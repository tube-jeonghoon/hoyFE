import {
  isCreateWorkspaceModalState,
  isWorkspaceModalState,
} from '@/store/atom/modalStatus';
import Image from 'next/image';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useRecoilState } from 'recoil';
import CreateWorkSpaceModal from '../createWorkSpaceModal';
import workspaceListState from '@/store/atom/workspaceListState';

// interface WorkspaceList {
//   id: number;
//   workspace_name: string;
//   workspace_imgUrl: string;
// }

const WorkspaceSelectModal = () => {
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const [workspaceVisible, setWorkspaceVisible] = useRecoilState(
    isWorkspaceModalState,
  );

  const [workspaceList, setWorkspaceList] = useRecoilState(workspaceListState);

  const handleCreateWorkspace = () => {
    setWorkspaceVisible(false);
    setCreateWorkspaceVisible(true);
  };

  return (
    <div className="absolute top-[3rem] w-[18rem] z-[101]">
      <div className="w-full p-3 bg-white rounded-xl border">
        {workspaceList.map(workspace => (
          <div
            key={workspace.id}
            className="px-3 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex
            cursor-pointer w-full hover:bg-gray-2"
          >
            <div className="justify-start items-center gap-2.5 flex hover:bg-gray-2">
              <Image
                src="/img/teamImage.png"
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
