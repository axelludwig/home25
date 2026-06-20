import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { StoreService } from './services/store.service';
import { Card3dDirective } from '../../core/directives/card-3d.directive';


@Component({
  selector: 'app-weather',
  imports: [Card3dDirective],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public store: StoreService
  ) {}

  ngOnInit() {}
}
