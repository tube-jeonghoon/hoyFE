import React, { useState } from 'react';
import Image from 'next/image';
import editIcon from '../../../../public/img/editBtn.svg';
import removeIcon from '../../../../public/img/removeBtn.svg';
import {
  currentCommentIdState,
  currentWorkspaceState,
} from '@/store/atom/userStatusState';
import { useRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { iscommentSettingModalState } from '@/store/atom/modalStatus';

interface CommentEditModalProps {
  taskId: number;
  commentId: number;
}

const CommentEditModal = (Props: CommentEditModalProps) => {
  const queryClient = useQueryClient();
  const { taskId, commentId } = Props;
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );
  const [isEditModalOpen, setEditModalOpen] = useRecoilState(
    iscommentSettingModalState,
  );
  const [newComment, setNewComment] = useState('');

  const [openCommentId, setOpenCommentId] = useRecoilState(
    currentCommentIdState,
  );

  const editHandler = () => {
    setEditModalOpen(true);
    setOpenCommentId(commentId);
  };

  // 댓글 삭제 API 호출 함수
  const deleteComment = async () => {
    const accessToken = Cookies.get('ACCESS_KEY');
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/tasks/${taskId}/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  // 댓글 삭제 useMutation
  const deleteCommentMutation = useMutation(deleteComment, {
    // 성공/실패 콜백 등 필요한 옵션을 여기에 추가할 수 있습니다.
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
      queryClient.invalidateQueries('commentList');
      queryClient.invalidateQueries('taskDetail');
      queryClient.invalidateQueries('favoriteUserTodos');
    },
  });

  // 삭제 버튼 클릭 시ㅣ
  const handleCommentDelete = () => {
    const userConfirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
    if (userConfirmed) {
      deleteCommentMutation.mutate();
    }
  };

  return (
    <div className="absolute z-[99] right-0 top-[2rem] w-[144px] text-black">
      <div
        className="border-[1px] bg-white border-[#EAEEF3] p-[0.75rem] rounded-[0.75rem]
        w-[144px]"
      >
        <div className="flex gap-[0.75rem] items-center p-[0.75rem] hover:bg-gray-2 rounded-[0.5rem] relative">
          <div
            className="flex gap-[0.75rem] items-center"
            onClick={editHandler}
          >
            <div>
              <Image src={editIcon} alt="수정" />
            </div>
            <div>수정</div>
          </div>
          {/* 댓글 수정 모달 */}
          {/* {isEditModalOpen && (
            <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded">
                <h2>댓글 수정</h2>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full border p-2 rounded"
                ></textarea>
                <button onClick={handleCommentEdit}>수정하기</button>
                <button onClick={() => setEditModalOpen(false)}>취소</button>
              </div>
            </div>
          )} */}
        </div>
        <div
          className="flex gap-[0.75rem] items-center p-[0.75rem] hover:bg-g ray-2 rounded-[0.5rem]"
          onClick={handleCommentDelete}
        >
          <div>
            <Image src={removeIcon} alt="삭제" />
          </div>
          <div>삭제</div>
        </div>
      </div>
    </div>
  );
};

export default CommentEditModal;
