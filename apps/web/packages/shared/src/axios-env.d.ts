import 'axios';

/** Custom properties added to Axios request configs by the HTTP interceptor. */
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retried?: boolean;
    _skipExchange?: boolean;
    _skipLogout?: boolean;
    _authTokenVersion?: number;
  }
}
