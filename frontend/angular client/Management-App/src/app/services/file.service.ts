import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private apiUrl = "http://localhost:5046/api/Files";

    constructor(private http: HttpClient) { }

    getAllFiles(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }
    getTotalStorageUsed(): Observable<{ totalStorageInGB: number }> {
        return this.http.get<{ totalStorageInGB: number }>(`${this.apiUrl}/total-storage`);
    }
}