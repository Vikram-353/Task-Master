import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function Input({ value, onChange, placeholder, label, type }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="input-box">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-sm"
        />
        {type === "password" &&
          (showPassword ? (
            <FaRegEye
              size={22}
              className="text-primary cursor-pointer"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="text-primary cursor-pointer"
              onClick={toggleShowPassword}
            />
          ))}
      </div>
    </div>
  );
}

export default Input;
