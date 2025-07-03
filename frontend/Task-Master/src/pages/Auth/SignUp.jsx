import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Input/Input";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Input/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName.trim()) return setError("Full name is required.");
    if (!validateEmail(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Password must be at least 8 characters.");

    setError("");
    try {
      if (profilePic) {
        const imageloadRes = await uploadImage(profilePic);
        profileImageUrl = imageloadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate(
          role === "admin" ? "/admin/dashboard" : "/user/user-dashboard-data"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // return (
  //   <AuthLayout>
  //     <div className="w-full h-full flex flex-col justify-center">
  //       <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
  //         Create an Account
  //       </h3>
  //       <p className="text-sm text-gray-600 mb-6">
  //         Join Task Manager by entering your details below
  //       </p>

  //       <form onSubmit={handleSignup} className="space-y-4">
  //         <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
  //         <Input
  //           value={fullName}
  //           onChange={(e) => setFullName(e.target.value)}
  //           label="Full Name"
  //           placeholder="John"
  //           type="text"
  //         />
  //         <Input
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           label="Email Address"
  //           placeholder="john@example.com"
  //           type="email"
  //         />
  //         <Input
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           label="Password"
  //           placeholder="Min 8 Characters"
  //           type="password"
  //         />
  //         <Input
  //           value={adminInviteToken}
  //           onChange={(e) => setAdminInviteToken(e.target.value)}
  //           label="Admin Invite Token"
  //           placeholder="6 Digit Code"
  //           type="text"
  //         />

  //         {error && <p className="text-red-500 text-xs">{error}</p>}

  //         <button type="submit" className="btn-primary w-full">
  //           Sign Up
  //         </button>

  //         <p className="text-sm text-center">
  //           Already have an account?{" "}
  //           <Link className="font-semibold text-primary underline" to="/login">
  //             Log In
  //           </Link>
  //         </p>
  //       </form>
  //     </div>
  //   </AuthLayout>
  // );

  return (
    <AuthLayout>
      <div className="w-full h-full flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 text-center">
          Create an Account
        </h2>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Join <span className="font-semibold text-primary">Task Manager</span>{" "}
          by entering your details below
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          <Input
            value={adminInviteToken}
            onChange={(e) => setAdminInviteToken(e.target.value)}
            label="Admin Invite Token"
            placeholder="6 Digit Code"
            type="text"
          />

          {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-dark transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-600 mt-5">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary underline hover:text-primary-dark"
              to="/login"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
