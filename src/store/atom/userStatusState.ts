import { atom } from 'recoil';

interface CurrentWorkspace {
  workspace_id: number;
  workspace_imgUrl?: string | null;
  workspace_name: string;
}

const currentUserDataState = atom({
  key: 'currentUserDataState',
  default: {
    userId: 0,
    nickname: '',
    imgUrl: '',
  },
});

const currentHeaderNameState = atom<string>({
  key: 'currentHeaderNameState',
  default: '',
});

const currentWorkspaceState = atom<CurrentWorkspace>({
  key: 'currentWorkspaceState',
  default: {
    workspace_id: 1,
    workspace_name: '',
  },
});

const currentGroupState = atom<number>({
  key: 'currentGroupState',
  default: 1,
});

export {
  currentUserDataState,
  currentHeaderNameState,
  currentWorkspaceState,
  currentGroupState,
};
