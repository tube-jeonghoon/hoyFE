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
import {
  currentFavoriteUserIdState,
  currentWorkspaceState,
} from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
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
import {
  Todo,
  NewTodoItem,
  NewTask,
  CurrentDate,
} from '../../types/viewFavoriteTypes';

interface ViewFavoriteProps {
  userId: number;
}

const ViewFavorite = () => {
  const queryClient = useQueryClient();

  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoList, setNewTodoList] = useState<NewTodoItem[]>([]);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [addNewTask, setaddNewTask] = useState<NewTask>();
  const [currentWorkSpace, setCurrentWorkSpace] = useRecoilState(
    currentWorkspaceState,
  );
  const [selectedDate, setSelectedDate] = useRecoilState(currentDateState);
  const [currentFavoriteUserId, setCurrentFavoriteUserId] = useRecoilState(
    currentFavoriteUserIdState,
  );

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

  const { data: workspaceData } = useQuery(
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
      return res.data[0];
    },
    { staleTime: 0 },
  );

  const { data: favoriteUserTodoData } = useQuery(
    [
      'favoriteUserTodos',
      currentWorkSpace.workspace_id,
      currentDate.formatDate,
    ],
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        //workspace/{:workspaceId}/tasks/member/{:userId}/three-days?date={date?}
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks/member/${currentFavoriteUserId}/three-days?date=${currentDate.formatDate}`,
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
              favoriteUserTodoData?.filter(
                (task: Todo) => task.scheduleDate === todo.date,
              ) || [],
          };
        });
      });

      return sortedData;
    },
  );

  const detailModal = (taskId: number) => {
    setIsDetailModalOpen(true);
    setIstDetailModal(taskId);
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
    if (workspaceData) {
      setCurrentWorkSpace(workspaceData);
    }
  }, [workspaceData]);

  useEffect(() => {
    if (favoriteUserTodoData) {
      setTodoList(favoriteUserTodoData);
    }
  }, [favoriteUserTodoData]);

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

  // 액세스 토큰을 가지고 있지 않다면 /login 으로 리다이렉팅
  // useEffect(() => {
  //   setIsLogin(Cookies.get('ACCESS_KEY') ? true : false);
  //   if (!Cookies.get('ACCESS_KEY')) {
  //     router.push('/login');
  //   }
  // }, [isLogin])

  return (
    <div className="px-[5rem] py-[3.75rem] overflow-y-auto h-[48rem]">
      <div className="todos grid grid-cols-3 ">
        {newTodoList.map((todo, idx) => (
          <div
            className="todo mr-[3.12rem] desktop:w-[11.5rem] desktopL:w-[19rem]"
            key={idx}
          >
            <div className="todo-date flex items-center justify-center mb-[1.125rem] py-[1.125rem]">
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
                value={inputTitles[todo.date] || ''}
              />
            </div>
            {todo.tasks.map(task => (
              <div key={task.id} className="todo-list">
                {task.status ? (
                  <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                    <div className="mr-[0.62rem] cursor-pointer text-primary-blue w-[1.5rem]">
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

export default ViewFavorite;
