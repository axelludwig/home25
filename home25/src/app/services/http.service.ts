import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { 
        console.log('API URL:', this.baseUrl);
    }

    getWeather(lat: number, lon: number) {
        return this.http.get(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}`);
    }

}