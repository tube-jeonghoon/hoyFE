import React from 'react';

interface UserSettingsModalProps {
  userId: number;
}

const UserSettingsModal = (Props: UserSettingsModalProps) => {
  const { userId } = Props;
  return (
    <div className="absolute z-[95] top-[1rem] right-0">
      <div
        className="w-[178px] h-[120px] border-[1px] rounded-[0.75rem]
        p-[0.75rem] border-[#DFE0E8]"
      >
        {' '}
        설정
      </div>
    </div>
  );
};

export default UserSettingsModal;
