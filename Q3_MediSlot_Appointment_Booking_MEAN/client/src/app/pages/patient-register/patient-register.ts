import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, errMsg } from '../../core/api.service';
import { Patient } from '../../core/models';

@Component({
  selector: 'app-patient-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './patient-register.html',
  styleUrl: './patient-register.css',
})
export class PatientRegister {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  readonly bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  readonly saved = signal<Patient | null>(null);
  readonly error = signal('');
  readonly saving = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z .]+$/)]],
    age: [null as number | null, [Validators.required, Validators.min(0), Validators.max(120)]],
    gender: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: ['', Validators.email],
    bloodGroup: [''],
    address: ['', Validators.maxLength(150)],
    consent: [false, Validators.requiredTrue],
  });

  /** returns the first error text of a control (shown under the field) */
  errorOf(name: string): string | null {
    const c = this.form.get(name);
    if (!c || !c.invalid || !(c.touched || c.dirty)) return null;
    if (c.hasError('required')) return 'This field is required';
    if (c.hasError('minlength')) return 'Too short';
    if (c.hasError('maxlength')) return 'Too long';
    if (c.hasError('min') || c.hasError('max')) return 'Age must be between 0 and 120';
    if (c.hasError('email')) return 'Enter a valid email';
    if (c.hasError('pattern')) return name === 'phone' ? 'Enter a 10-digit mobile number' : 'Letters only';
    if (c.hasError('requiredTrue')) return 'Please accept to continue';
    return 'Invalid value';
  }

  submit(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { consent, ...data } = this.form.getRawValue();
    this.saving.set(true);
    this.api.registerPatient({ ...(data as unknown as Patient), age: Number(data.age) }).subscribe({
      next: (p) => {
        this.saved.set(p);
        this.form.reset({ gender: '', bloodGroup: '', consent: false });
        this.saving.set(false);
      },
      error: (e) => {
        this.error.set(errMsg(e));
        if (e.status === 409 && e.error?.patient) this.saved.set(e.error.patient);
        this.saving.set(false);
      },
    });
  }
}
