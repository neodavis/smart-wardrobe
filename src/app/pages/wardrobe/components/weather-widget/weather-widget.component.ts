import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherService } from '../../services';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  providers: [WeatherService],
  templateUrl: './weather-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherWidgetComponent {
  currentWeather$ = this.weatherService.currentWeather$

  constructor(private weatherService: WeatherService) { }
}
