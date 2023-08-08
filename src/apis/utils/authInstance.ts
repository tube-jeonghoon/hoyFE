import axios from 'axios';
import Cookies from 'js-cookie';

const authInstance = axios.create({
  baseURL: process.env.BACKEND_SERVER,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

authInstance.interceptors.request.use(
  // 요청 보내기 전 수행
  function (config) {
    const accessToken = Cookies.get('ACCESS_KEY');
    const refreshToken = Cookies.get('REFRESH_KEY');
    config.headers['ACCESS_KEY'] = `${accessToken}`;
    config.headers['REFRESH_KEY'] = `${refreshToken}`;
    // console.log('인터셉터 요청 성공!');
    return config;
  },
  // 오류 요청 보내기 전 수행
  function (error) {
    // console.log('인터셉터 요청 오류!');
    return Promise.reject(error);
  },
);

authInstance.interceptors.response.use(
  // 응답 내보내기 전 수행
  function (response) {
    // console.log('인터셉터 응답 받았습니다!');
    return response;
  },

  // 오류 응답 내보내기 전 수행
  function (error) {
    // console.log('인터셉터 응답 오류 발생!', error);
    return Promise.reject(error);
  },
);

export default authInstance;
