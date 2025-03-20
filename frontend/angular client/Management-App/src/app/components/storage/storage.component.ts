import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent implements OnInit {
  totalStorageInGB: number = 0;
files: any[] = [];
loading: boolean = true;
users:any[]=[];
  constructor(private fileService: FileService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchTotalStorage();
    this.fetchUserStorage();

  }

  fetchTotalStorage(): void {
    this.fileService.getTotalStorageUsed().subscribe(
      (data) => {
        this.totalStorageInGB = data.totalStorageInGB;
        // this.loading=false;
      },
      (error) => {
        console.error('Error fetching total storage:', error);
      }
    );
  }

  fetchUserStorage(): void {
    this.userService.getUserStorageUsage().subscribe(
      (data) => {
        this.users = data.sort((a, b) => b.storageUsed - a.storageUsed);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching user storage usage:', error);
      }
    );
  }
}
