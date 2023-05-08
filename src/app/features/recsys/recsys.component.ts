import { Component, OnInit, ElementRef } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from "@angular/router";

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface RecSysItem {
  id: string;
  date_created: string;
  name: string;
  description: string;
  image_url: string;
}

@Injectable({
  providedIn: 'root'
})
class RecSysService {
  public baseUrl = "https://ingeniumuahub.ew.r.appspot.com/api/recsys/";
  constructor(private httpClient: HttpClient) { }

  public getItems(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "items")
  }

  public postUser(formdata: object): any {
    this.httpClient.post<any>(this.baseUrl + "user", formdata).subscribe(
      (res) => {
        console.log(res);
        return res;
      },
      (err) => console.log(err)
    );
  }

  public postInteraction(formdata: object) {
    this.httpClient.post<any>(this.baseUrl + "interaction", formdata).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}

@Component({
  selector: 'app-recsys',
  templateUrl: './recsys.component.html',
  styleUrls: ['./recsys.component.css']
})
export class RecsysComponent implements OnInit {

  // Variables
  studeert: boolean = false;
  studeertUA: boolean = false;
  studeertFTI: boolean = false;
  ingeniumLid: boolean = false;
  ingeniumGedoopt: boolean = false;
  ingeniumOntgroend: boolean = false;
  showNext: boolean = false;

  // Formbuilder
  recsysForm = this.formBuilder.group({
    user: this.formBuilder.group({
      studeert: [''],
      studeertUA: [''],
      studeertFTI: [''],
      studeertFaculteit: [''],

      ingeniumLid: [''],
      ingeniumGedoopt: [''],
      ingeniumOntgroend: [''],

      uitgaan: [''],

      interesseFeest: [''],
      interesseSport: [''],
      interesseRelations: [''],
      interesseEducation: [''],
      interesseClubTraditie: [''],
    }),
    interactions: this.formBuilder.group({
      interaction0: [''],
      interaction1: [''],
      interaction2: [''],
      interaction3: [''],
      interaction4: [''],
      interaction5: [''],
      interaction6: [''],
      interaction7: [''],
      interaction8: [''],
      interaction9: [''],
    })
  })

  // Items
  items!: RecSysItem[];
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private recsysService: RecSysService,
              private element: ElementRef) {  }

  ngOnInit(): void {
    this.recsysService.getItems().subscribe(
      data => {this.items = data;}
    )
  }

  onSubmit() {
    // Userdata
    const formData = new FormData();
    const userData: {[key:string]: any} = this.recsysForm.get('user')!.value;
    Object.keys(userData).forEach(key => formData.append(key, this.checkEmpty(userData[key])))

    // All interactionData
    const interactionData: {[key:string]: any} = this.recsysForm.get('interactions')!.value;
    let index: number = 0;
    Object.keys(interactionData).forEach(key => {
      if (this.items.length <= index) {
        return;}
      formData.append("interaction"+index.toString(), interactionData[key])

      index = index + 1;
    })

    //this.formDataService.postFormData(formData);

    // Routing to homepage
    //this.router.navigate([""]); // Redirect to homescreen
  }

  checkEmpty(s: string) {
    if (s === "") {
      s = "false";
    }
    return s;
  }

  async previous() {
    const toHide: Element = this.element.nativeElement.querySelector(".active");
    const toShow: any = toHide.previousElementSibling!;

    toHide.classList.add("slideUpOutOfView");
    await new Promise(f => setTimeout(f, 650));
    toHide.classList.remove("active");
    toHide.classList.remove("slideUpOutOfView");

    this.showNext = true;

    toShow.classList.add("active");
    toShow.classList.add("slideDownIntoView");
    await new Promise(f => setTimeout(f, 650));
    toShow.classList.remove("slideDownIntoView");
  }

  async next() {
    const toHide: Element = this.element.nativeElement.querySelector(".active");
    const toShow: any = toHide.nextElementSibling!;

    toHide.classList.add("slideOutOfView");
    await new Promise(f => setTimeout(f, 650));
    toHide.classList.remove("active");
    toHide.classList.remove("slideOutOfView");

    this.showNext = false;

    toShow.classList.add("active");
    toShow.classList.add("slideIntoView");
    await new Promise(f => setTimeout(f, 650));
    toShow.classList.remove("slideIntoView");
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  radioChange(event:any) {
    let source: string = event.source.name;
    let value: boolean = false;

    if (event.value === "true") {
      value = true;
    }

    switch (source) {
      case "studeert":
        this.showNext = !value;
        this.studeert = value;
        break;
      case "studeertUA":
        this.showNext = !value;
        this.studeertUA = value;
        break;
      case "studeertFTI":
        this.showNext = true;
        this.studeertFTI = value;
        break;
      case "ingeniumLid":
        this.showNext = !value;

        this.ingeniumLid = value;
        break;
      case "ingeniumGedoopt":
        this.showNext = !value;

        this.ingeniumGedoopt = value;
        break;
      case "ingeniumOntgroend":
        this.showNext = true;
        this.ingeniumOntgroend = value;
        break;
      default:
        this.showNext = true;
        break;
    }
  }
}
