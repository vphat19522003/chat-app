import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies["token"];

    if (!token) return res.status(401).json({ message: "NO token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });

    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "No user found" });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectedRoute;
