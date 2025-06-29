import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WeatherService } from './weather.service';
import { GeolocationService } from './geo.service';

export interface WeatherResponse {
    base: string;
    clouds: {
        all: number;
    };
    cod: number;
    coord: {
        lon: number;
        lat: number;
    };
    dt: number;
    id: number;
    main: {
        feels_like: number;
        grnd_level: number;
        humidity: number;
        pressure: number;
        sea_level: number;
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    name: string;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    visibility: number;
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
        deg: number;
    };
}


@Injectable({
    providedIn: 'root'
})


export class StoreService {



    public weatherData: any;

    constructor(private http: HttpClient, private weatherService: WeatherService, private geoService: GeolocationService) {
        this.geoService.getCurrentPosition().subscribe((coords) => {
            this.weatherService.getWeather(coords.latitude, coords.longitude).subscribe((weather) => {
                this.weatherData = weather;
                console.log('Weather data:', weather);
            });

        });
    }


}