import axios from 'axios';

interface FetchTodoApiParams {
  currentDate: string;
}

export const fetchTodoApi = async ({ currentDate }: FetchTodoApiParams) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/tasks?date=${currentDate}`,
      {
        headers: {
          Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
