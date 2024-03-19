import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {EventItemDetailI} from '../../../../shared/models/items/events';
import {EventService} from '../../../../core/services/items/events/event.service';

@Component({
  selector: 'app-staff-event-detail',
  templateUrl: './staff-event-detail.component.html',
  styleUrls: ['./staff-event-detail.component.css'],
})
export class StaffEventDetailComponent implements OnInit {
  event$?: Observable<EventItemDetailI>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private eventService: EventService) {
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
    this.event$ = this.eventService.getEvent(id);
  }
}
