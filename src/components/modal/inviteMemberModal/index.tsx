import { currentWorkspaceState } from '@/store/atom/userStatusState';
import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import Image from 'next/image';
import cancel from '../../../../public/img/cancel.svg';

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
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/invitations/availability?email=${email}`,
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
          setErrorMessage(error.response.data.message);
        }
      }
    }
  };

  const handleSendInvites = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/invitations`,
        {
          emails: inviteList,
        },
      );
      console.log('Invitations sent:', res.data);
      setInviteList([]);
      setEmail('');
    } catch (error) {
      console.error('Error sending invites:', error);
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteList(inviteList.filter(email => email !== emailToRemove));
  };

  return (
    <div className="absolute top-[1.5rem] right-0">
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
            onClick={handleSendInvites}
            className="h-[2rem] bg-gray-3 text-white flex items-center rounded-[0.5rem]
          gap-[0.2rem] px-[0.75rem] py-[0.25rem] cursor-pointer font-semibold hover:bg-primary-blue"
          >
            <div>전송</div>
            <div>({inviteList.length})</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
