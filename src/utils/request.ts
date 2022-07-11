import { message } from 'antd';
import { extend, RequestOptionsInit } from 'umi-request';

const controller = new AbortController();

export const request = async (url: string, option?: RequestOptionsInit) => {
  const host =
    process.env.NODE_ENV === 'development'
      ? ''
      : 'https://observable-api-dev.starboard.ventures';

  try {
    const { signal } = controller;

    const req = extend({
      timeout: 30000,
      errorHandler(error) {
        const { response } = error;
        message.error(error.message);

        return response;
      },
      signal,
    });

    const res = await req(host + url, option);

    return res;
  } catch (e) {
    return null;
  }
};
