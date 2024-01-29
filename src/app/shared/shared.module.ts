import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/shared/services/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppInputBorderDirective } from './directives/app-input-border.directive';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    AppInputBorderDirective,
  ],
  imports: [CommonModule, RouterModule, HttpClientModule],
  exports: [
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    AppInputBorderDirective,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
