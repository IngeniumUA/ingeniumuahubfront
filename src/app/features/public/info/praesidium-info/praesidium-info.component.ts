import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, Subject, takeUntil} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormControl} from '@angular/forms';

interface PraesidiumButtonI {
  text: string
  url: string
}

interface PraesidiumDisplayI {
  name: string
  functie: string
  image: string
}
interface PraesidiumCategorieI {
  categorieName: string
  categorieDescription: string
  praesidia: PraesidiumDisplayI[]
  button: PraesidiumButtonI
}
interface PraesidiumGroupI {
  groupName: string
  groupDescription: string
  categories: PraesidiumCategorieI[]
}

@Component({
  selector: 'app-praesidium-info',
  templateUrl: './praesidium-info.component.html',
  styleUrls: ['./praesidium-info.component.css']
})
export class PraesidiumInfoComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private httpClient: HttpClient) {}

  yearControl = new FormControl<string>('');
  validYears: string[] = ['23-24', '22-23', '21-22', '20-21', '19-20', '18-19']; // Put newest year first
  praesidium$: Observable<PraesidiumGroupI[]> = of([]);

  ngOnInit() {
    // Fetch ID
    const year: string = this.route.snapshot.paramMap.get('year') || this.validYears[0];
    this.yearControl.patchValue(year);
    this.SetupYear(year);

    // Event for form changeing
    this.yearControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe) // Unsubscribe behaviour
    ).subscribe(selectedValue => {
      if (selectedValue === null) return;
      this.router.navigateByUrl(`/info/praesidium/${selectedValue}`).then(() => {});
    }
    );

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

    this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>( `/assets/praesidium_files/praesidium_${year}.json`);
  }

  private ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
