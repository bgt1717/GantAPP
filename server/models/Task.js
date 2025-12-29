import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Validate endDate > startDate
taskSchema.pre("save", function (next) {
  if (this.endDate < this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

export default mongoose.model("Task", taskSchema);
