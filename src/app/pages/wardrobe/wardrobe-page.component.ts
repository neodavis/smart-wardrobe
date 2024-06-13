import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';

import { WardrobeItemComponent, WeatherWidgetComponent, WardrobeItemModalComponent } from './components';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../shared/users/services';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WardrobeService, WeatherService } from './services';
import { startWith, take, tap } from 'rxjs';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ClothingItemResponse, ClothingType, RecommendedClothingItemResponse, StyleType } from '../../shared/models';
import { KeyValuePipe } from '@angular/common';
import { LocationNotAllowedComponent } from '../../shared/location-not-allowed/location-not-allowed.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-wardrobe',
  standalone: true,
  imports: [
    WardrobeItemComponent,
    WeatherWidgetComponent,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatSlideToggle,
    KeyValuePipe,
    LocationNotAllowedComponent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './wardrobe-page.component.html',
  styleUrl: 'wardrobe-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WardrobePageComponent implements OnInit {
  clothes$ = this.usersService.clothes$;
  recommendedClothes$ = this.usersService.recommendedClothes$;
  searchValue$ = signal<string>('');
  clothesFilteredByName$ = computed(() => this.clothes$().filter((item) => item.name.toLowerCase().includes(this.searchValue$().toLowerCase())));
  recommendedClothesGroupedByType$ = computed(() => {
    return this.recommendedClothes$()
        .filter((item) => item.clothingItem.name.toLowerCase().includes(this.searchValue$().toLowerCase()))
        .reduce((acc: Record<ClothingType, RecommendedClothingItemResponse[]>, item: RecommendedClothingItemResponse) => {
          acc[item.clothingItem.clothingType] ? acc[item.clothingItem.clothingType].push(item) : acc[item.clothingItem.clothingType] = [item];
          return acc;
        }, { } as Record<ClothingType, RecommendedClothingItemResponse[]>);
  });
  recommendationMode$ = signal<boolean>(false);
  doesLocationAllowed$ = this.weatherService.doesLocationAllowed$;
  styleTypeControl = new FormControl<StyleType[]>(Object.values(StyleType));
  clothingTypeControl = new FormControl<ClothingType[]>(Object.values(ClothingType));

  readonly ClothingType = ClothingType;
  readonly StyleType = StyleType;
  readonly clothTypeLabel: Record<string, string> = {
    [ClothingType.BottomWear]: 'Нижній одяг',
    [ClothingType.FootWear]: 'Взуття',
    [ClothingType.HeadWear]: 'Головний убір',
    [ClothingType.OuterWear]: 'Зовнішній одяг',
    [ClothingType.TopWear]: 'Нижній одяг',
  }

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private wardrobeService: WardrobeService,
    private weatherService: WeatherService,
  ) {
  }

  ngOnInit() {
    this.usersService.loadClothesCollection();

    this.clothingTypeControl.valueChanges
      .pipe(
        startWith(this.clothingTypeControl.value),
        tap((value) => this.usersService.updateClothesTypeFilter(value!)),
      )
      .subscribe()

    this.styleTypeControl.valueChanges
      .pipe(
        startWith(this.styleTypeControl.value),
        tap((value) => this.usersService.updateStyleTypeFilter(value!)),
      )
      .subscribe()
  }

  openItemCreationModal() {
    this.dialog.closeAll();
    this.dialog.open(WardrobeItemModalComponent);
  }

  openItemEditionModal(id: string) {
    this.dialog.closeAll();
    this.dialog.open(WardrobeItemModalComponent, { data: this.clothes$().find((item) => item.id === id) });
  }

  deleteItem(id: string) {
    this.wardrobeService.deleteClothingItem(id)
      .pipe(
        take(1),
        tap(() => this.usersService.loadClothesCollection()),
      )
      .subscribe()
  }
}
