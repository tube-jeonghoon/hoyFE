import React from 'react';

const AccountSettings = () => {
  return (
    <div>
      <div className="flex">
        <div className="my-[2rem] mx-[1.5rem]">
          <div className="w-[59px] h-10 justify-start items-center gap-2.5 inline-flex">
            <div className="justify-start items-center gap-2.5 flex">
              <div className="text-neutral-600 text-base font-semibold leading-relaxed">
                내 프로필
              </div>
            </div>
          </div>
          <div className="w-[318px] h-[84px] flex-col justify-center items-end gap-2.5 inline-flex">
            <div className="w-[318px] justify-between items-start gap-5 inline-flex">
              <div className="w-[60px] h-[60px] bg-black bg-opacity-60 rounded-[20px] border border-zinc-200" />
              <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="text-neutral-600 text-sm font-semibold">
                  나의 이름
                </div>
                <div className="w-[237px] h-8 px-3 py-1 rounded-lg border border-zinc-200 justify-start items-center gap-2.5 inline-flex">
                  <div className="grow shrink basis-0 text-neutral-600 text-sm font-medium">
                    {/* {name} */}
                  </div>
                  <div className="w-5 h-5 relative" />
                </div>
              </div>
            </div>
            <div className="text-zinc-400 text-xs font-medium">로그아웃</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
