import { currentWorkspaceState } from '@/store/atom/userStatusState';
import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import Image from 'next/image';
import cancel from '../../../../public/img/cancel.svg';
import { useMutation } from 'react-query';

const InviteMemberModal = () => {
  const [email, setEmail] = useState<string>('');
  const [inviteList, setInviteList] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const handleInputChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleEnterPress = async (e: any) => {
    if (e.key === 'Enter') {
      // 이미 inviteList에 존재하는 이메일인지 확인
      if (inviteList.includes(email)) {
        setErrorMessage('이미 추가된 이메일 주소입니다.');
        return;
      }
      try {
        const accessToken = Cookies.get('ACCESS_KEY');
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/invitations/availability`,
          {
            email: email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (res.data.answer) {
          setInviteList([...inviteList, email]);
          setEmail('');
          setErrorMessage('');
          // console.log(inviteList);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          console.error(error);
          console.error(error.response.data.message);
          setErrorMessage(error.response.data.message);
        }
      }
    }
  };

  const InviteMutation = useMutation(
    async () => {
      const accessKey = Cookies.get('ACCESS_KEY');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/invitations`,
        {
          emails: inviteList,
        },
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
          },
        },
      );
      return res.data;
    },
    {
      onSuccess: data => {
        console.log('Invitations sent:', data);
        setInviteList([]);
        setEmail('');
      },
      onError: error => {
        console.error('Error sending invites:', error);
      },
    },
  );
  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteList(inviteList.filter(email => email !== emailToRemove));
  };
  return (
    <div className="absolute z-[95] top-[1.5rem] right-0">
      <div
        className="w-[24.375rem] bg-white border-[1px] rounded-[0.75rem] p-[1.5rem] flex flex-col gap-[0.75rem]
        text-black"
      >
        <div className="border-[1px] p-[0.75rem] rounded-[0.75rem]">
          <input
            value={email}
            onChange={handleInputChange}
            onKeyPress={handleEnterPress}
            className="w-full text-[0.875rem] focus:outline-none"
            type="text"
            placeholder="e-mail을 입력해 멤버를 추가해주세요."
          />
        </div>
        <div>
          <div className="flex gap-[0.62rem] flex-wrap overflow-y-auto max-h-[18.5rem]">
            {inviteList.map((invitedEmail, index) => (
              <div
                key={index}
                className="border-[1px] border-gray-[#DFE0E8] bg-gray-1 px-[1rem] py-[0.5rem]
                  flex items-center gap-[0.12rem] rounded-[6.25rem]"
              >
                <div>{invitedEmail}</div>
                <div
                  className="cursor-pointer"
                  onClick={() => handleRemoveEmail(invitedEmail)}
                >
                  <Image src={cancel} alt="취소" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-[0.875rem]">
          <div className="leading-[1.4rem] text-gray-4">
            {errorMessage || ''}
          </div>
          <div
            onClick={() => !InviteMutation.isLoading && InviteMutation.mutate()}
            className="h-[2rem] bg-gray-3 text-white flex items-center rounded-[0.5rem]
          gap-[0.2rem] px-[0.75rem] py-[0.25rem] cursor-pointer font-semibold hover:bg-primary-blue"
          >
            <div>
              {InviteMutation.isLoading ? (
                <div className="flex items-center gap-[0.2rem]">
                  <div>전송중...</div>
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">로딩중...</span>
                  </div>
                </div>
              ) : (
                '전송'
              )}
            </div>
            <div>({inviteList.length})</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InviteMemberModal;
