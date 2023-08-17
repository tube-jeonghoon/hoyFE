import { Inter } from 'next/font/google';
import { Router, useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return <div>hello wolrd</div>;
}
