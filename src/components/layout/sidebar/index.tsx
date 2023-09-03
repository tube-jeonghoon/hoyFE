import React, { useEffect, useRef, useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import { AiOutlinePlus, AiFillStar } from 'react-icons/ai';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import {
  isCreateGroupModalState,
  isCreateMemberModalState,
  isCreateWorkspaceModalState,
  isSearchMemberModalState,
  isSelectWorkspaceModalState,
  isSettingsModalState,
  isUpdateModalState,
} from '@/store/atom/modalStatus';
import WorkspaceSelectModal from '../../modal/workspaceSelectModal';
import CreateWorkSpaceModal from '../../modal/createWorkSpaceModal';
import SearchMemberModal from '../../searchMemberModal';
import { useRouter } from 'next/router';
import axios from 'axios';
import workspaceListState from '@/store/atom/workspaceListState';
import {
  currentGroupState,
  currentUserDataState,
  currentHeaderNameState,
  currentWorkspaceState,
  currentFavoriteUserIdState,
  workspaceIdState,
} from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import CreateGroupModal from '../../modal/createGroupModal';
import CreateFavoriteMemberModal from '../../modal/createFavoriteMemberModal';
import favoriteUserListState from '@/store/atom/favoriteUserListState';
import groupListState from '@/store/atom/groupListState';
import UpdateModal from '../../updateModal';
import { GroupList, FavoriteUserList } from '../../../types/sidebarTypes';
import { useQuery, useQueryClient } from 'react-query';
import { fetchWorkspaceData } from '@/apis/utils/api/sidebar/fetchWorkSpace';
import fetchUserDataApi from '@/apis/utils/api/sidebar/fetchUserDataApi';
import defaultWorkspace from '../../../../public/img/defaultWorkspace.svg';
import SettingsModal from '@/components/modal/settingsModal';
import { selectedMenuState } from '@/store/atom/selectedMenuState';

const SideBar = () => {
  const router = useRouter();
  const queryClinet = useQueryClient();

  const [workspaceId, setWorkspaceId] = useRecoilState(workspaceIdState);

  const [currentUserData, setCurrentUserData] =
    useRecoilState(currentUserDataState);
  const [currentHeaderName, setCurrentHeaderName] = useRecoilState(
    currentHeaderNameState,
  );
  const [workspaceSelectVisible, setWorkspaceSelectVisible] = useRecoilState(
    isSelectWorkspaceModalState,
  );
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const [searchMemeberVisible, setSearchMemeberVisible] = useRecoilState(
    isSearchMemberModalState,
  );
  const [createGroupModalVisible, setCreateGroupModalVisible] = useRecoilState(
    isCreateGroupModalState,
  );
  const [createFavoriteVisible, setCreateFavoriteVisible] = useRecoilState(
    isCreateMemberModalState,
  );
  const [updateModalVisible, setUpdateModalVisible] =
    useRecoilState(isUpdateModalState);

  const [updateSettingsVisible, setSettingsModalVisible] =
    useRecoilState(isSettingsModalState);

  const [currentFavoriteUserId, setCurrentFavoriteUserId] = useRecoilState(
    currentFavoriteUserIdState,
  );
  const [workspaceList, setWorkspaceList] = useRecoilState(workspaceListState);
  const [currentWorkSpace, setCurrentWorkSpace] = useRecoilState(
    currentWorkspaceState,
  );
  const [currentGroup, setCurrentGroup] = useRecoilState(currentGroupState);

  const [favoriteUserList, setFavoriteUserList] = useRecoilState(
    favoriteUserListState,
  );

  const [groupList, setGroupList] = useRecoilState(groupListState);
  const [isWorkspaceSelected, setIsWorkspaceSelected] = useState(false);

  const [selectedMenu, setSelectedMenu] = useRecoilState(selectedMenuState);

  const toggleWorkspaceSelect = () => {
    setWorkspaceSelectVisible(!workspaceSelectVisible);
  };

  const toggleSearchMember = () => {
    setSearchMemeberVisible(!searchMemeberVisible);
  };

  const toggleCreateFavoriteMemeber = () => {
    setCreateFavoriteVisible(!createFavoriteVisible);
  };

  const toggleCreateGroupModal = () => {
    setCreateGroupModalVisible(!createGroupModalVisible);
  };

  const toggleUpdateModal = () => {
    setUpdateModalVisible(!updateModalVisible);
  };

  const toggleSettingsModal = () => {
    setSettingsModalVisible(!updateSettingsVisible);
  };

  useEffect(() => {
    if (workspaceId) {
    }
  }, [workspaceId]);

  // 현재 보유하고 있는 워크스페이스를 가져오는 함수
  const {
    data: workspaceSidbarData,
    isSuccess: workspaceSidbarSuccess,
    isError: workspaceSidbarError,
  } = useQuery('workspaceSidbarData', fetchWorkspaceData);

  useEffect(() => {
    if (workspaceSidbarSuccess) {
      setWorkspaceList(workspaceSidbarData);

      // 워크스페이스가 아직 선택되지 않았다면 첫 번째 워크스페이스를 선택
      // if (!isWorkspaceSelected) {
      //   setCurrentWorkSpace(workspaceSidbarData[0]);
      //   setIsWorkspaceSelected(true); // 워크스페이스 선택 상태 업데이트
      // }

      // console.log(workspaceSidbarData[0]);
    }
    if (workspaceSidbarError) {
      console.error(workspaceSidbarError);
    }
  }, [
    workspaceSidbarSuccess,
    workspaceSidbarError,
    workspaceSidbarData,
    setWorkspaceList,
    setCurrentWorkSpace,
    isWorkspaceSelected, // 의존성 배열에 추가
  ]);

  // 즐겨찾기 유저를 가져오는 함수
  const { data: favoriteUserListData, isSuccess: favoriteUserListSucess } =
    useQuery(['favoriteUserList', currentWorkSpace?.workspace_id], async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace?.workspace_id}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    });

  // 즐겨찾기 멤버를 누르면 발생되는 이벤트
  const viewFavoriteHandler = (userId: number, userName: string) => {
    setSelectedMenu('favoriteTasks');
    setCurrentFavoriteUserId(userId);
    setCurrentHeaderName(userName);
    router.push('/viewFavorite');
  };

  useEffect(() => {
    if (favoriteUserListSucess) {
      setFavoriteUserList(favoriteUserListData);
    }
  }, [favoriteUserListData]);

  // 그룹의 리스트를 가져오는 함수
  const { data: groupListData, isSuccess: groupListDataSuccess } = useQuery(
    ['groupListData', currentWorkSpace?.workspace_id],
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/group`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return res.data;
    },
  );

  useEffect(() => {
    if (groupListDataSuccess) {
      setGroupList(groupListData);
    }
  }, [groupListData]);

  // 현재의 유저정보를 반환하는 함수
  const {
    data: fetchUserData,
    isSuccess: fetchUserDataSuccess,
    isLoading: fetchUserDataLoading,
    isError: fetchUserDataError,
  } = useQuery(['fetchUserData', currentWorkSpace?.workspace_id], async () => {
    const accessToken = Cookies.get('ACCESS_KEY');
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/current-user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res.data;
  });

  useEffect(() => {
    // console.log(fetchUserDataSuccess);
    if (fetchUserDataSuccess) {
      // console.log('fetchUserData 들어옴', fetchUserData);
      setCurrentUserData(fetchUserData);
      setCurrentHeaderName(fetchUserData.nickname);
    }
  }, [fetchUserData]);

  // const fetchUserData = async () => {
  //   try {
  //     const accessToken = Cookies.get('ACCESS_KEY');
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/current-user`,
  //       {
  //         headers: {
  //           // Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );

  //     console.log(res.data);
  //     setCurrentUserData(res.data);
  //     setCurrentHeaderName(res.data.nickname);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // 유저 이름을 눌렀을 때 동작되는 함수
  const userDataHandler = () => {
    queryClinet.invalidateQueries('taskList');
    queryClinet.invalidateQueries('workspaceData');
    queryClinet.invalidateQueries('todos');
    queryClinet.invalidateQueries('favoriteUserList');
    queryClinet.invalidateQueries('groupListData');
    queryClinet.invalidateQueries('fetchUserData');
    queryClinet.invalidateQueries('fetchGroupMember');
    queryClinet.invalidateQueries('workspaceSidbarData');

    setSelectedMenu('userTask');
    // router.push는 쿼리의 상태에 따라 변경될 수 있습니다.
    if (!fetchUserDataLoading && !fetchUserDataError) {
      router.push(`/workspace/${workspaceId}`);
    }
  };

  // 그룹 이름을 눌렀을 때 동작되는 함수
  const fetchGroupBtn = (id: number, name: string): void => {
    setSelectedMenu('groupTask');
    setCurrentGroup(id);
    setCurrentHeaderName(name);
    router.push('/viewGroup');
  };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <div className="my-[2.5rem] mx-[1.5rem] flex flex-col gap-[2rem]">
      <div
        className="team-logo flex items-center justify-between relative
        cursor-pointer rounded-[0.5rem]"
        onClick={toggleWorkspaceSelect}
      >
        <div className="flex items-center gap-[0.62rem]">
          <div className="desktop:w-[1.5rem] desktopL:w-[2.5rem] min-w-[2.5rem]">
            <Image
              src={currentWorkSpace?.workspace_imgUrl || defaultWorkspace}
              width={40}
              height={40}
              alt="워크스페이스"
            />
          </div>
          <div className="text-black mx-[0.62rem] desktop:text-[0.8rem] desktopL:text-[1rem] font-bold">
            {currentWorkSpace?.workspace_name}
          </div>
        </div>
        <div
          // onClick={toggleWorkspaceSelect}
          className="ml-[0.3rem] flex items-center"
        >
          <VscChevronDown />
        </div>
        {workspaceSelectVisible && <WorkspaceSelectModal />}
      </div>
      <div className="sidebar-menu text-[0.875rem] text-black">
        <div
          className={`flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer ${
            selectedMenu === 'userTask' &&
            'bg-gray-1 rounded-[0.5rem] font-bold'
          }`}
          onClick={userDataHandler}
        >
          <div className="mr-[0.75rem]">
            {currentUserData.imgUrl && (
              <Image
                src={currentUserData.imgUrl}
                alt="img"
                width="24"
                height="24"
              />
            )}
          </div>
          <div className="flex gap-[0.2rem]">
            <div>{currentUserData.nickname}</div>
            <div>(나)</div>
          </div>
        </div>
        <div
          className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer
              relative z-[100]"
          onClick={toggleUpdateModal}
        >
          <div className="mr-[0.75rem]">
            <Image
              src="/img/notifications.png"
              alt="img"
              width="24"
              height="24"
            />
          </div>
          <div>업데이트</div>
          {updateModalVisible && <UpdateModal />}
        </div>
        <div
          className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer"
          onClick={toggleSearchMember}
        >
          <div className="mr-[0.75rem]">
            <Image src="/img/search.png" alt="img" width="24" height="24" />
          </div>
          <div>멤버 찾기</div>
        </div>
        {searchMemeberVisible && <SearchMemberModal />}
        <div
          className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer"
          onClick={toggleSettingsModal}
        >
          <div className="mr-[0.75rem]">
            <Image src="/img/settings.png" alt="img" width="24" height="24" />
          </div>
          <div>설정</div>
        </div>
      </div>

      <div className="border-b-[1px] w-full">{''}</div>

      <div className="favorite-person-Area">
        <div className="flex items-center justify-between h-[2.5rem] px-[0.75rem] ">
          <div className="font-bold text-black">자주 찾는 멤버</div>
          <div className="cursor-pointer" onClick={toggleCreateFavoriteMemeber}>
            <AiOutlinePlus />
          </div>
        </div>
        {createFavoriteVisible && <CreateFavoriteMemberModal />}
        <div className="favorite-persion text-[0.875rem] max-h-[12rem] overflow-y-auto">
          {favoriteUserList.map(user => (
            <div
              key={user.userId}
              className={`flex items-center p-[0.75rem] cursor-pointer hover:bg-gray-1 hover:rounded-[0.5rem] ${
                selectedMenu === 'favoriteTasks' &&
                'bg-gray-1 rounded-[0.5rem] font-bold'
              }`}
              onClick={() => viewFavoriteHandler(user.userId, user.nickname)}
            >
              <div>
                <Image src={user.imgUrl} alt="img" width="24" height="24" />
              </div>
              <div className="mx-[0.75rem]">{user.nickname}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b-[1px] w-full">{''}</div>
      <div>
        <div className="flex items-center justify-between px-[0.75rem] mb-[0.6rem]">
          <div className="font-bold text-black">그룹 보기</div>
          <div className="cursor-pointer" onClick={toggleCreateGroupModal}>
            <AiOutlinePlus />
          </div>
          {createGroupModalVisible && <CreateGroupModal />}
        </div>
        <div className="max-h-[24rem] h-[15rem] overflow-y-auto">
          {groupList?.map((group: GroupList) => (
            <div
              key={group.id}
              className={`cursor-pointer hover:bg-gray-1 hover:rounded-[0.5rem] text-black ${
                selectedMenu === 'groupTask' &&
                'bg-gray-1 rounded-[0.5rem] font-bold'
              }`}
              onClick={() => fetchGroupBtn(group.id, group.name)}
            >
              <div className="p-[0.75rem] leading-[1.4rem] text-[0.875rem] flex items-center gap-[0.1rem] ">
                <div>{group.name}</div>
                <div className="tracking-[0.1rem]">({group.memberCount})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {createWorkspaceVisible && <CreateWorkSpaceModal />}
      {updateSettingsVisible && <SettingsModal />}
    </div>
  );
};

export default SideBar;
