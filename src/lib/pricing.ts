/**
 * MyWorkPadi / TaskGH — Pricing Utilities
 * Psychology-optimised: never uses the word "fee". 
 */

export const BOOKING_PROTECTION = 10; // GHS — flat rate per booking
export const SECURE_SERVICE_RATE = 0.05; // 5% of service value
export const TASKER_SUCCESS_RATE = 0.10; // 10% deducted from tasker payout
export const EMERGENCY_SURCHARGE = 20; // GHS — added when urgency = "asap"

export function calculateBookingProtection(): number {
  return BOOKING_PROTECTION;
}

export function calculateSecureCharge(serviceAmount: number): number {
  return Math.round(serviceAmount * SECURE_SERVICE_RATE * 100) / 100;
}

export function calculateEmergencySurcharge(urgency: string): number {
  return urgency === "asap" ? EMERGENCY_SURCHARGE : 0;
}

export function calculateTotal(serviceAmount: number, urgency = "flexible"): {
  serviceAmount: number;
  bookingProtection: number;
  secureServiceCharge: number;
  emergencySurcharge: number;
  total: number;
} {
  const bookingProtection = calculateBookingProtection();
  const secureServiceCharge = calculateSecureCharge(serviceAmount);
  const emergencySurcharge = calculateEmergencySurcharge(urgency);
  const total = serviceAmount + bookingProtection + secureServiceCharge + emergencySurcharge;

  return {
    serviceAmount,
    bookingProtection,
    secureServiceCharge,
    emergencySurcharge,
    total: Math.round(total * 100) / 100,
  };
}

export function calculateTaskerPayout(serviceAmount: number): {
  gross: number;
  successFee: number;
  netPayout: number;
} {
  const successFee = Math.round(serviceAmount * TASKER_SUCCESS_RATE * 100) / 100;
  return {
    gross: serviceAmount,
    successFee,
    netPayout: Math.round((serviceAmount - successFee) * 100) / 100,
  };
}

export function formatGHS(amount: number): string {
  return `GH₵ ${amount.toFixed(2)}`;
}
