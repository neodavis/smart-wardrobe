import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';

import { WardrobeItemComponent, WeatherWidgetComponent, WardrobeItemModalComponent } from './components';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../shared/users/services';
import { FormsModule } from '@angular/forms';
import { WardrobeService } from './services';
import { take, tap } from 'rxjs';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ClothingItemResponse, ClothingType } from '../../shared/models';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-wardrobe',
  standalone: true,
  imports: [WardrobeItemComponent, WeatherWidgetComponent, MatButtonModule, MatButtonModule, MatDialogModule, FormsModule, MatSlideToggle, KeyValuePipe],
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
    return this.clothes$()
        .filter((item) => item.name.toLowerCase().includes(this.searchValue$().toLowerCase()))
        .reduce((acc: Record<ClothingType, ClothingItemResponse[]>, item: ClothingItemResponse) => {
          acc[item.clothingType].push(item);
          return acc;
        }, {
          [ClothingType.OuterWear]: [],
          [ClothingType.HeadWear]: [],
          [ClothingType.TopWear]: [],
          [ClothingType.BottomWear]: [],
          [ClothingType.FootWear]: [],
        });
  });
  recommendationMode$ = signal<boolean>(false);

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
  ) {
  }

  ngOnInit() {
    this.usersService.loadClothesCollection();
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
