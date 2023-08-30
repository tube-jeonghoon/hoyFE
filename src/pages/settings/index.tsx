import WorkspaceSettings from '@/components/workspaceSettings';
import React from 'react';
import Image from 'next/image';
import workSpace from '../../../public/img/workSpace.svg';
import { isSettingsModalState } from '@/store/atom/modalStatus';
import { useRecoilState } from 'recoil';

const Settings = () => {
  const [settingsVisible, SetSettingsVisible] =
    useRecoilState(isSettingsModalState);

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      SetSettingsVisible(false);
    }
  };

  return (
    <div>
      <div
        className="absolute z-[101] top-0 left-0 w-[100vw] h-[100vh]
        bg-black bg-opacity-10"
      >
        <div
          className="bg-white top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2
            absolute rounded-[0.75rem]"
        >
          <div className="flex text-black">
            <div className="py-[2rem] px-[1.5rem] border-r-[1px]">
              {/* <div>계정</div> */}
              <div>
                <div
                  className="flex w-[10rem] items-center gap-[0.62rem] p-[0.75rem] hover:bg-gray-2
                  cursor-pointer rounded-[0.5rem]"
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
            <div className="py-[2rem] px-[1.5rem]">
              <WorkspaceSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
