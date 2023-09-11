import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: any,
  ) {
  }

  ngOnInit() {
    const s = this.renderer2.createElement('script');
    s.onload = this.loadNextScript.bind(this);
    s.type = 'text/javascript';
    s.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'; // Defines someGlobalObject
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
  }

  loadNextScript() {
    const s = this.renderer2.createElement('script');
    s.text = `
    SumUpCard.mount({
    id: 'sumup-card',
    checkoutId: '2ceffb63-cbbe-4227-87cf-0409dd191a98',
    onResponse: function (type, body) {
      console.log('Type', type);
      console.log('Body', body);
    },
  });
`
    this.renderer2.appendChild(this._document.body, s);
  }
}
