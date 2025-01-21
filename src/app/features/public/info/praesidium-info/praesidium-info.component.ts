import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of, Subject, takeUntil} from 'rxjs';
import {PraesidiumGroupI} from "@ingenium/app/shared/models/praesidium";

import praesidium from "@ingenium/app/shared/data/praesidium";
import {Title} from "@angular/platform-browser";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";

@Component({
  selector: 'app-page',
  templateUrl: './praesidium-info.component.html',
  styleUrls: ['./praesidium-info.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    NgIf,
    NgClass,
    PublicHeaderComponent
  ]
})
export class PraesidiumInfoComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private titleService: Title) {}

  validYears: string[] = Object.keys(praesidium); // Put newest year first
  currentYear: string = this.validYears[0];
  praesidium$: Observable<PraesidiumGroupI[]> = of([]);

  ngOnInit() {
    // Fetch ID
    this.currentYear = this.route.snapshot.paramMap.get('year') || this.validYears[0];
    this.SetupYear(this.currentYear);
    this.titleService.setTitle(`Praesidium '${this.currentYear}`);

    // Start a watcher for the route parameter
    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe) // Unsubscribe behaviour
    ).subscribe(params => {
      const year = params.get('year');
      if (year === null) return;
      this.SetupYear(year);
    });
  }

  SetupYear(year: string) {
    if (!this.validYears.includes(year)) {
      this.router.navigateByUrl('/info/praesidium/' + this.validYears[0]).then(() => {});
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
}
