import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  loading = false;

  usersCount = 100; // לדוגמה
  activeUsers = 80; // לדוגמה
  siteTraffic = 2000; // לדוגמה

  navigateToUsers() {
    // כאן יפנה לדף ניהול המשתמשים
  }

  navigateToStats() {
    // כאן יפנה לדף הסטטיסטיקות
  }
}
