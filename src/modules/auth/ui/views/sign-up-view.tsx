"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon, EyeIcon, EyeOffIcon, CheckIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert"

import { SocialView } from "./social-view"

const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const SignUpView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null)
    setIsPending(true)

    authClient.signUp.email(
      {
        name: values.name,
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

  // Watch form values for validation indicators
  const watchedName = form.watch("name")
  const watchedEmail = form.watch("email")
  const watchedPassword = form.watch("password")
  const watchedConfirmPassword = form.watch("confirmPassword")

  const isNameValid = watchedName && watchedName.length >= 3
  const isEmailValid = watchedEmail && z.string().email().safeParse(watchedEmail).success
  const isPasswordValid = watchedPassword && watchedPassword.length >= 8
  const isConfirmPasswordValid = watchedConfirmPassword && watchedConfirmPassword === watchedPassword

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 border shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold">Let&apos;s get started</h1>
                  <p className="text-muted-foreground text-balance text-sm">
                    Create an account to get started with our services.
                  </p>
                </div>

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Enter your name"
                              className="pr-10 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-0"
                              {...field}
                            />
                            {isNameValid && (
                              <CheckIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="my@email.com"
                              className="pr-10 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-0"
                              {...field}
                            />
                            {isEmailValid && (
                              <CheckIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                              {isPasswordValid && <CheckIcon className="h-4 w-4 text-emerald-500" />}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pr-10 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                              {isConfirmPasswordValid && <CheckIcon className="h-4 w-4 text-emerald-500" />}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="!text-destructive h-4 w-4" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-emerald-600 hover:text-emerald-700 underline-offset-4 underline"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                </div>

                <SocialView setError={setError} setIsPending={setIsPending} isPending={isPending} />
              </div>
            </form>
          </Form>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>

            <Image src="/logo.svg" alt="logo" width={92} height={92} className="w-20 h-20 relative z-10" />
            <p className="text-2xl font-semibold text-white relative z-10">Meet.AI</p>

            <div className="mt-6 text-emerald-50 max-w-xs text-center relative z-10">
              <p className="text-sm">
                Join thousands of users who are already using Meet.AI to enhance their meeting experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 underline-offset-4 underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline-offset-4 underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}
