import { Routes } from '@angular/router';
import { PatientRegister } from './pages/patient-register/patient-register';
import { BookAppointment } from './pages/book-appointment/book-appointment';
import { Appointments } from './pages/appointments/appointments';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: PatientRegister, title: 'Patient Registration | MediSlot' },
  { path: 'book', component: BookAppointment, title: 'Book Appointment | MediSlot' },
  { path: 'appointments', component: Appointments, title: 'Appointments | MediSlot' },
  { path: '**', redirectTo: 'register' },
];
