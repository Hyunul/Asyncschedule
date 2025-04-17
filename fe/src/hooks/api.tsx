// api.ts
import axios, {
    AxiosInstance,
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosRequestHeaders,
  } from "axios";
  
  /* -------------------------------------------------- */
  /* 타입 정의                                          */
  /* -------------------------------------------------- */
  interface TokenPair {
    accessToken: string;
    refreshToken: string;
  }
  
  interface ErrorPayload {
    message: string;
  }
  
  /* -------------------------------------------------- */
  /* Axios 인스턴스                                      */
  /* -------------------------------------------------- */
  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
  });
  
  /* -------------------------------------------------- */
  /* Request Interceptor                                 */
  /* -------------------------------------------------- */
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // ① headers 가 undefined 면 빈 객체로 만들어 두기
      const headers = (config.headers ||= {} as AxiosRequestHeaders);
  
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken && !refreshToken) {
        headers.accessToken = "";
        headers.refreshToken = "";
        return config;
      }
  
      headers.Authorization = `Bearer ${accessToken}`;
      headers.refreshToken = `Bearer ${refreshToken}`;
  
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );
  
  /* -------------------------------------------------- */
  /* Response Interceptor                                */
  /* -------------------------------------------------- */
  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (
      error: AxiosError<ErrorPayload>,
    ): Promise<AxiosResponse | never> => {
      const original = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
  
      if (
        error.response?.status === 401 &&
        error.response.data?.message === "expired"
      ) {
        if (original._retry) return Promise.reject(error);
        original._retry = true;
  
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return Promise.reject(error);
  
        const { data } = await axios.post<TokenPair>(
          "/api/refresh-token",
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
  
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
  
        // 새 토큰으로 헤더 갱신
        (original.headers ||= {} as AxiosRequestHeaders).Authorization =
          `Bearer ${data.accessToken}`;
  
        return axios(original);
      }
  
      return Promise.reject(error);
    },
  );
  
  export default api;
  