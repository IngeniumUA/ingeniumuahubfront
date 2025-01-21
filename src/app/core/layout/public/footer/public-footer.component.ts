import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {LayoutService} from '../../../services/layout/layout.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-layout-public-footer',
    templateUrl: './public-footer.component.html',
    imports: [
        NgClass,
        AsyncPipe,
        RouterLink,
        NgOptimizedImage
    ],
    styleUrls: ['./public-footer.component.scss']
})
export class PublicFooterComponent {
  isMobile$: Observable<boolean> = this.layoutService.isMobile;

  constructor(private router: Router,
              private layoutService: LayoutService) {
  }
}
