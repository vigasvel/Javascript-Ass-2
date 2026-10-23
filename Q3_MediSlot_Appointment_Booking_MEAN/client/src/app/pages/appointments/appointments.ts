import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, errMsg } from '../../core/api.service';
import { Appointment } from '../../core/models';

@Component({
  selector: 'app-appointments',
  imports: [FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  private api = inject(ApiService);
  readonly patientQuery = input<string>('', { alias: 'patient' });

  filter = { patientId: '', date: '', status: '' };
  readonly list = signal<Appointment[]>([]);
  readonly msg = signal('');
  readonly counts = computed(() => ({
    booked: this.list().filter((a) => a.status === 'Booked').length,
    completed: this.list().filter((a) => a.status === 'Completed').length,
    cancelled: this.list().filter((a) => a.status === 'Cancelled').length,
  }));

  ngOnInit(): void {
    if (this.patientQuery()) this.filter.patientId = this.patientQuery();
    this.load();
  }

  load(): void {
    this.api.appointments(this.filter).subscribe({
      next: (l) => this.list.set(l),
      error: (e) => this.msg.set(errMsg(e)),
    });
  }

  reset(): void {
    this.filter = { patientId: '', date: '', status: '' };
    this.load();
  }

  update(a: Appointment, status: 'Cancelled' | 'Completed'): void {
    const verb = status === 'Cancelled' ? 'Cancel' : 'Mark as completed';
    if (!confirm(`${verb}: ${a.patient.name} with ${a.doctor.name} on ${a.date} ${a.time}?`)) return;
    this.api.setStatus(a._id, status).subscribe({
      next: () => {
        this.msg.set(`Appointment ${status.toLowerCase()}`);
        this.load();
      },
      error: (e) => this.msg.set(errMsg(e)),
    });
  }
}
