interface GroupList {
  id: number;
  name: string;
  memberCount: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface FavoriteUserList {
  userId: number;
  nickname: string;
  imgUrl: string;
}

export type { GroupList, FavoriteUserList };
