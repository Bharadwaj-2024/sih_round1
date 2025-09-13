"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, type UserRole } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Mail, CreditCard, Shield, Users, ArrowLeft } from "lucide-react"

interface LoginFormProps {
  onBack?: () => void
}

export function LoginForm({ onBack }: LoginFormProps) {
  const [aadhaar, setAadhaar] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("citizen")
  const [loginType, setLoginType] = useState<"aadhaar" | "gmail">("aadhaar")
  const { login, isLoading } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const credentials = loginType === "aadhaar" ? { aadhaar, password } : { email, password }

    const success = await login(credentials, role)
    if (!success) {
      alert("Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">CivicConnect</CardTitle>
          <CardDescription>Sign in to report and manage civic issues</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t.selectRole}</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citizen">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t.citizen}
                    </div>
                  </SelectItem>
                  <SelectItem value="administrator">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t.administrator}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "aadhaar" | "gmail")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aadhaar" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Aadhaar
                </TabsTrigger>
                <TabsTrigger value="gmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Gmail
                </TabsTrigger>
              </TabsList>

              <TabsContent value="aadhaar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">{t.aadhaarNumber}</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="Enter your 12-digit Aadhaar number"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    maxLength={12}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="gmail" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Gmail address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t.loading : t.signIn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
