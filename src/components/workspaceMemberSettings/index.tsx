import React, { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultWorkspace.svg';
import cancel from '../../../public/img/cancel.svg';
import plus from '../../../public/img/plus.svg';
import ownerIcon from '../../../public/img/owner.svg';
import verticalSetting from '../../../public/img/verticalSetting.svg';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { isInviteMemberModalState } from '@/store/atom/modalStatus';
import InviteMemberModal from '../modal/inviteMemberModal';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface WorkspaceUserList {
  userId: number;
  nickname: string;
  imgUrl: string;
  flag?: boolean;
  admin: boolean;
}

const WorkspaceMemberSttings = forwardRef((props, ref) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [inViteMemberVisible, setInViteMemberVisible] = useRecoilState(
    isInviteMemberModalState,
  );
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const [workspaceUserList, setWorkspaceUserList] = useState<
    WorkspaceUserList[]
  >([]);

  const toggleInviteMemberModal = () => {
    setInViteMemberVisible(!inViteMemberVisible);
  };

  // 현재 내 워크스페이스 있는 사람 목록
  const { data: currentUserData, isSuccess: currentUserSuccess } = useQuery(
    'currentUser',
    async () => {
      // workspace/{:workspaceId}/favorites/available-users
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/favorites/available-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('받아온 유저 목록', res.data);
      return res.data;
    },
  );

  useEffect(() => {
    if (currentUserSuccess) {
      // console.log(currentUserData);
      setWorkspaceUserList(currentUserData);
    }
  }, [currentUserData, currentUserSuccess]);

  // 떠나기 로직
  const leaveWorkspaceMutation = useMutation(
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    },
    {
      onSuccess: () => {
        router.push('/workspace');
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          setModalMessage(error.response.data.message);
          setModalVisible(true);
        } else {
          console.error('Error leaving the workspace:', error);
        }
      },
    },
  );

  const leaveWorkspaceHandler = () => {
    leaveWorkspaceMutation.mutate();
  };
  return (
    <div className="text-black flex flex-col gap-[0.75rem]">
      <div className="flex flex-col gap-[0.75rem]">
        <div className="flex justify-between px-[0.72rem]">
          <div className="font-semibold">멤버</div>
          <div className="relative">
            <div
              className="cursor-pointer relative w-[1.5rem] h-[1.5rem] hover:bg-gray-2 rounded-[0.5rem]"
              onClick={toggleInviteMemberModal}
            >
              <Image src={plus} alt="추가" />
            </div>
            {inViteMemberVisible && <InviteMemberModal />}
          </div>
        </div>
        <div className="users flex flex-col gap-[0.62rem] overflow-y-auto h-[21rem] text-[0.875rem]">
          {workspaceUserList.map(user => (
            <div
              key={user.userId}
              className="user flex items-center justify-between p-[0.75rem]"
            >
              <div className="flex items-center gap-[0.75rem]">
                <div className="h-[1.5rem] w-[1.5rem]">
                  <Image
                    src={user.imgUrl}
                    width={24}
                    height={24}
                    alt="기본유저"
                  />
                </div>
                <div>{user.nickname}</div>
              </div>
              {user.admin === true ? (
                <div className="cursor-pointer">
                  <Image src={ownerIcon} alt="owner" />
                </div>
              ) : (
                <div className="cursor-pointer">
                  <Image src={verticalSetting} alt="member" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end cursor-pointer">
        <div
          className="border-[1px] p-[0.62rem] rounded-[0.25rem] border-[#DFE0E8]
            hover:bg-gray-2"
          onClick={leaveWorkspaceHandler}
        >
          <div className="text-[0.8rem]">이 워크스페이스를 떠나기</div>
        </div>
      </div>
    </div>
  );
});

WorkspaceMemberSttings.displayName = 'WorkspaceSettings';
export default WorkspaceMemberSttings;
