import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    //Add task counts to each user
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, //Include alln exixting user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(userWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};
