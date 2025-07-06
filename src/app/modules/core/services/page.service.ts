import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export class HeaderObj {
  tittleName: string;
  routePath: string;
  backButton: boolean;

  constructor(tittleName: string, routePath: string = '', backButton: boolean = false) {
    this.tittleName = tittleName;
    this.routePath  = routePath;
    this.backButton = backButton;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private readonly headerPageVar;

  constructor() {
    this.headerPageVar = new BehaviorSubject(new HeaderObj(''));
  }

  get headerPage(): BehaviorSubject<HeaderObj> {
    return this.headerPageVar;
  }

  setHeaderPage(value: HeaderObj) {
    setTimeout(() => this.headerPageVar.next(value), 0);
  }
}
