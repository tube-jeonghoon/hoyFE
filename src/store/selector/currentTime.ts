import { selector } from 'recoil';
import currentDateState from '../atom/currentDateState';
import { addDays, format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

// 오늘 날짜
const formattedCurrentDateSelector = selector({
  key: 'formattedCurrentDateSelector',
  get: ({ get }) => {
    const currentDate = get(currentDateState);
    const formatDate = format(currentDate, 'yyyy-MM-dd');
    const dayofWeek = format(currentDate, 'EEEE', {
      locale: ko,
    });
    const day = format(currentDate, 'M/d');

    return { formatDate, dayofWeek, day };
  },
});

// 이전 날짜
const formattedBeforeDateSelector = selector({
  key: 'formattedBeforeDateSelector',
  get: ({ get }) => {
    const currentDate = get(currentDateState);
    const prevDate = subDays(currentDate, 1);
    const formatDate = format(prevDate, 'yyyy-MM-dd');
    const dayOfWeek = format(prevDate, 'EEEE', { locale: ko });
    const day = format(prevDate, 'M/d');
    return { formatDate, dayOfWeek, day };
  },
});

// 이후 날짜
const formattedAfterDateSelector = selector({
  key: 'formattedAfterDateSelector',
  get: ({ get }) => {
    const currentDate = get(currentDateState);
    const nextDate = addDays(currentDate, 1);
    const formatDate = format(nextDate, 'yyyy-MM-dd');
    const dayOfWeek = format(nextDate, 'EEEE', { locale: ko });
    const day = format(nextDate, 'M/d');
    return { formatDate, dayOfWeek, day };
  },
});

export {
  formattedCurrentDateSelector,
  formattedBeforeDateSelector,
  formattedAfterDateSelector,
};
