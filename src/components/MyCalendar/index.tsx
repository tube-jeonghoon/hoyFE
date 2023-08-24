import React, { SetStateAction, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRecoilState } from 'recoil';
import selectedDateState from '@/store/atom/selectedDateState';
import { isCalendarModalState } from '@/store/atom/modalStatus';
import currentDateState from '@/store/atom/currentDateState';

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useRecoilState(currentDateState);
  const [calendarVisible, setCalendarVisible] =
    useRecoilState(isCalendarModalState);

  const handleSelectedDate = (value: any) => {
    setSelectedDate(value);
    setCalendarVisible(!calendarVisible);
    console.log(`선택된 날짜 : ${value}`);
    console.log(`선택된 날짜 : ${selectedDate}`);
  };
  return (
    <div className="w-full">
      <Calendar
        className="text-[0.75rem] w-[16rem] p-2 bg-white rounded-md shadow-md"
        value={selectedDate}
        locale="ko-KO"
        formatDay={(locale, date) => format(date, 'd')}
        formatMonth={(locale, date) => format(date, 'MMMM')}
        formatShortWeekday={(locale, date) => format(date, 'EEEEE')}
        minDetail="month"
        maxDetail="month"
        calendarType="gregory"
        next2Label={null}
        prev2Label={null}
        allowPartialRange={true}
        onClickDay={(value, event) => handleSelectedDate(value)}
      />
    </div>
  );
};

export default MyCalendar;
