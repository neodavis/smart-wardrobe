import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'getSecuredImage',
  standalone: true,
})
export class GetSecuredImagePipe implements PipeTransform {
  transform(url: string): Observable<string> {
    // TODO: implement adding of auth token to image query
    return of('');
  }
}
