import mongoose from "mongoose";

interface User {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  accessToken: number;
  followers: {}[];
  following: {}[];
  wallet: {}[];
  history: {}[];
  _doc: {};
}

interface iUser extends User, mongoose.Document {}

const userModel = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    accessToken: {
      type: Number,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "followers",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "followings",
      },
    ],
    wallet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallets",
      },
    ],
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "histories",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<iUser>("users", userModel);
