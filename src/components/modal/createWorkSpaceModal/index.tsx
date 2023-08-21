import { isCreateWorkspaceModalState } from '@/store/atom/modalStatus';
import React from 'react';
import { useRecoilState } from 'recoil';
import Image from 'next/image';

const CreateWorkSpaceModal = () => {
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setCreateWorkspaceVisible(false);
    }
  };

  return (
    <div
      className={`modalContainer fixed inset-0 flex items-center justify-center z-[101] ${
        createWorkspaceVisible ? 'visible' : 'hidden'
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
              <div className="text-[1.125rem] font-bold leading-[1.8rem] mb-[1.5rem]">
                새로운 워크스페이스 생성
              </div>
              <div className="mb-[1.5rem]">
                <div className="font-bold leading-[1.6rem] mb-[1rem]">이름</div>
                <div className="w-full h-12 px-3 py-1 bg-white rounded-lg border border-zinc-200 justify-start items-center gap-2.5 inline-flex">
                  <input
                    className="grow shrink basis-0 h-[22px] text-gray-400 text-sm font-medium
                    leading-snug focus:text-black focus:outline-none bg-transparent "
                    placeholder="워크스페이스 이름을 입력하세요."
                  />
                </div>
              </div>
              <div className="mb-[1.5rem]">
                <div className="font-bold mb-[1rem]">사진</div>
                <div className="flex">
                  <div className="mr-[1.5rem]">
                    <Image
                      src="/img/empty_workspace.png"
                      width={60}
                      height={60}
                      alt="이미지"
                    />
                  </div>
                  <div>
                    <div className="flex mb-[0.6rem]">
                      <div
                        className="border-[1px] px-[0.75rem] py-[0.25rem] rounded-[0.5rem]
                      text-[0.875rem] font-bold leading-[1.4rem] mr-[0.8rem] cursor-pointer"
                      >
                        사진 추가
                      </div>
                      <div
                        className="border-[1px] px-[0.75rem] py-[0.25rem] rounded-[0.5rem]
                      text-[0.875rem] font-bold leading-[1.4rem] cursor-pointer"
                      >
                        사진 삭제
                      </div>
                    </div>
                    <div className="text-[0.7rem] leading-[1.2rem] text-gray-4">
                      워크스페이스의 대표사진으로 전체공개입니다.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div
                  onClick={() => setCreateWorkspaceVisible(false)}
                  className="w-[10rem] h-[3rem] font-bold leading-[1.6rem] border-[1px] rounded-[0.5rem]
                py-[0.25rem] px-[0.75rem] flex items-center justify-center mr-[0.75rem] cursor-pointer"
                >
                  취소
                </div>
                <div
                  className="w-[10rem] h-[3rem] font-bold leading-[1.6rem] border-[1px] rounded-[0.5rem]
                    py-[0.25rem] px-[0.75rem] flex items-center justify-center bg-gray-3 text-white
                    cursor-pointer hover:bg-primary-blue"
                >
                  생성하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkSpaceModal;
