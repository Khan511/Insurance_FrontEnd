import type { InsuracePolicy, PaymentSchedule } from "@/services/ServiceTypes";

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
