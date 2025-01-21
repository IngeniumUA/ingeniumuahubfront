import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicFooterComponent } from '../../core/layout/public/footer/public-footer.component';

@Component({
    selector: 'app-template-wrapper',
    templateUrl: './public-routing.component.html',
    imports: [RouterOutlet, PublicFooterComponent]
})
export class PublicRoutingComponent {

}
