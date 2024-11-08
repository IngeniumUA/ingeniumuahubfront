import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageTrackingService {

  constructor() { }

  public addToTree(Page: string) {
    if (pageTree[pageTree.length - 1] === Page) {return}
    if (pageTree.includes(Page)) {
        const index = pageTree.indexOf(Page, 0);
        if (index > -1) {
            pageTree.splice(0, index + 1);  // this removes the entire tree up to and including the last time the page to be added was visited
        }
    }
    pageTree.push(Page)
    currentPage = Page
  }

  public popFromTree() {
    if (pageTree.length > 1) {
      pageTree.pop()
      currentPage = pageTree[pageTree.length - 1]
    }
  }

  public setTreeToRoot() {
    document.documentElement.classList.toggle('ion-palette-dark', false);
    document.documentElement.style.setProperty('--ing-ion-color', '#000000')
    pageTree = [""]
  }

}

export let currentPage: string = "scan"
export let pageTree: string[] = [""]
