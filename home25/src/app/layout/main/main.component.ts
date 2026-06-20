import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WeatherComponent } from '../../features/weather/weather.component';
import { MenuComponent } from '../../features/menu/menu.component';
import { Card3dDirective } from '../../core/directives/card-3d.directive';

@Component({
  selector: 'app-main',
  imports: [WeatherComponent, MenuComponent, Card3dDirective],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  currentTime = '';
  currentDate = '';
  currentDay = '';

  private tickIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.refreshClock();
    this.tickIntervalId = setInterval(() => this.refreshClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  private refreshClock(): void {
    const now = new Date();

    this.currentTime = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);

    this.currentDate = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(now);

    this.currentDay = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long'
    }).format(now);
  }

}