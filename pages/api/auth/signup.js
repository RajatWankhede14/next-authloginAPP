import { hash } from "bcrypt";
import { connectToMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import mongoose from "mongoose";

const handler = async (req, res) => {
  connectToMongoDB().catch((err) => res.json(err));

  if (!req.body) {
    return res.status(400).json({ error: "Data is missing" });
  }
  const { fullName, phoneNumber, password } = req.body;
  const userExists = await User.findOne({ phoneNumber });
  if (userExists) {
    return res.status(409).json({ error: "User already exists" });
  } else {
    const hashedPassword = await hash(password, 10);
    await User.create({
      fullName,
      password: hashedPassword,
      phoneNumber,
    })
      .then((data) => {
        const user = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          _id: data._id,
        };
        res.status(201).json({ success: true, user });
      })
      .catch((error) => {
        res.json(error);
      });
  }
};

export default handler;
