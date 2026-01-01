import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  Headphones,
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ShieldCheck,
  Globe,
  Award,
} from "lucide-react";
import { Container, Row, Col } from "react-bootstrap";
import "./HomeHeroSection.css";

export function HomeHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const stats = [
    {
      value: "2M+",
      label: "Families Protected",
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: "99.7%",
      label: "Claim Satisfaction",
      icon: <Star className="h-4 w-4" />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      value: "150+",
      label: "Coverage Countries",
      icon: <Globe className="h-4 w-4" />,
    },
  ];

  const floatingCards = [
    {
      title: "AI Health Coverage",
      //   price: "From DKK129/month",
      icon: <Shield className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-400",
      delay: "0s",
      features: ["Smart Diagnosis", "24/7 Doctor Chat", "Mental Health"],
    },
    {
      title: "Auto Protection",
      //   price: "From DKK149/month",
      icon: <Zap className="h-8 w-8" />,
      color: "from-emerald-500 to-green-400",
      delay: "0.5s",
      features: ["Accident AI Assist", "Theft Protection", "Roadside 24/7"],
    },
    {
      title: "Smart Home Shield",
      //   price: "From DKK139/month",
      icon: <ShieldCheck className="h-8 w-8" />,
      color: "from-violet-500 to-purple-400",
      delay: "1s",
      features: ["Climate Coverage", "IoT Protection", "Natural Disasters"],
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${
              mousePosition.y * 20
            }px)`,
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-linear-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-linear-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-linear-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />

        {/* Geometric grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px)] bg-size-[100px_100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-size-[100px_100px]" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <Container className="relative z-10 py-20">
        <Row className="items-center min-h-[calc(100vh-200px)]">
          <Col lg={6} className="mb-12 lg:mb-0">
            <div className="space-y-8">
              {/* Trust badge */}
              <div
                className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 ${
                  isVisible ? "animate-slide-up" : "opacity-0"
                }`}
              >
                <div className="relative">
                  <Award className="h-5 w-5 text-amber-500" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-300" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    Trusted by 2M+ Families Worldwide
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-2">
                      4.7/5 from 15,000+ reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Main headline */}
              <div
                className={`space-y-6 ${
                  isVisible
                    ? "animate-slide-up animation-delay-100"
                    : "opacity-0"
                }`}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="block">Future-Proof</span>
                  <span className="relative inline-block">
                    <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-shift">
                      Protection
                    </span>
                    <Sparkles className="absolute -top-4 -right-6 h-8 w-8 text-cyan-300 animate-pulse" />
                  </span>
                  <span className="block">for Life's Next Chapter</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Experience insurance reimagined for 2025. AI-powered coverage
                  that adapts in real-time, protecting what matters most with
                  unprecedented precision and simplicity.
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap gap-4 ${
                  isVisible
                    ? "animate-slide-up animation-delay-200"
                    : "opacity-0"
                }`}
              >
                <Link
                  to="/all-products"
                  className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden no-underline"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-3">
                    <span>Calculate Your Price</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
                </Link>

                <Link
                  to="/expert-consultation"
                  className="group px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-lg border-2 border-gray-200/50 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:border-blue-200 transition-all duration-300 no-underline"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Headphones className="h-5 w-5 text-blue-600" />
                      <div className="absolute -inset-1 bg-blue-100 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="text-gray-900">
                      AI Expert Consultation
                    </span>
                  </div>
                </Link>
              </div>

              {/* Quick stats */}
              <div
                className={`grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-200/50 ${
                  isVisible
                    ? "animate-slide-up animation-delay-300"
                    : "opacity-0"
                }`}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="p-2 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                        <div className={`text-blue-600`}>{stat.icon}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={6} className="relative">
            {/* Floating cards container */}
            <div className="relative h-[600px]">
              {floatingCards.map((card, index) => (
                <div
                  key={index}
                  className={`absolute ${
                    index === 0
                      ? "top-0 left-0"
                      : index === 1
                      ? "top-1/4 right-0"
                      : "bottom-0 left-1/2 -translate-x-1/2"
                  } group cursor-pointer ${
                    isVisible ? "animate-float-card" : "opacity-0"
                  }`}
                  style={{ animationDelay: card.delay }}
                >
                  {/* Card shadow/glow */}
                  <div
                    className={`absolute -inset-4 rounded-3xl bg-linear-to-br ${card.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                  />

                  {/* Main card */}
                  <div className="relative w-80 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl group-hover:shadow-3xl group-hover:scale-105 transition-all duration-500 overflow-hidden">
                    {/* Animated gradient border */}
                    <div
                      className={`absolute inset-0 rounded-2xl p-0.5 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    >
                      <div className="w-full h-full bg-white rounded-2xl" />
                    </div>

                    {/* Card content */}
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`p-3 rounded-xl bg-linear-to-br ${card.color} bg-opacity-10`}
                        >
                          {card.icon}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-gray-50 to-gray-100 border border-gray-200">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-semibold text-gray-700">
                            Trending
                          </span>
                        </div>
                      </div>
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {card.title}
                      </h3>
                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {card.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Floating animation indicator */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}

              {/* Center decorative element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="relative">
                  <div className="w-64 h-64 bg-linear-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-full border-2 border-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Shield className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="absolute -bottom-10 left-0 right-0">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="-ml-2 first:ml-0">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            U{i}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Joined by 500+ today
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">
                    Live AI Coverage Analysis
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-current text-blue-50"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-current text-blue-100"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-current text-white"
            />
          </svg>
        </div>
      </Container>

      {/* Mouse follower effect */}
      <div
        className="fixed top-0 left-0 w-64 h-64 bg-linear-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl pointer-events-none z-0"
        style={{
          transform: `translate(${mousePosition.x * 100}px, ${
            mousePosition.y * 100
          }px)`,
        }}
      />
    </div>
  );
}
