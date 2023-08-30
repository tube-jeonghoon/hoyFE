import axios from 'axios';
import Cookies from 'js-cookie';
import { NewTask } from './types';

interface CurrentWorkSpace {
  workspace_id: number;
  workspace_name: string;
  workspace_url?: string;
}

const addTodoApi = async (
  taskItem: NewTask,
  currentWorkSpace: CurrentWorkSpace,
) => {
  try {
    const accessToken = Cookies.get('ACCESS_KEY');
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/tasks`,
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
