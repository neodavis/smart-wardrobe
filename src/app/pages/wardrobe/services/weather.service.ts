import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, tap } from 'rxjs';

@Injectable()
export class WeatherService {
  private _currentWeather$ = signal<unknown>(null);
  private _httpClient = inject(HttpClient);

  get currentWeather$() {
    return this._currentWeather$.asReadonly();
  }

  constructor() {
    this.updateCurrentWeatherData();

    setInterval(() => this.updateCurrentWeatherData(), 60000)
  }

  loadCurrentWeatherData(lat: number, lon: number) {
    this.getCurrentWeather(lat, lon)
      .pipe(
        take(1),
        tap((value) => this._currentWeather$.set(value)),
      )
      .subscribe()
  }

  private updateCurrentWeatherData() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => this.loadCurrentWeatherData(coords.latitude, coords.longitude),
    );
  }

  private getCurrentWeather(lat: number, lon: number) {
    return this._httpClient.get('https://api.weatherbit.io/v2.0/current', {
      params: {
        lat,
        lon,
        key: '45b6c13f49294bb3912b58bad11628eb',
      }
    })
  }
}
