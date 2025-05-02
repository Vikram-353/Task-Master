import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import { validateEmail } from "../../utils/helper";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //handle form submint
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setPassword("Please enter a valid password.");
      return;
    }

    setError("");
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@ex.com"
            type="text"
          ></Input>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          ></Input>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            Login
          </button>

          <p>
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Signup
            </Link>{" "}
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
