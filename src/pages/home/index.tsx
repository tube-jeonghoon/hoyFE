import MyCalendar from '@/components/MyCalendar';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  IoSquareOutline,
  IoEllipsisVertical,
  IoCheckbox,
} from 'react-icons/io5';

const Home = () => {
  const [todoList, setTodoList] = useState([
    '5시 전까지 주간회의록 정리',
    '프로젝트 기획서 작성',
    '와이프레임 1차 시안 공유 와이프레임 1차 시안 공유와이프레임 1차 시안 공유',
  ]);
  return (
    <div className="w-[63.25rem]">
      <div className="todos grid grid-cols-3 px-[5rem] py-[3.5rem]">
        <div className="todo mr-[3.12rem]">
          <div className="todo-date flex items-center justify-center">
            <div className="mr-[0.5rem] text-[1.125rem] font-bold">수요일</div>
            <div className="text-gray-5">8/2</div>
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
                focus:text-black"
              placeholder="리스트를 작성해 주세요."
            />
          </div>
          <div className="todo-list">
            {todoList.map((todo, idx) => (
              <div
                key={idx}
                className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]"
              >
                <div className="text-black mr-[0.62rem] cursor-pointer">
                  <IoSquareOutline />
                </div>
                <div className="w-full text-[0.875rem] text-black mr-[0.62rem]">
                  {todo}
                </div>
                <div className="cursor-pointer">
                  <IoEllipsisVertical />
                </div>
              </div>
            ))}
            <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
              <div className="mr-[0.62rem] cursor-pointer text-primary-blue">
                <IoCheckbox />
              </div>
              <div className="w-full text-[0.875rem] text-gray-4 mr-[0.62rem] line-through">
                간식 많이 먹기
              </div>
              <div className="cursor-pointer">
                <IoEllipsisVertical />
              </div>
            </div>
          </div>
        </div>
        <div className="todo mr-[3.12rem]">
          <div className="todo-date flex items-center justify-center">
            <div className="mr-[0.5rem] text-[1.125rem] font-bold text-primary-blue">
              목요일
            </div>
            <div className="text-gray-5">8/3</div>
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
                focus:text-black"
              placeholder="리스트를 작성해 주세요."
            />
          </div>
          <div className="todo-list">
            {todoList.map((todo, idx) => (
              <div
                key={idx}
                className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]"
              >
                <div className="text-black mr-[0.62rem] cursor-pointer">
                  <IoSquareOutline />
                </div>
                <div className="w-full text-[0.875rem] text-black mr-[0.62rem]">
                  {todo}
                </div>
                <div className="cursor-pointer">
                  <IoEllipsisVertical />
                </div>
              </div>
            ))}
            <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
              <div className="mr-[0.62rem] cursor-pointer text-primary-blue">
                <IoCheckbox />
              </div>
              <div className="w-full text-[0.875rem] text-gray-4 mr-[0.62rem] line-through">
                간식 많이 먹기
              </div>
              <div className="cursor-pointer">
                <IoEllipsisVertical />
              </div>
            </div>
          </div>
        </div>
        <div className="todo mr-[3.12rem]">
          <div className="todo-date flex items-center justify-center">
            <div className="mr-[0.5rem] text-[1.125rem] font-bold">금요일</div>
            <div className="text-gray-5">8/4</div>
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
                focus:text-black"
              placeholder="리스트를 작성해 주세요."
            />
          </div>
          <div className="todo-list">
            {todoList.map((todo, idx) => (
              <div
                key={idx}
                className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]"
              >
                <div className="text-black mr-[0.62rem] cursor-pointer">
                  <IoSquareOutline />
                </div>
                <div className="w-full text-[0.875rem] text-black mr-[0.62rem]">
                  {todo}
                </div>
                <div className="cursor-pointer">
                  <IoEllipsisVertical />
                </div>
              </div>
            ))}
            <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
              <div className="mr-[0.62rem] cursor-pointer text-primary-blue">
                <IoCheckbox />
              </div>
              <div className="w-full text-[0.875rem] text-gray-4 mr-[0.62rem] line-through">
                간식 많이 먹기
              </div>
              <div className="cursor-pointer">
                <IoEllipsisVertical />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
