import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { WardrobeItemComponent, WeatherWidgetComponent } from './components';
import { WardrobeService } from './services';

@Component({
  selector: 'app-wardrobe',
  standalone: true,
  imports: [WardrobeItemComponent, WeatherWidgetComponent],
  providers: [WardrobeService],
  templateUrl: './wardrobe-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WardrobePageComponent {
  clothes$ = signal([]);
}
