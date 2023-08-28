import React from 'react';
import Image from 'next/image';
import editBtn from '../../../public/img/editBtn.svg';
import removeBtn from '../../../public/img/removeBtn.svg';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import {
  currentGroupState,
  currentWorkspaceState,
} from '@/store/atom/userStatusState';
import { useRouter } from 'next/router';

const CustomViewOptionBtn = () => {
  const router = useRouter();
  const [selectedWorkspace, setSelectedWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  const [currentGroupId, setCurrentGroupId] = useRecoilState(currentGroupState);

  const deleteGroup = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${selectedWorkspace.workspace_id}/group/${currentGroupId}`,
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGroupHandler = () => {
    deleteGroup();
    window.location.reload();
  };

  return (
    <div className="outsider-area relative">
      <div className="absolute z-[95]">
        <div className="border-[1px] text-gray-2 rounded-[0.75rem] p-[0.75rem] bg-white">
          <div
            className="flex text-black p-[0.75rem] gap-[0.75rem] hover:bg-gray-2 cursor-pointer
          rounded-[0.5rem] w-[7.5rem]"
          >
            <div>
              <Image src={editBtn} alt="수정" />
            </div>
            <div>수정</div>
          </div>
          <div
            className="flex text-black p-[0.75rem] gap-[0.75rem] hover:bg-gray-2 cursor-pointer
          rounded-[0.5rem] w-[7.5rem]"
            onClick={deleteGroupHandler}
          >
            <div>
              <Image src={removeBtn} alt="수정" />
            </div>
            <div>삭제</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomViewOptionBtn;
