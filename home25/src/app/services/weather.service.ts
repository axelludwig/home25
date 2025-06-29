// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherResponse } from './store.service';

@Injectable({ providedIn: 'root' })
export class WeatherService {
    private apiKey = environment.apiKey;
    private urlBase = 'https://api.openweathermap.org/data/2.5/weather';

    constructor(private http: HttpClient) { }

    getWeather(lat: number, lon: number): Observable<WeatherResponse> {
        const url = `${this.urlBase}?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${this.apiKey}`;
        return this.http.get(url) as Observable<WeatherResponse>;
    }
}
