import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Mail,
  Building,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeactivateEmployeeMutation,
  useGetEmployeesQuery,
  useReactivateEmployeeMutation,
} from "@/services/AdminSlice";
import { toast } from "sonner";

interface EmployeeListProps {
  onEdit: (employeeId: number) => void;
  onView: (employeeId: number) => void;
}

export function EmployeeList({ onEdit, onView }: EmployeeListProps) {
  const { data: employees, isLoading, error, refetch } = useGetEmployeesQuery();
  const [deactivateEmployee] = useDeactivateEmployeeMutation();
  const [reactivateEmployee] = useReactivateEmployeeMutation();
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState<
    number | null
  >(null);
  const [employeeToReactivate, setEmployeeToReactivate] = useState<
    number | null
  >(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // First, filter by status only
  let employeesAfterStatusFilter = employees || [];

  if (statusFilter === "active") {
    employeesAfterStatusFilter = employeesAfterStatusFilter.filter(
      (emp) => emp.active === true
    );
  } else if (statusFilter === "inactive") {
    employeesAfterStatusFilter = employeesAfterStatusFilter.filter(
      (emp) => emp.active !== true
    );
  }

  // Get departments available for the current status filter
  const availableDepartments = Array.from(
    new Set(employeesAfterStatusFilter.map((emp) => emp.department))
  );

  // Now apply both filters (status + department)
  let filteredEmployees = employeesAfterStatusFilter;

  if (departmentFilter !== "all") {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.department === departmentFilter
    );
  }

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

  const handleDeactivate = async () => {
    if (employeeToDeactivate) {
      const toastId = toast.loading("Deactivating employee...");
      try {
        await deactivateEmployee(employeeToDeactivate).unwrap();
        toast.success("Employee deactivated successfully", {
          id: toastId,
          description: "The employee account has been deactivated.",
        });
        setEmployeeToDeactivate(null);
        refetch(); // Refresh the list
      } catch (error: any) {
        console.error("Failed to deactivate employee:", error);
        toast.error("Failed to deactivate employee", {
          id: toastId,
          description: error?.data?.message || "Please try again.",
        });
      }
    }
  };

  const handleReactivate = async () => {
    if (employeeToReactivate) {
      const toastId = toast.loading("Reactivating employee...");
      try {
        await reactivateEmployee(employeeToReactivate).unwrap();
        toast.success("Employee reactivated successfully", {
          id: toastId,
          description: "The employee account has been reactivated.",
        });
        setEmployeeToReactivate(null);
        refetch(); // Refresh the list
      } catch (error: any) {
        console.error("Failed to reactivate employee:", error);
        toast.error("Failed to reactivate employee", {
          id: toastId,
          description: error?.data?.message || "Please try again.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Failed to load employees</div>
        <p className="text-gray-500 mt-2">Please try again later</p>
      </div>
    );
  }

  // Find the employee being deactivated/reactivated for dialog messages
  const deactivatingEmployee = employeeToDeactivate
    ? employees?.find((emp) => emp.id === employeeToDeactivate)
    : null;

  const reactivatingEmployee = employeeToReactivate
    ? employees?.find((emp) => emp.id === employeeToReactivate)
    : null;

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Employees</h2>
            <p className="text-gray-500">Manage your team members</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setDepartmentFilter("all");
              }}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
              disabled={availableDepartments.length === 0}
            >
              <option value="all">All Departments</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {employees?.filter((emp) => emp.active).length || 0}
            </div>
            <div className="text-sm text-gray-500">Active Employees</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">
              {employees?.filter((emp) => !emp.active).length || 0}
            </div>
            <div className="text-sm text-gray-500">Inactive Employees</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {employees?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Total Employees</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      No employees found with the current filters
                    </div>
                    {(statusFilter !== "all" || departmentFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setStatusFilter("all");
                          setDepartmentFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Avatar>
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white">
                          {employee.name.firstName[0]}
                          {employee.name.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {employee.name.firstName} {employee.name.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {employee.employeeId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getRoleColor(employee.roleType)}
                      >
                        {employee.roleType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {employee.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getEmploymentTypeColor(
                          employee.employmentType
                        )}
                      >
                        {employee.employmentType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(employee.salary)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.active ? "default" : "outline"}
                        className={
                          employee.active
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {employee.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onView(employee.id)}
                            className="cursor-pointer bg-white"
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {employee.active && (
                            <DropdownMenuItem
                              onClick={() => onEdit(employee.id)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {employee.active ? (
                            <DropdownMenuItem
                              onClick={() =>
                                setEmployeeToDeactivate(employee.id)
                              }
                              className="text-red-600 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                setEmployeeToReactivate(employee.id)
                              }
                              className="text-green-600 cursor-pointer"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Deactivation Dialog */}
      <AlertDialog
        open={employeeToDeactivate !== null}
        onOpenChange={() => setEmployeeToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              {deactivatingEmployee && (
                <>
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold">
                    {deactivatingEmployee.name.firstName}{" "}
                    {deactivatingEmployee.name.lastName}
                  </span>
                  ? They will no longer be able to access the system.
                </>
              )}
              <br />
              <br />
              This action can be reversed by reactivating the employee later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center items-center gap-2">
            <AlertDialogCancel className="mt-0 rounded">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700 rounded text-white"
            >
              Deactivate Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivation Dialog */}
      <AlertDialog
        open={employeeToReactivate !== null}
        onOpenChange={() => setEmployeeToReactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              {reactivatingEmployee && (
                <>
                  Are you sure you want to reactivate{" "}
                  <span className="font-semibold">
                    {reactivatingEmployee.name.firstName}{" "}
                    {reactivatingEmployee.name.lastName}
                  </span>
                  ? They will regain access to the system.
                </>
              )}
              <br />
              <br />
              The employee will be able to log in and use all system features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center items-center gap-2">
            <AlertDialogCancel className="mt-0 rounded">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReactivate}
              className="bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Reactivate Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
