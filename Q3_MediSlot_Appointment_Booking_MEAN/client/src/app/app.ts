import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="brand">
        <div class="cross">✚</div>
        <div>
          <h1>MediSlot</h1>
          <p>Hospital Appointment Booking · MEAN Stack</p>
        </div>
      </div>
      <nav>
        <a routerLink="/register" routerLinkActive="active">1 · Patient Registration</a>
        <a routerLink="/book" routerLinkActive="active">2 · Book Appointment</a>
        <a routerLink="/appointments" routerLinkActive="active">3 · Appointments</a>
      </nav>
    </header>
    <main><router-outlet /></main>
    <footer>U21CSP12 JavaScript Frameworks · Assignment II · Vigasvel R (24CS241)</footer>
  `,
  styles: `
    header { background: #fff; padding: 16px 36px; display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 14px; border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 5; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .cross { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--blue), var(--teal));
      color: #fff; display: grid; place-items: center; font-size: 22px; }
    h1 { margin: 0; font-size: 22px; color: var(--blue); }
    header p { margin: 0; color: var(--muted); font-size: 12px; }
    nav { display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 12px; }
    nav a { padding: 9px 16px; border-radius: 9px; color: #475569; text-decoration: none; font-size: 14px; font-weight: 600; }
    nav a.active { background: #fff; color: var(--blue); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
    main { max-width: 1180px; margin: 0 auto; padding: 26px 24px; }
    footer { text-align: center; color: var(--muted); font-size: 12px; padding: 18px; }
  `,
})
export class App {}
