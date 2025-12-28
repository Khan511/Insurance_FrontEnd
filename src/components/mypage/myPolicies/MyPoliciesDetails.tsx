// import { useGetPolicyDetailsQuery } from "@/services/InsurancePolicySlice";
// import { useNavigate, useParams } from "react-router";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Calendar,
//   DollarSign,
//   User,
//   Shield,
//   FileText,
//   CreditCard,
//   Users,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   MapPin,
//   Tag,
//   Briefcase,
//   Globe,
//   FileCheck,
//   Target,
//   Settings,
//   History,
//   Trash2,
// } from "lucide-react";

// // Define the comprehensive TypeScript interfaces for the policy data
// interface Category {
//   id: number;
//   name: string;
//   description: string;
// }

// interface CoverageLimit {
//   amount: number;
//   currency: string;
// }

// interface CoverageDetail {
//   coverageType: string;
//   description: string;
//   coverageLimit: CoverageLimit;
//   deductible: CoverageLimit | null;
// }

// interface EligibilityRules {
//   vehicleAge?: string;
//   licenseType?: string;
//   minAge?: string;
//   maxAge?: string;
//   healthCheck?: string;
// }

// interface Translation {
//   displayName: string;
//   description: string;
// }

// interface Translations {
//   da_DK: Translation;
//   nb_NO: Translation;
//   sv_SE: Translation;
// }

// interface ValidityPeriod {
//   effectiveDate: [number, number, number];
//   expirationDate: [number, number, number];
//   active: boolean;
//   expired: boolean;
// }

// interface PaymentSchedule {
//   id: number;
//   dueDate: string;
//   dueAmount: number;
//   status: string;
//   paidDate: string | null;
// }

// interface Beneficiary {
//   name: string;
//   relationship: string;
//   dateOfBirth: string;
// }

// interface PolicyDetails {
//   // Basic Information
//   id: number;
//   policyNumber: string;
//   policyHolderId: number;
//   policyHolderName: string;
//   policyHolderEmail: string;
//   userId: string;

//   // Product Information
//   productCode: string;
//   productId: number;
//   productType: string;
//   displayName: string;
//   description: string;
//   category: Category;

//   // Financial Information
//   premium: number;
//   currency: string;
//   paymentFrequency: string;
//   paymentSchedules: PaymentSchedule[];

//   // Coverage & Eligibility
//   coverageDetails: CoverageDetail[];
//   eligibilityRules: EligibilityRules;
//   allowedClaimTypes: string[];

//   // Validity & Status
//   validityPeriod: ValidityPeriod;
//   status: string;
//   statusChangeNotes: string;

//   // Geographical & Audience
//   regions: string[];
//   targetAudience: string[];

//   // Translations
//   translations: Translations;

//   // Beneficiaries
//   beneficiaries: Beneficiary[];

//   // Cancellation Info
//   cancellationDate: [number, number, number] | null;
//   cancellationReason: string | null;
//   cancelledBy: string | null;

//   // Audit Trail
//   createdAt: string | [number, number, number, number, number, number, number];
//   createdBy: string;
//   updatedAt: string | [number, number, number, number, number, number, number];
//   updatedBy: string;

//   // Additional Fields
//   calculationConfig: any;
// }

// export default function MyPoliciesDetails() {
//   const navigate = useNavigate();
//   const { policyId } = useParams();

//   const { data: policyDetails, isLoading } = useGetPolicyDetailsQuery(
//     policyId || "",
//     {
//       skip: !policyId,
//     }
//   );

//   console.log("PolicyDetails: ", policyDetails);

//   // Helper function to convert array date to Date object
//   const parseArrayDate = (dateArray: any): Date | null => {
//     if (!dateArray || !Array.isArray(dateArray)) return null;

//     if (dateArray.length >= 3) {
//       // [year, month, day]
//       return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
//     } else if (dateArray.length >= 7) {
//       // [year, month, day, hour, minute, second, millisecond]
//       return new Date(
//         dateArray[0],
//         dateArray[1] - 1,
//         dateArray[2],
//         dateArray[3],
//         dateArray[4],
//         dateArray[5],
//         dateArray[6]
//       );
//     }
//     return null;
//   };

//   const formatDate = (
//     dateInput?: string | Date | [number, ...number[]] | null
//   ): string => {
//     if (!dateInput) return "Date not available";

//     let date: Date;

//     if (Array.isArray(dateInput)) {
//       const parsedDate = parseArrayDate(dateInput);
//       if (!parsedDate) return "Invalid date";
//       date = parsedDate;
//     } else {
//       date = new Date(dateInput);
//     }

//     if (isNaN(date.getTime())) return "Invalid date";

//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour:
//         dateInput && typeof dateInput !== "string" && dateInput.length > 3
//           ? "2-digit"
//           : undefined,
//       minute:
//         dateInput && typeof dateInput !== "string" && dateInput.length > 3
//           ? "2-digit"
//           : undefined,
//     });
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       ACTIVE: {
//         color: "bg-green-100 text-green-800 border-green-200",
//         label: "Active",
//         icon: <CheckCircle className="h-3 w-3 mr-1" />,
//       },
//       PENDING: {
//         color: "bg-yellow-100 text-yellow-800 border-yellow-200",
//         label: "Pending",
//         icon: <Clock className="h-3 w-3 mr-1" />,
//       },
//       INACTIVE: {
//         color: "bg-red-100 text-red-800 border-red-200",
//         label: "Inactive",
//         icon: <XCircle className="h-3 w-3 mr-1" />,
//       },
//       EXPIRED: {
//         color: "bg-gray-100 text-gray-800 border-gray-200",
//         label: "Expired",
//         icon: <AlertCircle className="h-3 w-3 mr-1" />,
//       },
//       CANCELLED: {
//         color: "bg-gray-100 text-gray-800 border-gray-200",
//         label: "Cancelled",
//         icon: <Trash2 className="h-3 w-3 mr-1" />,
//       },
//     };

//     const config =
//       statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
//     return (
//       <Badge
//         variant="outline"
//         className={`${config.color} flex items-center px-2 py-1`}
//       >
//         {config.icon}
//         {config.label}
//       </Badge>
//     );
//   };

//   const getProductTypeIcon = (type: string) => {
//     const icons: Record<string, React.ReactNode> = {
//       LIFE: <Shield className="h-4 w-4 text-blue-600" />,
//       AUTO: <Briefcase className="h-4 w-4 text-green-600" />,
//       PROPERTY: <Shield className="h-4 w-4 text-orange-600" />,
//     };
//     return icons[type] || <FileText className="h-4 w-4 text-gray-600" />;
//   };

//   // Get payment frequency display
//   const getPaymentFrequencyDisplay = (frequency: string) => {
//     const frequencyMap: Record<string, string> = {
//       MONTHLY: "Monthly",
//       QUARTERLY: "Quarterly",
//       ANNUAL: "Annual",
//     };
//     return frequencyMap[frequency] || frequency;
//   };

//   // Get next payment schedule
//   const getNextPayment = () => {
//     if (
//       !policyDetails?.paymentSchedules ||
//       policyDetails.paymentSchedules.length === 0
//     ) {
//       return null;
//     }

//     const pendingPayments = policyDetails.paymentSchedules
//       .filter((schedule) => schedule.status === "PENDING")
//       .sort(
//         (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
//       );

//     return pendingPayments[0] || null;
//   };

//   const nextPayment = getNextPayment();

//   console.log("NextPayment in my Policy details: ", nextPayment);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading policy details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!policyDetails) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
//           <h2 className="mt-4 text-xl font-semibold text-gray-900">
//             Policy Not Found
//           </h2>
//           <p className="mt-2 text-gray-600">
//             The policy you're looking for doesn't exist.
//           </p>
//           <Button onClick={() => navigate(-1)} className="mt-4">
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <Button
//             variant="outline"
//             onClick={() => navigate(-1)}
//             className="mb-4 flex items-center gap-2"
//           >
//             ← Back to My Policies
//           </Button>

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {policyDetails.displayName}
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Policy Number:{" "}
//                 <span className="font-semibold">
//                   {policyDetails.policyNumber}
//                 </span>
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               {getStatusBadge(policyDetails.status)}
//               {policyDetails.cancellationDate && (
//                 <Badge
//                   variant="outline"
//                   className="bg-red-100 text-red-800 border-red-200"
//                 >
//                   Cancelled on {formatDate(policyDetails.cancellationDate)}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Main Policy Info */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Policy Overview Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   {getProductTypeIcon(policyDetails.productType)}
//                   <h2 className="text-xl font-semibold">Policy Overview</h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Product Type:</span>
//                       <span className="font-medium">
//                         {policyDetails.productType}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Product Code:</span>
//                       <span className="font-medium">
//                         {policyDetails.productCode}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Category:</span>
//                       <span className="font-medium">
//                         {policyDetails.category.name}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Policy Holder:</span>
//                       <span className="font-medium">
//                         {policyDetails.policyHolderName}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">
//                         {policyDetails.policyHolderEmail}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Policy Holder ID:</span>
//                       <span className="font-medium">
//                         {policyDetails.policyHolderId}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-4 border-t">
//                   <p className="text-gray-700">{policyDetails.description}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Coverage Details Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Shield className="h-5 w-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Coverage Details</h2>
//                 </div>

//                 <div className="space-y-4">
//                   {policyDetails.coverageDetails?.map((coverage, index) => (
//                     <div key={index} className="border rounded-lg p-4">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="font-semibold text-lg">
//                           {coverage.coverageType}
//                         </h3>
//                         <Badge
//                           variant="outline"
//                           className="bg-blue-50 text-blue-700"
//                         >
//                           {coverage.coverageLimit.amount.toLocaleString()}{" "}
//                           {coverage.coverageLimit.currency}
//                         </Badge>
//                       </div>
//                       <p className="text-gray-600 text-sm mb-3">
//                         {coverage.description}
//                       </p>
//                       {coverage.deductible && (
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                           <span>Deductible:</span>
//                           <span className="font-medium">
//                             {coverage.deductible.amount}{" "}
//                             {coverage.deductible.currency}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment Information Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <CreditCard className="h-5 w-5 text-green-600" />
//                   <h2 className="text-xl font-semibold">Payment Information</h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Total Premium:</span>
//                       <div className="flex items-center gap-1">
//                         {/* <DollarSign className="h-4 w-4 text-green-600" /> */}
//                         <span className="font-bold text-lg">
//                           {policyDetails.premium} {policyDetails.currency}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Payment Frequency:</span>
//                       <Badge variant="outline">
//                         {getPaymentFrequencyDisplay(
//                           policyDetails.paymentFrequency
//                         )}
//                       </Badge>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Currency:</span>
//                       <span className="font-medium">
//                         {policyDetails.currency}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     {nextPayment && (
//                       <>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-600">Next Payment:</span>
//                           <div className="text-right">
//                             <div className="font-bold">
//                               {nextPayment?.dueAmount} {policyDetails.currency}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               Due: {formatDate(nextPayment?.dueDate)}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-600">Payment Status:</span>
//                           <Badge
//                             variant="outline"
//                             className={
//                               nextPayment?.status === "OVERDUE"
//                                 ? "bg-red-100 text-red-800 border-red-200"
//                                 : "bg-green-100 text-green-800 border-green-200"
//                             }
//                           >
//                             {nextPayment?.status}
//                           </Badge>
//                         </div>
//                       </>
//                     )}

//                     {policyDetails.paymentSchedules &&
//                       policyDetails.paymentSchedules.length > 0 && (
//                         <div className="pt-3 border-t">
//                           <div className="flex items-center justify-between">
//                             <span className="text-gray-600">
//                               Total Installments:
//                             </span>
//                             <span className="font-medium">
//                               {policyDetails.paymentSchedules.length}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Validity Period Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Calendar className="h-5 w-5 text-purple-600" />
//                   <h2 className="text-xl font-semibold">Validity Period</h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Effective Date:</span>
//                       <div className="text-right">
//                         <span className="font-medium">
//                           {formatDate(
//                             policyDetails.validityPeriod.effectiveDate
//                           )}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Expiration Date:</span>
//                       <div className="text-right">
//                         <span className="font-medium">
//                           {formatDate(
//                             policyDetails.validityPeriod.expirationDate
//                           )}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Policy Active:</span>
//                       <Badge
//                         variant="outline"
//                         className={
//                           policyDetails.validityPeriod.active
//                             ? "bg-green-100 text-green-800 border-green-200"
//                             : "bg-red-100 text-red-800 border-red-200"
//                         }
//                       >
//                         {policyDetails.validityPeriod.active ? "Yes" : "No"}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Policy Expired:</span>
//                       <Badge
//                         variant="outline"
//                         className={
//                           policyDetails.validityPeriod.expired
//                             ? "bg-red-100 text-red-800 border-red-200"
//                             : "bg-green-100 text-green-800 border-green-200"
//                         }
//                       >
//                         {policyDetails.validityPeriod.expired ? "Yes" : "No"}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Side Info */}
//           <div className="space-y-6">
//             {/* Eligibility Rules Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Target className="h-5 w-5 text-orange-600" />
//                   <h2 className="text-xl font-semibold">Eligibility Rules</h2>
//                 </div>

//                 <div className="space-y-3">
//                   {policyDetails.eligibilityRules.minAge && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Minimum Age:</span>
//                       <span className="font-medium">
//                         {policyDetails.eligibilityRules.minAge} years
//                       </span>
//                     </div>
//                   )}
//                   {policyDetails.eligibilityRules.maxAge && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Maximum Age:</span>
//                       <span className="font-medium">
//                         {policyDetails.eligibilityRules.maxAge} years
//                       </span>
//                     </div>
//                   )}
//                   {policyDetails.eligibilityRules.vehicleAge && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Vehicle Age:</span>
//                       <span className="font-medium">
//                         {policyDetails.eligibilityRules.vehicleAge} years
//                       </span>
//                     </div>
//                   )}
//                   {policyDetails.eligibilityRules.licenseType && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">License Type:</span>
//                       <Badge variant="outline">
//                         {policyDetails.eligibilityRules.licenseType.replace(
//                           /_/g,
//                           " "
//                         )}
//                       </Badge>
//                     </div>
//                   )}
//                   {policyDetails.eligibilityRules.healthCheck && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Health Check:</span>
//                       <Badge variant="outline">
//                         {policyDetails.eligibilityRules.healthCheck}
//                       </Badge>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Regions & Audience Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Globe className="h-5 w-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Coverage Regions</h2>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex flex-wrap gap-2">
//                     {policyDetails.regions?.map((region, index) => (
//                       <Badge
//                         key={index}
//                         variant="secondary"
//                         className="bg-blue-50 text-blue-700"
//                       >
//                         <MapPin className="h-3 w-3 mr-1" />
//                         {region}
//                       </Badge>
//                     ))}
//                   </div>

//                   {policyDetails.targetAudience &&
//                     policyDetails.targetAudience.length > 0 && (
//                       <>
//                         <div className="pt-4 border-t">
//                           <div className="flex items-center gap-2 mb-2">
//                             <Users className="h-4 w-4 text-green-600" />
//                             <span className="font-medium">Target Audience</span>
//                           </div>
//                           <div className="flex flex-wrap gap-2">
//                             {policyDetails.targetAudience.map(
//                               (audience, index) => (
//                                 <Badge
//                                   key={index}
//                                   variant="outline"
//                                   className="bg-green-50 text-green-700"
//                                 >
//                                   {audience}
//                                 </Badge>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       </>
//                     )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Allowed Claim Types Card */}
//             {policyDetails.allowedClaimTypes &&
//               policyDetails.allowedClaimTypes.length > 0 && (
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3 mb-4">
//                       <FileCheck className="h-5 w-5 text-purple-600" />
//                       <h2 className="text-xl font-semibold">
//                         Allowed Documents
//                       </h2>
//                     </div>

//                     <div className="space-y-2">
//                       {policyDetails.allowedClaimTypes.map(
//                         (claimType, index) => (
//                           <div key={index} className="flex items-center gap-2">
//                             <div className="h-2 w-2 rounded-full bg-purple-500"></div>
//                             <span className="text-sm">
//                               {claimType.replace(/_/g, " ")}
//                             </span>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//             {/* Beneficiaries Card */}
//             {policyDetails.beneficiaries &&
//               policyDetails.beneficiaries.length > 0 && (
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3 mb-4">
//                       <Users className="h-5 w-5 text-red-600" />
//                       <h2 className="text-xl font-semibold">Beneficiaries</h2>
//                     </div>

//                     <div className="space-y-3">
//                       {policyDetails.beneficiaries.map((beneficiary, index) => (
//                         <div key={index} className="border rounded-lg p-3">
//                           <div className="flex items-center justify-between mb-2">
//                             <div className="flex items-center gap-2">
//                               <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
//                                 <User className="h-4 w-4 text-red-600" />
//                               </div>
//                               <span className="font-medium">
//                                 {beneficiary.name}
//                               </span>
//                             </div>
//                             <Badge variant="outline">
//                               {beneficiary.relationship}
//                             </Badge>
//                           </div>
//                           {beneficiary.dateOfBirth && (
//                             <div className="text-sm text-gray-500">
//                               Date of Birth:{" "}
//                               {formatDate(beneficiary.dateOfBirth)}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//             {/* Cancellation Details Card */}
//             {policyDetails.cancellationDate && (
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Trash2 className="h-5 w-5 text-red-600" />
//                     <h2 className="text-xl font-semibold">
//                       Cancellation Details
//                     </h2>
//                   </div>

//                   <div className="space-y-3">
//                     <div>
//                       <div className="text-sm text-gray-600 mb-1">
//                         Cancellation Date
//                       </div>
//                       <div className="font-medium">
//                         {formatDate(policyDetails.cancellationDate)}
//                       </div>
//                     </div>

//                     <div>
//                       <div className="text-sm text-gray-600 mb-1">
//                         Cancelled By
//                       </div>
//                       <div className="font-medium">
//                         {policyDetails.cancelledBy}
//                       </div>
//                     </div>

//                     {policyDetails.cancellationReason && (
//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">Reason</div>
//                         <div className="text-sm bg-red-50 p-3 rounded border border-red-200">
//                           {policyDetails.cancellationReason}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Audit Trail Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <History className="h-5 w-5 text-gray-600" />
//                   <h2 className="text-xl font-semibold">Audit Trail</h2>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Created By:</span>
//                     <span className="text-sm font-medium">
//                       {policyDetails.createdBy}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Created At:</span>
//                     <span className="text-sm">
//                       {formatDate(policyDetails.createdAt)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">
//                       Last Updated By:
//                     </span>
//                     <span className="text-sm font-medium">
//                       {policyDetails.updatedBy}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">
//                       Last Updated At:
//                     </span>
//                     <span className="text-sm">
//                       {formatDate(policyDetails.updatedAt)}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Translations Section - Full Width */}
//         {policyDetails.translations && (
//           <Card className="mt-6">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <Globe className="h-5 w-5 text-indigo-600" />
//                 <h2 className="text-xl font-semibold">Regional Translations</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {Object.entries(policyDetails.translations).map(
//                   ([locale, translation]) => (
//                     <div key={locale} className="border rounded-lg p-4">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Tag className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-700 uppercase">
//                           {locale}
//                         </span>
//                       </div>
//                       <h3 className="font-semibold text-gray-900 mb-2">
//                         {translation.displayName}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {translation.description}
//                       </p>
//                     </div>
//                   )
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Status Change Notes */}
//         {policyDetails.statusChangeNotes && (
//           <Card className="mt-6">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <Settings className="h-5 w-5 text-yellow-600" />
//                 <h2 className="text-xl font-semibold">Status Change Notes</h2>
//               </div>

//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <p className="text-gray-700">
//                   {policyDetails.statusChangeNotes}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

import { useGetPolicyDetailsQuery } from "@/services/InsurancePolicySlice";
import { useNavigate, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  User,
  Shield,
  FileText,
  CreditCard,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Tag,
  Briefcase,
  Globe,
  FileCheck,
  Target,
  Settings,
  History,
  Trash2,
  Pause,
  Zap,
  AlertTriangle,
} from "lucide-react";

// Define the comprehensive TypeScript interfaces for the policy data
interface Category {
  id: number;
  name: string;
  description: string;
}

interface CoverageLimit {
  amount: number;
  currency: string;
}

interface CoverageDetail {
  coverageType: string;
  description: string;
  coverageLimit: CoverageLimit;
  deductible: CoverageLimit | null;
}

interface EligibilityRules {
  vehicleAge?: string;
  licenseType?: string;
  minAge?: string;
  maxAge?: string;
  healthCheck?: string;
}

interface Translation {
  displayName: string;
  description: string;
}

interface Translations {
  da_DK: Translation;
  nb_NO: Translation;
  sv_SE: Translation;
}

interface ValidityPeriod {
  effectiveDate: [number, number, number];
  expirationDate: [number, number, number];
  active: boolean;
  expired: boolean;
}

interface PaymentSchedule {
  id: number;
  dueDate: string;
  dueAmount: number;
  status: string;
  paidDate: string | null;
  cancellationDate?: string | null;
  cancelledBy?: string | null;
}

interface Beneficiary {
  name: string;
  relationship: string;
  dateOfBirth: string;
}

interface PolicyDetails {
  // Basic Information
  id: number;
  policyNumber: string;
  policyHolderId: number;
  policyHolderName: string;
  policyHolderEmail: string;
  userId: string;

  // Product Information
  productCode: string;
  productId: number;
  productType: string;
  displayName: string;
  description: string;
  category: Category;

  // Financial Information
  premium: number;
  currency: string;
  paymentFrequency: string;
  paymentSchedules: PaymentSchedule[];

  // Coverage & Eligibility
  coverageDetails: CoverageDetail[];
  eligibilityRules: EligibilityRules;
  allowedClaimTypes: string[];

  // Validity & Status
  validityPeriod: ValidityPeriod;
  status: string;
  statusChangeNotes: string;

  // Geographical & Audience
  regions: string[];
  targetAudience: string[];

  // Translations
  translations: Translations;

  // Beneficiaries
  beneficiaries: Beneficiary[];

  // Cancellation Info
  cancellationDate: [number, number, number] | null;
  cancellationReason: string | null;
  cancelledBy: string | null;

  // Audit Trail
  createdAt: string | [number, number, number, number, number, number, number];
  createdBy: string;
  updatedAt: string | [number, number, number, number, number, number, number];
  updatedBy: string;

  // Additional Fields
  calculationConfig: any;
}

export default function MyPoliciesDetails() {
  const navigate = useNavigate();
  const { policyId } = useParams();

  const { data: policyDetails, isLoading } = useGetPolicyDetailsQuery(
    policyId || "",
    {
      skip: !policyId,
    }
  );

  console.log("PolicyDetails: ", policyDetails);

  // Helper function to convert array date to Date object
  const parseArrayDate = (dateArray: any): Date | null => {
    if (!dateArray || !Array.isArray(dateArray)) return null;

    if (dateArray.length >= 3) {
      // [year, month, day]
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    } else if (dateArray.length >= 7) {
      // [year, month, day, hour, minute, second, millisecond]
      return new Date(
        dateArray[0],
        dateArray[1] - 1,
        dateArray[2],
        dateArray[3],
        dateArray[4],
        dateArray[5],
        dateArray[6]
      );
    }
    return null;
  };

  const formatDate = (
    dateInput?: string | Date | [number, ...number[]] | null
  ): string => {
    if (!dateInput) return "Date not available";

    let date: Date;

    if (Array.isArray(dateInput)) {
      const parsedDate = parseArrayDate(dateInput);
      if (!parsedDate) return "Invalid date";
      date = parsedDate;
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour:
        dateInput && typeof dateInput !== "string" && dateInput.length > 3
          ? "2-digit"
          : undefined,
      minute:
        dateInput && typeof dateInput !== "string" && dateInput.length > 3
          ? "2-digit"
          : undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Active",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      INACTIVE: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Inactive",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
      EXPIRED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Expired",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
        icon: <Trash2 className="h-3 w-3 mr-1" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center px-2 py-1`}
      >
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getProductTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      LIFE: <Shield className="h-4 w-4 text-blue-600" />,
      AUTO: <Briefcase className="h-4 w-4 text-green-600" />,
      PROPERTY: <Shield className="h-4 w-4 text-orange-600" />,
    };
    return icons[type] || <FileText className="h-4 w-4 text-gray-600" />;
  };

  // Get payment frequency display
  const getPaymentFrequencyDisplay = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      MONTHLY: "Monthly",
      QUARTERLY: "Quarterly",
      ANNUAL: "Annual",
    };
    return frequencyMap[frequency] || frequency;
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      PAID: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Paid",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      OVERDUE: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Overdue",
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
        icon: <Trash2 className="h-3 w-3 mr-1" />,
      },
      PAUSED: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Paused",
        icon: <Pause className="h-3 w-3 mr-1" />,
      },
      PROCESSING: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Processing",
        icon: <Zap className="h-3 w-3 mr-1" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center px-2 py-1`}
      >
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Analyze payment schedules and return comprehensive information
  const analyzePayments = () => {
    if (
      !policyDetails?.paymentSchedules ||
      policyDetails.paymentSchedules.length === 0
    ) {
      return {
        hasPayments: false,
        nextPayment: null,
        lastPayment: null,
        paymentSummary: {
          total: 0,
          paid: 0,
          pending: 0,
          overdue: 0,
          cancelled: 0,
          paused: 0,
        },
        paymentStatus: "NO_PAYMENTS",
      };
    }

    const schedules = policyDetails.paymentSchedules;

    // Sort by due date
    const sortedSchedules = [...schedules].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    // Find next payment (first PENDING, PAUSED, or OVERDUE)
    const nextPayment = sortedSchedules.find((schedule) =>
      ["PENDING", "OVERDUE", "PAUSED"].includes(schedule.status)
    );

    // Find last paid payment
    const lastPayment = [...sortedSchedules]
      .reverse()
      .find((schedule) => schedule.status === "PAID");

    // Calculate summary
    const summary = {
      total: schedules.length,
      paid: schedules.filter((s) => s.status === "PAID").length,
      pending: schedules.filter((s) => s.status === "PENDING").length,
      overdue: schedules.filter((s) => s.status === "OVERDUE").length,
      cancelled: schedules.filter((s) => s.status === "CANCELLED").length,
      paused: schedules.filter((s) => s.status === "PAUSED").length,
    };

    // Determine overall payment status based on policy status
    let paymentStatus = "ACTIVE";

    if (policyDetails.status === "CANCELLED") {
      paymentStatus = "CANCELLED";
    } else if (policyDetails.status === "EXPIRED") {
      paymentStatus = "EXPIRED";
    } else if (policyDetails.status === "INACTIVE") {
      paymentStatus = "INACTIVE";
    } else if (summary.overdue > 0) {
      paymentStatus = "OVERDUE";
    } else if (summary.pending > 0) {
      paymentStatus = "PENDING";
    } else if (summary.paused > 0) {
      paymentStatus = "PAUSED";
    } else if (summary.paid === summary.total) {
      paymentStatus = "COMPLETED";
    }

    return {
      hasPayments: true,
      nextPayment,
      lastPayment,
      paymentSummary: summary,
      paymentStatus,
      allSchedules: sortedSchedules,
    };
  };

  const paymentAnalysis = analyzePayments();

  // Get payment status display based on analysis
  const getPaymentStatusDisplay = () => {
    if (!paymentAnalysis.hasPayments) {
      return {
        title: "No Payment Schedule",
        description: "This policy has no payment schedules set up.",
        color: "bg-gray-100 text-gray-800",
      };
    }

    const statusMap = {
      CANCELLED: {
        title: "Payments Cancelled",
        description:
          "All future payments have been cancelled due to policy cancellation.",
        color: "bg-gray-100 text-gray-800",
      },
      EXPIRED: {
        title: "Policy Expired",
        description:
          "Payment schedule completed or terminated due to policy expiration.",
        color: "bg-gray-100 text-gray-800",
      },
      INACTIVE: {
        title: "Payments Inactive",
        description: "Payments are inactive due to policy status.",
        color: "bg-yellow-100 text-yellow-800",
      },
      OVERDUE: {
        title: "Payments Overdue",
        description: `You have ${paymentAnalysis.paymentSummary.overdue} overdue payment(s).`,
        color: "bg-red-100 text-red-800",
      },
      PENDING: {
        title: "Payments Active",
        description: `You have ${paymentAnalysis.paymentSummary.pending} pending payment(s).`,
        color: "bg-blue-100 text-blue-800",
      },
      PAUSED: {
        title: "Payments Paused",
        description: `You have ${paymentAnalysis.paymentSummary.paused} paused payment(s).`,
        color: "bg-blue-100 text-blue-800",
      },
      COMPLETED: {
        title: "All Payments Completed",
        description: "All payments have been successfully processed.",
        color: "bg-green-100 text-green-800",
      },
      ACTIVE: {
        title: "Payments Active",
        description: "Payment schedule is active and up to date.",
        color: "bg-green-100 text-green-800",
      },
    };

    return (
      statusMap[paymentAnalysis.paymentStatus as keyof typeof statusMap] ||
      statusMap.ACTIVE
    );
  };

  const paymentStatusDisplay = getPaymentStatusDisplay();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (!policyDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Policy Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The policy you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            ← Back to My Policies
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {policyDetails.displayName}
              </h1>
              <p className="text-gray-600 mt-1">
                Policy Number:{" "}
                <span className="font-semibold">
                  {policyDetails.policyNumber}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(policyDetails.status)}
              {policyDetails.cancellationDate && (
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-800 border-red-200"
                >
                  Cancelled on {formatDate(policyDetails.cancellationDate)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Policy Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policy Overview Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getProductTypeIcon(policyDetails.productType)}
                  <h2 className="text-xl font-semibold">Policy Overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Type:</span>
                      <span className="font-medium">
                        {policyDetails.productType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Code:</span>
                      <span className="font-medium">
                        {policyDetails.productCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">
                        {policyDetails.category.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Holder:</span>
                      <span className="font-medium">
                        {policyDetails.policyHolderName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {policyDetails.policyHolderEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Holder ID:</span>
                      <span className="font-medium">
                        {policyDetails.policyHolderId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-700">{policyDetails.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Coverage Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Coverage Details</h2>
                </div>

                <div className="space-y-4">
                  {policyDetails.coverageDetails?.map((coverage, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {coverage.coverageType}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {coverage.coverageLimit.amount.toLocaleString()}{" "}
                          {coverage.coverageLimit.currency}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {coverage.description}
                      </p>
                      {coverage.deductible && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Deductible:</span>
                          <span className="font-medium">
                            {coverage.deductible.amount}{" "}
                            {coverage.deductible.currency}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information Card - UPDATED */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </div>

                {/* Payment Status Overview */}
                <div className="mb-6">
                  <div
                    className={`${paymentStatusDisplay.color} rounded-lg p-4 mb-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {paymentStatusDisplay.title}
                        </h3>
                        <p className="text-sm mt-1">
                          {paymentStatusDisplay.description}
                        </p>
                      </div>
                      {paymentAnalysis.hasPayments && (
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {policyDetails.premium} {policyDetails.currency}
                          </div>
                          <div className="text-sm">Total Premium</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Payment Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Payment Schedule
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <Badge variant="outline">
                            {getPaymentFrequencyDisplay(
                              policyDetails.paymentFrequency
                            )}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">
                            {policyDetails.currency}
                          </span>
                        </div>
                        {paymentAnalysis.hasPayments && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Installments:
                            </span>
                            <span className="font-medium">
                              {paymentAnalysis.paymentSummary.total}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Payment Section */}
                    {paymentAnalysis.nextPayment && (
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Next Payment Due
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-bold">
                              {paymentAnalysis.nextPayment.dueAmount}{" "}
                              {policyDetails.currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium">
                              {formatDate(paymentAnalysis.nextPayment.dueDate)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status:</span>
                            {getPaymentStatusBadge(
                              paymentAnalysis.nextPayment.status
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Last Payment Section */}
                    {paymentAnalysis.lastPayment && (
                      <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Last Payment
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-bold">
                              {paymentAnalysis.lastPayment.dueAmount}{" "}
                              {policyDetails.currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Paid Date:</span>
                            <span className="font-medium">
                              {formatDate(paymentAnalysis.lastPayment.paidDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Payment Summary */}
                  {paymentAnalysis.hasPayments && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Payment Summary
                      </h4>

                      {/* Payment Status Breakdown */}
                      <div className="space-y-3">
                        {paymentAnalysis.paymentSummary.paid > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-gray-600">Paid</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                {paymentAnalysis.paymentSummary.paid} of{" "}
                                {paymentAnalysis.paymentSummary.total}
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                              >
                                {Math.round(
                                  (paymentAnalysis.paymentSummary.paid /
                                    paymentAnalysis.paymentSummary.total) *
                                    100
                                )}
                                %
                              </Badge>
                            </div>
                          </div>
                        )}

                        {paymentAnalysis.paymentSummary.pending > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span className="text-gray-600">Pending</span>
                            </div>
                            <span className="font-medium">
                              {paymentAnalysis.paymentSummary.pending}
                            </span>
                          </div>
                        )}

                        {paymentAnalysis.paymentSummary.overdue > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span className="text-gray-600">Overdue</span>
                            </div>
                            <span className="font-medium text-red-600">
                              {paymentAnalysis.paymentSummary.overdue}
                            </span>
                          </div>
                        )}

                        {paymentAnalysis.paymentSummary.cancelled > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                              <span className="text-gray-600">Cancelled</span>
                            </div>
                            <span className="font-medium">
                              {paymentAnalysis.paymentSummary.cancelled}
                            </span>
                          </div>
                        )}

                        {paymentAnalysis.paymentSummary.paused > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-gray-600">Paused</span>
                            </div>
                            <span className="font-medium">
                              {paymentAnalysis.paymentSummary.paused}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Policy Status Impact */}
                      {["CANCELLED", "EXPIRED", "INACTIVE"].includes(
                        policyDetails.status
                      ) && (
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-700">
                              Policy Status Impact
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {policyDetails.status === "CANCELLED" &&
                              "All future payments have been cancelled due to policy cancellation."}
                            {policyDetails.status === "EXPIRED" &&
                              "Payment schedule terminated due to policy expiration."}
                            {policyDetails.status === "INACTIVE" &&
                              "Payments are inactive. Please contact support to reactivate."}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Show if no payment schedules */}
                {!paymentAnalysis.hasPayments && (
                  <div className="text-center py-4 border-t mt-4">
                    <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No payment schedule available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Validity Period Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold">Validity Period</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Effective Date:</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {formatDate(
                            policyDetails.validityPeriod.effectiveDate
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expiration Date:</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {formatDate(
                            policyDetails.validityPeriod.expirationDate
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rest of your component remains the same... */}
          {/* Right Column - Side Info */}
          <div className="space-y-6">
            {/* Eligibility Rules Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-semibold">Eligibility Rules</h2>
                </div>

                <div className="space-y-3">
                  {policyDetails.eligibilityRules.minAge && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Age:</span>
                      <span className="font-medium">
                        {policyDetails.eligibilityRules.minAge} years
                      </span>
                    </div>
                  )}
                  {policyDetails.eligibilityRules.maxAge && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maximum Age:</span>
                      <span className="font-medium">
                        {policyDetails.eligibilityRules.maxAge} years
                      </span>
                    </div>
                  )}
                  {policyDetails.eligibilityRules.vehicleAge && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Age:</span>
                      <span className="font-medium">
                        {policyDetails.eligibilityRules.vehicleAge} years
                      </span>
                    </div>
                  )}
                  {policyDetails.eligibilityRules.licenseType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Type:</span>
                      <Badge variant="outline">
                        {policyDetails.eligibilityRules.licenseType.replace(
                          /_/g,
                          " "
                        )}
                      </Badge>
                    </div>
                  )}
                  {policyDetails.eligibilityRules.healthCheck && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Check:</span>
                      <Badge variant="outline">
                        {policyDetails.eligibilityRules.healthCheck}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Regions & Audience Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Coverage Regions</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {policyDetails.regions?.map((region, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {region}
                      </Badge>
                    ))}
                  </div>

                  {policyDetails.targetAudience &&
                    policyDetails.targetAudience.length > 0 && (
                      <>
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Target Audience</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {policyDetails.targetAudience.map(
                              (audience, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-green-50 text-green-700"
                                >
                                  {audience}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Allowed Claim Types Card */}
            {policyDetails.allowedClaimTypes &&
              policyDetails.allowedClaimTypes.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileCheck className="h-5 w-5 text-purple-600" />
                      <h2 className="text-xl font-semibold">
                        Allowed Documents
                      </h2>
                    </div>

                    <div className="space-y-2">
                      {policyDetails.allowedClaimTypes.map(
                        (claimType, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm">
                              {claimType.replace(/_/g, " ")}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Beneficiaries Card */}
            {policyDetails.beneficiaries &&
              policyDetails.beneficiaries.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-5 w-5 text-red-600" />
                      <h2 className="text-xl font-semibold">Beneficiaries</h2>
                    </div>

                    <div className="space-y-3">
                      {policyDetails.beneficiaries.map((beneficiary, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-red-600" />
                              </div>
                              <span className="font-medium">
                                {beneficiary.name}
                              </span>
                            </div>
                            <Badge variant="outline">
                              {beneficiary.relationship}
                            </Badge>
                          </div>
                          {beneficiary.dateOfBirth && (
                            <div className="text-sm text-gray-500">
                              Date of Birth:{" "}
                              {formatDate(beneficiary.dateOfBirth)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Cancellation Details Card */}
            {policyDetails.cancellationDate && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <h2 className="text-xl font-semibold">
                      Cancellation Details
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Cancellation Date
                      </div>
                      <div className="font-medium">
                        {formatDate(policyDetails.cancellationDate)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Cancelled By
                      </div>
                      <div className="font-medium">
                        {policyDetails.cancelledBy}
                      </div>
                    </div>

                    {policyDetails.cancellationReason && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Reason</div>
                        <div className="text-sm bg-red-50 p-3 rounded border border-red-200">
                          {policyDetails.cancellationReason}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audit Trail Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <History className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Audit Trail</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created By:</span>
                    <span className="text-sm font-medium">
                      {policyDetails.createdBy}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created At:</span>
                    <span className="text-sm">
                      {formatDate(policyDetails.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Last Updated By:
                    </span>
                    <span className="text-sm font-medium">
                      {policyDetails.updatedBy}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Last Updated At:
                    </span>
                    <span className="text-sm">
                      {formatDate(policyDetails.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Translations Section - Full Width */}
        {policyDetails.translations && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-semibold">Regional Translations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(policyDetails.translations).map(
                  ([locale, translation]) => (
                    <div key={locale} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 uppercase">
                          {locale}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {translation.displayName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {translation.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Change Notes */}
        {policyDetails.statusChangeNotes && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Status Change Notes</h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">
                  {policyDetails.statusChangeNotes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
