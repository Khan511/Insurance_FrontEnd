import UserCreatingForme from "@/components/forms/creaeUserForm/UserCreatingForme";

export const CreateUser = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 mt-5 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Content */}

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
          <div className="p-2 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
            <div className="bg-white rounded-2xl p-3">
              <UserCreatingForme />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our
            <a href="#" className="text-blue-600 hover:text-blue-800 mx-1">
              Terms of Service
            </a>
            and
            <a href="#" className="text-blue-600 hover:text-blue-800 mx-1">
              Privacy Policy
            </a>
            . Protected by reCAPTCHA.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2025 Your Company. All rights reserved. | v3.2.1
          </p>
        </div>
      </div>
    </div>
  );
};
