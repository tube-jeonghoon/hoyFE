import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultUser.png';
import cancel from '../../../public/img/cancel.svg';
import { useRecoilState } from 'recoil';
import {
  currentUserDataState,
  currentWorkspaceState,
} from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import pica from 'pica';

const AccountSettings = forwardRef((props, ref) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef(null);

  const [fileError, setFileError] = useState<string | null>(null); // 상태 에러 메시지
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  const [currentUserData, setCurrentUserData] =
    useRecoilState(currentUserDataState);

  // 파일 선택
  const handleAddButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 파일을 상태로 저장 (selectedFile)
  const handleImageUpload = (event: any) => {
    // 파일 선택
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
          });
        };
      }
    };
    reader.readAsDataURL(file);
  };

  useImperativeHandle(ref, () => ({
    async handleUpdateAccount() {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      // 유저 이름 정보를 formData에 추가
      const userName = userNameRef.current?.value;
      if (userName) {
        formData.append('name', userName);
      }
      try {
        const accessToken = Cookies.get('ACCESS_KEY');
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${selectedWorkspace.workspace_id}/user-account/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('User Account updated', response.data);
        // setCreateWorkspaceVisible(false);
        // setSelectedFile(null);
        window.location.reload();
      } catch (error) {
        console.error('Error updating user account:', error);
      }
    },
  }));

  const logoutHandler = () => {
    const confirm = window.confirm('로그아웃 하시겠습니까?');
    if (!confirm) return;

    // 로그아웃 로직
    Cookies.remove('ACCESS_KEY');
    Cookies.remove('REFRESH_KEY');
    router.push('/login');
  };

  return (
    <div className="text-black flex flex-col gap-[1.5rem]">
      <div className="font-bold leading-[1.6rem]">내 프로필</div>

      <div className="flex justify-between">
        <div className="border-[#DFE0E8] rounded-[1.25rem] w-[3.75rem] h-[3.75rem]">
          {filePreview ? (
            <Image
              src={filePreview}
              width={60}
              height={60}
              alt="이미지"
              onClick={handleAddButtonClick}
              className="imageUpload"
            />
          ) : (
            <Image
              src={currentUserData?.imgUrl}
              width={60}
              height={60}
              alt="이미지"
              onClick={handleAddButtonClick}
              className="imageUpload"
            />
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex flex-col gap-[0.62rem]">
          <div className="text-[0.875rem] font-bold">나의 이름</div>
          <div
            className="w-[14.8rem] py-[0.25rem] px-[0.75rem] flex gap-[0.62rem]
          border-[1px] border-[#DFE0E8] rounded-[0.5rem] justify-between items-center"
          >
            <input
              ref={userNameRef}
              className="text-[0.875rem] text-gray-3 focus:outline-none focus:text-black w-full"
              type="text"
              placeholder={currentUserData.nickname}
            />
            <Image src={cancel} alt="cancel" />
          </div>
          <div
            className="flex justify-end cursor-pointer"
            onClick={logoutHandler}
          >
            <div className="text-[0.75rem] text-[#9092A0]">로그아웃</div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
});

AccountSettings.displayName = 'AccountSettings';

export default AccountSettings;
