import MyCalendar from '@/components/MyCalendar';
import DetailModal from '@/components/modal/detailModal';
import { isDetailModalState } from '@/store/atom/modalStatus';
import { todo } from 'node:test';
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  IoSquareOutline,
  IoEllipsisVertical,
  IoCheckbox,
} from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import Image from 'next/image';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import fillCheckBox from '../../../public/img/fillCheckBox.svg';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface Task {
  id: number;
  title: string;
  userId: number;
  priority: number;
  done: boolean;
  commentCount: number;
  scheduleDate: string;
}

type Todo = {
  date: string;
  dayOfWeek: string;
  day: string;
  dDay: boolean;
  tasks: Task[];
};

const Home = () => {
  const router = useRouter();
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const [isDetailModal, setIstDetailModal] = useRecoilState(isDetailModalState);
  const [inputTitle, setInpuTitle] = useState('');

  const fetchTodo = async () => {
    try {
      const response = await axios.get(
        'https://hoy.im/api/workspace/1/tasks?date=',
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY5MjA5OTA2OSwiZXhwIjoxNjk0NTE4MjY5fQ.-oITCr559cGLJDksN2UuDqkWAs4hbmW0qxKWKSDeKrE',
          },
        },
      );
      console.log(response.data);

      setTodoList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  // 액세스 토큰을 가지고 있지 않다면 /login 으로 리다이렉팅
  useEffect(() => {
    if (!Cookies.get('ACCESS_KEY')) {
      router.push('/login');
    }
  }, []);

  return (
    <div className="w-full">
      <div className="todos grid grid-cols-3 px-[5rem] py-[3.75rem]">
        {todoList.map(data => (
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
        ))}
      </div>
      {isDetailModal && <DetailModal />}
    </div>
  );
};

export default Home;
