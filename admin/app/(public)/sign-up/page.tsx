"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    email: z
      .string()
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setServerError(
          result?.message || "Unable to create your account."
        );
        return;
      }

      setSuccessMessage(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto grid min-h-[65vh] w-full max-w-5xl items-center gap-10 py-8 lg:grid-cols-[0.9fr_1fr] lg:py-12">
      <section className="hidden max-w-md lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Join the community</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">Create an account to manage your portfolio.</h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">Your account gives you access to the private dashboard for maintaining profile details and refreshing GitHub data.</p>
        <p className="mt-8 border-l-2 border-primary/40 pl-4 text-sm leading-6 text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
      </section>
      <Card className="mx-auto w-full max-w-md border-border/80">
        <CardHeader className="space-y-2 p-6 pb-2 sm:p-8 sm:pb-3">
          <CardTitle className="text-2xl tracking-tight">
            Create an account
          </CardTitle>

          <CardDescription>
            Set up your sign-in details for the dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-4 sm:p-8 sm:pt-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {serverError && (
              <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 text-sm text-primary">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Name
              </label>

              <Input
                id="name"
                type="text"
                placeholder="Muhammad Waqas"
                autoComplete="name"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
              />

              {errors.name && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
              />

              {errors.email && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
              />

              {errors.password && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirm password
              </label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                aria-invalid={Boolean(errors.confirmPassword)}
              />

              {errors.confirmPassword && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account…"
                : "Create account"}
            </Button>

            <p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}