"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, AlertCircleIcon, CheckIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

import { SocialView } from "./social-view"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
})

export const SignInView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  type SignInFormValues = {
    email: string
    password: string
    rememberMe: boolean
  }

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null)
    setIsPending(true)

    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setIsPending(false)
          setError(null)
          form.reset()
          router.push("/")
        },
        onError: ({ error }) => {
          setIsPending(false)
          setError(error.message)
        },
      },
    )
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Watch form values for validation indicators
  const watchedEmail = form.watch("email")
  const isEmailValid = watchedEmail && z.string().email().safeParse(watchedEmail).success

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <div className="p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-light tracking-tight text-gray-900">Welcome back</h1>
                  <p className="text-sm text-gray-500">Sign in to your account</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal text-gray-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              autoComplete="email"
                              className="h-11 border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors"
                              {...field}
                            />
                            {isEmailValid && (
                              <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-normal text-gray-700">Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              autoComplete="current-password"
                              className="h-11 pr-10 border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4 text-gray-400" />
                              ) : (
                                <EyeIcon className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remember Me */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-600 cursor-pointer">Remember me</FormLabel>
                    </FormItem>
                  )}
                />

                {/* Error Alert */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircleIcon className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800 text-sm">{error}</AlertTitle>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full h-10 bg-black hover:bg-gray-800 text-white text-sm font-normal transition-colors"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up" className="text-gray-900 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <SocialView setError={setError} setIsPending={setIsPending} isPending={isPending} />
              </form>
            </Form>
          </div>

          {/* Brand Section */}
          <div className="relative bg-gradient-to-b from-gray-900 to-black hidden md:flex flex-col items-center justify-center p-12">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
            </div>

            {/* Content */}
            <div className="relative text-center space-y-6">
              {/* Logo */}
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/logo.svg"
                  alt="Meet.AI"
                  width={32}
                  height={32}
                  className="w-8 h-8 filter brightness-0 invert"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <h2 className="text-2xl font-light text-white">Meet.AI</h2>
                <p className="text-gray-300 text-sm max-w-xs">Transform your meetings with intelligent insights</p>
              </div>

              {/* Features */}
              <div className="space-y-3 text-left max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="text-gray-400 text-xs">AI-powered transcription</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="text-gray-400 text-xs">Smart meeting summaries</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="text-gray-400 text-xs">Actionable insights</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-8">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="hover:text-gray-600 transition-colors">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:text-gray-600 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
