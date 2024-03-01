import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PromoService} from "../../../../../core/services/items/promo/promo.service";
import {Observable, of} from "rxjs";
import {PromoI} from "../../../../../shared/models/items/promo";

@Component({
  selector: 'app-vacature-display',
  templateUrl: './vacature-display.component.html',
  styleUrls: ['./vacature-display.component.css']
})
export class VacatureDisplayComponent implements OnInit {

  vacature$: Observable<PromoI> = of();
  item_id!: string

  constructor(private route: ActivatedRoute,
              private router: Router,
              private promoService: PromoService) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.router.navigateByUrl('/vacatures')
      return
    }

    this.item_id = id;
    this.vacature$ = this.promoService.getPromo('vacature', this.item_id)
  }

}
