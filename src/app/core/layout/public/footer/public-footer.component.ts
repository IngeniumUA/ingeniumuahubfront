import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {LayoutService} from '../../../services/layout/layout.service';
import {Observable} from 'rxjs';
import {AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  standalone: true, // Allows it to be imported outside of routing
  selector: 'app-layout-public-footer',
  templateUrl: './public-footer.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./public-footer.component.scss']
})
export class PublicFooterComponent {
  isMobile$: Observable<boolean> = this.layoutService.isMobile;

  constructor(private layoutService: LayoutService,
              private appFunctionsService: AppFunctionsService,) {
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
