export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  room: string;
  fee: number;
  days: string[];
  slots: string[];
}

export interface Patient {
  _id?: string;
  patientId?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  bloodGroup?: string;
  address?: string;
}

export interface Slot {
  time: string;
  available: boolean;
  booked: boolean;
  past: boolean;
}

export interface SlotResponse {
  doctor: string;
  date: string;
  weekday: string;
  working: boolean;
  slots: Slot[];
}

export interface Appointment {
  _id: string;
  patient: Patient;
  doctor: Doctor;
  date: string;
  time: string;
  reason: string;
  status: 'Booked' | 'Cancelled' | 'Completed';
  token: number;
}
