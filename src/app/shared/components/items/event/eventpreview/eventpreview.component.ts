import {Component, Input, OnInit} from '@angular/core';
import {EventPreviewModel} from "../../../../models/items/events";
import {Router} from "@angular/router";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'app-eventpreview',
  templateUrl: './eventpreview.component.html',
  styleUrls: ['./eventpreview.component.css']
})
export class EventpreviewComponent implements OnInit {
  @Input() eventPreview!: EventPreviewModel

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,) {
  }
  isMobile: boolean = true;
  primaryColor90!: string;
  primaryColorFull!: string;
  ngOnInit() {
    this.breakpointObserver  // Breakpoint Observable for responsiveness
      .observe(['(min-width: 850px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = !state.matches;
      });

    const primaryBackground = "rgba("
      + this.eventPreview.main_color.substring(0, 3) + ", "
      + this.eventPreview.main_color.substring(3, 6) + ", "
      + this.eventPreview.main_color.substring(6, 9)

    this.primaryColor90 = primaryBackground + ", 0.9)";
    this.primaryColorFull = primaryBackground + ")";
  }

  public RedirectToEvent(): void {
    this.router.navigate(['event/' + this.eventPreview.item.id]);
  }
}
