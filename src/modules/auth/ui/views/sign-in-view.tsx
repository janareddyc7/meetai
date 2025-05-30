"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, OctagonAlertIcon, CheckIcon } from "lucide-react"

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
  rememberMe: z.boolean().optional(),
})

export const SignInView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
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
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 border shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance text-sm">
                    Enter your credentials to access your account
                  </p>
                </div>
                <div className="grid gap-4">
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
                              autoComplete="email"
                              aria-label="Email"
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
                </div>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
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
                              aria-label="Password"
                              className="pr-10 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={togglePasswordVisibility}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <EyeIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="rememberMe"
                          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                      </FormControl>
                      <FormLabel htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
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
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-emerald-600 hover:text-emerald-700 underline-offset-4 underline"
                  >
                    Sign Up
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

            <Image src="/logo.svg" alt="Meet.AI logo" width={92} height={92} className="relative z-10 w-20 h-20" />
            <p className="relative z-10 text-2xl font-semibold text-white">Meet.AI</p>

            <div className="mt-6 text-emerald-50 max-w-xs text-center relative z-10">
              <p className="text-sm">
                Streamline your meetings with AI-powered transcription, summaries, and action items
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
