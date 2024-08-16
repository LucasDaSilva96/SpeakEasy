export interface UserType {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  native_language: string;
  conversations: string[];
  status: boolean;
  image: string | null;
  friends: string[];
}

export interface UserFriendType {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  native_language: string;
  status: boolean;
  image: string | null;
}

export interface UserCreateType {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  nativeLanguage: string;
}
