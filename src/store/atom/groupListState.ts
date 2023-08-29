import { atom } from 'recoil';

interface GroupListState {
  id: number;
  name: string;
  memberCount: number;
  updatedAt?: string;
  createAt?: string;
}

const groupListState = atom<GroupListState[]>({
  key: 'groupListState',
  default: [],
});

export default groupListState;
