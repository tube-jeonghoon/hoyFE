import MyCalendar from '@/components/MyCalendar';
import DetailModal from '@/components/modal/detailModal';
import { isDetailModalState } from '@/store/atom/modalStatus';
import { todo } from 'node:test';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  IoSquareOutline,
  IoEllipsisVertical,
  IoCheckbox,
} from 'react-icons/io5';
import { useRecoilState } from 'recoil';

type Task = {
  id: number;
  title: string;
  userId: number;
  priority: number;
  done: boolean;
  createdDate: string;
};

type TodoListType = {
  [key: string]: {
    dayOfWeek: string;
    day: string;
    dDay: boolean;
    tasks: Task[];
  };
};

const Home = () => {
  const [todoList, setTodoList] = useState<TodoListType>({
    '2023-08-07': {
      dayOfWeek: '월요일',
      day: '8/7',
      dDay: false,
      tasks: [
        {
          id: 1,
          title: '5시 전까지 주간회의록 정리',
          userId: 1,
          priority: 1,
          done: true,
          createdDate: '2023-08-07',
        },
        {
          id: 2,
          title: '책상 정리',
          userId: 1,
          priority: 0,
          done: false,
          createdDate: '2023-08-07',
        },
        {
          id: 3,
          title: '간식 먹기',
          userId: 2,
          priority: 1,
          done: true,
          createdDate: '2023-08-07',
        },
      ],
    },
    '2023-08-08': {
      dayOfWeek: '화요일',
      day: '8/8',
      dDay: true,
      tasks: [
        {
          id: 1,
          title: '월간 회의하기',
          userId: 1,
          priority: 1,
          done: false,
          createdDate: '2023-08-07',
        },
        {
          id: 2,
          title: '로그인 레이아웃 완성하기',
          userId: 1,
          priority: 0,
          done: false,
          createdDate: '2023-08-07',
        },
      ],
    },
    '2023-08-09': {
      dayOfWeek: '수요일',
      day: '8/9',
      dDay: false,
      tasks: [
        {
          id: 1,
          title: '대청소 하기',
          userId: 1,
          priority: 1,
          done: false,
          createdDate: '2023-08-07',
        },
      ],
    },
  });

  const [isDetailModal, setIstDetailModal] = useRecoilState(isDetailModalState);

  // 할 일의 상태를 변경하는 함수
  const toggleTask = (date: string, taskId: number) => {
    setTodoList(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        tasks: prev[date].tasks.map(task =>
          task.id === taskId ? { ...task, done: !task.done } : task,
        ),
      },
    }));
  };

  return (
    <div className="w-full">
      <div className="todos grid grid-cols-3 px-[5rem] py-[3.75rem]">
        {Object.entries(todoList).map(([date, data]) => (
          <div key={date} className="todo mr-[3.12rem] w-[19rem]">
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
                      <div
                        className="mr-[0.62rem] cursor-pointer text-primary-blue"
                        onClick={() => toggleTask(date, task.id)}
                      >
                        <IoCheckbox />
                      </div>
                      <div className="w-full text-[0.875rem] text-gray-4 mr-[0.62rem] line-through">
                        {task.title}
                      </div>
                      <div className="cursor-pointer">
                        <IoEllipsisVertical />
                      </div>
                    </div>
                  ) : (
                    <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                      <div
                        className="text-black mr-[0.62rem] cursor-pointer"
                        onClick={() => toggleTask(date, task.id)}
                      >
                        <IoSquareOutline />
                      </div>
                      <div className="w-full text-[0.875rem] text-black mr-[0.62rem]">
                        {task.title}
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
