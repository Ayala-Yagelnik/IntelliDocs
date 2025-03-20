import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
isLoggedIn:boolean=false;
private authSubscription: Subscription = new Subscription();
constructor(private authService: AuthService) { }
ngOnInit(): void {
  this.authSubscription = this.authService.isLoggedIn().subscribe(loggedIn => {
    this.isLoggedIn = loggedIn;
  });
}

ngOnDestroy(): void {
  if (this.authSubscription) {
    this.authSubscription.unsubscribe();
  }
}

logout() {
  this.authService.logout();  
}
}
