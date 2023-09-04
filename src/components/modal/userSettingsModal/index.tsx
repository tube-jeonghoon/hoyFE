import React from 'react';
import Image from 'next/image';
import trash from '../../../../public/img/trashIcon.svg';
import ownerIcon from '../../../../public/img/owner.svg';
import { useMutation } from 'react-query';
import Cookies from 'js-cookie';
import axios from 'axios';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { useRecoilState } from 'recoil';
interface UserSettingsModalProps {
  userId: number;
  admin: boolean;
}
const UserSettingsModal = (Props: UserSettingsModalProps) => {
  const { userId, admin } = Props;
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  console.log(
    'userId, admin, workspaceId',
    userId,
    admin,
    currentWorkspace.workspace_id,
  );
  const assignAdmin = async (userId: number) => {
    const accessToken = Cookies.get('ACCESS_KEY');
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/account/admin/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return res.data;
  };
  const assignAdminMutation = useMutation(assignAdmin, {
    onSuccess: data => {
      console.log(data);
      console.log('Added-admin');
    },
    onError: error => {
      console.error('Error assigning admin:', error);
    },
  });
  const deleteAdmin = async (userId: number) => {
    const accessToken = Cookies.get('ACCESS_KEY');
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/account/admin/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return res.data;
  };
  const deleteAdminMutation = useMutation(deleteAdmin, {
    onSuccess: data => {
      console.log(data);
      console.log('Delete-admin');
    },
    onError: error => {
      console.error('Error deleting admin:', error);
    },
  });
  const handleAdminClick = () => {
    if (admin) {
      deleteAdminMutation.mutate(userId);
    } else {
      assignAdminMutation.mutate(userId);
    }
  };
  return (
    <div className="absolute z-[95] top-[1rem] right-0">
      <div className="w-[178px] h-[120px] p-3 bg-white rounded-xl shadow border border-zinc-200 flex-col justify-start items-start inline-flex">
        <button
          className="w-[154px] p-3 bg-slate-200 rounded-lg justify-start items-center gap-3 inline-flex"
          onClick={handleAdminClick}
        >
          <Image src={ownerIcon} alt="관리자" />
          <div className="grow shrink basis-0 text-neutral-600 text-sm font-semibold">
            {admin ? '관리자 권한 삭제' : '관리자 권한 부여'}
          </div>
        </button>
        <button className="w-[154px] p-3 rounded-lg justify-start items-center gap-3 inline-flex">
          <Image src={trash} alt="삭제" />
          <div className="grow shrink basis-0 text-neutral-600 text-sm font-medium">
            삭제
          </div>
        </button>
      </div>
    </div>
  );
};
export default UserSettingsModal;
