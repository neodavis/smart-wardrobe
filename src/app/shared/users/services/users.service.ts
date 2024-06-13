import { effect, inject, Injectable, signal } from '@angular/core';
import { ClothingItemResponse, ClothingType, RecommendedClothingItemResponse, StyleType } from '../../models';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { WeatherService } from '../../../pages/wardrobe/services';
import { UserDto } from '../../models/user.model';
import { User } from '../../auth/models';
import { AuthService } from '../../auth/services';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private _clothes$ = signal<ClothingItemResponse[]>([]);
  private _recommendedClothes$ = signal<RecommendedClothingItemResponse[]>([]);
  private _user$ = signal<User | null>(null);
  private _styleTypeFilter$ = signal<StyleType[]>([]);
  private _clothesTypeFilter$ = signal<ClothingType[]>([]);

  private _httpClient = inject(HttpClient);
  private _weatherService = inject(WeatherService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  private basic = 'http://localhost:8080/users/self';

  get clothes$() {
    return this._clothes$.asReadonly();
  }

  get user$() {
    return this._user$.asReadonly()
  }

  get recommendedClothes$() {
    return this._recommendedClothes$.asReadonly();
  }

  constructor() {
    effect(() => this._authService.userId$() ? this.fetchUser() : this._user$.set(null), { allowSignalWrites: true });

    effect(() => {
      this.loadClothesCollection();

      const currentWeather = this._weatherService.currentWeather$();

      if (currentWeather) {
        const { temp, wind_spd, precip } = currentWeather;
        this.loadRecommendedClothesCollection({ temperature: temp, windSpeed: wind_spd, precipitation: precip })
      }
    });
  }

  updateStyleTypeFilter(filter: StyleType[]) {
    this._styleTypeFilter$.set(filter);
  }

  updateClothesTypeFilter(filter: ClothingType[]) {
    this._clothesTypeFilter$.set(filter);
  }

  loadClothesCollection() {
    this.getClothesCollection(this._clothesTypeFilter$(), this._styleTypeFilter$())
      .pipe(
        take(1),
        tap((response) => this._clothes$.set(response)),
      )
      .subscribe()
  }

  saveUserPhoto(file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    return this._httpClient.post(`${this.basic}/image`, formData)
  }

  editUser(userDto: UserDto) {
    return this._httpClient.patch<UserDto>(this.basic, userDto);
  }

  private loadRecommendedClothesCollection(weatherData: { temperature: number, windSpeed: number, precipitation: number }) {
    this.getRecommendedClothesCollection(weatherData, this._clothesTypeFilter$())
      .pipe(
        take(1),
        tap((response) => this._recommendedClothes$.set(response)),
      )
      .subscribe()
  }

  private getRecommendedClothesCollection(weatherData: { temperature: number, windSpeed: number, precipitation: number }, clothingTypes: ClothingType[]) {
    return this._httpClient.get<RecommendedClothingItemResponse[]>(`${this.basic}/wardrobe/recommendation`, {
      params: {
        'clothingTypes': clothingTypes,
        'temperature': weatherData.temperature,
        'wind-speed': weatherData.windSpeed,
        'precipitation': weatherData.precipitation,
        'number': 5,
      },
    });
  }

  private getClothesCollection(clothingTypes: ClothingType[], styleTypes: StyleType[]) {
    return this._httpClient.get<ClothingItemResponse[]>(`${this.basic}/wardrobe`, { params: { clothingTypes, styleTypes } });
  }

  private fetchUser() {
    this._httpClient.get<User>(`${this.basic}`)
      .pipe(
        tap((user) => this._user$.set(user)),
      )
      .subscribe();
  }
}
