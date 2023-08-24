import { atom } from 'recoil';

interface WorkspaceList {
  id: number;
  workspace_name: string;
  workspace_imgUrl: string;
}

const workspaceListState = atom<WorkspaceList[]>({
  key: 'workspaceListState',
  default: [],
});

export default workspaceListState;
