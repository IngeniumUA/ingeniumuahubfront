import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";

@Component({
    selector: 'app-staff-page',
    templateUrl: './staff-event-page.component.html',
    styleUrls: ['./staff-event-page.component.css'],
    standalone: false
})
export class StaffEventPageComponent implements OnInit {
  event$?: Observable<ItemWideI>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemWideService: ItemWideService) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id === null) {
      this.router.navigateByUrl('home');
      return;
    }
    this.SetEvent(id);
  }

  SetEvent(id: string): void {
    this.event$ = this.itemWideService.getItem(id);
  }
}
