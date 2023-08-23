import { isCreateGroupModalState } from '@/store/atom/modalStatus';
import React from 'react';
import { useRecoilState } from 'recoil';

const CreateGroupModal = () => {
  const [createGroupVisible, setCreateGroupVisible] = useRecoilState(
    isCreateGroupModalState,
  );

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setCreateGroupVisible(false);
    }
  };

  return (
    <div
      className={`modalContainer fixed inset-0 flex items-center justify-center z-[101] ${
        createGroupVisible ? 'visible' : 'hidden'
      }`}
    >
      <div
        className="absolute z-[99] top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-10"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          className="absolute border-[1px] border-gray-100 p-[14px] rounded-[5px] w-[23.875rem]
        overflow-y-auto bg-white top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="contentsArea w-full">
            <div className="p-[2rem]">
              <div className="flex flex-col gap-[1rem]">
                <div className="text-black font-semibold leading-[1.6rem]">
                  그룹 이름
                </div>
                <div>
                  <input type="text" placeholder="팀 이름" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
