import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import SideBar from '@/components/layout/SideBar';
import NavBar from '@/components/layout/NavBar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`flex h-full font-pretendard`}>
      <div className="sidebar bg-gray-1 w-[16rem]">
        <SideBar />
      </div>
      <div className="">
        <div className="w-full">
          <NavBar />
        </div>
        <div className="mt-[11rem] ml-[5rem]">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}
