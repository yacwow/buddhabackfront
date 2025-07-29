// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState(): Promise<{ name: string }> {
//   return { name: '@umijs/max' };
// }
// import TimeCountDown from "./components/TimeSaleMainComp/TimeCountDown";
import type { RequestConfig } from 'umi';

export const layout = (initialState: { serverName: any; }) => {
  // console.log(initialState)
  return {
    logo: '@/assets/img/myFavicon.webp',
    title: initialState.serverName,
    pure: true,
    menu: {
      locale: false,
    },
    footerRender: false,
    headerRender: false,
    rightRender: false,
    menuRender: false,
    menuHeaderRender: false,
    // noFound: TimeCountDown,
    // unAccessible: TimeCountDown,
  };
};
export const request: RequestConfig = {
  timeout: 600000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    [
      (url, options) => {
        // console.log(options)
        options.headers = {
          ...options.headers,
          token: localStorage.getItem('token'),
        };
        // console.log(options.headers);
        return { url, options };
      },
    ],
  ],
  responseInterceptors: [
    [
      (data) => {
        if (data.data && data.data.data && data.data.data.token) {
          localStorage.setItem('token', data.data.data.token);
        }
        // console.log(data)
        return data;
      },
    ],
  ],
};
