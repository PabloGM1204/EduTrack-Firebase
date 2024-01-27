import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appZoom]'
})
export class ZoomDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('cdkDragStarted')
  onDragStart() {
    this.renderer.addClass(this.el.nativeElement, 'zoomed');
  }

  @HostListener('cdkDragEnded')
  onDragEnd() {
    this.renderer.removeClass(this.el.nativeElement, 'zoomed');
  }
  
  /*@HostListener('cdkDragStarted')
  onDragStart() {
    this.renderer.setStyle(this.el.nativeElement, 'scale(1.1)');
  }

  @HostListener('cdkDragEnded')
  onDragEnd() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
  }*/

}
