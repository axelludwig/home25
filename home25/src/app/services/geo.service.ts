// src/app/services/geolocation.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    // ngOnInit() {
    //     this.getCurrentPosition().subscribe({
    //         next: (coords) => {
    //             this.coords = coords;
    //         },
    //         error: (err) => {
    //             console.error('Error getting location:', err);
    //         }
    //     });
    // }

    getCurrentPosition(): Observable<Coordinates> {
        return new Observable<Coordinates>(observer => {
            if (!isPlatformBrowser(this.platformId) || !('geolocation' in navigator)) {
                observer.error('Géolocalisation non supportée');
                return;
            }

            // console.log(navigator);
            navigator.geolocation.getCurrentPosition(
                pos => {
                    observer.next({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    });
                    observer.complete();
                },
                err => observer.error(err),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }
}
