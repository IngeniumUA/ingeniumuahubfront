import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import { readAndParseJson} from "@angular/cli/src/utilities/json-file";
import {assert} from "@angular/compiler-cli/linker";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

enum FunctieEnum {
  praeses = 'Praeses',
  vicePraeses = 'Vice-Praeses',
  quaestor = 'Quaestor',
  cantor = 'Cantor',

  businessRelations = 'Business Relations',
  event = 'Event',

  temmer = 'Schachtentemmer',
  zeden = 'Zedenmeester',

  webmaster = 'Webmaster',

  publicRelations = 'Public Relations',

  abactis = 'Ab-Actis',
  scriptor = 'Scriptor',

  feest = 'Feest',

  sport = 'Sport',
  soc = 'SOC',

  peter = 'Peter',
  biermeester = 'Biermeester',

  media = 'Media',

  mentor = 'Mentor',
  education = 'Education',
  edu_eict = 'Education EICT',
  edu_bouwkunde = 'Education Bouwkunde',
  edu_chemie = 'Education Chemie',
  edu_em = 'Education Elektromechanica'
}

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
export class PraesidiumInfoComponent implements OnInit {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private httpClient: HttpClient) {
  }

  praesidium$: Observable<PraesidiumGroupI[]> = of([])
  ngOnInit() {
    // Fetch ID
    const year: string | null = this.route.snapshot.paramMap.get('year');

    // If ID is null
    if (year === null) {
      this.NavigateCurrentYear();
      return
    }

    // Setupfunction
    this.SetupYear(year)
  }

  NavigateCurrentYear() {
    this.router.navigateByUrl('/info/praesidium/23-24')
    return
  }

  SetupYear(year: string) {
    const filePath: string = '/assets/praesidium_files/praesidium_' + year + '.json'

    if (year == '23-24') {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
    }
    else if (year == '22-23') {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
      }
    else if (year == '21-22') {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
    }
    else if (year == '20-21') {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
    }
    else if (year == '19-20') {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
    }
    else if (year == '18-19') {
      this.praesidium$ = this.httpClient.get<PraesidiumGroupI[]>(filePath);
    }
    else {
      // If no years match we redirect to current year
      this.NavigateCurrentYear()
      return
    }
  }
}
