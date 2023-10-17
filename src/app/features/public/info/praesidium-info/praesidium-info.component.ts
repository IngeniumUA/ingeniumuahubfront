import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of, Subject, takeUntil} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";

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
              private httpClient: HttpClient) {
  }
  yearControl = new FormControl<string>('');
  yearForm!: FormGroup;
  validYears: string[] = ['18-19', '19-20', '20-21', '21-22', '22-23', '23-24'];
  praesidium$: Observable<PraesidiumGroupI[]> = of([])

  ngOnInit() {
    // Fetch ID
    const year: string | null = this.route.snapshot.paramMap.get('year');

    // If ID is null
    if (year === null) {
      this.NavigateCurrentYear();
      return
    }

    // Setup form
    this.yearControl.patchValue(year);

    // Event for form changeing
    this.yearControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe) // Unsubscribe behaviour
      )
      .subscribe(selectedValue => {
        if (selectedValue === null) {
          this.NavigateCurrentYear()
        } else {
          // Changes the url
          this.router.navigateByUrl('/info/praesidium/' + selectedValue).then(() => {})
          this.SetupYear(selectedValue)
          return
        }
      }
    )
    // Setupfunction
    this.SetupYear(year)
  }

  NavigateCurrentYear() {
    this.router.navigateByUrl('/info/praesidium/23-24').then(() => {})
    return
  }

  SetupYear(year: string) {
    const filePath: string = '/assets/praesidium_files/praesidium_' + year + '.json'

    if (this.validYears.includes(year)) {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
    } else {
      // If no years match we redirect to current year
      this.NavigateCurrentYear()
      return
    }
  }

  private ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
