import MyCalendar from '@/components/MyCalendar';
import DetailModal from '@/components/modal/detailModal';
import Image from 'next/image';
import { isDetailModalState } from '@/store/atom/modalStatus';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  formattedCurrentDateSelector,
  formattedBeforeDateSelector,
  formattedAfterDateSelector,
} from '@/store/selector/currentTime';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoEllipsisVertical } from 'react-icons/io5';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import fillCheckBox from '../../../public/img/fillCheckBox.svg';
import loginState from '@/store/atom/loginState';
import { useMutation, useQueryClient } from 'react-query';
import detailState from '@/store/atom/detailState';
import selectedDateState from '@/store/atom/selectedDateState';
import { currentWorkspace } from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';

interface Todo {
  id: number;
  title: string;
  scheduleDate: string;
  status: boolean;
  priority: number;
  updatedAt: string;
  createdAt: string;
  commentCount: number;
  dueDate: string;
  deletedAt: string;
}

interface NewTodoItem {
  date: string;
  dayOfWeek: string;
  day: string;
  tasks: Todo[]; // 이미 이전에 Todo 타입을 정의해두었습니다.
}

interface NewTask {
  workspaceId?: number;
  title: Record<string, string>;
  date: string;
  priority?: number;
  status?: boolean;
}

interface currentDate {
  dayofWeek: string;
  day: string;
  formatDate: string;
}

const Home = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoList, setNewTodoList] = useState<NewTodoItem[]>([]);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [addNewTask, setaddNewTask] = useState<NewTask>();
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [currentWorkSpace, setCurrentWorkSpace] =
    useRecoilState(currentWorkspace);

  const [isDetailModal, setIstDetailModal] =
    useRecoilState<number>(detailState);
  const [inputTitles, setInputTitles] = useState<Record<string, string>>({});
  const [isDetailModalOpen, setIsDetailModalOpen] =
    useRecoilState(isDetailModalState);

  const beforeDate = useRecoilValue(formattedBeforeDateSelector);
  const currentDate = useRecoilValue(formattedCurrentDateSelector);
  const afterDate = useRecoilValue(formattedAfterDateSelector);

  const fechWorkSpaceData = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      setCurrentWorkSpace(res.data[0]);
      // console.log(res.data[0].workspace_id);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodo = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      console.log('101번쨰', currentWorkSpace.workspace_id);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks?date=${currentDate.formatDate}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      // console.log(response.data);

      const sortedData = response.data.sort((a: Todo, b: Todo) => {
        // status를 확인하여 true가 false보다 먼저 오도록 정렬
        if (a.status !== b.status) {
          return a.status ? 1 : -1;
        }

        // priority를 확인하여 1인 경우가 다른 경우보다 먼저 오도록 정렬
        if (a.priority !== b.priority) {
          return a.priority === 1 ? -1 : b.priority === 1 ? 1 : 0;
        }

        return (
          // createdAt 기준으로 정렬
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setTodoList(sortedData);
      // console.log('✨ ➤ fetchTodo ➤ sortedData:', sortedData);

      setNewTodoList(prev => {
        // console.log('✨ ➤ Home ➤ prev:', prev);
        return [
          {
            date: beforeDate.formatDate,
            dayOfWeek: beforeDate.dayOfWeek,
            day: beforeDate.day,
            tasks: [],
          },
          {
            date: currentDate.formatDate,
            dayOfWeek: currentDate.dayofWeek,
            day: currentDate.day,
            tasks: [],
          },
          {
            date: afterDate.formatDate,
            dayOfWeek: afterDate.dayOfWeek,
            day: afterDate.day,
            tasks: [],
          },
        ].map(todo => {
          return {
            ...todo,
            tasks:
              response.data.tasks?.filter(
                (task: Todo) => task.scheduleDate === todo.date,
              ) || [],
          };
        });
      });
      console.log(newTodoList);
      console.log(`data fetch 완료`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDate = () => {
    setNewTodoList(prev => [
      {
        date: beforeDate.formatDate,
        dayOfWeek: beforeDate.dayOfWeek,
        day: beforeDate.day,
        tasks: [],
      },
      {
        date: currentDate.formatDate,
        dayOfWeek: currentDate.dayofWeek,
        day: currentDate.day,
        tasks: [],
      },
      {
        date: afterDate.formatDate,
        dayOfWeek: afterDate.dayOfWeek,
        day: afterDate.day,
        tasks: [],
      },
    ]);
  };

  const addTask = async (taskItem: NewTask) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/tasks`,
        {
          title: taskItem.title[taskItem.date as keyof typeof taskItem.title],
          date: taskItem.date,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const addMutation = useMutation(addTask, {
    onError: error => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      if (!data) return;

      setNewTodoList(prev => {
        const targetDate = variables.date;

        // 새로운 할 일 추가
        const updatedList = prev.map(item => {
          if (item.date === targetDate) {
            return {
              ...item,
              tasks: [
                ...item.tasks,
                {
                  id: data.id,
                  title:
                    variables.title[
                      variables.date as keyof typeof variables.title
                    ],
                  scheduleDate: targetDate,
                  status: false, // 기본값
                  priority: 0, // 기본값 설정, 필요한 값으로 변경
                  updatedAt: '', // 기본값 설정, 필요한 값으로 변경
                  createdAt: '', // 기본값 설정, 필요한 값으로 변경
                  commentCount: 0, // 기본값 설정
                  dueDate: '', // 기본값 설정, 필요한 값으로 변경
                  deletedAt: '', // 기본값 설정, 필요한 값으로 변경
                },
              ],
            };
          }
          return item;
        });

        // 해당 할 일의 날짜에 따라 정렬
        const sortedList = updatedList.map(item => {
          if (item.date === targetDate) {
            const sortedTasks = item.tasks.sort((a: Todo, b: Todo) => {
              // status를 확인하여 true가 false보다 먼저 오도록 정렬
              if (a.status !== b.status) {
                return a.status ? 1 : -1;
              }

              // priority를 확인하여 1인 경우가 다른 경우보다 먼저 오도록 정렬
              if (a.priority !== b.priority) {
                return a.priority === 1 ? -1 : b.priority === 1 ? 1 : 0;
              }

              return (
                // createdAt 기준으로 정렬
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
            return {
              ...item,
              tasks: sortedTasks,
            };
          }
          return item;
        });

        console.log('✨ ➤ Home ➤ sortedList:', sortedList);
        return sortedList;
      });

      // 입력 필드 초기화
      setInputTitles(prevTitles => ({
        ...prevTitles,
        [variables.date as keyof typeof prevTitles]: '',
      }));
      console.log(`useMutation 진입`, data);
    },
  });

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      // 본문을 담지 않는 PUT 요청
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/tasks/${taskId}/status`,
        {},
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      // 상태 업데이트
      setNewTodoList(prev => {
        return prev.map(item => {
          return {
            ...item,
            tasks: item.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  status: !task.status, // 상태를 토글합니다.
                };
              }
              return task;
            }),
          };
        });
      });
      // console.log(res);
      return res;
    } catch (error) {
      console.log(taskId);
      console.error('완료 표시에서 에러 발생', error);
    }
  };

  const detailModal = (taskId: number) => {
    setIsDetailModalOpen(true);
    setIstDetailModal(taskId);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    date: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const title = inputTitles[date];
      if (title) {
        const newTask = { title: inputTitles, date: date };
        addMutation.mutate(newTask);
      }
    }
  };

  useEffect(() => {
    fechWorkSpaceData();
    fetchDate();
    fetchTodo();
  }, [currentDate]);

  useEffect(() => {
    const updatedTodoList = newTodoList.map(day => {
      const filteredTasks = todoList.filter(
        task => task.scheduleDate === day.date,
      );
      return {
        ...day,
        tasks: filteredTasks,
      };
    });
    // console.log(updatedTodoList);
    setNewTodoList(updatedTodoList);
  }, [todoList]);

  // 액세스 토큰을 가지고 있지 않다면 /login 으로 리다이렉팅
  // useEffect(() => {
  //   setIsLogin(Cookies.get('ACCESS_KEY') ? true : false);
  //   if (!Cookies.get('ACCESS_KEY')) {
  //     router.push('/login');
  //   }
  // }, [isLogin]);

  return (
    <div className="px-[5rem] py-[3.75rem] overflow-y-auto h-[48rem]">
      <div className="todos grid grid-cols-3 ">
        {newTodoList.map(todo => (
          <div
            className="todo mr-[3.12rem] desktop:w-[11.5rem] desktopL:w-[19rem]"
            key={todo.date}
          >
            <div className="todo-date flex items-center justify-center mb-[1.125rem] py-[1.125rem]">
              <div className="mr-[0.5rem] text-[1.125rem] font-bold">
                {todo.dayOfWeek}
              </div>
              <div className="text-gray-5">{todo.day}</div>
            </div>
            <div
              className="flex items-center mb-[1.12rem] h-[3rem] p-[0.62rem]
              border-b-[0.1rem]"
            >
              <div
                className="mr-[0.6rem] text-gray-3 cursor-pointer"
                onClick={() => {
                  const title = inputTitles[todo.date];
                  console.log(title);
                  console.log(todo.date);
                  if (title) {
                    const newTask = { title: inputTitles, date: todo.date };
                    console.log(newTask);
                    addMutation.mutate(newTask);
                  }
                }}
              >
                <AiOutlinePlus />
              </div>
              <input
                type="text"
                className="outline-none text-[0.875rem] text-gray-4 border-gray-4
                focus:text-black w-full"
                placeholder="리스트를 작성해 주세요."
                onChange={e => {
                  setInputTitles({
                    ...inputTitles,
                    [todo.date]: e.target.value,
                  });
                }}
                onKeyDown={e => handleKeyDown(e, todo.date)}
                value={inputTitles[todo.date] || ''}
              />
            </div>
            {todo.tasks.map(task => (
              <div key={task.id} className="todo-list">
                {task.status ? (
                  <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                    <div
                      className="mr-[0.62rem] cursor-pointer text-primary-blue w-[1.5rem]"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <Image src={fillCheckBox} alt="체크박스" />
                    </div>
                    <div className="flex items-center mr-[0.62rem]">
                      {task.priority === 1 && (
                        <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
                      )}
                    </div>
                    <div className="w-full text-[0.875rem] text-gray-4 mr-[0.62rem] flex">
                      <div className="line-through">{task.title}</div>
                      <div>
                        {task.commentCount !== 0 && (
                          <div className="ml-[0.62rem] text-gray-4">
                            [{task.commentCount}]
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => detailModal(task.id)}
                    >
                      <IoEllipsisVertical />
                    </div>
                    {isDetailModalOpen && isDetailModal === task.id && (
                      <DetailModal taskId={task.id} />
                    )}
                  </div>
                ) : (
                  <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                    <div
                      className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <Image src={checkBoxIcon} alt="체크박스" />
                    </div>
                    <div className="flex items-center mr-[0.62rem]">
                      {task.priority === 1 && (
                        <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
                      )}
                    </div>
                    <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
                      {task.title}
                      {task.commentCount !== 0 ||
                        (undefined && (
                          <div className="ml-[0.62rem] text-gray-4">
                            [{task.commentCount}]
                          </div>
                        ))}
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => detailModal(task.id)}
                    >
                      <IoEllipsisVertical />
                    </div>
                    {isDetailModalOpen && isDetailModal === task.id && (
                      <DetailModal taskId={task.id} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="current-date"></div>
        <div className="after-date"></div>
      </div>
    </div>
  );
};

export default Home;
