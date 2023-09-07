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
    admin: false,
  },
});

const currentHeaderNameState = atom<string>({
  key: 'currentHeaderNameState',
  default: '',
});

const currentWorkspaceState = atom<CurrentWorkspace>({
  key: 'currentWorkspaceState',
  default: {
    workspace_id: 0,
    workspace_name: '',
    workspace_imgUrl: '' || null,
  },
});

const workspaceIdState = atom<string>({
  key: 'workspaceIdState',
  default: '',
});

const currentGroupState = atom<number>({
  key: 'currentGroupState',
  default: 0,
});

const currentFavoriteUserIdState = atom<number>({
  key: 'currentFavoriteUserIdState',
  default: 0,
});

const currentCommentIdState = atom<number | null>({
  key: 'currentCommentIdState',
  default: null,
});

export {
  currentUserDataState,
  currentHeaderNameState,
  currentWorkspaceState,
  currentGroupState,
  currentFavoriteUserIdState,
  workspaceIdState,
  currentCommentIdState,
};
