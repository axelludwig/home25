import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { 
        console.log('API URL:', this.baseUrl);
        this.getWeather(48.8566, 2.3522).subscribe(console.log);
    }

    getWeather(lat: number, lon: number) {
        return this.http.get(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}`);
    }

}