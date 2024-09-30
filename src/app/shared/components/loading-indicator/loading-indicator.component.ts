import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss'
})
export class LoadingIndicatorComponent {
  @Input() isLoading: boolean = false;
  @Input() title: string = 'Even geduld aub';
  @Input() message: string = 'Jouw verzoek wordt verwerkt';
}
