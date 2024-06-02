export interface User {
  username: string;
  email: string;
  id: number;
}

export interface UserCredentials {
  token: string;
  type: string;
  algorithm: string;
  expiresAt: string;
}

