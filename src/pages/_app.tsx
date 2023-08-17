import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import SideBar from '@/components/layout/SideBar';
import NavBar from '@/components/layout/NavBar';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId =
  '207985048710-uut7o2bb4n3i63b0gtgsaubefimn2fsl.apps.googleusercontent.com';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (
    router.pathname === '/login' ||
    router.pathname === '/googleLogin' ||
    router.pathname === '/firstGroup' ||
    router.pathname === '/searchMember'
  ) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <RecoilRoot>
          <div className="font-pretendard">
            <Component {...pageProps} />
          </div>
        </RecoilRoot>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RecoilRoot>
        <div className="bg-gray-1">
          <div
            className={`flex font-pretendard max-w-[1440px] mx-auto bg-white`}
          >
            <div className="sidebar w-[16rem] border-r-[0.1rem] border-r-[#EAEEF3]">
              <SideBar />
            </div>
            <div>
              <div className="w-full">
                <NavBar />
              </div>
              <div className="mt-[10.5rem]">
                <Component {...pageProps} />
              </div>
            </div>
          </div>
        </div>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}
