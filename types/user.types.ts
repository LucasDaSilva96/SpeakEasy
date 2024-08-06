export interface UserType {
  _id: string;
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  image: string;
  conversationsIds: string[];
  resetToken: string;
  resetTokenExpires: Date;
  nativeLanguage: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
