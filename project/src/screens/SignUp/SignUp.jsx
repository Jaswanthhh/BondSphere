import { EyeOffIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import { auth } from '../../services/api';

export const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSignUp = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }
    try {
      const registerData = {
        fullName: formData.fullName,
        username: formData.fullName.toLowerCase().replace(/\s+/g, ''),
        email: formData.email,
        password: formData.password
      };
      console.log('Sending registration data:', registerData);
      const response = await auth.register(registerData);
      console.log('Registration response:', response.data);
      setSuccess(true);
      navigate('/'); // Redirect to login
    } catch (err) {
      console.error('Registration error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        fullError: err
      });
      
      // Show more detailed error message
      let errorMessage = 'Signup failed';
      if (err.response?.data) {
        if (err.response.data.missing) {
          const missingFields = Object.entries(err.response.data.missing)
            .filter(([_, isMissing]) => isMissing)
            .map(([field]) => field)
            .join(', ');
          errorMessage = `Missing required fields: ${missingFields}`;
        } else if (err.response.data.msg) {
          errorMessage = err.response.data.msg;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      setError(errorMessage);
    }
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
              Create an account
            </h2>
            <p className="text-[#959595] text-lg leading-[27px] font-['Inter',Helvetica]">
              Join our community and start exploring.
            </p>
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-5 max-w-[399px]">
            {/* Full Name field */}
            <div className="relative">
              <div className="flex items-center p-4 rounded-[10px] border border-[#d9d9d9]">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full text-[#232323] text-lg leading-[27px] font-['Inter',Helvetica] outline-none bg-transparent"
                />
              </div>
              <div className="inline-flex items-center px-1 absolute -top-2.5 left-3 bg-white">
                <span className="font-medium text-[#357aff] text-sm leading-[21px] font-['Inter',Helvetica]">
                  Full Name
                </span>
              </div>
            </div>

            {/* Email field */}
            <div className="relative">
              <div className="flex items-center p-4 rounded-[10px] border border-[#d9d9d9]">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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

            {/* Confirm Password field */}
            <div className="relative">
              <div className="flex items-center p-4 rounded-[10px] border border-[#d9d9d9]">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full text-[#232323] text-lg leading-[27px] font-['Inter',Helvetica] outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="w-6 h-6" />
                  ) : (
                    <EyeOffIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="inline-flex items-center px-1 absolute -top-2.5 left-3 bg-white">
                <span className="font-medium text-[#357aff] text-sm leading-[21px] font-['Inter',Helvetica]">
                  Confirm Password
                </span>
              </div>
            </div>

            {/* Terms and Conditions checkbox */}
            <div className="flex items-center gap-2.5">
              <Checkbox 
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked)}
                className="w-6 h-6 rounded-none"
              />
              <label
                htmlFor="terms"
                className="font-medium text-[#232323] text-base leading-6 font-['Inter',Helvetica] cursor-pointer"
              >
                I agree to the Terms and Conditions
              </label>
            </div>

            {/* Sign up button */}
            <Button 
              onClick={handleSignUp}
              className="w-full py-4 bg-[#357aff] rounded-[10px] font-semibold text-lg tracking-[-0.18px] leading-[21.6px] font-['Inter',Helvetica]"
            >
              Create Account
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-2.5">
              <Separator className="flex-1" />
              <span className="font-medium text-[#6d6d6d] text-base leading-6 font-['Inter',Helvetica]">
                or
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Google sign up */}
            <Button
              variant="outline"
              className="w-full h-[54px] py-4 bg-white rounded-[10px] border border-[#e6e8e7] shadow-[0px_1px_2px_#00000008] font-semibold text-[#232323] text-lg tracking-[-0.18px] leading-[21.6px] font-['Inter',Helvetica]"
            >
              Sign up with Google
              <img className="w-6 h-6 ml-2" alt="Google logo" src="/plus.svg" />
            </Button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-lg leading-[27px] font-['Inter',Helvetica]">
            <span className="text-[#6c6c6c]">Already have an account? </span>
            <span 
              onClick={() => navigate("/")}
              className="font-semibold text-[#357aff] underline cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      {/* Right section with background image */}
      <div className="w-[849px] p-3 self-stretch">
        <div className="w-full h-full rounded-3xl bg-[url(..//container.png)] bg-cover bg-center" />
      </div>
    </div>
  );
}; 