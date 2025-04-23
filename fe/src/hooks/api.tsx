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
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
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

    if (accessToken && refreshToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      headers.refreshToken = `Bearer ${refreshToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* -------------------------------------------------- */
/* Response Interceptor                                */
/* -------------------------------------------------- */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<ErrorPayload>): Promise<AxiosResponse | never> => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (original._retry) return Promise.reject(error); // 재귀 요청 방지
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        // ② refreshToken을 사용하여 새로운 accessToken을 요청
        const { data } = await axios.post<TokenPair>(
          "/api/refresh-token",
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        // ③ 새로 받은 accessToken과 refreshToken을 로컬스토리지에 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // ④ 요청의 Authorization 헤더를 새 accessToken으로 업데이트
        (original.headers ||=
          {} as AxiosRequestHeaders).Authorization = `Bearer ${data.accessToken}`;

        // ⑤ 토큰을 갱신하고 요청을 다시 전송
        return axios(original);
      } catch (err) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
