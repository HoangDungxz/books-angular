import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { BooksService } from '../shared/services/books.service';
import { Subscription, Subject, finalize } from 'rxjs';
import { IBook } from 'src/app/shared/models/Books';
import { IMeta, IResponse } from 'src/app/shared/models';

/**
 * Component for displaying a list of books with "scroll down to load more" functionality.
 */
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnDestroy {
  /** List of books to be displayed */
  books: IBook[] | undefined;
  meta: IMeta | undefined;

  /**
   * Flag to indicate whether the login process is loading.
   * @type {boolean}
   */
  isLoading: boolean = false;

  /** Subscription to the books observable */
  private _booksObserver: Subscription = new Subscription();

  /** Current page index for pagination */
  private pageIndex = 1;

  /** Subject to trigger loading more data */
  private _loadMoreSubject = new Subject<void>();

  /**
   * Constructor
   * @param booksService - Service for fetching books data
   */
  constructor(private booksService: BooksService) {}

  /**
   * Lifecycle hook called after Angular has initialized all data-bound properties.
   * Initializes the component and sets up necessary subscriptions.
   */
  ngOnInit(): void {
    // Subscribe to the books observable to update the books list
    this._booksObserver = this.booksService.books
      .pipe(
        finalize(() => {
          console.log('finalize');

          this.isLoading = false;
        })
      )
      .subscribe({
        next: (e: unknown) => {
          const response = e as IResponse<IBook[]>;
          if (this.books) {
            // Append new data to existing array
            this.books = [...this.books, ...response.data];
            this.meta = response.meta;
          } else {
            this.books = response.data;
          }
        },
        error: (error: any) => {
          // Handle error if needed
        },
      });

    // Subscribe to the _loadMoreSubject to trigger loading more data

    this._loadMoreSubject.pipe().subscribe(() => {
      this.pageIndex++;
      if (
        (this.meta?.currentPage || 0) * (this.meta?.itemsPerPage || 1) >=
          (this.meta?.totalItems || 0) ||
        this.isLoading
      ) {
        return;
      }
      this.isLoading = true;
      console.log(this.isLoading);

      this.booksService.getAllBooks(this.pageIndex, '');
    });

    // Initial load
    this.booksService.getAllBooks(this.pageIndex, '');
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this._booksObserver.unsubscribe();
    this._loadMoreSubject.unsubscribe();
  }

  /**
   * HostListener to detect scroll events.
   * Checks if the user has scrolled to the bottom and triggers loading more data.
   * @param event - The scroll event
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Check if the user has scrolled to the bottom
    if (this.isScrolledToBottom()) {
      // Emit an event to trigger loading more data
      this._loadMoreSubject.next();
    }
  }

  /**
   * Checks if the user has scrolled to the bottom of the page.
   * @returns True if scrolled to the bottom, otherwise false.
   */
  private isScrolledToBottom(): boolean {
    const scrollY = window.scrollY;
    const visibleHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    return scrollY + visibleHeight >= pageHeight;
  }
}
