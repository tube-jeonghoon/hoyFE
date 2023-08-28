import React from 'react';
import Image from 'next/image';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import { IoEllipsisVertical } from 'react-icons/io5';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '@/store/atom/userStatusState';

interface CutomViewTasksProps {
  userId: number;
  selectedDay: string;
}

const CustomViewTasks = (props: CutomViewTasksProps) => {
  const { userId, selectedDay } = props;
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}workspace/${currentWorkspace.workspace_id}/tasks/member/${userId}?date=${selectedDay}}`,
      );

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
};

export default CustomViewTasks;
