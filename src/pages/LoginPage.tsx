import LoginForm from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-1">
      <div className="w-full max-w-md">
        <Card className="p-3 shadow-xl mt-1 sm:mt-5">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
