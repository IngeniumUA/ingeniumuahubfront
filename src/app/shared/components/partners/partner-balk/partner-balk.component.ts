import {Component, OnDestroy} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

interface PartnerDisplay {
  xOffset: number
  logo: string
}

@Component({
    selector: 'app-partner-balk',
    templateUrl: './partner-balk.component.html',
    styleUrls: ['./partner-balk.component.css'],
    imports: [
        NgClass,
        NgForOf
    ]
})
export class PartnerBalkComponent implements OnDestroy {

  partners: PartnerDisplay[] = [

  ];
  displayedPartners: PartnerDisplay[] = [
    {xOffset: 0, logo: 'assets/images/sponsors/SparklinkLogo.png'},
    {xOffset: 0, logo: 'assets/images/sponsors/umicore-logo-2017.svg'},
    {xOffset: 0, logo: 'assets/images/sponsors/Vorsselmans_logo.png'},
  ];

  /*ngOnInit() {
    this.intervalId = setInterval(this.DoStep, 1000);
  }*/

  intervalId!: any;

  DoStep() {
    console.log(this.displayedPartners);
  }

  GetStyleClass(_partner: PartnerDisplay): any {

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
