import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BooksRoutingModule } from './books-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../auth/shared/services/auth.service';

@NgModule({
  declarations: [BookListComponent, BookDetailComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BooksRoutingModule,
    FormsModule,
    SharedModule,
  ],
  providers: [],
})
export class BooksModule {}
