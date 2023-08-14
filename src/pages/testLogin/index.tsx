import LoginButton from '@/components/loginButton';
import React, { useEffect } from 'react';

const TestLogin = () => {
  useEffect(() => {
    async function loadGapi() {
      const { gapi } = await import('gapi-script');

      const clientId = process.env.GOOGLE_CLIENT_ID;

      if (gapi && gapi.client) {
        await gapi.client.init({
          clientId,
          scope: '',
        });
      }
    }

    loadGapi();
  }, []);

  return (
    <div>
      <LoginButton />
    </div>
  );
};

export default TestLogin;
