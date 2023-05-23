import { Schema, model, models } from "mongoose";

const Token = new Schema({
  token: {
    type: String,
    unique: true,
  },
  user_id: {
    type: String,
    unique: true,
  },
});

const UserTokens = models.user_tokens || model("user_tokens", Token);

export default UserTokens;
