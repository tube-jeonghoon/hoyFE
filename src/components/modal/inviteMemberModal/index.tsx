import React from 'react';

const InviteMemberModal = () => {
  return (
    <div className="w-[390px] h-[136px] px-9 py-6 bg-white rounded-lg shadow border border-zinc-200 flex-col justify-start items-end gap-3 inline-flex">
      <div className="flex-col justify-start items-start gap-3 flex">
        <div className="w-[318px] h-11 p-3 rounded-lg border border-zinc-200 justify-start items-center gap-2.5 inline-flex">
          <div className="grow shrink basis-0 text-gray-400 text-sm font-medium leading-snug">
            e-mail을 입력해 멤버를 추가해주세요.
          </div>
        </div>
      </div>
      <div className="h-8 px-3 py-1 bg-zinc-200 rounded-lg border border-zinc-200 justify-center items-center gap-2.5 inline-flex">
        <div className="text-white text-sm font-semibold leading-snug">
          전송
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
