import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchWorkspaceData = async () => {
  const accessToken = Cookies.get('ACCESS_KEY');
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  console.log(res.data);
  return res.data;
};
