import { atom } from 'recoil';

const selectedMenuState = atom({
  key: 'selectedMenuState',
  default: '',
});

const selectedSettingMenuState = atom({
  key: 'selectedSettingMenuState',
  default: 'userSettings',
});

export { selectedMenuState, selectedSettingMenuState };
