import axios from 'axios';
import Cookies from 'js-cookie';

interface FetchCustomViewTodoApi {
  userId: number;
  currentDate: string;
  workspaceId: number;
}

export const fetchCustomViewTodoApi = async ({
  userId,
  currentDate,
  workspaceId,
}: FetchCustomViewTodoApi) => {
  const accessToken = Cookies.get('ACCESS_KEY');
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${workspaceId}/tasks/member/${userId}?date=${currentDate}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
