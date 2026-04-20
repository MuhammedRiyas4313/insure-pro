import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = `${environment.apiUrl}/policies`;

  constructor(private http: HttpClient) { }

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl);
  }

  createPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.apiUrl, policy);
  }

  updatePolicy(id: string, policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/${id}`, policy);
  }

  deletePolicy(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
