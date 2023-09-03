import {
  isCreateWorkspaceModalState,
  isSelectWorkspaceModalState,
} from '@/store/atom/modalStatus';
import Image from 'next/image';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useRecoilState } from 'recoil';
import CreateWorkSpaceModal from '../createWorkSpaceModal';
import workspaceListState from '@/store/atom/workspaceListState';
import {
  currentWorkspaceState,
  workspaceIdState,
} from '@/store/atom/userStatusState';
import { useQueryClient } from 'react-query';
import defaultWorkspace from '../../../../public/img/defaultWorkspace.svg';
import { useRouter } from 'next/router';

interface WorkspaceList {
  workspace_id: number;
  workspace_name: string;
  workspace_imgUrl: string;
}

const WorkspaceSelectModal = () => {
  const router = useRouter();
  const queryClinet = useQueryClient();
  const [workspaceId, setWorkspaceId] = useRecoilState(workspaceIdState);
  const [currentWorkSpace, setCurrentWorkSpace] = useRecoilState(
    currentWorkspaceState,
  );
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const [workspaceSelectVisible, setWorkspaceSelectVisible] = useRecoilState(
    isSelectWorkspaceModalState,
  );

  const [workspaceList, setWorkspaceList] = useRecoilState(workspaceListState);

  const closeModal = () => {
    setWorkspaceSelectVisible(false);
    // console.log(`들어옴`);
  };

  const handleClickOutside = (e: any) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  };

  const handleCreateWorkspace = () => {
    setWorkspaceSelectVisible(false);
    setCreateWorkspaceVisible(true);
  };

  // 워크스페이스를 클릭했을 때 일어나는 함수
  const changeCurrentWorkspaceHandler = (
    workspaceId: number,
    workspaceName: string,
    workspaceUrl: string,
  ) => {
    // console.log(`클릭됌`);
    // console.log(workspaceId);
    // console.log(workspaceName);
    // console.log(workspaceUrl);
    const newCurrentWorkspace = {
      workspace_id: workspaceId,
      workspace_name: workspaceName,
      workspace_url: workspaceUrl,
    };

    console.log(workspaceId);
    console.log(workspaceName);
    console.log(workspaceUrl);

    setCurrentWorkSpace(newCurrentWorkspace);
    console.log(newCurrentWorkspace);

    queryClinet.invalidateQueries('taskList');
    queryClinet.invalidateQueries('workspaceData');
    queryClinet.invalidateQueries('todos');
    queryClinet.invalidateQueries('favoriteUserList');
    queryClinet.invalidateQueries('groupListData');
    queryClinet.invalidateQueries('fetchUserData');
    queryClinet.invalidateQueries('fetchGroupMember');
    queryClinet.invalidateQueries('workspaceSidbarData');

    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <div
      className={`absolute top-[3rem] w-[18rem] z-[101] modal-overlay ${
        workspaceSelectVisible ? 'active' : ''
      }`}
      onClick={handleClickOutside}
    >
      <div className="w-full p-3 bg-white rounded-xl border">
        {workspaceList.map(workspace => (
          <div
            key={workspace.workspace_id}
            className="px-3 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex
            cursor-pointer w-full hover:bg-gray-2"
            // onClick={() => changeCurrentWorkspaceHandler(workspace.id)}
            onClick={() =>
              changeCurrentWorkspaceHandler(
                workspace.workspace_id,
                workspace.workspace_name,
                workspace.workspace_imgUrl,
              )
            }
          >
            <div className="justify-start items-center gap-2.5 flex hover:bg-gray-2">
              <Image
                src={workspace.workspace_imgUrl || defaultWorkspace}
                alt="img"
                width="40"
                height="40"
              />
              <div className="text-neutral-600 text-base leading-relaxed">
                {workspace.workspace_name}
              </div>
            </div>
          </div>
        ))}

        <div className="h-14 px-3 py-2 hover:bg-gray-2 rounded-lg flex-col justify-start items-start gap-2.5 flex">
          <div
            onClick={handleCreateWorkspace}
            className="h-10 justify-start items-center gap-2.5 inline-flex cursor-pointer"
          >
            <div className="justify-between items-center flex">
              <div className="mx-[1rem]">
                <AiOutlinePlus />
              </div>
              <div className="text-black text-base leading-relaxed">
                새로운 워크스페이스 생성
              </div>
            </div>
          </div>
          <div className="w-6 h-6 left-[20px] top-[16px] absolute">
            <div className="w-6 h-6 left-0 top-0 absolute" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelectModal;
