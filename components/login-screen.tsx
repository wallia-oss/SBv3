"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, User, Lock, Sparkles } from "lucide-react"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 1000)
  }

  const handleDemoLogin = () => {
    onLogin()
  }

  return (
    <div className="flex flex-col h-full ios-18-bg">
      {/* Header */}
      <div className="flex items-center justify-center p-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center ios-18-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="ios-18-large-title text-black">SpeakBack</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <h2 className="ios-18-title1 text-black mb-2">Welcome Back</h2>
          <p className="ios-18-body text-gray-600">Sign in to continue your learning journey</p>
        </div>

        <Card className="ios-18-card ios-18-shadow-lg border-0 mb-6">
          <CardContent className="p-6 space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="ios-18-footnote font-medium text-gray-700">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 h-12 ios-18-input border-gray-200 rounded-xl"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="ios-18-footnote font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 ios-18-input border-gray-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl ios-18-button ios-18-shadow border-0 ios-18-haptic disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>

        {/* Demo Mode */}
        <div className="text-center">
          <p className="ios-18-caption text-gray-500 mb-3">Want to try it first?</p>
          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full h-12 border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-xl ios-18-button ios-18-haptic bg-transparent"
          >
            Try Demo Mode
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="ios-18-caption text-gray-500">
          Don't have an account? <button className="text-blue-500 font-medium ios-18-haptic">Sign Up</button>
        </p>
      </div>
    </div>
  )
}
