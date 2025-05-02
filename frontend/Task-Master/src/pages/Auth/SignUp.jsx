import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Input/Input";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/layouts/ProfilePhotoSelector";

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!fullName.trim()) return setError("Full name is required.");
    if (!validateEmail(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Password must be at least 8 characters.");

    setError("");
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
          ></ProfilePhotoSelector>

          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="John"
            type="text"
          ></Input>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="John@ex.com"
            type="text"
          ></Input>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="MIn 8 Characters"
            type="password"
          ></Input>
          <Input
            value={adminInviteToken}
            onChange={({ target }) => setAdminInviteToken(target.value)}
            label="Admin Invite Token"
            placeholder="6 Digit Code"
            type="text"
          ></Input>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SignUP
          </button>

          <p>
            Already have an account ?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Log In
            </Link>{" "}
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
