import { Component } from '@angular/core';
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";

@Component({
  selector: 'app-page',
  templateUrl: './clublied.component.html',
  styleUrls: ['./clublied.component.css'],
  standalone: true,
  imports: [
    PublicHeaderComponent
  ]
})
export class ClubliedComponent { }
