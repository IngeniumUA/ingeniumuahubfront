import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isMobile: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile = this.breakpointObserver
      .observe('(min-width: 850px)')
      .pipe(
        map((breakpointState) => (!breakpointState.matches))
      );
  }
}
