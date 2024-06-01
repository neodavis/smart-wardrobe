export interface User {
  // TODO: align with BE after complete model
  id: number;
}

export interface UserCredentials {
  token: string;
  type: string;
  algorithm: string;
  expiresAt: string;
}

