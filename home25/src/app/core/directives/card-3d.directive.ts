import { Directive, ElementRef, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCard3d]',
  standalone: true,
})
export class Card3dDirective implements OnDestroy {
  private unlistenMouseMove: (() => void) | null = null;
  private bounds!: DOMRect;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen(this.el.nativeElement, 'mouseenter', (e: MouseEvent) => {
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
        this.onEnter(e);
      });
      this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
        this.renderer.removeStyle(this.el.nativeElement, 'cursor');
        this.onLeave();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }
  }

  private onEnter(e: MouseEvent): void {
    this.bounds = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    this.unlistenMouseMove = this.renderer.listen('document', 'mousemove', (mv: MouseEvent) =>
      this.rotateToMouse(mv)
    );
  }

  private onLeave(): void {
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }
    this.renderer.setStyle(this.el.nativeElement, 'transform', '');
  }

  private rotateToMouse(e: MouseEvent): void {
    const mouseX = e.clientX - this.bounds.x;
    const mouseY = e.clientY - this.bounds.y;
    const cx = this.bounds.width / 2;
    const cy = this.bounds.height / 2;
    const xRatio = (mouseX - cx) / cx;
    const yRatio = (mouseY - cy) / cy;
    const rotateX = yRatio * 2.5;
    const rotateY = -xRatio * 3;
    const translateX = xRatio * 2;
    const translateY = yRatio * 2;
    const translateZ = 5 - Math.min(Math.hypot(xRatio, yRatio) * 1.25, 2);

    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `perspective(1200px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    );
  }
}
