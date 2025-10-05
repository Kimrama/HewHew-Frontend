export interface UserSignUp {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface UserSignIn {
  username: string;
  password: string;
}

export interface singInResponse {
  token?: string;
  error?: string;
}
