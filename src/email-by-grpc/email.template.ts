import { SubjectEmail } from '@common/constants';

export const EmailTemplates = {
  [SubjectEmail.BOOKING_CREATION_TENANT]: {
    subject: 'Your Booking Request Has Been Submitted',
    body: (bookingId: string, placeName: string, date: string) =>
      `Dear Guest,\n\n` +
      `We've received your booking request for ${placeName} on ${date} (Booking ID: ${bookingId}).\n\n` +
      `The landlord will review your request and respond within 48 hours.\n\n` +
      `You can view your booking details here: [Booking Link]\n\n` +
      `Best regards,\nThe Booking Team`,
  },
  [SubjectEmail.BOOKING_CREATION_LANDLORD]: {
    subject: 'New Booking Request for Your Place',
    body: (bookingId: string, tenantName: string, dates: string) =>
      `Dear Host,\n\n` +
      `You have a new booking request from ${tenantName} for ${dates} (Booking ID: ${bookingId}).\n\n` +
      `Please respond within 48 hours to confirm or decline.\n\n` +
      `Manage booking: [Host Dashboard Link]\n\n` +
      `Thank you,\nThe Booking Team`,
  },
  [SubjectEmail.BOOKING_CONFIRMATION]: {
    subject: 'Your Booking Has Been Confirmed!',
    body: (placeName: string, address: string, checkInDate: string) =>
      `Congratulations!\n\n` +
      `Your booking at ${placeName} (${address}) has been confirmed for ${checkInDate}.\n\n` +
      `What's next:\n` +
      `1. Review booking details [Link]\n` +
      `2. Contact host for check-in instructions\n` +
      `3. Enjoy your stay!\n\n` +
      `Need help? Contact support@example.com`,
  },
  [SubjectEmail.BOOKING_REJECTION]: {
    subject: 'Your Booking Request Was Not Accepted',
    body: (placeName: string, reason?: string) =>
      `We regret to inform you that your booking request for ${placeName} could not be accepted.\n\n` +
      `${reason ? `Reason: ${reason}\n\n` : ''}` +
      `Explore other available places: [Search Link]\n\n` +
      `We hope to welcome you another time!\n\n` +
      `The Booking Team`,
  },
  [SubjectEmail.BOOKING_CANCELLATION_BY_TENANT]: {
    subject: 'Booking Cancellation Confirmation',
    body: (bookingId: string, refundAmount: string) =>
      `Your booking (ID: ${bookingId}) has been successfully cancelled.\n\n` +
      `${refundAmount ? `A refund of ${refundAmount} will be processed within 5-7 business days.\n\n` : ''}` +
      `View cancellation policy: [Policy Link]\n\n` +
      `We hope to see you again soon!`,
  },
  [SubjectEmail.BOOKING_CANCELLATION_BY_LANDLORD]: {
    subject: 'Important: Your Booking Was Cancelled',
    body: (placeName: string, alternativeOptions?: string) =>
      `We're sorry to inform you that your booking for ${placeName} has been cancelled by the host.\n\n` +
      `${alternativeOptions || 'Our team is available to help you find alternative accommodations.'}\n\n` +
      `Contact support: support@example.com\n\n` +
      `We sincerely apologize for the inconvenience.`,
  },
  [SubjectEmail.BOOKING_COMPLETION]: {
    subject: 'How Was Your Stay?',
    body: (placeName: string, reviewLink: string) =>
      `Thank you for staying at ${placeName}!\n\n` +
      `We'd love to hear about your experience:\n` +
      `[Leave a Review](${reviewLink})\n\n` +
      `Your feedback helps hosts improve and other guests make better choices.\n\n` +
      `Warm regards,\nThe Booking Team`,
  },
};
