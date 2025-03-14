import mongoose from "mongoose";
const doc = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    filename: {
      type: String,
      required: true,
    },
    fileurl: {
      type: String, //cloudinary uri
      required: true,
    },
  },
  { timestamps: true }
);

export const Doc = mongoose.model("Doc", doc);
