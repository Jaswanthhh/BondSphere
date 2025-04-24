import { EyeOffIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../lib/auth-context";

export const Desktop = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = () => {
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // In a real app, you would validate credentials against a backend
    // For now, we'll simulate a successful login
    login(email);
    if (keepLoggedIn) {
      localStorage.setItem("keepLoggedIn", "true");
    }
    navigate("/home");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user types
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear error when user types
  };

  const handleKeepLoggedInChange = (checked) => {
    setKeepLoggedIn(checked);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left section with form */}
      <div className="flex flex-col p-8 flex-1">
        {/* Logo and brand */}
        <div className="flex items-center gap-3">
          <img className="w-8 h-8" alt="Icon" src="/icon.png" />
          <h1 className="font-semibold text-2xl text-[#232323] tracking-[-0.96px] leading-[26.4px] font-['Inter',Helvetica]">
            BondSphere
          </h1>
        </div>

        {/* Main content container */}
        <div className="flex flex-col justify-center gap-8 px-16 py-0 flex-1 w-full">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-[40px] text-[#232323] tracking-[-1.60px] leading-[44px] font-['Inter',Helvetica]">
              Sign in
            </h2>
            <p className="text-[#959595] text-lg leading-[27px] font-['Inter',Helvetica]">
              Please login to continue to your account.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5 max-w-[399px]">
            {/* Error message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Email field */}
            <div className="relative">
              <div className="flex items-center p-4 rounded-[10px] border border-[#d9d9d9]">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="w-full text-[#232323] text-lg leading-[27px] font-['Inter',Helvetica] outline-none bg-transparent"
                />
              </div>
              <div className="inline-flex items-center px-1 absolute -top-2.5 left-3 bg-white">
                <span className="font-medium text-[#357aff] text-sm leading-[21px] font-['Inter',Helvetica]">
                  Email
                </span>
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <div className="flex items-center p-4 rounded-[10px] border border-[#d9d9d9]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full text-[#232323] text-lg leading-[27px] font-['Inter',Helvetica] outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeIcon className="w-6 h-6" />
                  ) : (
                    <EyeOffIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="inline-flex items-center px-1 absolute -top-2.5 left-3 bg-white">
                <span className="font-medium text-[#357aff] text-sm leading-[21px] font-['Inter',Helvetica]">
                  Password
                </span>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center gap-2.5">
              <Checkbox 
                id="keep-logged-in" 
                className="w-6 h-6 rounded-none"
                checked={keepLoggedIn}
                onCheckedChange={handleKeepLoggedInChange}
              />
              <label
                htmlFor="keep-logged-in"
                className="font-medium text-[#232323] text-base leading-6 font-['Inter',Helvetica] cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            {/* Sign in button */}
            <Button 
              onClick={handleSignIn}
              className="w-full py-4 bg-[#357aff] rounded-[10px] font-semibold text-lg tracking-[-0.18px] leading-[21.6px] font-['Inter',Helvetica]"
            >
              Sign in
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-2.5">
              <Separator className="flex-1" />
              <span className="font-medium text-[#6d6d6d] text-base leading-6 font-['Inter',Helvetica]">
                or
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Google sign in */}
            <Button
              variant="outline"
              className="w-full h-[54px] py-4 bg-white rounded-[10px] border border-[#e6e8e7] shadow-[0px_1px_2px_#00000008] font-semibold text-[#232323] text-lg tracking-[-0.18px] leading-[21.6px] font-['Inter',Helvetica]"
            >
              Sign in with Google
              <img className="w-6 h-6 ml-2" alt="Google logo" src="/plus.svg" />
            </Button>
          </div>

          {/* Create account link */}
          <p className="text-center text-lg leading-[27px] font-['Inter',Helvetica]">
            <span className="text-[#6c6c6c]">Need an account? </span>
            <span 
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#357aff] underline cursor-pointer"
            >
              Create one
            </span>
          </p>
        </div>
      </div>

      {/* Right section with background image */}
      <div className="w-[849px] p-3 self-stretch">
        <div className="w-full h-full rounded-3xl bg-[url('/container.png')] bg-cover bg-center"></div>
      </div>
    </div>
  );
}

export default Desktop;
 