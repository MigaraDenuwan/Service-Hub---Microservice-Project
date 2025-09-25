// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface UserType {
  id?: string;
  fullName?: string;
  email: string;
  role: 'customer' | 'provider';
}

// Provider Types
export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Review {
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Provider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  isVerified: boolean;
  availability: Availability[];
  reviews: Review[];
}

// Appointment Types
export interface Appointment {
  id: string;
  customerId: string;
  providerId: string;
  date: string;
  time: string;
  status: 'BOOKED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED';
  providerName?: string;
  serviceType?: string;
}

export interface AppointmentFormData {
  date: string;
  time: string;
}