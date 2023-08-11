import { atom } from 'recoil';

const selectedDateState = atom({
  key: 'selectedDateState',
  default: '',
});

export default selectedDateState;
