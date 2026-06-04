"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // ✅ Clear JWT cookie on login page load (correct cookie name)
  useEffect(() => {
    document.cookie =
      "JWT=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax"
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 Important: sends/receives cookies
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      router.push("/")
      router.refresh() // Force refresh to update auth state
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // // 🔥 Google OAuth login - redirects to backend OAuth2 endpoint
  // const handleGoogleLogin = () => {
  //   window.location.href =
  //     `${process.env.NEXT_PUBLIC_BASE_URL}/oauth2/authorization/google`
  // }

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center">

      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Invoicer</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="email">
            <TabsList className="grid grid-cols-1">
              <TabsTrigger value="email">Login</TabsTrigger>
              {/* <TabsTrigger value="google">Google</TabsTrigger> */}
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* <TabsContent value="google">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full"
                type="button"
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </TabsContent> */}
          </Tabs>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}