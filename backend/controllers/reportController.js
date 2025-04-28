import Task from "../models/Task.js";
import User from "../models/User.js";
import excelJs from "exceljs";

//@desc Export all tasks as an Excel file
//@route Get api/reports/export/tasks
//@access Private (Admin)

export const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email ");
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
      { header: "Task Id", key: "_id", width: 25 },
      { header: "Tilte", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "AssignedTo", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name}`)
        .join(", ");
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content=Desposition",
        'attachment; filename=tasks_report.xlsx"'
      );

      return workbook.xlsx.write(res).then(() => {
        res.end();
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting tasks", error: error.message });
  }
};

//@desc Export all user-tasks as an Excel file
//@route Get api/reports/export/users
//@access Private (Admin)

export const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id "
    );

    const userTasksMap = {};

    users.forEach((user) => {
      userTasksMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTasksMap[assignedUser._id]) {
            userTasksMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTasksMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTasksMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTasksMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskcount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "User In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTasksMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content=Desposition",
      'attachment; filename=users_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting tasks", error: error.message });
  }
};
