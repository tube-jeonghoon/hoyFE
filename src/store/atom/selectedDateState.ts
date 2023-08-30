import { atom } from 'recoil';

const selectedDateState = atom({
  key: 'selectedDateState',
  default: new Date(),
});

export default selectedDateState;
