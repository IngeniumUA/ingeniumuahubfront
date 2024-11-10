import {Component, EventEmitter, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-delete-button',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './delete-button.component.html',
})
export class DeleteButtonComponent {

  @Output() public deleteEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  deleteBuffer: boolean = false;
  loadingDisable: boolean = false;

  public updateDeleteStatus() {
    // First press toggles "are you sure?"
    if (! this.deleteBuffer) {
      this.deleteBuffer = true;
      return;
    }

    // Second press emits event
    this.loadingDisable = true;
    this.deleteEvent.emit(true);
  }

}
