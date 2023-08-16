import React, { useState } from 'react';
import Image from 'next/image';
import detailImg from '../../../../public/img/detailImg.png';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';
import checkBoxIcon from '../../../../public/img/checkBox.svg';
import trashIcon from '../../../../public/img/trashIcon.svg';
import CommentCard from '@/components/commentCard';
import sendMsg from '../../../../public/img/sendMsg.svg';
import noneComment from '../../../../public/img/noneComment.svg';

const DetailModal = () => {
  const [commentStatus, setCommentStatus] = useState(false);

  return (
    <div className="fixed right-0 top-0 bg-white z-9 w-[22.875rem] h-screen border-[1px]">
      <div
        className="flex flex-col gap-[1.25rem] px-[2rem] pt-[3.75rem] pb-[2rem] border-b-[1px]
          border-gray-2"
      >
        <div className="flex gap-[0.75rem]">
          <div>
            <Image src={detailImg} alt="디테일" />
          </div>
          <div>홍길동</div>
        </div>
        <div className="text-black text-[1.25rem] font-bold leading-[2rem]">
          대청소 하기
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
          <div className="flex gap-[0.38rem] items-center cursor-pointer">
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
  );
};

export default DetailModal;
