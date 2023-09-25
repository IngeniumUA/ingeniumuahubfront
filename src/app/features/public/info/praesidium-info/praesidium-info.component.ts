import { Component, Inject, Renderer2 } from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-praesidium-info',
  templateUrl: './praesidium-info.component.html',
  styleUrls: ['./praesidium-info.component.css']
})
export class PraesidiumInfoComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {
    // this.document.body.style.backgroundColor = "#d8c7bc";    
    this.document.body.style.backgroundColor = "#554746";        
  }
}
