"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  MapPin,
  Users,
  Shield,
  Clock,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Smartphone,
  ArrowRight,
  Globe,
  Award,
  Zap,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: MapPin,
      title: "Interactive Issue Mapping",
      description: "Visualize civic issues on an interactive map with real-time updates and location-based filtering.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Enable citizens to vote, comment, and collaborate on civic issues for better community involvement.",
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Aadhaar-based authentication ensures secure access and verified issue reporting.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for administrators to track progress and make data-driven decisions.",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Faster Resolution",
      description: "Streamlined workflow reduces issue resolution time by up to 60%",
      stat: "60% Faster",
    },
    {
      icon: CheckCircle,
      title: "Higher Transparency",
      description: "Real-time status updates keep citizens informed throughout the process",
      stat: "100% Transparent",
    },
    {
      icon: MessageSquare,
      title: "Better Communication",
      description: "Direct communication channel between citizens and authorities",
      stat: "24/7 Available",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Responsive design works seamlessly across all devices",
      stat: "Any Device",
    },
  ]

  const stats = [
    { label: "Issues Resolved", value: "2,847", icon: CheckCircle },
    { label: "Active Citizens", value: "15,234", icon: Users },
    { label: "Government Departments", value: "28", icon: Shield },
    { label: "Average Resolution Time", value: "3.2 days", icon: Clock },
  ]

  const FeatureIcon = features[activeFeature].icon
  const FeatureTitle = features[activeFeature].title
  const FeatureDescription = features[activeFeature].description

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CivicConnect</h1>
                <p className="text-xs text-muted-foreground">Smart India Hackathon 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Badge variant="secondary" className="hidden sm:flex">
                <Globe className="h-3 w-3 mr-1" />6 Languages
              </Badge>
              <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              <Award className="h-3 w-3 mr-1" />
              Smart India Hackathon 2025 Solution
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Empowering Citizens,
              <span className="text-primary"> Transforming Communities</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              CivicConnect bridges the gap between citizens and government, making civic engagement transparent,
              efficient, and accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                <Zap className="mr-2 h-5 w-5" />
                Start Reporting Issues
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/20 hover:bg-primary/5 bg-transparent"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Governance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology to deliver seamless civic engagement experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? "border-primary shadow-lg bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          activeFeature === index
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <FeatureIcon className="h-24 w-24 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">{FeatureTitle}</h3>
                  <p className="text-muted-foreground">{FeatureDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose CivicConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proven results that make a real difference in communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {benefit.stat}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Community?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of citizens and administrators already using CivicConnect to build better, more
                responsive communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onGetStarted}
                  className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">CivicConnect</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering citizens and transforming communities through technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Citizen Portal</li>
                <li>Admin Dashboard</li>
                <li>Mobile App</li>
                <li>API Access</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Training</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Data Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 CivicConnect. Built for Smart India Hackathon 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
