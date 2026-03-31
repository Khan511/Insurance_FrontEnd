import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, ArrowLeft, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Unauthorized() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-red-200 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="h-10 w-10 text-red-600" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            <CardTitle className="text-3xl font-bold text-red-700">
              Access Denied
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-gray-600">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Insufficient Privileges</p>
                <p>
                  Your current user role doesn't have access to this resource.
                  Please contact your administrator if you believe this is an
                  error.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full h-12  rounded text-white bg-blue-500 hover:bg-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t border-red-100 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link
                to="/contact"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
