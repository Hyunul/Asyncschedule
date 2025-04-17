// src/utils/jwt.ts
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;          // 사용자 고유 ID
  username?: string;
  role?: string;
  exp: number;          // 만료(초 단위)
  iat: number;          // 발급
  // 서버가 넣어주는 커스텀 클레임도 여기에 추가
}

export const decodeToken = (token: string): JwtPayload => jwtDecode<JwtPayload>(token);

export const getUserFromToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const { username, sub, exp } = jwtDecode<JwtPayload>(token);
    if (exp * 1000 < Date.now()) return null;
    return username ?? sub ?? null;
  } catch {
    return null;
  }
};