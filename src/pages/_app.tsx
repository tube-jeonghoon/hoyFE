import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import SideBar from '@/components/layout/SideBar';
import NavBar from '@/components/layout/NavBar';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <div className={`flex h-full font-pretendard`}>
        <div className="sidebar bg-gray-1 w-[16rem]">
          <SideBar />
        </div>
        <div>
          <div className="w-full">
            <NavBar />
          </div>
          <div className="mt-[10.5rem] ml-[5rem]">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </RecoilRoot>
  );
}
