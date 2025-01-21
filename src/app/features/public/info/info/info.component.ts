import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-page',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    PublicHeaderComponent,
    NgOptimizedImage
  ]
})
export class InfoComponent {

}
