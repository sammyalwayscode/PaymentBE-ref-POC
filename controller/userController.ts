import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import { Response, Request } from "express";

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find().sort({ createdAt: -1 });

    return res.status(200).json({ message: `all users`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.findById(req.params.id);

    return res.status(200).json({ message: `single user`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, fullName } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { userName, fullName },
      { new: true }
    );

    return res.status(200).json({ message: `updated`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.findByIdAndRemove(req.params.id);

    return res.status(200).json({ message: `Delete` });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, fullName, email, password } = req.body;

    const numb = crypto.randomBytes(4).toString("binary");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      userName,
      fullName,
      email,
      password: hash,
      accessToken: 100 + Math.floor(Math.random() * 1000),
    });

    return res.status(201).json({ message: `user Created`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const signinUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email });

    if (findUser) {
      const checkPassword = await bcrypt.compare(password, findUser.password);

      if (checkPassword) {
        const { ...info } = findUser._doc;

        return res
          .status(200)
          .json({ message: `welcome back ${findUser.fullName}`, data: info });
      } else {
        return res.status(404).json({ message: `password isn't correct` });
      }
    } else {
      return res.status(404).json({ message: `user doesn't exist` });
    }
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};
