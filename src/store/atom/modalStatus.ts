import { atom } from 'recoil';

const isCalendarModalState = atom({
  key: 'isCalendarModalState',
  default: false,
});

const isSelectWorkspaceModalState = atom({
  key: 'isSelectWorkspaceModalState',
  default: false,
});

const isCreateWorkspaceModalState = atom({
  key: 'isCreateWorkspaceModalState',
  default: false,
});

const isDetailModalState = atom({
  key: 'isDetailModalState',
  default: false,
});

const isSearchMemberModalState = atom({
  key: 'isSearchMemberModalState',
  default: false,
});

const isCreateGroupModalState = atom({
  key: 'isCreateGroupModalState',
  default: false,
});

export {
  isCalendarModalState,
  isSelectWorkspaceModalState,
  isCreateWorkspaceModalState,
  isDetailModalState,
  isSearchMemberModalState,
  isCreateGroupModalState,
};
