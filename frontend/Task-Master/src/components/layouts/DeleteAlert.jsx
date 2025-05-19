import React from "react";

function DeleteAlert({ content, onDelete }) {
  return (
    <div>
      <div>
        <p className="text-sm">{content}</p>
        <div>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 text-xs text-rose-500 whitespace-nowrap md:text-sm font-medium bg-rose-50 border-rose-100 rounded-lg px-4 py-2 cursor-pointer"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAlert;
