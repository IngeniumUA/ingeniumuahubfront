import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, ignoreElements, Observable, of} from 'rxjs';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";

@Component({
  selector: 'app-vacature-display',
  templateUrl: './vacature-display.component.html',
  styleUrls: ['./vacature-display.component.scss']
})
export class VacatureDisplayComponent implements OnInit {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacature$: Observable<ItemWideLimitedI> = of();
  vacatureError$!: Observable<any>;
  item_id!: string;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private layoutService: LayoutService,
              private promoService: PromoService) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.IdError();
      return;
    }

    this.item_id = id;
    this.vacature$ = this.promoService.getPromo('vacature', this.item_id);
    this.vacatureError$ = this.vacature$.pipe(
      ignoreElements(),
      catchError((err) => {
        return of(err);
      })
    );
  }

  IdError() {
    this.router.navigateByUrl('/vacatures');
  }

  ImageDivClass(isMobile: boolean | null) {
    if (isMobile === null) {
      return 'mx-[20%]';
    }
    if (isMobile) {
      return '';
    } else {
      return 'mx-[20%]';
    }
  }
}
