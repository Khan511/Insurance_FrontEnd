// // src/pages/admin/customers/CustomerEdit.tsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// // UI Components
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { toast } from "sonner";

// // Icons
// import {
//   ArrowLeft,
//   Save,
//   RotateCcw,
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   IdCard,
//   Calendar,
//   AlertCircle,
// } from "lucide-react";

// // API
// import {
//   useGetCustomerByUserIdsQuery,
//   useUpdateCustomerMutation,
// } from "@/services/AdminSlice";

// // Validation Schema
// const editCustomerSchema = z.object({
//   // Personal Information
//   customerFirstname: z
//     .string()
//     .min(1, "First name is required")
//     .max(50, "First name is too long"),
//   customerLastname: z
//     .string()
//     .min(1, "Last name is required")
//     .max(50, "Last name is too long"),
//   email: z.string().email("Invalid email address"),
//   customerDateOfBirth: z.string().optional(),

//   // Contact Information
//   customerPhone: z
//     .string()
//     .min(1, "Phone number is required")
//     .regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone number"),
//   customerAlternativePhone: z.string().optional(),

//   // Primary Address
//   customerPrimaryAddressStreet: z.string().min(1, "Street address is required"),
//   customerPrimaryAddressCity: z.string().min(1, "City is required"),
//   customerPrimaryAddressPostalCode: z
//     .string()
//     .min(1, "Postal code is required"),
//   customerPrimaryAddressCountry: z.string().min(1, "Country is required"),

//   // Billing Address
//   customerBillingAddressStreet: z.string().optional(),
//   customerBillingAddressCity: z.string().optional(),
//   customerBillingAddressPostalCode: z.string().optional(),
//   customerBillingAddressCountry: z.string().optional(),

//   // Status
//   status: z.enum(["ACTIVE", "INACTIVE"]),

//   // Government ID - Read only usually
//   customerIdType: z.string().optional(),
//   customerIdMaskedNumber: z.string().optional(),
//   idIssuingCountry: z.string().optional(),
//   idExpirationDate: z.string().optional(),
//   idVerificationStatus: z.string().optional(),
// });

// type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

// const CustomerEdit = () => {
//   const navigate = useNavigate();
//   const { customerId } = useParams<{ customerId: string }>();

//   // State
//   const [isSameAsPrimary, setIsSameAsPrimary] = useState(false);

//   // API Hooks
//   const {
//     data: customer,
//     isLoading,
//     error,
//   } = useGetCustomerByUserIdsQuery(customerId || "", {
//     skip: !customerId,
//   });

//   const [updateCustomer, { isLoading: isUpdating }] =
//     useUpdateCustomerMutation();

//   // Form
//   const form = useForm<EditCustomerFormData>({
//     resolver: zodResolver(editCustomerSchema),
//     defaultValues: {
//       status: "ACTIVE",
//       customerFirstname: "",
//       customerLastname: "",
//       email: "",
//       customerDateOfBirth: "",
//       customerPhone: "",
//       customerAlternativePhone: "",
//       customerPrimaryAddressStreet: "",
//       customerPrimaryAddressCity: "",
//       customerPrimaryAddressPostalCode: "",
//       customerPrimaryAddressCountry: "",
//       customerBillingAddressStreet: "",
//       customerBillingAddressCity: "",
//       customerBillingAddressPostalCode: "",
//       customerBillingAddressCountry: "",
//       customerIdType: "",
//       customerIdMaskedNumber: "",
//       idIssuingCountry: "",
//       idExpirationDate: "",
//       idVerificationStatus: "",
//     },
//   });

//   // Watch billing address fields to enable/disable sync
//   const primaryAddressStreet = form.watch("customerPrimaryAddressStreet");
//   const primaryAddressCity = form.watch("customerPrimaryAddressCity");
//   const primaryAddressPostalCode = form.watch(
//     "customerPrimaryAddressPostalCode"
//   );
//   const primaryAddressCountry = form.watch("customerPrimaryAddressCountry");

//   // Sync billing address with primary address
//   useEffect(() => {
//     if (isSameAsPrimary) {
//       form.setValue("customerBillingAddressStreet", primaryAddressStreet, {
//         shouldDirty: true,
//       });
//       form.setValue("customerBillingAddressCity", primaryAddressCity, {
//         shouldDirty: true,
//       });
//       form.setValue(
//         "customerBillingAddressPostalCode",
//         primaryAddressPostalCode,
//         {
//           shouldDirty: true,
//         }
//       );
//       form.setValue("customerBillingAddressCountry", primaryAddressCountry, {
//         shouldDirty: true,
//       });
//     }
//   }, [
//     isSameAsPrimary,
//     primaryAddressStreet,
//     primaryAddressCity,
//     primaryAddressPostalCode,
//     primaryAddressCountry,
//     form,
//   ]);

//   // Reset form when customer data loads
//   useEffect(() => {
//     if (customer) {
//       form.reset({
//         customerFirstname: customer.customerFirstname || "",
//         customerLastname: customer.customerLastname || "",
//         email: customer.email || "",
//         customerDateOfBirth: customer.customerDateOfBirth || "",
//         customerPhone: customer.customerPhone || "",
//         customerAlternativePhone: customer.customerAlternativePhone || "",
//         customerPrimaryAddressStreet:
//           customer.customerPrimaryAddressStreet || "",
//         customerPrimaryAddressCity: customer.customerPrimaryAddressCity || "",
//         customerPrimaryAddressPostalCode:
//           customer.customerPrimaryAddressPostalCode || "",
//         customerPrimaryAddressCountry:
//           customer.customerPrimaryAddressCountry || "",
//         customerBillingAddressStreet:
//           customer.customerBillingAddressStreet || "",
//         customerBillingAddressCity: customer.customerBillingAddressCity || "",
//         customerBillingAddressPostalCode:
//           customer.customerBillingAddressPostalCode || "",
//         customerBillingAddressCountry:
//           customer.customerBillingAddressCountry || "",
//         status: (customer.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
//         customerIdType: customer.customerIdType || "",
//         customerIdMaskedNumber: customer.customerIdMaskedNumber || "",
//         idIssuingCountry: customer.idIssuingCountry || "",
//         idExpirationDate: customer.idExpirationDate || "",
//         idVerificationStatus: customer.idVerificationStatus || "",
//       });

//       // Check if billing address is same as primary
//       if (
//         customer.customerBillingAddressStreet ===
//           customer.customerPrimaryAddressStreet &&
//         customer.customerBillingAddressCity ===
//           customer.customerPrimaryAddressCity &&
//         customer.customerBillingAddressPostalCode ===
//           customer.customerPrimaryAddressPostalCode &&
//         customer.customerBillingAddressCountry ===
//           customer.customerPrimaryAddressCountry
//       ) {
//         setIsSameAsPrimary(true);
//       }
//     }
//   }, [customer, form]);

//   // Handle form submission
//   const onSubmit = async (data: EditCustomerFormData) => {
//     try {
//       if (!customerId) {
//         toast.error("Customer ID is required");
//         return;
//       }

//       // Prepare update payload with only the fields we're updating
//       const updatePayload = {
//         customerId,
//         customerFirstname: data.customerFirstname,
//         customerLastname: data.customerLastname,
//         email: data.email,
//         customerDateOfBirth: data.customerDateOfBirth,
//         customerPhone: data.customerPhone,
//         customerAlternativePhone: data.customerAlternativePhone,
//         customerPrimaryAddressStreet: data.customerPrimaryAddressStreet,
//         customerPrimaryAddressCity: data.customerPrimaryAddressCity,
//         customerPrimaryAddressPostalCode: data.customerPrimaryAddressPostalCode,
//         customerPrimaryAddressCountry: data.customerPrimaryAddressCountry,
//         customerBillingAddressStreet: isSameAsPrimary
//           ? data.customerPrimaryAddressStreet
//           : data.customerBillingAddressStreet,
//         customerBillingAddressCity: isSameAsPrimary
//           ? data.customerPrimaryAddressCity
//           : data.customerBillingAddressCity,
//         customerBillingAddressPostalCode: isSameAsPrimary
//           ? data.customerPrimaryAddressPostalCode
//           : data.customerBillingAddressPostalCode,
//         customerBillingAddressCountry: isSameAsPrimary
//           ? data.customerPrimaryAddressCountry
//           : data.customerBillingAddressCountry,
//         status: data.status,
//       };

//       // Remove undefined fields
//       const cleanedPayload = Object.fromEntries(
//         Object.entries(updatePayload).filter(
//           ([_, value]) => value !== undefined && value !== ""
//         )
//       );

//       await updateCustomer(cleanedPayload).unwrap();
//       toast.success("Customer updated successfully");

//       // Navigate back to view page
//       navigate(`/admin/customers/${customerId}`);
//     } catch (error: any) {
//       console.error("Update error:", error);
//       toast.error(error?.data?.message || "Failed to update customer");
//     }
//   };

//   // Handle reset
//   const handleReset = () => {
//     if (customer) {
//       form.reset({
//         customerFirstname: customer.customerFirstname || "",
//         customerLastname: customer.customerLastname || "",
//         email: customer.email || "",
//         customerDateOfBirth: customer.customerDateOfBirth || "",
//         customerPhone: customer.customerPhone || "",
//         customerAlternativePhone: customer.customerAlternativePhone || "",
//         customerPrimaryAddressStreet:
//           customer.customerPrimaryAddressStreet || "",
//         customerPrimaryAddressCity: customer.customerPrimaryAddressCity || "",
//         customerPrimaryAddressPostalCode:
//           customer.customerPrimaryAddressPostalCode || "",
//         customerPrimaryAddressCountry:
//           customer.customerPrimaryAddressCountry || "",
//         customerBillingAddressStreet:
//           customer.customerBillingAddressStreet || "",
//         customerBillingAddressCity: customer.customerBillingAddressCity || "",
//         customerBillingAddressPostalCode:
//           customer.customerBillingAddressPostalCode || "",
//         customerBillingAddressCountry:
//           customer.customerBillingAddressCountry || "",
//         status: (customer.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
//         customerIdType: customer.customerIdType || "",
//         customerIdMaskedNumber: customer.customerIdMaskedNumber || "",
//         idIssuingCountry: customer.idIssuingCountry || "",
//         idExpirationDate: customer.idExpirationDate || "",
//         idVerificationStatus: customer.idVerificationStatus || "",
//       });
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return <CustomerEditSkeleton />;
//   }

//   // Error state
//   if (error || !customer) {
//     return (
//       <div className="container mx-auto py-8">
//         <div className="flex flex-col items-center justify-center h-64 space-y-4">
//           <AlertCircle className="h-12 w-12 text-red-500" />
//           <h2 className="text-2xl font-bold">Customer Not Found</h2>
//           <p className="text-gray-600">
//             The customer you're looking for doesn't exist.
//           </p>
//           <Button onClick={() => navigate(-1)}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3 bg-accent p-2 rounded-xl border">
//         <div className="flex items-center space-x-4">
//           <Button variant="outline" onClick={() => navigate(-1)}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
//             <p className="text-gray-600">
//               {customer.customerFirstname} {customer.customerLastname} • ID:{" "}
//               {customer.customerId}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Badge
//             variant={customer.status === "ACTIVE" ? "default" : "secondary"}
//           >
//             {customer.status}
//           </Badge>
//         </div>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <Tabs defaultValue="personal" className="space-y-6">
//             <TabsList>
//               <TabsTrigger value="personal">
//                 <User className="h-4 w-4 mr-2" />
//                 Personal Info
//               </TabsTrigger>
//               <TabsTrigger value="contact">
//                 <Phone className="h-4 w-4 mr-2" />
//                 Contact Info
//               </TabsTrigger>
//               <TabsTrigger value="government">
//                 <IdCard className="h-4 w-4 mr-2" />
//                 Government ID
//               </TabsTrigger>
//             </TabsList>

//             {/* Personal Information Tab */}
//             <TabsContent value="personal" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Personal Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* First Name */}
//                     <FormField
//                       control={form.control}
//                       name="customerFirstname"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>First Name *</FormLabel>
//                           <FormControl>
//                             <Input {...field} placeholder="Enter first name" />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     {/* Last Name */}
//                     <FormField
//                       control={form.control}
//                       name="customerLastname"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Last Name *</FormLabel>
//                           <FormControl>
//                             <Input {...field} placeholder="Enter last name" />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     {/* Email */}
//                     <div className="space-y-2 md:col-span-2">
//                       <FormField
//                         control={form.control}
//                         name="email"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Email *</FormLabel>
//                             <FormControl>
//                               <div className="flex items-center space-x-2">
//                                 <Mail className="h-4 w-4 text-gray-400" />
//                                 <Input
//                                   {...field}
//                                   type="email"
//                                   placeholder="customer@example.com"
//                                   className="flex-1"
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Date of Birth */}
//                     <div className="space-y-2">
//                       <FormField
//                         control={form.control}
//                         name="customerDateOfBirth"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Date of Birth</FormLabel>
//                             <FormControl>
//                               <div className="flex items-center space-x-2">
//                                 <Calendar className="h-4 w-4 text-gray-400" />
//                                 <Input
//                                   {...field}
//                                   type="date"
//                                   placeholder="YYYY-MM-DD"
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Status */}
//                     <div className="space-y-2">
//                       <FormField
//                         control={form.control}
//                         name="status"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Account Status</FormLabel>
//                             <Select
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectItem value="ACTIVE">Active</SelectItem>
//                                 <SelectItem value="INACTIVE">
//                                   Inactive
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Contact Information Tab */}
//             <TabsContent value="contact" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Phone className="h-5 w-5 mr-2" />
//                     Contact Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Phone */}
//                     <FormField
//                       control={form.control}
//                       name="customerPhone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Phone Number *</FormLabel>
//                           <FormControl>
//                             <div className="flex items-center space-x-2">
//                               <Phone className="h-4 w-4 text-gray-400" />
//                               <Input {...field} placeholder="+47 123 45 678" />
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     {/* Alternate Phone */}
//                     <FormField
//                       control={form.control}
//                       name="customerAlternativePhone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Alternate Phone</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               placeholder="Optional alternate phone"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <Separator />

//                   {/* Primary Address */}
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold flex items-center">
//                         <MapPin className="h-5 w-5 mr-2" />
//                         Primary Address
//                       </h3>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="customerPrimaryAddressStreet"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Street *</FormLabel>
//                             <FormControl>
//                               <Input {...field} placeholder="Street address" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="customerPrimaryAddressCity"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>City *</FormLabel>
//                             <FormControl>
//                               <Input {...field} placeholder="City" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="customerPrimaryAddressPostalCode"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Postal Code *</FormLabel>
//                             <FormControl>
//                               <Input {...field} placeholder="1234" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="customerPrimaryAddressCountry"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Country *</FormLabel>
//                             <FormControl>
//                               <Input {...field} placeholder="Norway" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Billing Address */}
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold flex items-center">
//                         <MapPin className="h-5 w-5 mr-2" />
//                         Billing Address
//                       </h3>
//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           checked={isSameAsPrimary}
//                           onCheckedChange={setIsSameAsPrimary}
//                           id="same-as-primary"
//                         />
//                         <Label htmlFor="same-as-primary">
//                           Same as primary address
//                         </Label>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="customerBillingAddressStreet"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Street</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 placeholder="Street address"
//                                 disabled={isSameAsPrimary}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="customerBillingAddressCity"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>City</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 placeholder="City"
//                                 disabled={isSameAsPrimary}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="customerBillingAddressPostalCode"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Postal Code</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 placeholder="1234"
//                                 disabled={isSameAsPrimary}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="customerBillingAddressCountry"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Country</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 placeholder="Norway"
//                                 disabled={isSameAsPrimary}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Government ID Tab */}
//             <TabsContent value="government" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <IdCard className="h-5 w-5 mr-2" />
//                     Government ID Information
//                     <Badge variant="outline" className="ml-2">
//                       Read Only
//                     </Badge>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* ID Type */}
//                     <div className="space-y-2">
//                       <Label>ID Type</Label>
//                       <Input
//                         value={customer.customerIdType || "Not available"}
//                         disabled
//                       />
//                     </div>

//                     {/* ID Number */}
//                     <div className="space-y-2">
//                       <Label>ID Number</Label>
//                       <Input
//                         value={
//                           customer.customerIdMaskedNumber || "Not available"
//                         }
//                         disabled
//                       />
//                     </div>

//                     {/* Issuing Country */}
//                     <div className="space-y-2">
//                       <Label>Issuing Country</Label>
//                       <Input
//                         value={customer.idIssuingCountry || "Not available"}
//                         disabled
//                       />
//                     </div>

//                     {/* Expiration Date */}
//                     <div className="space-y-2">
//                       <Label>Expiration Date</Label>
//                       <Input
//                         type="date"
//                         value={customer.idExpirationDate?.split("T")[0] || ""}
//                         disabled
//                       />
//                     </div>

//                     {/* Verification Status */}
//                     <div className="space-y-2 md:col-span-2">
//                       <Label>Verification Status</Label>
//                       <Select
//                         value={customer.idVerificationStatus || "PENDING"}
//                         disabled
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="PENDING">Pending</SelectItem>
//                           <SelectItem value="VERIFIED">Verified</SelectItem>
//                           <SelectItem value="EXPIRED">Expired</SelectItem>
//                           <SelectItem value="REJECTED">Rejected</SelectItem>
//                           <SelectItem value="SUSPENDED">Suspended</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
//                     <p className="text-sm text-amber-800">
//                       <AlertCircle className="h-4 w-4 inline mr-2" />
//                       Government ID information cannot be edited here. Please
//                       contact the administrator for ID updates.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>

//           {/* Form Actions */}
//           <Card>
//             <CardFooter className="flex justify-between px-8 py-4 bg-gray-50">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleReset}
//                 disabled={!form.formState.isDirty || isUpdating}
//               >
//                 <RotateCcw className="h-4 w-4 mr-2" />
//                 Reset Changes
//               </Button>

//               <div className="flex space-x-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate(-1)}
//                   disabled={isUpdating}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={!form.formState.isDirty || isUpdating}
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   {isUpdating ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div>
//             </CardFooter>
//           </Card>
//         </form>
//       </Form>
//     </div>
//   );
// };

// // Skeleton Loader
// const CustomerEditSkeleton = () => {
//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Skeleton className="h-10 w-24" />
//           <div>
//             <Skeleton className="h-8 w-48 mb-2" />
//             <Skeleton className="h-4 w-32" />
//           </div>
//         </div>
//         <Skeleton className="h-6 w-20" />
//       </div>

//       <div className="space-y-6">
//         <Skeleton className="h-10 w-64" />

//         <Card>
//           <CardHeader>
//             <Skeleton className="h-6 w-40" />
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <Skeleton className="h-4 w-24" />
//                   <Skeleton className="h-10 w-full" />
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex justify-between">
//           <Skeleton className="h-10 w-32" />
//           <div className="flex space-x-2">
//             <Skeleton className="h-10 w-24" />
//             <Skeleton className="h-10 w-24" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerEdit;

// src/pages/admin/customers/CustomerEdit.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Icons
import {
  ArrowLeft,
  Save,
  RotateCcw,
  User,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Calendar,
  AlertCircle,
} from "lucide-react";

// API
import {
  useGetCustomerByUserIdsQuery,
  useUpdateCustomerMutation,
  type UpdateCustomerRequest,
} from "@/services/AdminSlice";

// Validation Schema
const editCustomerSchema = z.object({
  // Personal Information
  customerFirstname: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  customerLastname: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.string().email("Invalid email address"),
  customerDateOfBirth: z.string().optional(),

  // Contact Information
  customerPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone number"),
  customerAlternativePhone: z.string().optional(),

  // Primary Address
  customerPrimaryAddressStreet: z.string().min(1, "Street address is required"),
  customerPrimaryAddressCity: z.string().min(1, "City is required"),
  customerPrimaryAddressPostalCode: z
    .string()
    .min(1, "Postal code is required"),
  customerPrimaryAddressCountry: z.string().min(1, "Country is required"),

  // Billing Address
  customerBillingAddressStreet: z.string().optional(),
  customerBillingAddressCity: z.string().optional(),
  customerBillingAddressPostalCode: z.string().optional(),
  customerBillingAddressCountry: z.string().optional(),

  // Status
  status: z.enum(["ACTIVE", "INACTIVE"]),

  // Government ID - Read only usually
  customerIdType: z.string().optional(),
  customerIdMaskedNumber: z.string().optional(),
  idIssuingCountry: z.string().optional(),
  idExpirationDate: z.string().optional(),
  idVerificationStatus: z.string().optional(),
});

type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();

  // State
  const [isSameAsPrimary, setIsSameAsPrimary] = useState(false);

  // API Hooks
  const {
    data: customer,
    isLoading,
    error,
  } = useGetCustomerByUserIdsQuery(customerId || "", {
    skip: !customerId,
  });

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  // Form
  const form = useForm<EditCustomerFormData>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      status: "ACTIVE",
      customerFirstname: "",
      customerLastname: "",
      email: "",
      customerDateOfBirth: "",
      customerPhone: "",
      customerAlternativePhone: "",
      customerPrimaryAddressStreet: "",
      customerPrimaryAddressCity: "",
      customerPrimaryAddressPostalCode: "",
      customerPrimaryAddressCountry: "",
      customerBillingAddressStreet: "",
      customerBillingAddressCity: "",
      customerBillingAddressPostalCode: "",
      customerBillingAddressCountry: "",
      customerIdType: "",
      customerIdMaskedNumber: "",
      idIssuingCountry: "",
      idExpirationDate: "",
      idVerificationStatus: "",
    },
  });

  // Watch billing address fields to enable/disable sync
  const primaryAddressStreet = form.watch("customerPrimaryAddressStreet");
  const primaryAddressCity = form.watch("customerPrimaryAddressCity");
  const primaryAddressPostalCode = form.watch(
    "customerPrimaryAddressPostalCode"
  );
  const primaryAddressCountry = form.watch("customerPrimaryAddressCountry");

  // Sync billing address with primary address
  useEffect(() => {
    if (isSameAsPrimary) {
      form.setValue("customerBillingAddressStreet", primaryAddressStreet, {
        shouldDirty: true,
      });
      form.setValue("customerBillingAddressCity", primaryAddressCity, {
        shouldDirty: true,
      });
      form.setValue(
        "customerBillingAddressPostalCode",
        primaryAddressPostalCode,
        {
          shouldDirty: true,
        }
      );
      form.setValue("customerBillingAddressCountry", primaryAddressCountry, {
        shouldDirty: true,
      });
    }
  }, [
    isSameAsPrimary,
    primaryAddressStreet,
    primaryAddressCity,
    primaryAddressPostalCode,
    primaryAddressCountry,
    form,
  ]);

  // Reset form when customer data loads
  useEffect(() => {
    if (customer) {
      form.reset({
        customerFirstname: customer.customerFirstname || "",
        customerLastname: customer.customerLastname || "",
        email: customer.email || "",
        customerDateOfBirth: customer.customerDateOfBirth || "",
        customerPhone: customer.customerPhone || "",
        customerAlternativePhone: customer.customerAlternativePhone || "",
        customerPrimaryAddressStreet:
          customer.customerPrimaryAddressStreet || "",
        customerPrimaryAddressCity: customer.customerPrimaryAddressCity || "",
        customerPrimaryAddressPostalCode:
          customer.customerPrimaryAddressPostalCode || "",
        customerPrimaryAddressCountry:
          customer.customerPrimaryAddressCountry || "",
        customerBillingAddressStreet:
          customer.customerBillingAddressStreet || "",
        customerBillingAddressCity: customer.customerBillingAddressCity || "",
        customerBillingAddressPostalCode:
          customer.customerBillingAddressPostalCode || "",
        customerBillingAddressCountry:
          customer.customerBillingAddressCountry || "",
        status: (customer.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
        customerIdType: customer.customerIdType || "",
        customerIdMaskedNumber: customer.customerIdMaskedNumber || "",
        idIssuingCountry: customer.idIssuingCountry || "",
        idExpirationDate: customer.idExpirationDate || "",
        idVerificationStatus: customer.idVerificationStatus || "",
      });

      // Check if billing address is same as primary
      if (
        customer.customerBillingAddressStreet ===
          customer.customerPrimaryAddressStreet &&
        customer.customerBillingAddressCity ===
          customer.customerPrimaryAddressCity &&
        customer.customerBillingAddressPostalCode ===
          customer.customerPrimaryAddressPostalCode &&
        customer.customerBillingAddressCountry ===
          customer.customerPrimaryAddressCountry
      ) {
        setIsSameAsPrimary(true);
      }
    }
  }, [customer, form]);

  // Handle form submission
  const onSubmit = async (data: EditCustomerFormData) => {
    try {
      if (!customerId) {
        toast.error("Customer ID is required");
        return;
      }

      // Prepare update payload with only the fields we're updating
      const updatePayload: UpdateCustomerRequest = {
        customerId,
        customerFirstname: data.customerFirstname,
        customerLastname: data.customerLastname,
        email: data.email,
        status: data.status,
        customerPhone: data.customerPhone,
      };

      // Add optional fields only if they have values
      if (data.customerDateOfBirth) {
        updatePayload.customerDateOfBirth = data.customerDateOfBirth;
      }

      if (data.customerAlternativePhone) {
        updatePayload.customerAlternativePhone = data.customerAlternativePhone;
      }

      // Primary address fields
      updatePayload.customerPrimaryAddressStreet =
        data.customerPrimaryAddressStreet;
      updatePayload.customerPrimaryAddressCity =
        data.customerPrimaryAddressCity;
      updatePayload.customerPrimaryAddressPostalCode =
        data.customerPrimaryAddressPostalCode;
      updatePayload.customerPrimaryAddressCountry =
        data.customerPrimaryAddressCountry;

      // Billing address
      if (isSameAsPrimary) {
        updatePayload.customerBillingAddressStreet =
          data.customerPrimaryAddressStreet;
        updatePayload.customerBillingAddressCity =
          data.customerPrimaryAddressCity;
        updatePayload.customerBillingAddressPostalCode =
          data.customerPrimaryAddressPostalCode;
        updatePayload.customerBillingAddressCountry =
          data.customerPrimaryAddressCountry;
      } else {
        if (data.customerBillingAddressStreet) {
          updatePayload.customerBillingAddressStreet =
            data.customerBillingAddressStreet;
        }
        if (data.customerBillingAddressCity) {
          updatePayload.customerBillingAddressCity =
            data.customerBillingAddressCity;
        }
        if (data.customerBillingAddressPostalCode) {
          updatePayload.customerBillingAddressPostalCode =
            data.customerBillingAddressPostalCode;
        }
        if (data.customerBillingAddressCountry) {
          updatePayload.customerBillingAddressCountry =
            data.customerBillingAddressCountry;
        }
      }

      console.log("Sending update payload:", updatePayload);

      await updateCustomer(updatePayload).unwrap();
      toast.success("Customer updated successfully");

      // Navigate back to view page
      navigate(`/admin/customers/${customerId}`);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update customer");
    }
  };

  // Handle reset
  const handleReset = () => {
    if (customer) {
      form.reset({
        customerFirstname: customer.customerFirstname || "",
        customerLastname: customer.customerLastname || "",
        email: customer.email || "",
        customerDateOfBirth: customer.customerDateOfBirth || "",
        customerPhone: customer.customerPhone || "",
        customerAlternativePhone: customer.customerAlternativePhone || "",
        customerPrimaryAddressStreet:
          customer.customerPrimaryAddressStreet || "",
        customerPrimaryAddressCity: customer.customerPrimaryAddressCity || "",
        customerPrimaryAddressPostalCode:
          customer.customerPrimaryAddressPostalCode || "",
        customerPrimaryAddressCountry:
          customer.customerPrimaryAddressCountry || "",
        customerBillingAddressStreet:
          customer.customerBillingAddressStreet || "",
        customerBillingAddressCity: customer.customerBillingAddressCity || "",
        customerBillingAddressPostalCode:
          customer.customerBillingAddressPostalCode || "",
        customerBillingAddressCountry:
          customer.customerBillingAddressCountry || "",
        status: (customer.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
        customerIdType: customer.customerIdType || "",
        customerIdMaskedNumber: customer.customerIdMaskedNumber || "",
        idIssuingCountry: customer.idIssuingCountry || "",
        idExpirationDate: customer.idExpirationDate || "",
        idVerificationStatus: customer.idVerificationStatus || "",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return <CustomerEditSkeleton />;
  }

  // Error state
  if (error || !customer) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold">Customer Not Found</h2>
          <p className="text-gray-600">
            The customer you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 bg-accent p-2 rounded-xl border">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
            <p className="text-gray-600">
              {customer.customerFirstname} {customer.customerLastname} • ID:{" "}
              {customer.customerId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={customer.status === "ACTIVE" ? "default" : "secondary"}
          >
            {customer.status}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone className="h-4 w-4 mr-2" />
                Contact Info
              </TabsTrigger>
              <TabsTrigger value="government">
                <IdCard className="h-4 w-4 mr-2" />
                Government ID
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="customerFirstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter first name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="customerLastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter last name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="customer@example.com"
                                  className="flex-1"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="customerDateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type="date"
                                  placeholder="YYYY-MM-DD"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <Input {...field} placeholder="+47 123 45 678" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alternate Phone */}
                    <FormField
                      control={form.control}
                      name="customerAlternativePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Optional alternate phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Primary Address */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Primary Address
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerPrimaryAddressStreet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Street address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPrimaryAddressCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="City" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPrimaryAddressPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1234" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPrimaryAddressCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Norway" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Billing Address
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isSameAsPrimary}
                          onCheckedChange={setIsSameAsPrimary}
                          id="same-as-primary"
                        />
                        <Label htmlFor="same-as-primary">
                          Same as primary address
                        </Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerBillingAddressStreet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Street address"
                                disabled={isSameAsPrimary}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerBillingAddressCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="City"
                                disabled={isSameAsPrimary}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerBillingAddressPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="1234"
                                disabled={isSameAsPrimary}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerBillingAddressCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Norway"
                                disabled={isSameAsPrimary}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Government ID Tab */}
            <TabsContent value="government" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <IdCard className="h-5 w-5 mr-2" />
                    Government ID Information
                    <Badge variant="outline" className="ml-2">
                      Read Only
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ID Type */}
                    <div className="space-y-2">
                      <Label>ID Type</Label>
                      <Input
                        value={customer.customerIdType || "Not available"}
                        disabled
                      />
                    </div>

                    {/* ID Number */}
                    <div className="space-y-2">
                      <Label>ID Number</Label>
                      <Input
                        value={
                          customer.customerIdMaskedNumber || "Not available"
                        }
                        disabled
                      />
                    </div>

                    {/* Issuing Country */}
                    <div className="space-y-2">
                      <Label>Issuing Country</Label>
                      <Input
                        value={customer.idIssuingCountry || "Not available"}
                        disabled
                      />
                    </div>

                    {/* Expiration Date */}
                    <div className="space-y-2">
                      <Label>Expiration Date</Label>
                      <Input
                        type="date"
                        value={customer.idExpirationDate?.split("T")[0] || ""}
                        disabled
                      />
                    </div>

                    {/* Verification Status */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Verification Status</Label>
                      <Select
                        value={customer.idVerificationStatus || "PENDING"}
                        disabled
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="VERIFIED">Verified</SelectItem>
                          <SelectItem value="EXPIRED">Expired</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-amber-800">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      Government ID information cannot be edited here. Please
                      contact the administrator for ID updates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <Card>
            <CardFooter className="flex justify-between px-8 py-4 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!form.formState.isDirty || isUpdating}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Changes
              </Button>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isDirty || isUpdating}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

// Skeleton Loader
const CustomerEditSkeleton = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;
