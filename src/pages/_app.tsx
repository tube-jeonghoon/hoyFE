import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import SideBar from '@/components/layout/SideBar';
import NavBar from '@/components/layout/NavBar';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

const clientId =
  '207985048710-cg6c5mhn2flslptc06jpjkbl8181bjfr.apps.googleusercontent.com';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  if (
    router.pathname === '/login' ||
    router.pathname === '/googleLogin' ||
    router.pathname === '/firstGroup' ||
    router.pathname === '/searchMember' ||
    router.pathname === '/settings'
  ) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
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
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <div className="bg-gray-1">
            <div
              className={`flex font-pretendard max-w-[1440px] mx-auto bg-white`}
            >
              <div className="sidebar desktop:w-[13rem] desktopL:w-[16rem] border-r-[0.1rem] border-r-gray-[#EAEEF3] h-screen">
                <SideBar />
              </div>
              <div className="nav-bar">
                <div className="desktop:w-[50rem] desktopL:w-[73.25rem]">
                  <NavBar />
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
