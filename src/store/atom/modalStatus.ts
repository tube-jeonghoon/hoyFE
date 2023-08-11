import { atom } from 'recoil';

const isCalendarModalState = atom({
  key: 'isCalendarModalState',
  default: false,
});

const isWorkspaceModalState = atom({
  key: 'isWorkspaceModalState',
  default: false,
});

const isCreateWorkspaceModalState = atom({
  key: 'isCreateWorkspaceModalState',
  default: false,
});

export {
  isCalendarModalState,
  isWorkspaceModalState,
  isCreateWorkspaceModalState,
};
