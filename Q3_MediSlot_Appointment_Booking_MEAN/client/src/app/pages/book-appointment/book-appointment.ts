import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, errMsg, today } from '../../core/api.service';
import { Appointment, Doctor, Patient, SlotResponse } from '../../core/models';

@Component({
  selector: 'app-book-appointment',
  imports: [FormsModule, RouterLink],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment implements OnInit {
  private api = inject(ApiService);

  /** filled from ?patient=MS-1003 in the URL (withComponentInputBinding) */
  readonly patientQuery = input<string>('', { alias: 'patient' });

  readonly minDate = today();
  patientIdText = '';
  readonly patient = signal<Patient | null>(null);
  readonly patientErr = signal('');

  readonly doctors = signal<Doctor[]>([]);
  readonly specialization = signal('');
  readonly specializations = computed(() => [...new Set(this.doctors().map((d) => d.specialization))]);
  readonly shownDoctors = computed(() =>
    this.doctors().filter((d) => !this.specialization() || d.specialization === this.specialization())
  );

  readonly doctor = signal<Doctor | null>(null);
  date = today();
  readonly slotInfo = signal<SlotResponse | null>(null);
  readonly time = signal('');
  reason = '';

  readonly booking = signal(false);
  readonly error = signal('');
  readonly confirmed = signal<Appointment | null>(null);

  ngOnInit(): void {
    this.api.doctors().subscribe((d) => this.doctors.set(d));
    if (this.patientQuery()) {
      this.patientIdText = this.patientQuery();
      this.findPatient();
    }
  }

  findPatient(): void {
    this.patientErr.set('');
    if (!/^MS-\d{4}$/i.test(this.patientIdText.trim())) {
      this.patientErr.set('Patient ID looks like MS-1001');
      return;
    }
    this.api.patient(this.patientIdText).subscribe({
      next: (p) => this.patient.set(p),
      error: (e) => {
        this.patient.set(null);
        this.patientErr.set(errMsg(e));
      },
    });
  }

  chooseDoctor(d: Doctor): void {
    this.doctor.set(d);
    this.loadSlots();
  }

  loadSlots(): void {
    const d = this.doctor();
    this.time.set('');
    this.slotInfo.set(null);
    if (!d || !this.date) return;
    this.api.slots(d._id, this.date).subscribe((s) => this.slotInfo.set(s));
  }

  canBook(): boolean {
    return !!(this.patient() && this.doctor() && this.date && this.time()) && !this.booking();
  }

  book(): void {
    if (!this.canBook()) return;
    this.error.set('');
    this.booking.set(true);
    this.api
      .book({
        patientId: this.patient()!.patientId!,
        doctorId: this.doctor()!._id,
        date: this.date,
        time: this.time(),
        reason: this.reason.trim(),
      })
      .subscribe({
        next: (a) => {
          this.confirmed.set(a);
          this.booking.set(false);
          this.reason = '';
          this.loadSlots();
        },
        error: (e) => {
          this.error.set(errMsg(e));
          this.booking.set(false);
          this.loadSlots();
        },
      });
  }

  newBooking(): void {
    this.confirmed.set(null);
    this.time.set('');
  }
}
