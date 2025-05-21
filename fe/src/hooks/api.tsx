import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
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
  // baseURL: "http://www.hyunul.site:8080",
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/* -------------------------------------------------- */
/* Request Interceptor                                 */
/* -------------------------------------------------- */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const headers = (config.headers ||= {} as AxiosRequestHeaders);

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
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

    // 조건: 인증 오류 + 무한 루프 방지 플래그
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry
    ) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        // refresh 전용 인스턴스 (interceptor 미적용)
        const refreshInstance = axios.create({
          baseURL: "http://www.hyunul.site:8080",
          // baseURL: "http://localhost:8080",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const { data } = await refreshInstance.post<TokenPair>(
          "/api/auth/refresh-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // 새 토큰 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // 요청 헤더에 새 accessToken 적용
        (original.headers ||=
          {} as AxiosRequestHeaders).Authorization = `Bearer ${data.accessToken}`;

        // 요청 재시도
        return api(original);
      } catch (refreshError) {
        // 실패 시 토큰 초기화 및 로그아웃 등 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 선택 사항
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
