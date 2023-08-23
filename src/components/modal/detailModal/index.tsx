import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import detailImg from '../../../../public/img/detailImg.png';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';
import checkBoxIcon from '../../../../public/img/checkBox.svg';
import trashIcon from '../../../../public/img/trashIcon.svg';
import CommentCard from '@/components/commentCard';
import sendMsg from '../../../../public/img/sendMsg.svg';
import noneComment from '../../../../public/img/noneComment.svg';
import axios from 'axios';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { isDetailModalState } from '@/store/atom/modalStatus';

interface DetailProps {
  taskId: number;
}

interface postUser {
  nickname: string;
  imgUrl: string;
}

const DetailModal = (Props: DetailProps) => {
  const [commentStatus, setCommentStatus] = useState(false);
  const { taskId } = Props;
  const [title, setTitle] = useState<string>('');
  const [postUser, setPostUser] = useState<postUser>({
    nickname: '',
    imgUrl: '',
  });
  const [isDetailModalOpen, setIsDetailModalOpen] =
    useRecoilState(isDetailModalState);

  const mutation = useMutation((taskId: number) =>
    axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/tasks/${taskId}`,
      {
        headers: {
          Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
        },
      },
    ),
  );

  const deleteTask = async (taskId: number) => {
    const userConfirmed = window.confirm('정말로 이 글을 삭제하시겠습니까?');

    if (!userConfirmed) {
      return;
    }
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/tasks/${taskId}`,
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
          },
        },
      );
      setIsDetailModalOpen(false);
      console.log(`${taskId}번 글 삭제 완료`);
      window.location.href = '/home';
    } catch (error) {
      console.error(error);
    }
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsDetailModalOpen(false);
      console.log(`들어옴`);
    }
  };

  useEffect(() => {
    console.log(taskId);
    mutation.mutate(taskId);
  }, [taskId]);

  useEffect(() => {
    if (mutation.status === 'success') {
      console.log(mutation.data.data);
      setTitle(mutation.data.data.task.title);
      setPostUser(mutation.data.data.user);
      console.log(postUser);
      // console.log(postUser.imgUrl);
    }
    if (mutation.status === 'error') {
      console.log(mutation.error);
    }
  }, [mutation.status]);

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
                width={24}
                height={24}
                src={postUser.imgUrl}
                alt="디테일"
              />
            </div>
            <div>{postUser.nickname}</div>
          </div>
          <div className="text-black text-[1.25rem] font-bold leading-[2rem]">
            {title}
          </div>
          <div className="flex justify-between">
            <div className="flex gap-[0.62rem] items-center">
              <div className="text-gray-4 cursor-pointer">
                <Image src={checkBoxIcon} alt="체크박스" />
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
            {commentStatus ? (
              <div>
                <div className="flex gap-[0.5rem] mb-[1.5rem]">
                  <div className="text-black font-bold leading-[1.6rem]">
                    코멘트
                  </div>
                  <div className="text-gray-4 font-bold leading-[1.6rem]">
                    [4]
                  </div>
                </div>
                <div className="flex flex-col gap-[1.25rem]">
                  <CommentCard />
                  <CommentCard />
                  <CommentCard />
                  <CommentCard />
                </div>
              </div>
            ) : (
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
                />
              </div>
              <div
                className="bg-gray-2 rounded-[6.25rem] w-[2rem] h-[2rem]
              flex justify-center items-center p-[0.5rem]"
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
