import axios from 'axios';
import Cookies from 'js-cookie';

interface CurrentWorspace {
  workspace_id: number;
  workspace_name: string;
  workspace_url?: string;
}

const fetchUserDataApi = async (currentWorkspace: CurrentWorspace) => {
  const accessToken = Cookies.get('ACCESS_KEY');
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/current-user`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export default fetchUserDataApi;
