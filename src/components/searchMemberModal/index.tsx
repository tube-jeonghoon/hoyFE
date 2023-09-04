import React, { use, useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultUser.png';
import star from '../../../public/img/star.svg';
import fillStar from '../../../public/img/fillStar.svg';
import { useRecoilState } from 'recoil';
import { isSearchMemberModalState } from '@/store/atom/modalStatus';
import axios from 'axios';
import {
  currentFavoriteUserIdState,
  currentHeaderNameState,
  currentWorkspaceState,
} from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { set } from 'date-fns';

interface MemberList {
  user_id: number;
  nickname: string;
  user_imgUrl: string;
  flag?: boolean;
}

const SearchMemberModal = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const [currentFavoriteUserId, setCurrentFavoriteUserId] = useRecoilState(
    currentFavoriteUserIdState,
  );
  const [currentHeaderName, setCurrentHeaderName] = useRecoilState(
    currentHeaderNameState,
  );
  const [searchMemeberVisible, setSearchMemeberVisible] = useRecoilState(
    isSearchMemberModalState,
  );
  const [memberList, setMemberList] = useState<MemberList[]>([]);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMemberQuery(e.target.value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      queryClient.invalidateQueries('memberList'); // 쿼리 캐시 무효화
    }
  };

  // 외부 영역 클릭했을 때 모달 닫기
  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setSearchMemeberVisible(false);
    }
  };

  const fetchMembers = async (searchMemberQuery: string) => {
    const accessToken = Cookies.get('ACCESS_KEY');
    try {
      const res = await axios.get(
        // http://localhost:8000/api/workspace/21/group/search?query=지수
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/group/search?query=${searchMemberQuery}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('✨ ➤ fetchMembers ➤ fetchMembers:', res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: memberlistData,
    isLoading: memberlistIsLoading,
    isError: memberlistIsError,
    isSuccess: memberlistSuccess,
  } = useQuery(['memberlist', searchMemberQuery], () =>
    fetchMembers(searchMemberQuery),
  );

  useEffect(() => {
    if (memberlistSuccess) {
      console.log(memberlistData.data);
      setMemberList(memberlistData);
    }
  }, [memberlistData, memberlistSuccess]);

  const cancelHandler = () => {
    setSearchMemberQuery('');
  };

  const viewFavoriteHandler = (userId: number, userName: string) => {
    setSearchMemeberVisible(false);
    setCurrentFavoriteUserId(userId);
    setCurrentHeaderName(userName);
    router.push('/viewFavorite');
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
              absolute w-[23.875rem] h-[30rem] rounded-[0.75rem]"
        >
          <div className="contes-area">
            <div className="p-[2rem] flex flex-col gap-[1.5rem]">
              <div className="flex flex-col gap-[1rem]">
                <div className="text-black font-bold leading-[1.6rem]">
                  멤버 찾기
                </div>
                <div>
                  <div
                    className="flex items-center border-[1px] rounded-[0.5rem]
                    p-[0.75rem] gap-[0.62rem] text-gray-3"
                  >
                    <div className="text-black">
                      <BiSearch />
                    </div>
                    <input
                      className="text-black text-[0.875rem] leading-[1.4rem] w-full focus:outline-none"
                      type="text"
                      placeholder="멤버 이름 검색"
                      value={searchMemberQuery}
                      onChange={handleSearchInput}
                      onKeyPress={handleKeyPress}
                    />
                    {searchMemberQuery !== '' && (
                      <div
                        className="text-black cursor-pointer w-[1.25rem] h-[1.25rem] flex justify-center items-center"
                        onClick={cancelHandler}
                      >
                        <RxCross2 />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[0.62rem]">
                {memberList.map(member => (
                  <div
                    key={member.user_id}
                    className="flex justify-between items-center p-[0.75rem] hover:bg-gray-2
                  cursor-pointer hover:rounded-[0.5rem]"
                    onClick={() =>
                      viewFavoriteHandler(member.user_id, member.nickname)
                    }
                  >
                    <div className="flex items-center gap-[0.75rem] text-black">
                      <div className="w-[1.5rem]">
                        <Image
                          src={member.user_imgUrl || defaultUser}
                          width={24}
                          height={24}
                          alt="defaultUser"
                        />
                      </div>
                      <div className="text-[0.875rem]">{member.nickname}</div>
                    </div>
                    {member.flag ? (
                      <div>
                        <Image src={fillStar} alt="즐겨찾기" />
                      </div>
                    ) : (
                      <div>
                        <Image src={star} alt="즐겨찾기" />
                      </div>
                    )}
                  </div>
                ))}
                {/* <div
                  className="flex justify-between items-center p-[0.75rem] hover:bg-gray-2
                  cursor-pointer hover:rounded-[0.5rem]"
                >
                  <div className="flex items-center gap-[0.75rem] text-black">
                    <div className="w-[1.5rem]">
                      <Image src={defaultUser} alt="defaultUser" />
                    </div>
                    <div className="text-[0.875rem]">홍길동</div>
                  </div>
                  <div>
                    <Image src={star} alt="즐겨찾기" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMemberModal;
