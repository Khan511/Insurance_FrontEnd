import UserCreatingForme from "@/components/forms/UserCreatingForme";

export const CreateUser = () => {
  return (
    <div className="min-h-screen flex  justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ">
      <div className="max-w-3xl mx-auto p-6 mt-5 ">
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold mb-2">User Registration</h1> */}
          {/* <p className="text-muted-foreground">
          Create new insurance user profile (2025 Compliance)
          </p> */}
        </div>

        <div className="border rounded-lg shadow-sm p-6 bg-white">
          <UserCreatingForme />
        </div>
      </div>
    </div>
  );
};
