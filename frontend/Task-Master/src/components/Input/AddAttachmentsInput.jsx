import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

function AddAttachmentsInput({ attachments, setAttachments }) {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updateArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updateArr);
  };

  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 pt-2"
        >
          <p className="text-xs text-black flex items-center gap-2">
            <LuPaperclip className="text-gray-500 text-sm" />
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          placeholder="Add File Link"
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
          type="text"
          value={option}
          onChange={({ target }) => setOption(target.value)}
        />

        <button
          className="card-btn flex items-center gap-1"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}

export default AddAttachmentsInput;
