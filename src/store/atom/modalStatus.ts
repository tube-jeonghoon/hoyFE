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

const isCreateMemberModalState = atom({
  key: 'isCreateMemberModalState',
  default: false,
});

const isCreateGroupModalState = atom({
  key: 'isCreateGroupModalState',
  default: false,
});

const isUpdateModalState = atom({
  key: 'isUpdateModalState',
  default: false,
});

const isSettingsModalState = atom({
  key: 'isSettingsModalState',
  default: false,
});

const isInviteMemberModalState = atom({
  key: 'isInviteMemberModalState',
  default: false,
});

export {
  isCalendarModalState,
  isSelectWorkspaceModalState,
  isCreateMemberModalState,
  isCreateWorkspaceModalState,
  isDetailModalState,
  isSearchMemberModalState,
  isCreateGroupModalState,
  isUpdateModalState,
  isSettingsModalState,
  isInviteMemberModalState,
};
