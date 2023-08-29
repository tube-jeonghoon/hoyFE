import axios from 'axios';
import Cookies from 'js-cookie';
import { NewTask } from './types';

const addTodoApi = async (taskItem: NewTask) => {
  try {
    const accessToken = Cookies.get('ACCESS_KEY');
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/tasks`,
      {
        title: taskItem.title[taskItem.date as keyof typeof taskItem.title],
        date: taskItem.date,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export default addTodoApi;
