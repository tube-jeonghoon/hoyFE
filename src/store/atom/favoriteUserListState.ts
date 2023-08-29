import { atom } from 'recoil';

interface FavoriteUserList {
  userId: number;
  nickname: string;
  imgUrl: string;
}

const favoriteUserListState = atom<FavoriteUserList[]>({
  key: 'favoriteUserListState',
  default: [],
});

export default favoriteUserListState;
