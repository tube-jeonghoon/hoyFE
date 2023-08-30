import React, { useEffect, useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import dynamic from 'next/dynamic';
import MyCalendar from '@/components/MyCalendar';
import { useRecoilState, useRecoilValue } from 'recoil';
import selectedDateState from '@/store/atom/selectedDateState';
import { isCalendarModalState } from '@/store/atom/modalStatus';
import { currentHeaderNameState } from '@/store/atom/userStatusState';
import Image from 'next/image';
import verticalSetting from '../../../public/img/verticalSetting.svg';
import { useRouter } from 'next/router';
import CustomViewOptionBtn from '../customViewOptionBtn';
import { formattedCalendarDateSelector } from '@/store/selector/currentTime';
const DynamicMyCalendar = dynamic(() => import('@/components/MyCalendar'), {
  ssr: false,
});

const Header = () => {
  const router = useRouter();
  const [currentHeaderName, setCurrentHeaderName] = useRecoilState(
    currentHeaderNameState,
  );
  const [calendarVisible, setCalendarVisible] =
    useRecoilState(isCalendarModalState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [isCustomViewOptionBtnVisible, setIsCustomViewOptionBtnVisible] =
    useState(false);

  const showVerticalSettingIcon = router.pathname === '/viewGroup';
  const calendarDate = useRecoilValue(formattedCalendarDateSelector);

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const toggleCustomViewOptionBtn = () => {
    console.log('toggleCustomViewOptionBtn');
    setIsCustomViewOptionBtnVisible(!isCustomViewOptionBtnVisible);
  };

  return (
    <div className="w-[74rem] fixed top-0 z-[100] bg-white">
      <div className="p-[3.75rem] pb-[2.5rem] w-full">
        <div className="flex gap-[0.38rem] items-center">
          <div className="text-gray-5">{currentHeaderName} 님의 투두리스트</div>
          {showVerticalSettingIcon && (
            <div>
              <div
                className="w-[1.25rem] h-[1.25rem] cursor-pointer focus:bg-gray-2 hover:bg-gray-2
                  p-[0.12rem] rounded-[0.5rem]"
                onClick={toggleCustomViewOptionBtn}
              >
                <Image src={verticalSetting} alt="세로선" />
              </div>
              {isCustomViewOptionBtnVisible && <CustomViewOptionBtn />}
            </div>
          )}
        </div>
        <div className="flex items-center text-[1.625rem] font-bold relative">
          <div>{calendarDate}</div>
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
      <div className="w-full border-b-[1px] border-b-gray-[#EAEEF3]">{''}</div>
    </div>
  );
};

export default Header;
