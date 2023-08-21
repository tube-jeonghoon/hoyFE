import MyCalendar from '@/components/MyCalendar';
import DetailModal from '@/components/modal/detailModal';
import Image from 'next/image';
import { isDetailModalState } from '@/store/atom/modalStatus';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import Cookies from 'js-cookie';
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

type Todo = {
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
};

type NewTodoItem = {
  date: string;
  dayOfWeek: string;
  day: string;
  tasks: Todo[]; // 이미 이전에 Todo 타입을 정의해두었습니다.
};

const Home = () => {
  const router = useRouter();
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoList, setNewTodoList] = useState<NewTodoItem[]>([]);
  const [isLogin, setIsLogin] = useRecoilState(loginState);

  const [isDetailModal, setIstDetailModal] = useRecoilState(isDetailModalState);
  const [inputTitle, setInpuTitle] = useState('');

  const beforeDate = useRecoilValue(formattedBeforeDateSelector);
  const currentDate = useRecoilValue(formattedCurrentDateSelector);
  const afterDate = useRecoilValue(formattedAfterDateSelector);

  const fetchTodo = async () => {
    try {
      const response = await axios.get(
        // `https://hoy.im/api/workspace/1/tasks?date=2023-08-19`,
        `https://hoy.im/api/workspace/1/tasks?date=${currentDate.formatDate}`,
        // `http://localhost:8000/api/workspace/1/tasks?date=${currentDate.formatDate}`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY5MjI2MDEyNSwiZXhwIjoxNjk0Njc5MzI1fQ.O1tvy5xyIWYCXCZd8k873eN2Nu4TaWze9zQm8OVkZ7Q',
          },
        },
      );

      setTodoList(response.data);
      setNewTodoList(prev => {
        console.log('✨ ➤ Home ➤ prev:', prev);
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
                (task: any) => task.scheduleDate === todo.date,
              ) || [],
          };
        });
      });
      console.log(newTodoList);
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

  useEffect(() => {
    fetchDate();
    fetchTodo();
  }, []);

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
    console.log(updatedTodoList);
    setNewTodoList(updatedTodoList);
  }, [todoList]);

  // 액세스 토큰을 가지고 있지 않다면 /login 으로 리다이렉팅
  useEffect(() => {
    setIsLogin(Cookies.get('ACCESS_KEY') ? true : false);
    if (!Cookies.get('ACCESS_KEY')) {
      router.push('/login');
    }
  }, [isLogin]);

  return (
    <div className="w-full">
      <div className="todos grid grid-cols-3 px-[5rem] py-[3.75rem]">
        {newTodoList.map(todo => (
          <div
            className="todo mr-[3.12rem] w-[14rem] desktopL:w-[19rem]"
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
              <div className="mr-[0.6rem] text-gray-3 cursor-pointer">
                <AiOutlinePlus />
              </div>
              <input
                type="text"
                className="outline-none text-[0.875rem] text-gray-4 border-gray-4
                focus:text-black w-full"
                placeholder="리스트를 작성해 주세요."
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

                    <div className="cursor-pointer">
                      <IoEllipsisVertical />
                    </div>
                  </div>
                ) : (
                  <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                    <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
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
                    <div className="cursor-pointer">
                      <IoEllipsisVertical />
                    </div>
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
    // <div className="w-full">
    //   <div className="todos grid grid-cols-3 px-[5rem] py-[3.75rem]">
    //     <div className="before-date">
    //       <div>
    //         {newTodoList.map(data => (
    //           <div key={data.date}>{data.date}</div>
    //         ))}
    //       </div>
    //       {todoList.map(data => (
    //         <div>
    //           <div>{data.scheduleDate}</div>
    //           <div>{data.title}</div>
    //         </div>
    //       ))}
    //     </div>
    //     <div className="current-date"></div>
    //     <div className="after-date"></div>
    // {
    /* {todoList.map(data => (
          <div
            key={data.date}
            className="todo mr-[3.12rem] w-[14rem] desktopL:w-[19rem]"
          >
            <div className="todo-date flex items-center justify-center mb-[1.125rem] py-[1.125rem]">
              {data.dDay ? (
                <div className="text-primary-blue mr-[0.5rem] text-[1.125rem] font-bold">
                  {data.dayOfWeek}
                </div>
              ) : (
                <div className="mr-[0.5rem] text-[1.125rem] font-bold">
                  {data.dayOfWeek}
                </div>
              )}
              <div className="text-gray-5">{data.day}</div>
            </div>
            <div
              className="flex items-center mb-[1.12rem] h-[3rem] p-[0.62rem]
              border-b-[0.1rem]"
            >
              <div className="mr-[0.6rem] text-gray-3 cursor-pointer">
                <AiOutlinePlus />
              </div>
              <input
                type="text"
                className="outline-none text-[0.875rem] text-gray-4 border-gray-4
                focus:text-black w-full"
                placeholder="리스트를 작성해 주세요."
              />
            </div>
            <div>
              {data.tasks.map(task => (
                <div key={task.id} className="todo-list">
                  {task.done ? (
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

                      <div className="cursor-pointer">
                        <IoEllipsisVertical />
                      </div>
                    </div>
                  ) : (
                    <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                      <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
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
                      <div className="cursor-pointer">
                        <IoEllipsisVertical />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))} */
    // }
    //   </div>
    //   {isDetailModal && <DetailModal />}
    // </div>
  );
};

export default Home;
