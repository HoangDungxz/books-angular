import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IResponse } from 'src/app/shared/models';
import { IBook } from 'src/app/shared/models/Books';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private apiUrl = 'http://localhost:3000'; // Replace with your actual API base URL

  // Using BehaviorSubject for books
  private _books: BehaviorSubject<IResponse<IBook[]>> = new BehaviorSubject<
    IResponse<IBook[]>
  >({ data: [] });
  private books$ = this._books.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  /**
   * Get a paginated list of books with optional genre filter.
   * @param page - The page number.
   * @param genre - Optional genre filter.
   */
  getAllBooks(page: number, genre?: string): Subscription {
    let url = `${this.apiUrl}/books?page=${page}`;
    if (genre) {
      url += `&genre=${genre}`;
    }

    return this.http.get<IResponse<IBook[]>>(url).subscribe({
      next: (response: IResponse<IBook[]>) => {
        // Update the books BehaviorSubject
        this._books.next(response);
        // Process the response if needed
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Error while retrieving books', 'Error');
      },
    });
  }

  /**
   * Get details of a single book by ID.
   * @param id - The book ID.
   */
  getBookById(id: number): Observable<IBook> {
    const url = `${this.apiUrl}/books/${id}`;

    return this.http.get<IBook>(url).pipe(
      tap({
        next: (response: IBook) => {
          // Process the response if needed
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Error while retrieving the book', 'Error');
        },
      })
    );
  }

  /**
   * Create a new book.
   * @param bookData - The book data.
   */
  createBook(bookData: IBook): Observable<any> {
    const url = `${this.apiUrl}/books`;

    return this.http.post(url, bookData).pipe(
      tap({
        next: (response: any) => {
          this.toastr.success('Book created successfully!', 'Success');
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Error while creating the book', 'Error');
        },
      })
    );
  }

  /**
   * Update details of a book by ID.
   * @param id - The book ID.
   * @param bookData - The updated book data.
   */
  updateBook(id: number, bookData: IBook): Observable<any> {
    const url = `${this.apiUrl}/books/${id}`;

    return this.http.put(url, bookData).pipe(
      tap({
        next: (response: any) => {
          this.toastr.success('Book updated successfully!', 'Success');
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Error while updating the book', 'Error');
        },
      })
    );
  }

  /**
   * Remove a book by ID.
   * @param id - The book ID.
   */
  deleteBook(id: number): Observable<any> {
    const url = `${this.apiUrl}/books/${id}`;

    return this.http.delete(url).pipe(
      tap({
        next: (response: any) => {
          this.toastr.success('Book removed successfully!', 'Success');
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Error while removing the book', 'Error');
        },
      })
    );
  }

  get books() {
    return this.books$;
  }
}
