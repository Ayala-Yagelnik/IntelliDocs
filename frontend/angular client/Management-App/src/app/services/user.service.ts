import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "https://intellidocs-server.onrender.com/api/users";

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  deactivateUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
  reactivateUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${userId}/reactivate`, {});
  }
  getUserStorageUsage(): Observable<{ username: string; email: string; storageUsed: number }[]> {
    return this.http.get<{ username: string; email: string; storageUsed: number }[]>(`${this.apiUrl}/storage-usage`);
  }
}