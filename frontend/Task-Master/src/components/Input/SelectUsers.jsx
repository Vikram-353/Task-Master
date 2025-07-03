import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Model";
import AvatarGroup from "../layouts/AvatarGroup";
import avatar from "../../images/avatar.jpg";

function SelectUsers({ selectedUsers, setSelectedUsers }) {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error  fetching users:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModelOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl || avatar)
    .filter((url) => !!url);

  // console.log(selectedUserAvatars);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers); // Sync on mount/update
  }, [selectedUsers]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }

    return () => {};
  }, [selectedUsers]);
  // return (
  //   <div className="space-y-4 mt-2">
  //     {selectedUserAvatars.length === 0 && (
  //       <button className="card-btn" onClick={() => setIsModelOpen(true)}>
  //         <LuUsers className="text-sm" /> Add Members
  //       </button>
  //     )}
  //     {selectedUserAvatars.length > 0 && (
  //       <div className="cursor-pointer" onClick={() => setIsModelOpen(true)}>
  //         <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
  //       </div>
  //     )}

  //     <Modal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModelOpen(false)}
  //       title="Select Users"
  //     >
  //       <div className="space-y-4 h-[60vh] overflow-y-auto">
  //         {allUsers.map((user) => (
  //           <div
  //             key={user._id}
  //             className="flex items-center gap-4 p-3 border-b border-gray-200 "
  //           >
  //             <img
  //               src={user.profileImageUrl || null}
  //               alt={user.name}
  //               className="w-10 h-10 rounded-full"
  //             />
  //             <div className="flex-1">
  //               <p className="font-medium text-gray-800 dark:text-white">
  //                 {user.name}
  //               </p>
  //               <p className="text-[13px] text-gray-500">{user.email}</p>
  //             </div>
  //             <input
  //               type="checkbox"
  //               checked={tempSelectedUsers.includes(user._id)}
  //               onChange={() => toggleUserSelection(user._id)}
  //               className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
  //             />
  //           </div>
  //         ))}
  //       </div>

  //       <div className="flex justify-end gap-4 pt-4">
  //         <button className="card-btn" onClick={() => setIsModelOpen(false)}>
  //           CANCEL
  //         </button>
  //         <button className="card-btn-fill" onClick={handleAssign}>
  //           DONE
  //         </button>
  //       </div>
  //     </Modal>
  //   </div>
  // );

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition"
          onClick={() => setIsModelOpen(true)}
        >
          <LuUsers className="text-lg" />
          <span className="text-sm font-medium">Add Members</span>
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg transition"
          onClick={() => setIsModelOpen(true)}
        >
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
          <span className="text-sm font-medium hidden md:inline">
            Manage Members
          </span>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModelOpen(false)}
        title="Select Users"
      >
        <div className="space-y-2 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <img
                src={user.profileImageUrl || undefined}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-300 truncate">{user.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-gray-200 mt-5">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-100 hover:bg-gray-100 hover:text-gray-700 transition"
            onClick={() => setIsModelOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
            onClick={handleAssign}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SelectUsers;
