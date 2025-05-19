import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashBoardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Modal from "../../components/Model";
import { LuTrash2 } from "react-icons/lu";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import SelectDropdown from "../../components/Input/SelectDropdown";
import SelectUsers from "../../components/Input/SelectUsers";
import TodoListInput from "../../components/Input/TodoListInput";
import AddAttachmentsInput from "../../components/Input/AddAttachmentsInput";

function CreateTasks() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toString(),
          todoChecklist: todolist,
        }
      );

      toast.success("Task Update Successfully");
    } catch (error) {
      console.error("Error creating task", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title || !taskData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!taskData.description || !taskData.description.trim()) {
      setError("Description is required ");
      return;
    }
    if (!taskData.dueDate || !String(taskData.dueDate).trim()) {
      setError("Due Date is required ");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task is not assigned to any member");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add atleast one todo task");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      console.log(response.data);

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          priority: taskInfo.priority,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const deleteTask = async () => {
    if (!taskId) {
      console.error("Task ID is missing. Cannot delete.");
      return;
    }
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Expense details deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }

    return () => {};
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Tasks">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base">Delete</LuTrash2>
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Create UI"
                className="form-input"
                value={taskData.title || ""}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Task Description
              </label>

              <textarea
                name=""
                id=""
                placeholder="describe task"
                className="font-input"
                rows={4}
                value={taskData.description || ""}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2 ">
              <div className="col-span-6 md:col-span-4 ">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority || ""}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                ></SelectDropdown>
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  type="date"
                  placeholder="Create UI App"
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-400">
                  {" "}
                  Assign To
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo || []}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                ></SelectUsers>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                {" "}
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist || []}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              ></TodoListInput>
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              ></AddAttachmentsInput>
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500">{error}</p>
            )}
            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete tasks "
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        ></DeleteAlert>
      </Modal>
    </DashboardLayout>
  );
}

export default CreateTasks;
