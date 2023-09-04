import WorkspaceOwnerSettings from '@/components/workspaceOwnerSettings';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import workSpace from '../../../../public/img/workSpace.svg';
import {
  isInviteMemberModalState,
  isSettingsModalState,
} from '@/store/atom/modalStatus';
import { useRecoilState } from 'recoil';
import AccountSettings from '@/components/accountSettings';
import { selectedSettingMenuState } from '@/store/atom/selectedMenuState';
import settingUser from '../../../../public/img/settingUser.svg';
import axios from 'axios';
import Cookies from 'js-cookie';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { useQuery } from 'react-query';
import WorkspaceMemberSttings from '@/components/workspaceMemberSettings';

const SettingsModal = () => {
  const [settingsVisible, SetSettingsVisible] =
    useRecoilState(isSettingsModalState);

  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const [currentUser, setCurrentUser] = useState('');

  const accountRef = useRef();
  const workspaceRef = useRef();
  const [inviteVisible, setInviteVisible] = useRecoilState(
    isInviteMemberModalState,
  );

  const [selectedSettingMenu, setSelectedSettingMenu] = useRecoilState<string>(
    selectedSettingMenuState,
  );

  // 현재 유저 확인
  const fetchUser = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      // workspace/{:workspaceId}/current-user
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/current-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: fetchUserData, isSuccess: fetchUserIsSuccess } = useQuery(
    'fetchUser',
    fetchUser,
  );

  useEffect(() => {
    if (fetchUserIsSuccess) {
      console.log(fetchUserData);
      setCurrentUser(fetchUserData);
    }
  }, [fetchUserIsSuccess, fetchUserData]);

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      SetSettingsVisible(false);
      setInviteVisible(false);

      if (accountRef?.current && selectedSettingMenu == 'userSettings') {
        (accountRef.current as any).handleUpdateAccount();
      } else if (
        workspaceRef?.current &&
        selectedSettingMenu == 'workspaceSettings'
      ) {
        (workspaceRef.current as any).handleUpdateAccount();
      }
    }
  };

  const userSettingsHandler = () => {
    setSelectedSettingMenu('userSettings');
  };

  const workspaceSettingsHandler = () => {
    setSelectedSettingMenu('workspaceSettings');
  };

  return (
    <div>
      <div
        className="absolute z-[101] top-0 left-0 w-[100vw] h-[100vh]
        bg-black bg-opacity-10"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-white top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2
            absolute rounded-[0.75rem]"
        >
          <div className="flex text-black">
            <div className="py-[2rem] px-[1.5rem] border-r-[1px]">
              <div className="flex flex-col gap-[0.25rem]">
                <div
                  className={`flex w-[10rem] items-center gap-[0.62rem] p-[0.75rem] hover:bg-gray-2
                  cursor-pointer rounded-[0.5rem] ${
                    selectedSettingMenu === 'userSettings' && 'bg-gray-2'
                  }`}
                  onClick={userSettingsHandler}
                >
                  <div>
                    <Image src={settingUser} alt="계정" />
                  </div>
                  <div className="text-[0.875rem] leading-[1.4rem] font-semibold">
                    계정
                  </div>
                </div>
                <div
                  className={`flex w-[10rem] items-center gap-[0.62rem] p-[0.75rem] hover:bg-gray-2
                  cursor-pointer rounded-[0.5rem] ${
                    selectedSettingMenu === 'workspaceSettings' && 'bg-gray-2'
                  }`}
                  onClick={workspaceSettingsHandler}
                >
                  <div>
                    <Image src={workSpace} alt="워크스페이스" />
                  </div>
                  <div className="text-[0.875rem] leading-[1.4rem] font-semibold">
                    워크스페이스
                  </div>
                </div>
              </div>
              {/* <div>문의하기</div> */}
            </div>
            <div className="py-[2rem] px-[1.5rem] w-[22.875rem] h-[30rem]">
              {selectedSettingMenu === 'userSettings' && (
                <AccountSettings ref={accountRef} />
              )}
              {selectedSettingMenu === 'workspaceSettings' &&
                (fetchUserData.admin === true ? (
                  <WorkspaceOwnerSettings ref={workspaceRef} />
                ) : (
                  <WorkspaceMemberSttings ref={workspaceRef} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
