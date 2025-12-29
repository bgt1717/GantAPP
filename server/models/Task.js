import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
