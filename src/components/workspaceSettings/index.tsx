import React from 'react';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultWorkspace.svg';
import cancel from '../../../public/img/cancel.svg';
import plus from '../../../public/img/plus.svg';
import owner from '../../../public/img/owner.svg';
import verticalSetting from '../../../public/img/verticalSetting.svg';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { isInviteMemberModalState } from '@/store/atom/modalStatus';

const WorkspaceSettings = () => {
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const [inViteMemberVisible, setInViteMemberVisible] = useRecoilState(
    isInviteMemberModalState,
  );

  const toggleInviteMemberModal = () => {
    setInViteMemberVisible(!inViteMemberVisible);
  };

  return (
    <div className="text-black">
      <div className="mb-[0.75rem] font-semibold leading-[1.6rem]">설정</div>
      <div className="flex gap-[1.25rem] mb-[1.5rem]">
        <div className="min-w-[3.75rem] min-h-[3.75rem]">
          <Image src={defaultUser} alt="기본유저" />
        </div>
        <div>
          <div className="flex flex-col gap-[0.62rem]">
            <div className="text-[0.875rem]">워크스페이스 이름</div>
            <div
              className="flex items-center border-[1px] border-gray-300 rounded-[0.5rem]
              px-[0.75rem] py-[0.25rem]"
            >
              <div>
                <input
                  className="focus:outline-none text-[0.875rem]"
                  type="text"
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
          <div className="cursor-pointer">
            <Image src={plus} alt="추가" />
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
              <Image src={owner} alt="주인" />
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
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
