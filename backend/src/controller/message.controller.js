import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../util/cloudinaryConfig.js";
import { getReceiverMessage, io } from "../socket.js";

export const getListUserController = async (req, res) => {
  const myUserID = req.user._id;

  try {
    const listUsers = await UserModel.find({ _id: { $ne: myUserID } }).select(
      "-password"
    );

    res.status(200).json(listUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserMessageController = async (req, res) => {
  const myUserID = req.user._id;
  const friendID = req.params.id;

  console.log({ myUserID, friendID });

  try {
    const listMessage = await MessageModel.find({
      $or: [
        { senderId: friendID, receiverId: myUserID },
        {
          senderId: myUserID,
          receiverId: friendID,
        },
      ],
    });

    res.status(200).json(listMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessageController = async (req, res) => {
  const myUserID = req.user._id;
  const friendID = req.params.id;
  const { text, image } = req.body;

  console.log({
    myUserID,
    friendID,
    text,
    image,
  });

  try {
    let uploadResponse = "";
    if (image) {
      uploadResponse = await cloudinary.uploader.upload(image);
    }

    const message = new MessageModel({
      senderId: myUserID,
      receiverId: friendID,
      text,
      image: uploadResponse.secure_url,
    });

    await message.save();

    const receiverSocketID = getReceiverMessage(friendID);
    if (receiverSocketID) io.to(receiverSocketID).emit("send-message", message);

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
