import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import { sendOTP } from "../utiils/sendOTP.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(name, email, hashedPassword);

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "email or username required" });
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(200).json({
        message: "If the account exists, a reset code has been sent",
      });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await userModel.saveResetCode(user.id, hashedCode, expiresAt);
    await sendOTP(email, code);
    return res.status(200).json({
      message: "otp are send successfully",
    });
  } catch (error) {
    console.error(`error in forget password ${error} `);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, code } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verifyCode = await userModel.verifyCode(email);
    if (!verifyCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const isMatch = await bcrypt.compare(code, verifyCode.reset_password_token);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePassword(email, hashedPassword);
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(`error in reset password ${error} `);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userModel.updatePassword(email, password);
    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.error(`error in update password ${error} `);
    return res.status(500).json({ message: "Server error" });
  }
};
