"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Icons for visibility toggle
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginBg from "@/assets/loginImage.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const theme = localStorage.getItem("theme");
  useEffect(() => {
    // const token = localStorage.getItem("theme");
  }, [theme]);

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const emailValidationError = validateEmail(userCredentials?.email);
    const passwordValidationError = validatePassword(userCredentials?.password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) return;

    setError("");
    const success = await login(
      userCredentials?.email,
      userCredentials?.password
    );
    console.log("success",success)
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="flex h-screen w-screen flex-row bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
      data-theme="light"
    >
      <div className="h-full w-[60%] hidden lg:block relative">
        <img
          className="h-full w-full object-cover"
          src={LoginBg}
          alt="WHITE MASTERY"
        />
        <h1 className="absolute font-sans inset-0 flex items-center justify-center text-slate-600 text-7xl font-extrabold tracking-widest">
          WHITE MASTERY
        </h1>
      </div>
      <div className="flex items-center justify-center lg:w-[60%] w-full" data-theme="light">
        <Card className="w-full max-w-md" data-theme="light">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={userCredentials?.email}
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      email: e.target.value,
                    })
                  }
                  onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                />
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                    value={userCredentials?.password}
                    onChange={(e) =>
                      setUserCredentials({
                        ...userCredentials,
                        password: e.target.value,
                      })
                    }
                    onBlur={(e) =>
                      setPasswordError(validatePassword(e.target.value))
                    }
                    placeholder="********"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
