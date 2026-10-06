"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");
  const redirectTo =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/dashboard";

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [router, status]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setServerError("");
    setGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: redirectTo });
    } catch {
      setServerError("Google sign-in could not be started. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-16">
        <section className="hidden max-w-xl lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to portfolio
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Admin workspace</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Your work, organized and ready to share.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Sign in to manage your public profile, review repository insights, and keep your portfolio in sync.</p>
          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></span>
            <div><p className="text-sm font-medium">Secure access</p><p className="mt-0.5 text-xs text-muted-foreground">Protected by your connected account</p></div>
          </div>
        </section>
        <Card className="mx-auto w-full max-w-md border-border/80">
          <CardHeader className="space-y-2 p-6 pb-2 sm:p-8 sm:pb-3">
            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div>
            <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
            <CardDescription>Sign in to continue to your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4 sm:p-8 sm:pt-5">
          {status === "loading" ? (
            <div className="flex min-h-48 items-center justify-center" role="status" aria-label="Checking session"><Loader2 className="size-5 animate-spin text-primary" /></div>
          ) : status !== "authenticated" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
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
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
              />

              {errors.password && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Signing in…</> : "Sign in"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-border/80"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <FcGoogle className="size-4" />}
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground lg:hidden">Back to portfolio</Link>
              <p className="text-muted-foreground">New here? <Link href="/sign-up" className="font-medium text-primary hover:underline">Create an account</Link></p>
            </div>
          </form>
          ) : null}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="size-5 animate-spin text-primary" /></div>}><LoginForm /></Suspense>;
}