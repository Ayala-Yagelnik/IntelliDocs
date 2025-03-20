import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data;
        this.loading = false;
        console.log('Users:', this.users);
        this.users.forEach(user => { user.accountStatus === "Active" ? user.isActive = true : user.isActive = false });
      },
      (error: any) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    );
  }

  deactivateUser(userId: number): void {
    this.userService.deactivateUser(userId).subscribe(
      () => {
        console.log('User deactivated successfully');
        this.fetchUsers();
      },
      (error) => {
        console.error('Error deactivating user:', error);
      }
    );
  }
  reactivateUser(userId: number): void {
    this.userService.reactivateUser(userId).subscribe(
      () => {
        console.log('User reactivated successfully');
        this.fetchUsers(); // Refresh the user list
      },
      (error) => {
        console.error('Error reactivating user:', error);
      }
    );
  }
}
