import { atom } from 'recoil';

interface CurrentWorkspace {
  workspace_id: number;
  workspace_imgUrl?: string | null;
  workspace_name: string;
}

const currentWorkspace = atom<CurrentWorkspace>({
  key: 'currentWorkspaceId',
  default: {
    workspace_id: 1,
    workspace_name: '',
  },
});

export { currentWorkspace };
