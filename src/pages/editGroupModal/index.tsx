import { isEditGroupModalState } from '@/store/atom/modalStatus';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import cancelImg from '../../../public/img/cancel.svg';
import searchImg from '../../../public/img/search.png';
import membercheckImg from '../../../public/img/memberCheck.svg';
import fillMemberCheckImg from '../../../public/img/fillMemberCheck.svg';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { group } from 'console';

interface Member {
  userId: number;
  nickname: string;
  imgUrl: string;
}

const EditGroupModal = () => {
  const [editGroupVisible, setEditGroupVisible] = useRecoilState(
    isEditGroupModalState,
  );
  const [currentWorkspace, setCurrentWorkspace] = useState({
    workspace_id: 59,
  });
  // const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
  //   currentWorkspaceState,
  // );

  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setEditGroupVisible(false);
    }
  };

  // 유저 정보 받아오기
  const { data: groupFetchUserData, isSuccess: groupFetchUserSuccess } =
    useQuery('groupFetchUserData', async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        //workspace/{:workspaceId}/group/{:groupId}/available-users
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/group/12/available-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log(res.data.workspaceMembers);
      return res.data.workspaceMembers;
    });

  useEffect(() => {
    if (groupFetchUserSuccess) {
      setWorkspaceMembers(groupFetchUserData);
    }
  }, [groupFetchUserSuccess, groupFetchUserData]);

  return (
    <div
      className={`modalContainer fixed inset-0 flex items-center justify-center z-[101]${
        editGroupVisible ? 'visible' : 'hidden'
      }`}
    >
      <div
        className="absolute z-[99] top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-10"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          className="absolute border-[1px] border-gray-100 p-[14px] w-[23.875rem]
        overflow-y-auto bg-white rounded-[0.75rem] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="contentsArea w-full ">
            <div className="p-[2rem] flex flex-col gap-[1.5rem]">
              <div className="flex flex-col gap-[1rem]">
                <div className="text-black font-semibold leading-[1.6rem]">
                  그룹 이름
                </div>
                <div className="flex w-full items-center justify-between gap-[0.62rem] border-[1px] p-[0.75rem] rounded-[0.5rem]">
                  <input
                    className="focus:outline-none w-full"
                    type="text"
                    placeholder="팀 이름"
                    value={groupTitle}
                    onChange={e => setGroupTitle(e.target.value)}
                  />
                  {groupTitle.length > 0 && (
                    <div
                      className="cursor-pointer"
                      onClick={() => setGroupTitle('')}
                    >
                      <Image src={cancelImg} alt="취소" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[1rem]">
                <div className="flex gap-[0.38rem]">
                  <div className="text-black leading-[1.6rem] font-semibold">
                    멤버 추가
                  </div>
                  <div className="text-gray-5 font-semibold leading-[1.6rem]">
                    {selectedMembers.length}명
                  </div>
                </div>
                <div className="flex gap-[0.38rem] flex-wrap">
                  {/* {selectedMembers.map((member: Member) => (
                    <div
                      key={member.userId}
                      className="border border-gray-300 px-[1rem] rounded-[6.25rem] bg-gray-1 py-[0.5rem]
                        flex gap-[0.12rem] items-center justify-between"
                    >
                      <div className="flex items-center text-[0.75rem] text-black">
                        {member.nickname}
                      </div>
                      <div className="flex items-center cursor-pointer">
                        <Image
                          src={cancelImg}
                          width={16}
                          height={16}
                          alt="취소"
                        />
                      </div>
                    </div>
                  ))} */}
                </div>
                <div className="flex border-[1px] p-[0.75rem] rounded-[0.5rem] items-center gap-[0.62rem]">
                  <div>
                    <Image src={searchImg} alt="검색" />
                  </div>
                  <div className="w-full">
                    <input
                      className="focus:outline-none w-full"
                      type="text"
                      placeholder="멤버 이름 검색"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[0.62rem] overflow-y-auto h-[13.5rem]">
                  {workspaceMembers?.map((member: Member) => (
                    <div
                      key={member.userId}
                      className="flex gap-[0.75rem] items-center justify-between p-[0.75rem]
                      hover:bg-gray-2 rounded-[0.5rem] cursor-pointer"
                      // onClick={() => toggleMemberSelection(member)}
                    >
                      <div className="flex gap-[0.75rem] items-center ">
                        <div>
                          <Image
                            src={member.imgUrl}
                            width={24}
                            height={24}
                            alt="user"
                          />
                        </div>
                        <div className="text-black text-[0.875rem]">
                          {member.nickname}
                        </div>
                      </div>
                      <div>
                        <Image
                          src={
                            selectedMembers.some(
                              selected => selected.userId === member.userId,
                            )
                              ? fillMemberCheckImg
                              : membercheckImg
                          }
                          alt="멤버 추가"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-[0.75rem]">
                <div
                  className="border-[1px] rounded-[0.75rem] px-[2rem] py-[0.5rem] h-[3rem] w-[9.5rem]
                  flex items-center justify-center text-[0.875rem] cursor-pointer"
                  onClick={() => setEditGroupVisible(false)}
                >
                  취소
                </div>
                <div
                  className="border-[1px] rounded-[0.75rem] px-[2rem] py-[0.5rem] h-[3rem] w-[9.5rem]
                  flex items-center justify-center bg-primary-blue cursor-pointer text-white text-[0.875rem]"
                  onClick={editGroup}
                >
                  완료
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
