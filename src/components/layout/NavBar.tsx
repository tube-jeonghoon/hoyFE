import React, { useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import dynamic from 'next/dynamic';
import MyCalendar from '@/components/MyCalendar';
import { useRecoilState } from 'recoil';
import selectedDateState from '@/store/atom/selectedDateState';
import { isCalendarModalState } from '@/store/atom/modalStatus';
const DynamicMyCalendar = dynamic(() => import('@/components/MyCalendar'), {
  ssr: false,
});

const NavBar = () => {
  const [userName, setUserName] = useState('전정훈');
  const [calendarVisible, setCalendarVisible] =
    useRecoilState(isCalendarModalState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  return (
    <div className="w-[74rem] fixed top-0 z-[100] bg-white">
      <div className="p-[3.75rem] pb-[2.5rem] w-full">
        <div className="text-gray-5">{userName} 님의 투두리스트</div>
        <div className="flex items-center text-[1.625rem] font-bold relative">
          <div>2023년 8월</div>
          <button className="ml-[0.3rem]" onClick={toggleCalendar}>
            <VscChevronDown />
          </button>
          {calendarVisible && (
            <div className="mt-4 absolute top-6 left-0">
              <DynamicMyCalendar />
            </div>
          )}
        </div>
      </div>
      <div className="border-b-[1px] border-b-gray-[#EAEEF3]">{''}</div>
    </div>
  );
};

export default NavBar;
