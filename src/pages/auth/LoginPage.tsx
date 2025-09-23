import tccd_logo from "@/assets/TCCD_logo.svg";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/schemas/authSchemas";
import { z } from "zod";
import InputField from "@/components/generics/InputField";
import PasswordField from "@/components/generics/PasswordField";
import Button from "@/components/generics/Button";
import { useLogin } from "@/queries/users/userQueries";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();

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
      await login(loginForm);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
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
              <h2 className="text-[#5E6064] text-center font-bold mb-5">
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
            <Button
              buttonText={isSubmitting ? "Logging in..." : "Login"}
              type="primary"
              width="full"
              loading={isSubmitting}
              onClick={() => {}}
            />
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
