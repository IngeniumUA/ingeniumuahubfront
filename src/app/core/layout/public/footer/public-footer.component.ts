import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AsyncPipe, NgClass} from "@angular/common";
import {LayoutService} from "../../../services/layout/layout.service";
import {Observable} from "rxjs";

@Component({
  standalone: true, // Allows it to be imported outside of routing
  selector: 'app-layout-public-footer',
  templateUrl: './public-footer.component.html',
  imports: [
    NgClass,
    AsyncPipe
  ],
  styleUrls: ['./public-footer.component.css']
})
export class PublicFooterComponent {
  isMobile$: Observable<boolean> = this.layoutService.isMobile;

  constructor(private router: Router,
              private layoutService: LayoutService) {
  }
}
