import { Component } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-partner-balk',
  templateUrl: './partner-balk.component.html',
  styleUrls: ['./partner-balk.component.css'],
  imports: [
    NgClass,
    NgForOf
  ],
  standalone: true
})
export class PartnerBalkComponent {

  displayedPartners: any = []

  GetStyleClass(partner: any): any {

  }
}
