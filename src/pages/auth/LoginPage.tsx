import tccd_logo from "@/assets/TCCD_logo.svg";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/schemas/authSchemas";
import { z } from "zod";
import { loginRequest } from "@/endpoints/auth";
import InputField from "@/components/InputField";
import PasswordField from "@/components/PasswordField";

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts typing
    if (errors[id as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  }

  function validateForm(): boolean {
    try {
      loginSchema.parse(loginForm);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginRequest(loginForm);
      console.log(response);
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 1000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 pb-16"
      >
        <section
          className="w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
          aria-labelledby="login-title"
        >
          <header className="w-full flex flex-col gap-3 items-center">
            <p className="mb-3 text-[#636569] font-bold">welcome</p>
            <img src={tccd_logo} width={100} alt="azha-logo" />
            <h2 className="text-2xl font-bold text-[#3B3D41]">
              TCCD HR Portal
            </h2>
          </header>

          <div className="space-y-5 mt-5">
            {/* Email */}
            <div className="space-y-2">
              <h2 className="text-[#5E6064] text-center font-bold">
                Login to your account
              </h2>
              <InputField
                error={errors.email}
                id="email"
                value={loginForm.email}
                label="Email"
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <PasswordField
                value={loginForm.password}
                error={errors.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 lg:mt-7 rounded-xl px-6 py-2 bg-(--primary) text-white hover:bg-(--primary)/80 border border-(--primary) hover:border-(--primary)/80 cursor-pointer font-bold text-[12px] md:text-[13px] lg:text-[14px] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
          <footer className="p-10">
            <p className="text-center text-sm text-[#A5A9B2]">
              HR accounts are created internally by administrators, If you
              require access, please contact your department head.
            </p>
          </footer>
        </section>
      </form>
    </main>
  );
};

export default LoginPage;
