import React, {
  useRef,
  useState,
  ChangeEvent,
  InputHTMLAttributes,
} from 'react';
import { useRecoilState } from 'recoil';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import pica from 'pica';
import { isCreateWorkspaceModalState } from '@/store/atom/modalStatus';
interface FileInputRef extends InputHTMLAttributes<HTMLInputElement> {
  current: HTMLInputElement | null;
}

const CreateWorkSpaceModal = () => {
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceNameRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 유형 확인
    if (!file.type.startsWith('image/')) {
      setFileError('이미지 파일만 업로드 가능합니다.');
      return;
    } else {
      setFileError(null);
    }

    const targetSize = 300;
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const img = document.createElement('img');
        img.src = e.target.result;

        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          // Pica 리사이징
          await pica().resize(img, canvas);

          canvas.toBlob(async resizedBlob => {
            if (resizedBlob) {
              setSelectedFile(
                new File([resizedBlob], file.name, { type: 'image/jpeg' }),
              );
            }

            // 파일 미리보기 URL과 파일 이름 설정
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
            setFileName(file.name);
          });
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateWorkspace = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    // 워크스페이스 이름 등의 정보를 formData에 추가
    const workspaceName = workspaceNameRef.current?.value;
    if (workspaceName) {
      formData.append('name', workspaceName);
    }
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // console.log('Workspace created', response.data);
      setCreateWorkspaceVisible(false);
      setSelectedFile(null);
      window.location.reload();
      // Blob URL 해제
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
        setFilePreview(null); // 미리보기 및 파일이름 상태 초기화
        setFileName(null);
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleAddButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
                    ref={workspaceNameRef}
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
                    {filePreview ? (
                      <Image
                        src={filePreview}
                        width={60}
                        height={60}
                        alt="선택된 이미지"
                      />
                    ) : (
                      <Image
                        src="/img/empty_workspace.png"
                        width={60}
                        height={60}
                        alt="이미지"
                      />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <div className="flex mb-[0.6rem]">
                      <div
                        onClick={handleAddButtonClick}
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
                      {fileError ||
                        (fileName
                          ? fileName
                          : '워크스페이스의 대표사진으로 전체공개입니다.')}
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
                  onClick={handleCreateWorkspace}
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
