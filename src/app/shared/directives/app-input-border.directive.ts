import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
} from '@angular/core';

/**
 * Directive to customize input border based on a condition.
 *
 * Usage:
 * Apply the directive to an input element and bind the 'appAppInputBorder' input.
 * If 'appAppInputBorder' is false, it adds a red border to indicate an error state.
 *
 * @example
 * ```html
 * <input [appAppInputBorder]="false" />
 * ```
 */
@Directive({
  selector: '[appAppInputBorder]',
})
export class AppInputBorderDirective implements OnChanges {
  /** Input to determine whether to apply custom border. Defaults to false. */
  @Input() appAppInputBorder: boolean = false;

  /**
   * Constructs the AppInputBorderDirective.
   *
   * @param el - Reference to the host element.
   * @param renderer - Renderer for manipulating the element.
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Lifecycle hook called when the directive's data-bound properties change.
   * Checks the 'appAppInputBorder' condition and applies the error border if needed.
   */
  ngOnChanges() {
    this.updateBorder();
  }

  /**
   * Updates the border based on the 'appAppInputBorder' condition using Tailwind CSS classes.
   */
  private updateBorder() {
    if (this.appAppInputBorder) {
      // If appAppInputBorder is true, remove the error border class.
      this.renderer.removeClass(this.el.nativeElement, '!border-red-500');
      this.renderer.removeClass(this.el.nativeElement, '!border');
      this.renderer.removeClass(this.el.nativeElement, 'focus:!ring-red-600');
    } else {
      // If appAppInputBorder is false, add the error border class.
      this.renderer.addClass(this.el.nativeElement, '!border');
      this.renderer.addClass(this.el.nativeElement, '!border-red-500');
      this.renderer.addClass(this.el.nativeElement, 'focus:!ring-red-600');
    }
  }
}
