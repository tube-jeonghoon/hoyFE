import React from 'react';

const Settings = () => {
  return (
    <div>
      <div
        className="absolute z-[101] top-0 left-0 w-[100vw] h-[100vh]
        bg-black bg-opacity-10"
      >
        <div
          className="bg-white top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2
            absolute w-[23.875rem] rounded-[0.75rem]"
        >
          <div className="flex">
            <div className="my-[2rem] mx-[1.5rem]">
              <div>계정</div>
              <div>워크스페이스</div>
              <div>문의하기</div>
            </div>
            <div className="my-[2rem] mx-[1.5rem]">
              <div>내 프로필</div>
              <div className="flex">
                <div>프로필 사진</div>
                <div>
                  <div>나의 이름</div>
                  <div>
                    <input type="text" />
                  </div>
                  <div>로그아웃</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
