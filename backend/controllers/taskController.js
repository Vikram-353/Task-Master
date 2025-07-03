import Task from "../models/Task.js";

//@desc Get all tasks (Admin:all,User,only assigned tasks)
// @route GET api/tasks

export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    //Add Completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    //Status summary counts
    const alltasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const CompletedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: alltasks,
        pendingTasks,
        inProgressTasks,
        CompletedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

export const getTasksById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

// export const createTasks = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       priority,
//       dueDate,
//       assignedTo,
//       todoChecklist,
//       attachments,
//     } = req.body;
//     if (!Array.isArray(assignedTo)) {
//       return res
//         .status(400)
//         .json({ message: "assignedTo must be an array of IDs" });
//     }

//     const task = await Task.create({
//       title,
//       description,
//       priority,
//       dueDate,
//       assignedTo,
//       createdBy: req.user._id,
//       todoChecklist,
//       attachments,
//     });

//     res.status(201).json({ message: "Task created successfully", task });
//   } catch (error) {
//     res.status(500).json({ message: "Server error ", error: error.message });
//   }
// };

export const createTasks = async (req, res) => {
  try {
    const data = req.body;

    // Check if it's an array of tasks or single task
    if (Array.isArray(data)) {
      // Multiple tasks
      const tasksWithUser = data.map((task) => {
        if (!Array.isArray(task.assignedTo)) {
          throw new Error("assignedTo must be an array in each task");
        }
        return {
          ...task,
          createdBy: req.user._id,
        };
      });

      const insertedTasks = await Task.insertMany(tasksWithUser);

      return res.status(201).json({
        message: `${insertedTasks.length} tasks created successfully`,
        tasks: insertedTasks,
      });
    } else {
      // Single task
      const {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        todoChecklist,
        attachments,
      } = data;

      if (!Array.isArray(assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of IDs" });
      }

      const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        createdBy: req.user._id,
        todoChecklist,
        attachments,
      });

      return res
        .status(201)
        .json({ message: "Task created successfully", task });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: "assignedTo must be an array" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updateTask = await task.save();
    res.json({ message: "Task updated", updateTask });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

export const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized " });
    }

    task.todoChecklist = todoChecklist;
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;

    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res
      .status(200)
      .json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const CompletedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //Remove spaces for response key
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks; //Add total count to taskDistribution

    //Ensure all priorities levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLenvelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLenvelsRaw.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    }, {});

    //Fetch recent 10 tasks

    const recenttasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, CompletedTasks, overdueTasks },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recenttasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

export const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const CompletedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //Remove spaces for response key
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks; //Add total count to taskDistribution

    //Ensure all priorities levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLenvelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLenvelsRaw.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    }, {});

    //Fetch recent 10 tasks

    const recenttasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, CompletedTasks, overdueTasks },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recenttasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};
