import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {VacatureDisplayComponent} from "./vacatures/vacature-display/vacature-display.component";
import {VacaturesListDisplayComponent} from "./vacatures/vacatures-list-display/vacatures-list-display.component";

const routes: Routes = [
    {path: 'vacature/:id', component: VacatureDisplayComponent },
    {path: 'vacature', component: VacaturesListDisplayComponent },
    {path: 'vacatures', component: VacaturesListDisplayComponent }
    // {path: ':id', component: EventDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromoRoutingModule { }
