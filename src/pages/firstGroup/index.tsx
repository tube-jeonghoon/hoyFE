import React, { useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import defaultWorkspace from '../../../public/img/defaultWorkspace.svg';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { isCreateWorkspaceModalState } from '@/store/atom/modalStatus';
import Cookies from 'js-cookie';
import pica from 'pica';

const FirstGroup = () => {
  const router = useRouter();
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

      router.push('/home');
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

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-[6.25rem] p-[1.5rem]">
          <div className="mx-auto">
            <div className="text-[1.5rem] font-bold leading-[2.4rem]">
              워크스페이스 설정을 완료하세요.
            </div>
          </div>
          <div className="flex flex-col gap-[3.75rem] p-[1.5rem] border-[1px] rounded-[0.75rem]">
            <div className="flex flex-col gap-[1rem] w-full">
              <div className="text-black text-[1.25rem] font-bold">이름</div>
              <div className="">
                <input
                  ref={workspaceNameRef}
                  className="grow shrink basis-0 h-[3rem] text-gray-400 focus:text-black focus:outline-none bg-transparent border-[1px] rounded-[0.3rem]
                    px-[0.75rem] py-[0.25rem] w-full"
                  placeholder="워크스페이스 이름을 입력하세요."
                />
              </div>
            </div>
            <div className="flex flex-col gap-[1rem]">
              <div className="text-black text-[1.25rem] font-bold">사진</div>
              <div className="flex gap-[1.5rem] items-center">
                <div className="w-[5rem] h-[5rem]">
                  {filePreview ? (
                    <Image
                      src={filePreview}
                      width={60}
                      height={60}
                      alt="선택된 이미지"
                    />
                  ) : (
                    <Image
                      src={defaultWorkspace}
                      width={60}
                      height={60}
                      alt="이미지"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-[0.62rem]">
                  <div className="flex gap-[0.81rem]">
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
            <div className="mx-auto">
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
  );
};

export default FirstGroup;
