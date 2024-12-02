"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button, Spinner } from "@nextui-org/react";
import { api } from "../../helpers/api"; 
import { useUserStore, generateRandomAvatar } from "../../store/userStore";
import { useRouter } from "next/navigation";

// Zod Schema for Form Validation
const registrationSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters."),
    program: z.string().min(1, "Program affiliation is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setAddress = useUserStore((state) => state.setAddress);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const avatarPicture = generateRandomAvatar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    setLoading(true);
    try {
      // Make the API request to the register endpoint
      const response = await api.post("/api/users/register", {
        email: data.email,
        username: data.username,
        password: data.password,
        program: data.program,
      });

      const { user, token } = response.data;
      user.profilePicture = user.profilePicture || avatarPicture;
      setUser(user, token);

      setSubmissionError(null);
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to register. Please try again.";
      setSubmissionError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {submissionError && (
          <div className="mb-4 text-red-600 text-center">{submissionError}</div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            {...register("email")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? "border-red-500" : ""
            }`}
            type="email"
            placeholder="Your Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            {...register("username")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? "border-red-500" : ""
            }`}
            type="text"
            placeholder="Your Username"
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            {...register("password")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password ? "border-red-500" : ""
            }`}
            type="password"
            placeholder="Your Password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            type="password"
            placeholder="Confirm Your Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Program Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Program
          </label>
          <select
            {...register("program")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.program ? "border-red-500" : ""
            }`}
          >
            <option value="">Select your program</option>
            <option value="Applied Information and Data Science">
              Applied Information and Data Science
            </option>
            <option value="Other">Other</option>
          </select>
          {errors.program && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.program.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center justify-center mt-6">
          <Button
            type="submit"
            color="primary"
            isDisabled={loading}
            className="w-full max-w-[200px] flex justify-center"
          >
            {loading ? <Spinner size="sm" color="white" /> : "Register"}
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-gray-700 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;