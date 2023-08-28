import React, { useEffect, useState } from 'react';
import OtherTodo from '@/components/otherTodo';
import Image from 'next/image';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import userProfile from '../../../public/img/userProfile.png';
import star from '../../../public/img/star.svg';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import { IoEllipsisVertical } from 'react-icons/io5';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentHeaderNameState,
  currentWorkspaceState,
  currentGroupState,
} from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import { formattedCurrentDateSelector } from '@/store/selector/currentTime';
import { parseISO, addDays, format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchCustomViewTodoApi } from '@/apis/utils/api/fetchTodoApi';
interface ViewUserGroupList {
  userId: number;
  nickname: string;
  imgUrl: string;
  selectedDate: string;
  todos?: any[];
}
const CustomView = () => {
  // const selectedDay = useRecoilValue(formattedCurrentDateSelector);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentHeaderName, setCurrentHeaderName] = useRecoilState(
    currentHeaderNameState,
  );
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  const [currentGroupId, setCurrentGroupId] = useRecoilState(currentGroupState);
  const [viewGroupUserList, setViewGroupUserList] = useState<
    ViewUserGroupList[]
  >([]);

  const fetchGroupMember = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/group/${currentGroupId}/members`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const dataWithSelectedDate = res.data.map(user => ({
        ...user,
        selectedDate: format(selectedDay, 'yyyy-MM-dd'),
      }));
      console.log('fetchGroupMember', dataWithSelectedDate);
      setViewGroupUserList(dataWithSelectedDate);
      // 반환된 멤버 리스트를 반환
      return dataWithSelectedDate;
    } catch (error) {
      console.error(error);
    }
  };

  const changeDateForUser = async (
    user: ViewUserGroupList,
    direction: 'previous' | 'next',
  ) => {
    console.log('user.selectedDate', user.selectedDate);
    const currentDate = new Date(user.selectedDate); // 사용자의 현재 선택한 날짜
    console.log('fhi: changeDateForUser', currentDate);
    let newDate: Date;
    if (direction == 'previous') {
      newDate = subDays(currentDate, 1);
    } else {
      newDate = addDays(currentDate, 1);
    }
    console.log('newDate', newDate);
    const newDateString = format(newDate, 'yyyy-MM-dd');
    console.log('newDateString', newDateString);

    const updatedUsers = viewGroupUserList.map(u => {
      if (u.userId == user.userId) {
        return {
          ...u,
          selectedDate: newDateString,
        };
      }
      return u;
    });

    setViewGroupUserList(updatedUsers);
    console.log('viewGroupUserList', viewGroupUserList);
    // 날짜가 변경된 후 해당 날짜에 대한 todo 업데이트
    await updateTodosForUsers(updatedUsers);
  };

  const updateTodosForUsers = async (usersList: ViewUserGroupList[]) => {
    const updatedUsers = await Promise.all(
      usersList.map(async user => {
        const userTodos = await fetchTodoForUser(user);
        return {
          ...user,
          todos: userTodos,
        };
      }),
    );
    setViewGroupUserList(updatedUsers);
  };

  // 변경된 날짜로 Todo 리스트 불러오기
  const fetchTodoForUser = async (user: ViewUserGroupList) => {
    try {
      console.log('fhi', user.selectedDate);
      const todos = await fetchCustomViewTodoApi({
        userId: user.userId,
        currentDate: user.selectedDate,
      });
      console.log('fhi', todos);
      return todos;
    } catch (error) {
      console.error('Error fetching todos for user:', user.userId, error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAndUpdate = async () => {
      const members = await fetchGroupMember();
      await updateTodosForUsers(members);
    };
    fetchAndUpdate();
    console.log('viewGroup', currentGroupId);
    console.log('✨ ➤ useEffect ➤ viewGroupUserList:', viewGroupUserList);
  }, [currentGroupId]);

  useEffect(() => {
    console.log('Updated viewGroupUserList', viewGroupUserList);
  }, [viewGroupUserList]);

  return (
    <div className="px-[5rem] py-[3.75rem] overflow-y-auto h-[48rem]">
      <div className="cards grid grid-cols-3 gap-x-[3.12rem] gap-y-[3.75rem]">
        {/* <OtherTodo /> */}
        {viewGroupUserList?.map(user => {
          console.log('fhihh11', user.selectedDate);
          const parsedDate = new Date(user.selectedDate);
          console.log(parsedDate);
          const dayofWeek = format(parsedDate, 'EEE', { locale: ko });
          const day = format(parsedDate, 'M/d');
          // console.log('fhi', dayofWeek, day);
          return (
            <div
              key={user.userId}
              className="card flex flex-col gap-[0.62rem] w-[19rem] h-[24rem]"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-[0.62rem] items-center">
                  <div className="w-[1.5rem] h-[1.5rem]">
                    <Image
                      src={user.imgUrl}
                      width={24}
                      height={24}
                      alt="유저프로필"
                    />
                  </div>
                  <div className="text-black text-[1.125rem] font-bold leading-[1.8rem]">
                    {user.nickname}
                  </div>
                </div>
                <div className="w-[1.5rem] text-black cursor-pointer">
                  <Image src={star} alt="즐겨찾기" />
                </div>
              </div>
              <div className="flex items-center px-[0.75rem] justify-between">
                <div
                  className="text-gray-4 cursor-pointer"
                  onClick={() => changeDateForUser(user, 'previous')}
                >
                  <MdKeyboardArrowLeft />
                </div>
                <div className="flex items-center gap-[0.25rem]">
                  <div className="text-black text-[0.875rem] font-bold leading-[1.4rem]">
                    {dayofWeek}
                  </div>
                  <div className="text-gray-5 text-[0.75rem] leading-[1.4rem]">
                    {day}
                  </div>
                </div>
                <div
                  className="text-gray-4 cursor-pointer"
                  onClick={() => changeDateForUser(user, 'next')}
                >
                  <MdKeyboardArrowRight />
                </div>
                <ul>
                  {user.todos?.map(todo => <li key={todo.id}>{todo.title}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CustomView;
