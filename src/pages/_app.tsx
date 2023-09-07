import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '@/components/layout/Header';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import SideBar from '@/components/layout/sidebar';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  if (
    router.pathname === '/login' ||
    router.pathname === '/firstGroup' ||
    router.pathname === '/searchMember' ||
    router.pathname === '/settings' ||
    router.pathname === '/editGroupModal'
  ) {
    return (
      <GoogleOAuthProvider
        clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
      >
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <div className="font-pretendard">
              <Component {...pageProps} />
            </div>
          </RecoilRoot>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <div className="bg-gray-1">
            <div
              className={`flex font-pretendard max-w-[1440px] mx-auto bg-white`}
            >
              <div className="sidebar desktop:w-[13rem] desktopL:w-[16rem] border-r-[1px] border-r-gray-[#EAEEF3] h-screen">
                <SideBar />
              </div>
              <div className="nav-bar">
                <div className="desktop:w-[50rem] desktopL:w-[72.5rem]">
                  <Header />
                </div>
                <div className="mt-[10.5rem]">
                  <Component {...pageProps} />
                </div>
              </div>
            </div>
          </div>
        </RecoilRoot>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
