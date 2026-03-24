type UserRole = string;

type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

type AuthUser = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  birthday: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type { AuthUser, LoginResponse, UserRole };
