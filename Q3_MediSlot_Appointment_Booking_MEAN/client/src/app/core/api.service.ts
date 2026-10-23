import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, Doctor, Patient, SlotResponse } from './models';

/** One service for every REST endpoint of the Express backend */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // ---- doctors
  doctors(specialization = ''): Observable<Doctor[]> {
    const params = specialization ? new HttpParams().set('specialization', specialization) : undefined;
    return this.http.get<Doctor[]>('/api/doctors', { params });
  }
  slots(doctorId: string, date: string): Observable<SlotResponse> {
    return this.http.get<SlotResponse>(`/api/doctors/${doctorId}/slots`, { params: { date } });
  }

  // ---- patients
  registerPatient(p: Patient): Observable<Patient> {
    return this.http.post<Patient>('/api/patients', p);
  }
  patient(patientId: string): Observable<Patient> {
    return this.http.get<Patient>(`/api/patients/${encodeURIComponent(patientId.trim())}`);
  }
  patients(search = ''): Observable<Patient[]> {
    return this.http.get<Patient[]>('/api/patients', { params: { search } });
  }

  // ---- appointments
  book(body: { patientId: string; doctorId: string; date: string; time: string; reason: string }): Observable<Appointment> {
    return this.http.post<Appointment>('/api/appointments', body);
  }
  appointments(filter: { patientId?: string; date?: string; status?: string }): Observable<Appointment[]> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => v && (params = params.set(k, v)));
    return this.http.get<Appointment[]>('/api/appointments', { params });
  }
  setStatus(id: string, status: 'Cancelled' | 'Completed'): Observable<Appointment> {
    return this.http.patch<Appointment>(`/api/appointments/${id}/status`, { status });
  }
}

/** helper used by pages to read an error message from HttpErrorResponse */
export const errMsg = (e: { error?: { message?: string }; message?: string }) =>
  e?.error?.message || 'Server not reachable. Is the backend running on port 5013?';

/** today's date as YYYY-MM-DD in local time */
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
