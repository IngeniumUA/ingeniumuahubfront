import { Component } from '@angular/core';
import { PublicHeaderComponent } from '../../core/layout/public/header/public-header.component';
import { PublicFooterComponent } from '../../core/layout/public/footer/public-footer.component';

@Component({
    selector: 'app-page',
    templateUrl: './notfoundpage.component.html',
    styleUrls: ['./notfoundpage.component.css'],
    imports: [PublicHeaderComponent, PublicFooterComponent]
})
export class NotfoundpageComponent {

}
