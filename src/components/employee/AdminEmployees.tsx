import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeList } from "./EmployeeList";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeDetails } from "./EmployeeDetails";
import { UserPlus, Users } from "lucide-react";
import type { EmployeeFormData, EmployeeUpdateData } from "./employeeSchema";
import { toast } from "sonner";
import {
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "@/services/AdminSlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";

export default function AdminEmployees() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const [activeTab, setActiveTab] = useState<"list" | "create" | "view">(
    "list"
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  // Fetch employee data when viewing or editing
  const {
    data: employee,
    isLoading: isLoadingEmployee,
    refetch: refetchEmployee,
  } = useGetEmployeeByIdQuery(selectedEmployeeId!, {
    skip: !selectedEmployeeId,
  });

  // Log employee data to debug
  console.log("Selected Employee ID:", selectedEmployeeId);
  console.log("Employee Data:", employee);
  console.log("Active Tab:", activeTab);
  console.log("Edit Mode:", editMode);

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    console.log("handleCreateEmployee called with data:", data);
    const toastId = toast.loading("Creating employee...");

    try {
      const result = await createEmployee(data).unwrap();
      console.log("Create successful:", result);
      toast.success("Employee created successfully", {
        id: toastId,
        description: `${data.name.firstName} ${data.name.lastName} has been added to the team.`,
        action: {
          label: "View",
          onClick: () => setActiveTab("list"),
        },
      });
      setActiveTab("list");
    } catch (error: any) {
      console.error("Create failed:", error);
      toast.error("Failed to create employee", {
        id: toastId,
        description:
          error?.data?.message || "Please check the form and try again.",
      });
    }
  };

  const handleUpdateEmployee = async (data: EmployeeUpdateData) => {
    console.log("handleUpdateEmployee called with data:", data);
    console.log("selectedEmployeeId:", selectedEmployeeId);

    if (!selectedEmployeeId) {
      console.error("No employee selected for update!");
      toast.error("No employee selected");
      return;
    }

    const toastId = toast.loading("Updating employee...");

    try {
      console.log("Calling updateEmployee mutation...");
      const result = await updateEmployee({
        id: selectedEmployeeId,
        data,
      }).unwrap();

      console.log("Update successful:", result);

      toast.success("Employee updated successfully", {
        id: toastId,
        description: `Changes to ${data.name.firstName} ${data.name.lastName} have been saved.`,
      });

      setActiveTab("list");
      setSelectedEmployeeId(null);
      setEditMode(false);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error("Failed to update employee", {
        id: toastId,
        description: error?.data?.message || "Please try again.",
      });
    }
  };

  const handleEdit = (employeeId: number) => {
    console.log("Editing employee:", employeeId);
    setSelectedEmployeeId(employeeId);
    setEditMode(true);
    setActiveTab("create");
  };

  const handleView = (employeeId: number) => {
    console.log("Viewing employee:", employeeId);
    setSelectedEmployeeId(employeeId);
    setEditMode(false);
    setActiveTab("view");
    // Force refetch when viewing
    refetchEmployee();
  };

  const handleAddNew = () => {
    console.log("Adding new employee");
    setSelectedEmployeeId(null);
    setEditMode(false);
    setActiveTab("create");
  };

  const handleBackToList = () => {
    console.log("Going back to list");
    setActiveTab("list");
    setSelectedEmployeeId(null);
    setEditMode(false);
  };

  const handleEditFromView = () => {
    console.log("Editing from view");
    if (selectedEmployeeId) {
      setEditMode(true);
      setActiveTab("create");
    }
  };

  // Add more debugging
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log("Edit mode changed to:", editMode);
  }, [editMode]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-gray-500">
            Manage your team members and their roles
          </p>
        </div>
        <div className="flex space-x-2">
          {activeTab !== "list" && (
            <Button variant="outline" onClick={handleBackToList}>
              <Users className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          )}
          {activeTab === "list" && (
            <button
              onClick={handleAddNew}
              className="flex justify-center items-center bg-blue-500 text-white font-semibold border p-2 rounded hover:bg-blue-600 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            console.log("Tab changed to:", v);
            setActiveTab(v as any);
            // If switching away from view or create, reset selected employee
            if (v === "list") {
              setSelectedEmployeeId(null);
              setEditMode(false);
            }
          }}
        >
          {/* Add the TabsList back - this is REQUIRED */}
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <EmployeeList onEdit={handleEdit} onView={handleView} />
          </TabsContent>
          <TabsContent value="create">
            {isLoadingEmployee && editMode ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading employee data...</p>
              </div>
            ) : (
              <EmployeeForm
                onSubmit={
                  editMode && selectedEmployeeId
                    ? handleUpdateEmployee
                    : handleCreateEmployee
                }
                isLoading={editMode ? isUpdating : isCreating}
                isEdit={editMode}
                initialData={
                  employee && editMode
                    ? {
                        email: employee.email,
                        password: "",
                        name: employee.name,
                        dateOfBirth: employee.dateOfBirth || "",
                        terminationDate: employee.terminationDate || "",
                        department: employee.department,
                        jobTitle: employee.jobTitle,
                        salary: String(employee.salary),
                        employmentType: employee.employmentType,
                        roleType: employee.roleType,
                        workContactInfo: employee.workContactInfo || {
                          workPhone: "",
                          workEmail: "",
                          officeLocation: "",
                        },
                        emergencyContact: employee.emergencyContact || {
                          name: "",
                          relationship: "",
                          phone: "",
                          email: "",
                        },
                      }
                    : undefined
                }
              />
            )}
          </TabsContent>

          <TabsContent value="view">
            {isLoadingEmployee ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading employee details...</p>
              </div>
            ) : employee ? (
              <div className="space-y-6">
                <div className="flex justify-end items-center">
                  <button
                    onClick={handleEditFromView}
                    className="border flex items-center justify-center px-3 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span> Edit Employee</span>
                  </button>
                </div>
                <EmployeeDetails employee={employee} />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No employee selected or failed to load
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Selected ID: {selectedEmployeeId}
                </p>
                <Button onClick={handleBackToList} className="mt-4">
                  Back to List
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
