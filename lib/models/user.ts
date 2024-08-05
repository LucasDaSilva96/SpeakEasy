import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (this: {
          password: string;
          passwordConfirm: string;
        }) {
          return this.password === this.passwordConfirm;
        },
        message: 'Passwords do not match',
      },
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/default-avatar.jpg',
    },
    conversationsIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
    ],
    resetToken: String,
    resetTokenExpires: Date,
    nativeLanguage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'offline',
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
export type UserType = typeof User;
