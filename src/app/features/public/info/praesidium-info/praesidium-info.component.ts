import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {PraesidiumGroupI} from "@ingenium/app/shared/models/praesidium";

import praesidium from "@ingenium/app/shared/data/praesidium";
import {Title} from "@angular/platform-browser";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './praesidium-info.component.html',
  styleUrls: ['./praesidium-info.component.scss']
})
export class PraesidiumInfoComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              private titleService: Title,
              private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
  }

  validYears: string[] = Object.keys(praesidium); // Put newest year first
  currentYear: string = this.validYears[0];
  praesidium$: Observable<PraesidiumGroupI[]> = of([]);

  ngOnInit() {
    // Fetch ID
    this.currentYear = this.route.snapshot.paramMap.get('year') || this.validYears[0];
    this.SetupYear(this.currentYear);
    this.titleService.setTitle(`Praesidium '${this.currentYear}`);
  }

  SetupYear(year: string) {
    if (!this.validYears.includes(year)) {
      this.gotoPage('sub/info/praesidium/' + this.validYears[0])
      return;
    }

    // @ts-expect-error there isn't a type for this. I might change this later and thus am too lazy right now
    this.praesidium$ = of(praesidium[year]);
    this.currentYear = year;
  }

  private ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}
}
