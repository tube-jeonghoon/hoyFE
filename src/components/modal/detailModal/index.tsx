import React, { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import detailImg from '../../../../public/img/detailImg.png';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';
import checkBoxIcon from '../../../../public/img/checkBox.svg';
import trashIcon from '../../../../public/img/trashIcon.svg';
import CommentCard from '@/components/commentCard';
import sendMsg from '../../../../public/img/sendMsg.svg';
import noneComment from '../../../../public/img/noneComment.svg';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import {
  isDetailModalState,
  iscommentEditModalState,
} from '@/store/atom/modalStatus';
import Cookies from 'js-cookie';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { DetailProps, postUser } from './types';
import detailFillCheck from '../../../../public/img/detailFillCheck.svg';
import { IoEllipsisVertical } from 'react-icons/io5';
import userProfile from '../../../../public/img/userProfile.png';
import { CommentBody } from './types';
import defaultUser from '../../../../public/img/defaultUser.png';
import CommentEditModal from '../commentEditModal';

const DetailModal = (Props: DetailProps) => {
  const queryClient = useQueryClient();
  const [commentStatus, setCommentStatus] = useState(true);
  const [commentBody, setCommentBody] = useState<CommentBody[]>([]);
  const { taskId } = Props;
  const [title, setTitle] = useState<string>('');
  const [postUser, setPostUser] = useState<postUser>({
    nickname: '',
    imgUrl: '',
  });
  const [priority, setPriority] = useState<number>(0);
  const [currentWorkSpace, setCurrentWorkSpace] = useRecoilState(
    currentWorkspaceState,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] =
    useRecoilState(isDetailModalState);

  // const [iscommentEditModalVisible, setIscommentEditModalVisible] =
  //   useRecoilState(iscommentEditModalState);
  const [iscommentEditModalVisible, setIscommentEditModalVisible] = useState<{
    [key: number]: boolean;
  }>({});

  const [isEditing, setIsEditing] = useState(false); // 제목 편집 여부를 저장
  const [newTitle, setNewTitle] = useState(''); // 새로운 제목을 저장

  const [commentText, setCommentText] = useState(''); // 작성할 댓글의 내용

  // 특정 댓글 ID를 받아 상태를 업데이트하는 함수
  const toggleCommentEditModal = (commentId: number) => {
    setIscommentEditModalVisible(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  // 댓글 작성 API 호출 함수
  const postComment = async (commentText: string) => {
    const accessToken = Cookies.get('ACCESS_KEY');
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks/${taskId}/comment`,
      { text: commentText },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  // 댓글 작성 useMutation
  const postCommentMutation = useMutation(postComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['taskDetail', taskId]); // 댓글 작성 후 쿼리 데이터를 갱신
      queryClient.invalidateQueries('todos');
    },
  });

  const handleCommentSubmit = () => {
    postCommentMutation.mutate(commentText); // 댓글 작성 API 호출
    setCommentText(''); // 입력 필드 초기화
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 Enter 키 이벤트를 막음
      handleCommentSubmit();
    }
  };

  // 제목 수정
  const updateTitleMutation = useMutation(async (newTitle: string) => {
    const accessToken = Cookies.get('ACCESS_KEY');
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks/${taskId}/detail`,
      { title: newTitle },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    queryClient.invalidateQueries('todos');
  });

  const handleTitleClick = () => {
    setNewTitle(title);
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleUpdate = async () => {
    await updateTitleMutation.mutateAsync(newTitle);
    setTitle(newTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleUpdate();
    }
  };

  // 디테일 페이지 조회
  const { data: taskDetailData, isSuccess: taskDetailSuccess } = useQuery(
    ['taskDetail', taskId],
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // console.log(res.data);
      // console.log('✨ ➤ res.data:', res.data.comments);
      setCommentBody(res.data.comments);
      return res.data;
    },
  );
  // console.log(taskDetailData);

  // 중요도 표시 토글
  const changePriority = async (taskId: number) => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.put(
        // workspace/{:workspaceId}/tasks/{:taskId}/priority
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks/${taskId}/priority`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // console.log(res.data);

      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const priorityMutation = useMutation(changePriority, {
    onSuccess: () => {
      // console.log('✨ ➤ onSuccess ➤ priority mutation');
    },
  });

  const togglePriorityHandler = () => {
    priorityMutation.mutate(taskId);
  };

  // 글 삭제
  const deleteTask = async (taskId: number) => {
    const userConfirmed = window.confirm('정말로 이 글을 삭제하시겠습니까?');

    if (!userConfirmed) {
      return;
    }
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setIsDetailModalOpen(false);
      // console.log(`${taskId}번 글 삭제 완료`);

      queryClient.invalidateQueries('todos');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsDetailModalOpen(false);
    }
  };

  useEffect(() => {
    if (priorityMutation.isSuccess) {
      setPriority(priorityMutation.data);
      queryClient.invalidateQueries('taskDetail');
      queryClient.invalidateQueries('todos');
    }
  }, [priorityMutation.status]);

  useEffect(() => {
    if (taskDetailSuccess) {
      setTitle(taskDetailData.task.title);
      setPostUser(taskDetailData.user);
      setPriority(taskDetailData.task.priority);
    }
  }, [taskDetailData, taskDetailSuccess]);

  useEffect(() => {
    // console.log(taskId);
    // mutation.mutate(taskId);
  }, [taskId]);

  return (
    <div
      className={`modalContainer bg-black bg-opacity-5 inset-0
        h-screen w-screen z-[105] fixed top-0 left-0 cursor-default ${
          isDetailModalOpen ? 'visible' : 'hidden'
        }`}
      onClick={handleOverlayClick}
    >
      <div className="fixed right-0 top-0 bg-white z-[102] w-[22.875rem] h-screen border-[1px]">
        <div
          className="flex flex-col gap-[1.25rem] px-[2rem] pt-[3.75rem] pb-[2rem] border-b-[1px]
          border-gray-2"
        >
          <div className="flex gap-[0.75rem]">
            <div>
              <Image
                src={postUser.imgUrl}
                width={24}
                height={24}
                alt="디테일"
              />
            </div>
            <div>{postUser.nickname}</div>
          </div>
          <div className="text-black text-[1.25rem] font-bold leading-[2rem] cursor-pointer ">
            <div className="flex gap-[0.62rem] items-center">
              {priority === 0 ? (
                <div className="w-[0.375rem] h-[0.375rem]"></div>
              ) : (
                <div
                  className="w-[0.375rem] h-[0.375rem] bg-primary-red
                  border-none rounded-[5rem]"
                ></div>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={handleTitleChange}
                  onKeyDown={handleKeyDown}
                  onBlur={handleTitleUpdate}
                />
              ) : (
                <div onClick={handleTitleClick}>{title}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-[0.62rem] items-center cursor-pointer">
              <div className="text-gray-4" onClick={togglePriorityHandler}>
                {priority === 0 ? (
                  <Image src={checkBoxIcon} alt="체크박스" />
                ) : (
                  <Image src={detailFillCheck} alt="체크박스" />
                )}
              </div>
              <div className="text-black text-[0.875rem] leading-[1.4rem]">
                중요
              </div>
            </div>
            <div
              className="flex gap-[0.38rem] items-center cursor-pointer"
              onClick={() => deleteTask(taskId)}
            >
              <div>
                <Image src={trashIcon} alt="삭제" />
              </div>
              <div className="text-gray-5 text-[0.875rem] leading-[1.4rem]">
                삭제
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="p-[2rem]">
            {commentBody.length > 0 ? (
              <div>
                <div className="flex gap-[0.5rem] mb-[1.5rem]">
                  <div className="text-black font-bold leading-[1.6rem]">
                    코멘트
                  </div>
                  <div className="text-gray-4 font-bold leading-[1.6rem]">
                    [{commentBody.length}]
                  </div>
                </div>
                <div className="flex flex-col gap-[1.25rem]">
                  {commentBody.map(comment => (
                    <div key={comment.comment_id} className="flex flex-col">
                      <div className="flex gap-[0.62rem] w-full justify-between items-center mb-[0.62rem]">
                        <div className="flex gap-[0.62rem] items-center">
                          <div className="rounded-[0.5rem]">
                            <Image
                              src={comment.user_imgUrl}
                              width={24}
                              height={24}
                              alt="유저프로필"
                            />
                          </div>
                          <div className="flex gap-[2px] items-center">
                            <div className="text-black text-[0.875rem]">
                              {comment.workspaceMember_nickname}
                            </div>
                            {comment.isOwner ? (
                              <div className="text-black text-[0.875rem]">
                                (나)
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                          <div className="text-gray-4 text-[0.75rem]">
                            1분 미만 전
                          </div>
                        </div>
                        <div
                          className="text-gray-4 cursor-pointer hover:bg-gray-2 rounded-[0.5rem]
                            p-[0.25rem] relative"
                          onClick={() =>
                            toggleCommentEditModal(comment.comment_id)
                          }
                        >
                          <IoEllipsisVertical />
                          {iscommentEditModalVisible[comment.comment_id] && (
                            <CommentEditModal
                              taskId={taskId}
                              commentId={comment.comment_id}
                            />
                          )}
                        </div>
                      </div>
                      <div className="pb-[1.25rem]">
                        <div className="text-black text-[0.875rem] leading-[1.4rem]">
                          {comment.comment_text}
                        </div>
                      </div>
                      <div className="border-b-[1px] text-gray-2">{''}</div>
                      {/* <CommentCard /> */}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // <div>
              // <div className="flex gap-[0.5rem] mb-[1.5rem]">
              //   <div className="text-black font-bold leading-[1.6rem]">
              //     코멘트
              //   </div>
              //   <div className="text-gray-4 font-bold leading-[1.6rem]">
              //     [{commentBody.length}]
              //   </div>
              // </div>
              // <div className="flex flex-col gap-[1.25rem]">
              //   <div className="flex gap-[0.62rem] w-full justify-between items-center mb-[0.62rem]">
              //     <div className="flex gap-[0.62rem] items-center">
              //       <div className="rounded-[0.5rem]">
              //         <Image src={userProfile} alt="유저프로필" />
              //       </div>
              //       <div className="text-black text-[0.875rem]">
              //         전정훈 (나)
              //       </div>
              //       <div className="text-gray-4 text-[0.75rem]">
              //         1분 미만 전
              //       </div>
              //     </div>
              //     <div className="text-gray-4 cursor-pointer">
              //       <IoEllipsisVertical />
              //     </div>
              //   </div>
              //   <div className="pb-[1.25rem]">
              //     <div className="text-black text-[0.875rem] leading-[1.4rem]">
              //       업무에 수고가 많으십니다! 항상 고생이 많으시네요!
              //       대단하십니다.
              //     </div>
              //   </div>
              //   <div className="border-b-[1px] text-gray-2">{''}</div>
              //   {/* <CommentCard /> */}
              // </div>
              // </div>
              <div>
                <div className="flex gap-[0.5rem] mb-[1.5rem]">
                  <div className="text-black font-bold leading-[1.6rem]">
                    코멘트
                  </div>
                  <div className="text-gray-4 font-bold leading-[1.6rem]"></div>
                </div>
                <div className="flex flex-col gap-[0.62rem] items-center text-gray-5">
                  <div className="">
                    <Image src={noneComment} alt="코멘트" />
                  </div>
                  <div className="text-[0.875rem] leading-[1.4rem]">
                    작성된 코멘트가 없어요.
                  </div>
                </div>
              </div>
            )}
            <div
              className="h-[3rem] flex items-center justify-between rounded-[0.5rem]
              border-[1px] absolute w-[18.5rem] bottom-[1.5rem] p-[0.75rem]"
            >
              <div className="text-[0.75rem] leading-[1.4rem] w-full text-gray-4">
                <input
                  className="w-full focus:outline-none focus:text-black bg-transparent"
                  type="textarea"
                  placeholder="코멘트 내용을 작성해 주세요."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div
                className="bg-gray-2 rounded-[6.25rem] w-[2rem] h-[2rem]
              flex justify-center items-center p-[0.5rem] cursor-pointer hover:bg-primary-blue"
                onClick={handleCommentSubmit}
              >
                <Image src={sendMsg} alt="전송" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
