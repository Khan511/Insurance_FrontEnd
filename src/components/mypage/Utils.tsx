// import type {
//   InsuracePolicy,
//   PaymentSchedule,
// } from "@/services/InsurancePolicySlice";

// export const getUpcomingPayments = (policies: InsuracePolicy[] = [], days: number = 20):PaymentSchedule[] => {
//   const today = new Date();
//   const futureDate = new Date();
//   futureDate.setDate(today.getDate() + days);

//   const upcomingPayments: PaymentSchedule[] = [];

//   policies.forEach((policy) => {
//     if (policy.paymentSchedules && policy.paymentSchedules.length > 0) {
//       policy.paymentSchedules.forEach((payment) => {
//         // Skip if payment is already paid or cancelled
//         if (payment.status !== "PENDING" && payment.status !== "OVERDUE") {
//           return;
//         }

//         const dueDate = new Date(payment.dueDate);

//         // Check if payment is within the next 20 days and not in the past
//         if (dueDate >= today && dueDate <= futureDate) {
//           // Add policy information to the payment for display
//           upcomingPayments.push({
//             ...payment,
//             // id: policy.id,
//           });
//         }
//       });
//     }
//   });

//   // Sort by due date (earliest first)
//   return upcomingPayments.sort(
//     (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
//   );
// };

// // Helper function to format date
// export const formatDate = (date: string | Date): string => {
//   return new Date(date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// // Helper function to check if payment is overdue
// export const isPaymentOverdue = (dueDate: string | Date): boolean => {
//   return new Date(dueDate) < new Date();
// };
import type {
  InsuracePolicy,
  PaymentSchedule,
} from "@/services/InsurancePolicySlice";

export const getUpcomingPayments = (
  policies: InsuracePolicy[] = [],
  days: number = 20
): PaymentSchedule[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  futureDate.setHours(23, 59, 59, 999); // Set to end of the target day

  const upcomingPayments: PaymentSchedule[] = [];

  policies.forEach((policy) => {
    if (policy.paymentSchedules && policy.paymentSchedules.length > 0) {
      policy.paymentSchedules.forEach((payment) => {
        // Skip if payment is already paid (has paidDate)
        if (payment.paidDate) {
          return;
        }

        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Normalize due date to start of day

        // Check if payment is within the next X days (including today)
        // and not in the past (unless you want to include overdue)
        if (dueDate >= today && dueDate <= futureDate) {
          upcomingPayments.push({
            ...payment,
            // Add policy reference if needed
            id: policy.id,
            // productCode: policy.productCode,
            currency: policy.currency,
          });
        }
      });
    }
  });

  // Sort by due date (earliest first)
  return upcomingPayments.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
};
