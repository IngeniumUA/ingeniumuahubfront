import {Injectable} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  private DEFAULT_TITLE = 'Ingenium UA - Studentenvereninging FTI';

  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} | ${this.DEFAULT_TITLE}`);
      return;
    }

    this.title.setTitle(this.DEFAULT_TITLE);
  }
}
