export default function formatKenyanPhoneNumber(
  number: number | string
): string {
  // Remove all non-digit characters
  let digits = String(number).replace(/\D/g, "");

  // Remove leading '+' if present
  if (digits.startsWith("254")) {
    return digits; // Already in correct format
  } else if (digits.startsWith("0")) {
    return "254" + digits.slice(1); // Replace leading 0 with 254
  } else if (digits.length === 9 && digits.startsWith("7")) {
    return "254" + digits; // Assume it's a Safaricom-like number missing prefix
  } else {
    return digits; // Return as-is if unrecognized
  }
}
