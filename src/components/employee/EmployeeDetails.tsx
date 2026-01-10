import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Building,
  DollarSign,
  User,
  Calendar,
  Shield,
  Briefcase,
  MapPin,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import type { EmployeeResponseDto } from "@/pages/claim/Types";

interface EmployeeDetailsProps {
  employee: EmployeeResponseDto;
}

export function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "AGENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CLAIM_MANAGER":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-green-100 text-green-800 border-green-200";
      case "PART_TIME":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONTRACT":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xl">
                  {employee.name.firstName[0]}
                  {employee.name.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {employee.name.firstName} {employee.name.lastName}
                </h2>
                <p className="text-gray-500">{employee.jobTitle}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge
                    variant="outline"
                    className={getRoleColor(employee.roleType)}
                  >
                    {employee.roleType.replace("_", " ")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getEmploymentTypeColor(employee.employmentType)}
                  >
                    {employee.employmentType.replace("_", " ")}
                  </Badge>
                  <Badge
                    variant={employee.active ? "default" : "outline"}
                    className="text-white bg-green-500"
                  >
                    {employee.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-mono font-bold">{employee.employeeId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {employee.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(employee?.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(employee.hireDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Termination Date</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(employee.terminationDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                {employee.department}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p>{employee.jobTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(employee.salary)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Work Contact */}
        {employee.workContactInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Work Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.workContactInfo.workPhone && (
                <div>
                  <p className="text-sm text-gray-500">Work Phone</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {employee.workContactInfo.workPhone}
                  </p>
                </div>
              )}
              {employee.workContactInfo.workEmail && (
                <div>
                  <p className="text-sm text-gray-500">Work Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {employee.workContactInfo.workEmail}
                  </p>
                </div>
              )}
              {employee.workContactInfo.officeLocation && (
                <div>
                  <p className="text-sm text-gray-500">Office Location</p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {employee.workContactInfo.officeLocation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact */}
        {employee.emergencyContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.emergencyContact.name && (
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    {employee.emergencyContact.name}
                  </p>
                </div>
              )}
              {employee.emergencyContact.relationship && (
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p>{employee.emergencyContact.relationship}</p>
                </div>
              )}
              {employee.emergencyContact.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {employee.emergencyContact.phone}
                  </p>
                </div>
              )}
              {employee.emergencyContact.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {employee.emergencyContact.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
