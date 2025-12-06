import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  IdCard,
  Mail,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useGetCustomerByUserIdsQuery } from "@/services/AdminSlice";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

/* ---------- helpers ---------- */
const formatDate = (d?: string | null) =>
  d ? format(new Date(d), "dd MMM yyyy") : "Not available";

const CustomerView = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCustomerByUserIdsQuery(customerId || "", {
    skip: !customerId,
  });

  const customer = data;

  /* ---------- skeleton ---------- */
  if (isLoading || !customer)
    return (
      <div className="p-4 md:p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j}>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );

  /* ---------- badges ---------- */
  const statusBadge = (s: string) => (
    <Badge
      className={cn(
        "px-2.5 py-1 text-xs font-semibold",
        s === "ACTIVE"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 p-2"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 p-2"
      )}
    >
      {s}
    </Badge>
  );

  const verifyBadge = (s?: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      VERIFIED: { bg: "bg-green-100 text-green-700", text: "Verified" },
      PENDING: { bg: "bg-yellow-100 text-yellow-700", text: "Pending" },
      EXPIRED: { bg: "bg-red-100 text-red-700", text: "Expired" },
      REJECTED: { bg: "bg-red-100 text-red-700", text: "Rejected" },
    };
    const v = map[s || ""] || { bg: "bg-gray-100 text-gray-700", text: s };
    return <Badge className={cn("px-2.5 p-1 text-xs", v.bg)}>{v.text}</Badge>;
  };

  /* ---------- data ---------- */
  const premium = Number(customer.premium || 0);
  const activePolicies = Number(customer.customerActivePolicies || 0);
  const totalPolicies = Number(customer.numberOfPolicies || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-4 md:p-5">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 bg-accent p-2 rounded-xl border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex justify-center items-center border p-2 rounded   gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {customer.customerFirstname} {customer.customerLastname}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customer ID: {customer.customerId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {statusBadge(customer.status)}
            <Button
              variant="outline"
              size="sm"
              className="rounded"
              onClick={() => navigate(`/admin/customers/${customerId}/edit`)}
            >
              Edit Customer
            </Button>
          </div>
        </div>

        {/* Summary Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <Card className="border-border/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/60">
            <CardContent className=" gap-4 p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Policies
              </p>
              <div className="flex justify-between">
                <User className="h-8 w-8 text-indigo-500" />
                <p className="text-2xl font-bold">{totalPolicies}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/60">
            <CardContent className="  gap-4 p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Policies
              </p>
              <div className="flex justify-between">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
                <p className="text-2xl font-bold">{activePolicies}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/60">
            <CardContent className="  gap-4 p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Premium
              </p>
              <div className="flex justify-between">
                <FileText className="h-8 w-8 text-amber-500" />
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("da-DK", {
                    style: "currency",
                    currency: customer.currency || "DKK",
                  }).format(premium)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/60">
            <CardContent className="gap-4 p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
              <div className="flex justify-between">
                <Calendar className="h-8 w-8 text-sky-500" />
                <p className="text-lg font-bold">
                  {formatDate(customer.joinDate)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Column */}
          <div className="grid gap-3 lg:col-span-2 ">
            {/* Personal Info */}
            <Card className="border-border/50 p-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-indigo-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    First Name
                  </label>
                  <p className="font-medium">{customer.customerFirstname}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Last Name
                  </label>
                  <p className="font-medium">{customer.customerLastname}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    {customer.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Date of Birth
                  </label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    {formatDate(customer.customerDateOfBirth)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Government ID */}
            <Card className="border-border/50 p-3">
              <CardHeader>
                <CardTitle>Identity Document</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Type
                  </label>
                  <p className="font-medium">
                    {customer.customerIdType || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Number
                  </label>
                  <p className="font-medium">
                    {customer.customerIdMaskedNumber || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Issuing Country
                  </label>
                  <p className="font-medium">
                    {customer.idIssuingCountry || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Expires
                  </label>
                  <p>{formatDate(customer.idExpirationDate)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Verification
                  </label>
                  <div className="mt-1">
                    {verifyBadge(customer.idVerificationStatus)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Addresses */}
          <div className="">
            <Card className="border-border/50 p-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-indigo-500" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Phone
                  </label>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-indigo-500" />
                    {customer.customerPhone || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Alternate Phone
                  </label>
                  <p>{customer.customerAlternativePhone || "—"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 p-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  Primary Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>{customer.customerPrimaryAddressStreet}</p>
                <p>{customer.customerPrimaryAddressCity}</p>
                <p>{customer.customerPrimaryAddressPostalCode}</p>
                <p>{customer.customerPrimaryAddressCountry}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 p-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>{customer.customerBillingAddressStreet}</p>
                <p>{customer.customerBillingAddressCity}</p>
                <p>{customer.customerBillingAddressPostalCode}</p>
                <p>{customer.customerBillingAddressCountry}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
