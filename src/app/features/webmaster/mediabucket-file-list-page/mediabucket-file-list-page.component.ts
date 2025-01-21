import { Component } from '@angular/core';
import {MediabucketFileService} from "@ingenium/app/core/services/coreAPI/file.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-mediabucket-file-list-page',
    imports: [
        AsyncPipe,
        NgIf,
        NgForOf
    ],
    templateUrl: './mediabucket-file-list-page.component.html',
    styleUrl: './mediabucket-file-list-page.component.css'
})
export class MediabucketFileListPageComponent {

  constructor(private fileService: MediabucketFileService) {
  }

  $fileNames: Observable<string[]> = this.fileService.listFileNames();
}
