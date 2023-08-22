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
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY5MjI2MDEyNSwiZXhwIjoxNjk0Njc5MzI1fQ.O1tvy5xyIWYCXCZd8k873eN2Nu4TaWze9zQm8OVkZ7Q',
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
