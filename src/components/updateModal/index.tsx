import React from 'react';
import Image from 'next/image';
import cancelBtn from '../../../public/img/cancel.svg';
import defaultUser from '../../../public/img/defaultUser.png';

const UpdateModal = () => {
  const userAlertData = [
    {
      id: 1,
      nickName: '허지수',
      msg: '5시까지 주간회의록 정리에 코멘트를 남겼습니다.',
    },
    {
      id: 2,
      nickName: '하정민',
      msg: '책상정리 를 완료하였습니다.',
    },
    {
      id: 3,
      nickName: '전정훈',
      msg: '과자 5봉지 먹기에 댓글을 남겼습니다.',
    },
    {
      id: 4,
      nickName: '하정민',
      msg: '피그마 보면서 화내기에 댓글을 남겼습니다.',
    },
    {
      id: 5,
      nickName: '하정민',
      msg: '피그마 보면서 화내기를 완료하였습니다.',
    },
    {
      id: 6,
      nickName: '정혜승',
      msg: '백엔드 코드 서버에 배포하기에 댓글을 남겼습니다.',
    },
  ];

  return (
    <div className="absolute top-0 left-[13rem] z-[95] flex items-center justify-center bg-white">
      <div
        className="px-[2.25rem] py-[1.5rem] border border-gray-[#DFE0E8]
        rounded-[0.5rem] flex flex-col gap-[0.75rem]"
      >
        <div className="flex items-center justify-end">
          <div className="border border-gray-[#DFE0E8] rounded-[0.5rem] px-[0.75rem] py-[0.25rem]">
            <div className="text-[0.875rem] leading-[1.4rem]">모두 삭제</div>
          </div>
        </div>
        <div className="alert-cards flex flex-col gap-[0.7rem]">
          {userAlertData.map(data => (
            <div
              key={data.id}
              className="card w-[20rem] p-[0.75rem] border border-gray-[#DFE0E8] rounded-[0.5rem]
                flex justify-between items-center gap-[0.62rem]"
            >
              <div className="flex items-center gap-[0.62rem]">
                <div className="border border-none rounded-[0.5rem] min-w-[1.5rem]">
                  <Image
                    src={defaultUser}
                    width={24}
                    height={24}
                    alt="유저 프로필"
                  />
                </div>
                <div className="flex gap-[0.25rem]">
                  <div>{`${data.nickName} 님이 ${data.msg}`}</div>
                </div>
              </div>
              <div className="min-w-[1.5rem] cursor-pointer">
                <Image src={cancelBtn} alt="삭제" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
