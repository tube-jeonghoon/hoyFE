import { selector } from 'recoil';
import axios from 'axios';

interface CurrentWorkspace {
  workspace_id: number;
  workspace_imgUrl?: string | null;
  workspace_name: string;
}

export const firstWorkspaceSelector = selector<CurrentWorkspace | null>({
  key: 'firstWorkspaceSelector',
  get: async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
          },
        },
      );
      console.log(response.data);
      const workspaces = response.data;
      if (workspaces && workspaces.length > 0) {
        return workspaces[0];
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      return null;
    }
  },
});
