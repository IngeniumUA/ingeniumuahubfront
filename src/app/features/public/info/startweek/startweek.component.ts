import { Component, Inject, Renderer2 } from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-startweek',
  templateUrl: './startweek.component.html',
  styleUrls: ['./startweek.component.css']
})
export class StartweekComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {
    this.document.body.style.backgroundColor = "#BDBEC0";
  }
}
