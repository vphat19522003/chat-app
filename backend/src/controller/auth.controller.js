import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../util/generateToken.js";
import cloudinary from "../util/cloudinaryConfig.js";

export const SignUpController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !password || !fullName) {
      return res.status(404).json({ message: "All field must be fill" });
    }

    if (password < 6)
      return res
        .status(404)
        .json({ message: "Password must be at least 6 characters" });

    const existedUser = await UserModel.findOne({ email });

    if (existedUser)
      return res.status(400).json({ message: "User already exists" });

    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(403).json({ message: "Fill all fields" });

    const existedUser = await UserModel.findOne({ email });

    if (!existedUser)
      return res.status(404).json({ message: "Invalid Credentials" });

    const isMatchPassword = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (isMatchPassword) {
      generateToken(existedUser._id, res);

      return res.status(200).json({
        _id: existedUser._id,
        fullName: existedUser.fullName,
        email: existedUser.email,
        profilePic: existedUser.profilePic,
      });
    } else {
      return res.status(403).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogoutController = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic)
      return res.status(404).json({ message: "No profile picture provided" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Updated profile picture successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
