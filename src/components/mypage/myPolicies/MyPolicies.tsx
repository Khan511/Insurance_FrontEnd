import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";

type DateTuple = [number, number, number, number?, number?];

function formatDate(dateInput: string | DateTuple, locale = "en-GB"): string {
  let date: Date;

  if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else {
    // Handle DateTuple case
    const [y, m, d, h = 0, min = 0] = dateInput;
    date = new Date(y, m - 1, d, h, min);
  }

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Get status badge consistent with policy details
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

// Get product type icon
const getProductTypeIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    LIFE: <Shield className="h-4 w-4 text-blue-600" />,
    AUTO: <Shield className="h-4 w-4 text-green-600" />,
    PROPERTY: <Shield className="h-4 w-4 text-orange-600" />,
  };
  return icons[type] || <Shield className="h-4 w-4 text-gray-600" />;
};

// Format payment frequency display
const getPaymentFrequencyDisplay = (frequency: string) => {
  const frequencyMap: Record<string, string> = {
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    ANNUAL: "Annual",
  };
  return frequencyMap[frequency] || frequency;
};

// Get next payment date for a policy
const getNextPayment = (paymentSchedules: any[]) => {
  if (!paymentSchedules || paymentSchedules.length === 0) return null;

  const nextPayment = paymentSchedules
    .filter((schedule) =>
      ["PENDING", "OVERDUE", "PAUSED"].includes(schedule.status)
    )
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0];

  return nextPayment;
};

export default function MyPolicies() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data?.user?.userId;
  const { data: myAllPolicies, isLoading } = useGetAllPoliciesOfUserQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your policies...</p>
      </div>
    );
  }

  if (!myAllPolicies || myAllPolicies.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Policies Found
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have any insurance policies yet.
            </p>
            <Button asChild>
              <Link to="/policies">Browse Available Policies</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Insurance Policies
          </h1>
          <p className="text-gray-600 mt-2">
            You have {myAllPolicies.length} active policy
            {myAllPolicies.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Policy Counts Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {myAllPolicies.length}
                </div>
                <div className="text-sm text-gray-600">Total Policies</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {myAllPolicies.filter((p) => p.status === "ACTIVE").length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {myAllPolicies.filter((p) => p.status === "PENDING").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {
                    myAllPolicies.filter(
                      (p) => p.status === "CANCELLED" || p.status === "EXPIRED"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Ended</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAllPolicies?.map((policy) => {
            const nextPayment = getNextPayment(policy.paymentSchedules);

            return (
              <Card
                key={policy.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  {/* Policy Header with Status */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getProductTypeIcon(policy.productType)}
                          <span className="text-sm font-medium text-gray-500">
                            {policy.productType}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {policy.displayName ||
                            `${policy.productType} Insurance`}
                        </h3>
                      </div>
                      {getStatusBadge(policy.status)}
                    </div>

                    {/* Policy Number */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">Policy Number</div>
                      <div className="font-mono font-semibold">
                        {policy.policyNumber}
                      </div>
                    </div>

                    {/* Key Policy Information */}
                    <div className="space-y-3">
                      {/* Coverage Period */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <span className="text-gray-600">Coverage: </span>
                          <span className="font-medium">
                            {formatDate(policy.validityPeriod.effectiveDate)} -{" "}
                            {formatDate(policy.validityPeriod.expirationDate)}
                          </span>
                        </div>
                      </div>

                      {/* Premium Information */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <span className="text-gray-600">Premium: </span>
                          <span className="font-medium">
                            {policy.premium} {policy.currency}
                          </span>
                          <span className="text-gray-500 ml-1">
                            /{" "}
                            {getPaymentFrequencyDisplay(
                              policy.paymentFrequency
                            ).toLowerCase()}
                          </span>
                        </div>
                      </div>

                      {/* Next Payment (if active) */}
                      {nextPayment && policy.status === "ACTIVE" && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <div className="text-sm">
                            <span className="text-gray-600">
                              Next Payment:{" "}
                            </span>
                            <span className="font-medium">
                              {nextPayment.dueAmount} {policy.currency}
                            </span>
                            <span className="text-gray-500 ml-1">
                              due {formatDate(nextPayment.dueDate)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Category */}
                      <div className="text-sm">
                        <span className="text-gray-600">Category: </span>
                        <span className="font-medium">
                          {policy.category?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Action Buttons */}
                  <div className="p-6 pt-4">
                    <div className="flex gap-3">
                      <Button asChild variant="outline" className="flex-1">
                        <Link
                          to={`/my-page/policies/${policy.id}/policy-details`}
                          className="flex items-center justify-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </Button>

                      {/* Show additional actions based on policy status */}
                      {policy.status === "ACTIVE" && nextPayment && (
                        <Button asChild className="flex-1 text-white">
                          <Link
                            to={`/my-page/payments`}
                            className="flex items-center justify-center gap-2"
                          >
                            <DollarSign className="h-4 w-4" />
                            Pay Now
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Policies Table View (Alternative) */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium">
                        Policy Details
                      </th>
                      <th className="text-left p-4 font-medium">
                        Coverage Period
                      </th>
                      <th className="text-left p-4 font-medium">Premium</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAllPolicies?.map((policy) => (
                      <tr key={policy.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium">
                            {policy.policyNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {policy.displayName}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {policy.productType}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>
                              From:{" "}
                              {formatDate(policy.validityPeriod.effectiveDate)}
                            </div>
                            <div>
                              To:{" "}
                              {formatDate(policy.validityPeriod.expirationDate)}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {policy.premium} {policy.currency}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getPaymentFrequencyDisplay(
                              policy.paymentFrequency
                            )}
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(policy.status)}</td>
                        <td className="p-4">
                          <Button asChild variant="outline" size="sm">
                            <Link
                              to={`/my-page/policies/${policy.id}/policy-details`}
                            >
                              View Details
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help/Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Need Assistance?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your policy or need to make changes?
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">File a Claim</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need to submit a claim for your policy?
              </p>
              <Button asChild className="w-full text-white">
                <Link to="/my-page/claims">Start Claim</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Payment History
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                View your payment history and manage billing.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/my-page/payments">View Payments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
