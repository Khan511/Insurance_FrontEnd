import LoginForm from "@/components/forms/loginForm/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Login Form */}
          <div className="lg:w-2/3">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-2 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
                <div className="bg-white rounded-2xl p-8 md:p-10">
                  <LoginForm />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-xs text-gray-600">GDPR Compliant</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-xs text-gray-600">ISO 27001</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⚖️</span>
                </div>
                <p className="text-xs text-gray-600">HIPAA Certified</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Features */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              {/* Welcome Card */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Welcome to 2025</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <span>🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        AI-Powered Dashboard
                      </h3>
                      <p className="text-sm text-gray-300">
                        Get intelligent insights and predictions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <span>📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Mobile First</h3>
                      <p className="text-sm text-gray-300">
                        Access from any device, anywhere
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <span>🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Instant Analytics</h3>
                      <p className="text-sm text-gray-300">
                        Real-time data and reporting
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Tip:</span> Use biometric
                    login for fastest access.
                  </p>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💡</span> Quick Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Use your company email for SSO
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Enable 2FA for extra security
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Contact support for team access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
              Cookie Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
              GDPR Compliance
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
              Contact Support
            </a>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 Secure Insurance Portal. All rights reserved. | Enterprise
            Edition v3.2.1
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
