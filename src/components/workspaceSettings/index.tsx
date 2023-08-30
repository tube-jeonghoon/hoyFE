import React, { useEffect, useState } from 'react';
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
import { useQuery } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

interface WorkspaceUserList {
  userId: number;
  nickname: string;
  imgUrl: string;
  flag?: boolean;
}

const WorkspaceSettings = () => {
  const [workspaceUserList, setWorkspaceUserList] = useState<
    WorkspaceUserList[]
  >([]);

  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const [inViteMemberVisible, setInViteMemberVisible] = useRecoilState(
    isInviteMemberModalState,
  );

  const toggleInviteMemberModal = () => {
    setInViteMemberVisible(!inViteMemberVisible);
  };

  // // 현재 내 정보 가져오는 함수
  // const { data: currentMyData, isSuccess: currentMySuccess } = useQuery(
  //   'currentMy',
  //   async () => {
  //     // workspace/{:workspaceId}/current-user
  //     const accessToken = Cookies.get('ACCESS_KEY');
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/current-user`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );
  //     console.log(res.data);
  //     return res.data;
  //   },
  // );

  // useEffect(() => {
  //   if (currentMySuccess) {
  //     console.log(currentMyData);
  //   }
  // }, []);

  // 현재 워크 스페이스 정보 가져오는 함수

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
      // console.log(res.data);
      return res.data;
    },
  );

  useEffect(() => {
    if (currentUserSuccess) {
      // console.log(currentUserData);
      setWorkspaceUserList(currentUserData);
    }
  }, [currentUserData, currentUserSuccess]);

  return (
    <div className="text-black">
      <div className="mb-[0.75rem] font-semibold leading-[1.6rem]">설정</div>
      <div className="flex gap-[1.25rem] mb-[1.5rem]">
        <div className="min-w-[3.75rem] min-h-[3.75rem]">
          <Image src={defaultUser} alt="기본유저" />
        </div>
        <div>
          <div className="flex flex-col gap-[0.62rem]">
            <div className="text-[0.875rem] font-semibold">
              워크스페이스 이름
            </div>
            <div
              className="flex items-center border-[1px] border-gray-300 rounded-[0.5rem]
              px-[0.75rem] py-[0.25rem]"
            >
              <div>
                <input
                  className="focus:outline-none text-[0.875rem]"
                  type="text"
                  placeholder={currentWorkspace?.workspace_name}
                />
              </div>
              <div className="cursor-pointer">
                <Image src={cancel} alt="취소" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-[0.75rem] text-gray-5 cursor-pointer">
                이 워크스페이스를 삭제하기
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <div className="users flex flex-col gap-[0.62rem] overflow-y-auto h-[16rem] text-[0.875rem]">
          <div className="user flex items-center justify-between p-[0.75rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="h-[1.5rem] w-[1.5rem]">
                <Image src={defaultUser} alt="기본유저" />
              </div>
              <div>전정훈</div>
            </div>
            <div className="cursor-pointer">
              <Image src={ownerIcon} alt="주인" />
            </div>
          </div>
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
              <div className="cursor-pointer">
                <Image src={verticalSetting} alt="설정" />
              </div>
            </div>
          ))}
          {/* <div className="user flex items-center justify-between p-[0.75rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="h-[1.5rem] w-[1.5rem]">
                <Image src={defaultUser} alt="기본유저" />
              </div>
              <div>전정훈</div>
            </div>
            <div className="cursor-pointer">
              <Image src={verticalSetting} alt="설정" />
            </div>
          </div>
          <div className="user flex items-center justify-between p-[0.75rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="h-[1.5rem] w-[1.5rem]">
                <Image src={defaultUser} alt="기본유저" />
              </div>
              <div>전정훈</div>
            </div>
            <div className="cursor-pointer">
              <Image src={verticalSetting} alt="설정" />
            </div>
          </div>
          <div className="user flex items-center justify-between p-[0.75rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="h-[1.5rem] w-[1.5rem]">
                <Image src={defaultUser} alt="기본유저" />
              </div>
              <div>전정훈</div>
            </div>
            <div className="cursor-pointer">
              <Image src={verticalSetting} alt="설정" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
