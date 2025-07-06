import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from './modules/core/services/data.service';
import { HeaderObj, PageService } from './modules/core/services/page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showMsj = false;
  showContent = false;


  constructor(
    public pageService: PageService,
    private router: Router,
  ) {
    this.pageService.setHeaderPage(new HeaderObj('<PAGE_NAME>'));

  }

  ngOnInit(): void {

    
  }



  // handlerBack(newRoute: string): void {
  //   const navigationExtras: NavigationExtras = { queryParams: { token: this.storageService.userLogged } };
  //   this.router.navigate([newRoute], navigationExtras);
  // }
}

