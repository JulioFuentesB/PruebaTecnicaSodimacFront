import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  private httpReqCounter = 0;

  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.httpReqCounter++;
    this.spinner.show();

    return next.handle(request).pipe(
      tap({
        error: (error) => {
          this.httpReqCounter = 0;
          this.spinner.hide();
        },
      }),
      finalize(() => {
        this.httpReqCounter--;

        if (this.httpReqCounter <= 0) {
          this.httpReqCounter = 0;
          this.spinner.hide();
        }
      })
    );
  }
}
