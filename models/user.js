import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: [true, "Phone number is required"],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
