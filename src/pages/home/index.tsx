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
  formattedCalendarDateSelector,
  formattedSelectedDateSelector,
} from '@/store/selector/currentTime';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoEllipsisVertical } from 'react-icons/io5';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import fillCheckBox from '../../../public/img/fillCheckBox.svg';
import loginState from '@/store/atom/loginState';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import detailState from '@/store/atom/detailState';
import selectedDateState from '@/store/atom/selectedDateState';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import { Todo, NewTodoItem, NewTask, CurrentDate } from '../../types/homeType';
import addTodoApi from '@/apis/utils/api/addTodoApi';
import { addDays, parseISO, set, subDays } from 'date-fns';
import arrowRight from '../../../public/img/arrow_right.svg';
import arrowLeft from '../../../public/img/arrow_left.svg';
import format from 'date-fns/format';
import currentDateState from '@/store/atom/currentDateState';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

const Home = () => {
  console.log('Home 컴포넌트 렌더링');
  const queryClient = useQueryClient();
  const router = useRouter();

  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoList, setNewTodoList] = useState<NewTodoItem[]>([]);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [addNewTask, setaddNewTask] = useState<NewTask>();
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  const [selectedDate, setSelectedDate] = useRecoilState(currentDateState);

  const [isDetailModal, setIstDetailModal] =
    useRecoilState<number>(detailState);
  const [inputTitles, setInputTitles] = useState<Record<string, string>>({});
  const [isDetailModalOpen, setIsDetailModalOpen] =
    useRecoilState(isDetailModalState);

  const beforeDate = useRecoilValue(formattedBeforeDateSelector);
  const currentDate = useRecoilValue(formattedCurrentDateSelector);
  const afterDate = useRecoilValue(formattedAfterDateSelector);

  // const fetchDate = () => {
  //   setNewTodoList(prev => [
  //     {
  //       date: beforeDate.formatDate,
  //       dayOfWeek: beforeDate.dayOfWeek,
  //       day: beforeDate.day,
  //       tasks: [],
  //     },
  //     {
  //       date: currentDate.formatDate,
  //       dayOfWeek: currentDate.dayofWeek,
  //       day: currentDate.day,
  //       tasks: [],
  //     },
  //     {
  //       date: afterDate.formatDate,
  //       dayOfWeek: afterDate.dayOfWeek,
  //       day: afterDate.day,
  //       tasks: [],
  //     },
  //   ]);
  // };
  //

  const { data: workspaceData, isSuccess: workspaceSuccess } = useQuery(
    'workspaceData',
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(res.data);
      return res.data;
    },
  );

  // 받아온 워크스페이스 리스트가 없으면 초기페이지로 이동
  useEffect(() => {
    console.log(`실행되니?`);
    if (workspaceSuccess) {
      console.log(workspaceData.length);
      if (workspaceData?.length === 0) {
        router.push('/firstGroup');
      }
    }
  }, [workspaceSuccess, workspaceData]);

  useEffect(() => {
    if (workspaceData) {
      setCurrentWorkspace(workspaceData[0]);
    }
  }, [workspaceData]);

  const { data: todosData } = useQuery(
    ['todos', currentWorkspace?.workspace_id, currentDate.formatDate],
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/tasks?date=${currentDate.formatDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const sortedData = res.data.sort((a: Todo, b: Todo) => {
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

      setNewTodoList(prev => {
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
              todosData?.filter(
                (task: Todo) => task.scheduleDate === todo.date,
              ) || [],
          };
        });
      });

      // console.log(sortedData);
      return sortedData;
    },
  );

  const addMutation = useMutation(
    (taskItem: NewTask) => addTodoApi(taskItem, currentWorkspace),
    {
      onError: error => {
        console.error(error);
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

          // console.log('✨ ➤ Home ➤ sortedList:', sortedList);
          return sortedList;
        });

        // 입력 필드 초기화
        setInputTitles(prevTitles => ({
          ...prevTitles,
          [variables.date as keyof typeof prevTitles]: '',
        }));
        // console.log(`useMutation 진입`, data);
        // Task 추가 하자마자 데이터를 다시 fetch
        queryClient.invalidateQueries('todos');
      },
    },
  );

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      // 본문을 담지 않는 PUT 요청
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/tasks/${taskId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      queryClient.invalidateQueries('todos');

      return res;
    } catch (error) {
      // console.log(taskId);
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

  // 날짜를 하루 앞으로 이동
  const moveDateForward = () => {
    const newDate = addDays(selectedDate, 1);
    const formattedNewDate = format(newDate, 'yyyy-MM-dd');
    setSelectedDate(parseISO(formattedNewDate));
    queryClient.invalidateQueries('todos');
  };

  // 날짜를 하루 뒤로 이동
  const moveDateBackward = () => {
    const newDate = subDays(selectedDate, 1);
    const formattedNewDate = format(newDate, 'yyyy-MM-dd');
    setSelectedDate(parseISO(formattedNewDate));
    queryClient.invalidateQueries('todos');
  };

  useEffect(() => {
    if (todosData) {
      setTodoList(todosData);
    }
  }, [todosData]);

  // useEffect(() => {
  //   fetchDate();
  // }, [currentDate]);

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
    setNewTodoList(updatedTodoList);
  }, [todoList]);

  /***************************** DND LINE ADDED  **********************************/
  const updateTaskDate = async ({
    taskId,
    newDate,
  }: {
    taskId: number;
    newDate: string;
  }) => {
    const accessToken = Cookies.get('ACCESS_KEY');

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/tasks/${taskId}/drag`,
        { date: newDate },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // console.log('Task date updated: ', response.data);
    } catch (error) {
      console.error('Error updating task date:', error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    const sourceDate = source.droppableId;
    const destinationDate = destination.droppableId;
    const copyTodoList = [...newTodoList];

    // source 영역에서 해당 todo 제거
    const targetObj = copyTodoList.find(obj => obj.date === sourceDate);
    const tasksRemoved = targetObj?.tasks.splice(source.index, 1);
    const targetTask = tasksRemoved && tasksRemoved[0];
    // console.log('onDragEnd: targetTask: ', targetTask);

    // destination 영역에 todo 추가 -> 만약 해당 영역에 tasks가 빈 배열이라면?
    const destObj = copyTodoList.find(todo => todo.date === destinationDate);
    if (destObj && targetTask) {
      destObj.tasks.splice(destination.index, 0, targetTask);
    }

    setNewTodoList(copyTodoList);

    // 서버에 업데이트된 날짜로 변경 요청
    if (targetTask && targetTask.id && destinationDate) {
      updateTaskDate({ taskId: targetTask.id, newDate: destinationDate });
    }
    // console.log(result);
  };
  /***************************** DND LINE ENDED  **********************************/

  // 액세스 토큰을 가지고 있지 않다면 /login 으로 리다이렉팅
  useEffect(() => {
    setIsLogin(Cookies.get('ACCESS_KEY') ? true : false);
    if (!Cookies.get('ACCESS_KEY')) {
      router.push('/login');
    }
  }, [isLogin]);

  return (
    <div className="px-[5rem] py-[3.75rem] overflow-y-auto h-[48rem]">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="todos grid grid-cols-3 ">
          {newTodoList.map((todo, idx) => (
            <Droppable droppableId={String(todo.date)} key={idx}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="todo mr-[3.12rem] desktop:w-[11.5rem] desktopL:w-[19rem]"
                >
                  <div
                    className={`todo-date flex items-center mb-[1.125rem] py-[1.125rem] ${
                      idx === 0
                        ? 'justify-start'
                        : idx === 1
                        ? 'justify-center'
                        : idx === 2
                        ? 'justify-end'
                        : ''
                    }`}
                  >
                    <div className="flex gap-[5rem] h-[2.5rem]">
                      {idx === 0 && (
                        <div
                          onClick={moveDateBackward}
                          className="p-[0.8rem] bg-gray-1 rounded-[0.5rem] w-[2.5rem] h-[2.5rem] cursor-pointer"
                        >
                          <Image
                            src={arrowLeft}
                            width={24}
                            height={24}
                            alt="화살표"
                          />
                        </div>
                      )}
                      <div className="flex items-center">
                        <div
                          className={`mr-[0.5rem] text-[1.125rem] font-bold ${
                            idx === Math.floor(newTodoList.length / 2)
                              ? 'text-primary-blue'
                              : ''
                          }`}
                        >
                          {todo.dayOfWeek}
                        </div>
                        <div className="text-gray-5">{todo.day}</div>
                      </div>
                      {idx === newTodoList.length - 1 && (
                        <div
                          onClick={moveDateForward}
                          className="p-[0.8rem] bg-gray-1 rounded-[0.5rem] w-[2.5rem] h-[2.5rem] cursor-pointer"
                        >
                          <Image
                            src={arrowRight}
                            width={24}
                            height={24}
                            alt="화살표"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex items-center mb-[1.12rem] h-[3rem] p-[0.62rem]
                          border-b-[0.1rem]"
                  >
                    <div
                      className="mr-[0.6rem] text-gray-3 cursor-pointer"
                      onClick={() => {
                        const title = inputTitles[todo.date];
                        if (title) {
                          const newTask = {
                            title: inputTitles,
                            date: todo.date,
                          };
                          // console.log(newTask);
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
                      onKeyPress={e => handleKeyDown(e, todo.date)}
                      value={inputTitles[todo.date] || ''}
                    />
                  </div>
                  {todo.tasks.map((task, taskIdx) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={taskIdx}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="todo-list"
                        >
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
                              {isDetailModalOpen &&
                                isDetailModal === task.id && (
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
                                {task.commentCount !== 0 && (
                                  <div className="ml-[0.62rem] text-gray-4">
                                    [{task.commentCount}]
                                  </div>
                                )}
                              </div>
                              <div
                                className="cursor-pointer"
                                onClick={() => detailModal(task.id)}
                              >
                                <IoEllipsisVertical />
                              </div>
                              {isDetailModalOpen &&
                                isDetailModal === task.id && (
                                  <DetailModal taskId={task.id} />
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
