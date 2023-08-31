export interface DetailProps {
  taskId: number;
}

export interface postUser {
  nickname: string;
  imgUrl: string;
}

export interface CommentBody {
  comment_id: number;
  comment_text: string;
  comment_updatedAt: string;
  isOwner: boolean;
  user_id: number;
  user_imgUrl: string;
  workspaceMember_nickname: string;
}
