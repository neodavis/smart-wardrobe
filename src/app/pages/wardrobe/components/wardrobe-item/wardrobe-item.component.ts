import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-wardrobe-item',
  standalone: true,
  templateUrl: './wardrobe-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WardrobeItemComponent { }
