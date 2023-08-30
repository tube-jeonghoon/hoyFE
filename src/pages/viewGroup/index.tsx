import React, { useEffect, useState } from 'react';
import OtherTodo from '@/components/otherTodo';
import Image from 'next/image';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import userProfile from '../../../public/img/userProfile.png';
import star from '../../../public/img/star.svg';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import fillCheckBox from '../../../public/img/fillCheckBox.svg';
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
import CustomViewTasks from '@/components/customViewTasks';
import { parseISO, addDays, format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchCustomViewTodoApi } from '@/apis/utils/api/fetchTodoApi';

interface ViewGroupUserList {
  userId: number;
  nickname: string;
  imgUrl: string;
  selectedDate: string;
  todos?: any[];
}

const ViewGroup = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentHeaderName, setCurrentHeaderName] = useRecoilState(
    currentHeaderNameState,
  );
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  const [currentGroupId, setCurrentGroupId] = useRecoilState(currentGroupState);
  const [viewGroupUserList, setViewGroupUserList] = useState<
    ViewGroupUserList[]
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

      const dataWithSelectedDate = res.data.map((user: ViewGroupUserList) => ({
        ...user,
        selectedDate: format(selectedDay, 'yyyy-MM-dd'),
      }));

      // console.log('fetchGroupMember', dataWithSelectedDate);
      setViewGroupUserList(dataWithSelectedDate);
      // 반환된 멤버 리스트를 반환
      return dataWithSelectedDate;
    } catch (error) {
      console.error(error);
    }
  };

  const changeDateForUser = async (
    user: ViewGroupUserList,
    direction: 'previous' | 'next',
  ) => {
    const currentDate = new Date(user.selectedDate); // 사용자의 현재 선택한 날짜
    // console.log('fhi: changeDateForUser', currentDate);

    let newDate: Date;
    if (direction == 'previous') {
      newDate = subDays(currentDate, 1);
    } else {
      newDate = addDays(currentDate, 1);
    }
    const newDateString = format(newDate, 'yyyy-MM-dd');
    // console.log('newDateString', newDateString);

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
    // console.log('viewGroupUserList', viewGroupUserList);
    // 날짜가 변경된 후 해당 날짜에 대한 todo 업데이트
    await updateTodosForUsers(updatedUsers);
  };

  const updateTodosForUsers = async (usersList: ViewGroupUserList[]) => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  // 변경된 날짜로 Todo 리스트 불러오기
  const fetchTodoForUser = async (user: ViewGroupUserList) => {
    try {
      // console.log('fhi', user.selectedDate);
      const todos = await fetchCustomViewTodoApi({
        userId: user.userId,
        currentDate: user.selectedDate,
      });
      // console.log('fhi', todos);
      // console.log('------');
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
    // console.log('viewOtherGroup', currentGroupId);
    // console.log('✨ ➤ useEffect ➤ viewGroupUserList:', viewGroupUserList);
  }, [currentGroupId]);

  return (
    <div className="px-[5rem] py-[3.75rem] overflow-y-auto h-[48rem]">
      <div className="cards grid grid-cols-3 gap-x-[3.12rem] gap-y-[3.75rem]">
        {/* <OtherTodo /> */}
        {viewGroupUserList?.map(user => {
          const parsedDate = new Date(user.selectedDate);
          const dayofWeek = format(parsedDate, 'EEE', { locale: ko });
          const day = format(parsedDate, 'M/d');
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
              </div>
              <div className="h-[20rem] overflow-y-auto">
                {user.todos?.map(todo => (
                  <div key={todo.id} className="todo-list">
                    {todo.status ? (
                      <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                        <div className="text-black mr-[0.62rem] w-[1.5rem]">
                          <Image src={fillCheckBox} alt="체크박스" />
                        </div>
                        {todo.priority == 1 && (
                          <div className="flex items-center mr-[0.62rem]">
                            <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
                          </div>
                        )}
                        <div className="w-full text-[0.875rem] text-gray-4 mr-[0.62rem] flex">
                          <div className="line-through">{todo.title}</div>
                          <div className="ml-[0.62rem] text-gray-4">
                            [{todo.commentCount}]
                          </div>
                        </div>
                        <div className="cursor-pointer">
                          <IoEllipsisVertical />
                        </div>
                      </div>
                    ) : (
                      <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
                        <div className="text-black mr-[0.62rem] w-[1.5rem]">
                          <Image src={checkBoxIcon} alt="체크박스" />
                        </div>
                        {todo.priority == 1 && (
                          <div className="flex items-center mr-[0.62rem]">
                            <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
                          </div>
                        )}
                        <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
                          {todo.title}
                          <div className="ml-[0.62rem] text-gray-4">
                            [{todo.commentCount}]
                          </div>
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
          );
        })}
        {/* <div className="card flex flex-col gap-[0.62rem] w-[19rem] h-[24rem]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[0.62rem] items-center">
              <div className="w-[1.5rem] h-[1.5rem]">
                <Image src={userProfile} alt="유저프로필" />
              </div>
              <div className="text-black text-[1.125rem] font-bold leading-[1.8rem]">
                하정민
              </div>
            </div>
            <div className="w-[1.5rem] text-black cursor-pointer">
              <Image src={star} alt="즐겨찾기" />
            </div>
          </div>
          <div className="flex items-center px-[0.75rem] justify-between">
            <div className="text-gray-4 cursor-pointer">
              <MdKeyboardArrowLeft />
            </div>
            <div className="flex items-center gap-[0.25rem]">
              <div className="text-black text-[0.875rem] font-bold leading-[1.4rem]">
                목요일
              </div>
              <div className="text-gray-5 text-[0.75rem] leading-[1.4rem]">
                8/24
              </div>
            </div>
            <div className="text-gray-4 cursor-pointer">
              <MdKeyboardArrowRight />
            </div>
          </div>
          <div className="h-[20rem] overflow-y-auto">
            <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
              <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
                <Image src={checkBoxIcon} alt="체크박스" />
              </div>
              <div className="flex items-center mr-[0.62rem]">
                <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
              </div>
              <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
                코드 리뷰하기
                <div className="ml-[0.62rem] text-gray-4">[5]</div>
              </div>
              <div className="cursor-pointer">
                <IoEllipsisVertical />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ViewGroup;
