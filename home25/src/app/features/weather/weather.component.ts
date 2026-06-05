import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ElementRef,
  Renderer2
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StoreService } from './services/store.service';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  // stores the handler to be able to disable it
  private unlistenMouseMove: (() => void) | null = null;
  private bounds!: DOMRect;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public store: StoreService // Make sure to import and inject StoreService
  ) {}

  ngOnInit() {
    // … your weather initialization…
  }

  ngOnDestroy() {
    // cleanup the mousemove if it's in place
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }
  }

  onMouseEnter(e: MouseEvent) {
    // SSR-safe: we only do this in the browser
    if (!isPlatformBrowser(this.platformId)) return;

    // calculate bounds at the moment of enter
    const card = this.elRef.nativeElement.querySelector('.card') as HTMLElement;
    this.bounds = card.getBoundingClientRect();

    // install a global mousemove listener via Renderer2
    this.unlistenMouseMove = this.renderer.listen(
      'document',
      'mousemove',
      (moveEvent: MouseEvent) => this.rotateToMouse(moveEvent, card)
    );
  }

  onMouseLeave() {
    // uninstall the global listener
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }

    // reset styles
    const card = this.elRef.nativeElement.querySelector('.card') as HTMLElement;
    this.renderer.setStyle(card, 'transform', '');
    this.renderer.setStyle(card, 'box-shadow', '');
  }

  private rotateToMouse(e: MouseEvent, card: HTMLElement) {
    const mouseX = e.clientX - this.bounds.x;
    const mouseY = e.clientY - this.bounds.y;
    const centerX = this.bounds.width / 2;
    const centerY = this.bounds.height / 2;
    const xRatio = (mouseX - centerX) / centerX;
    const yRatio = (mouseY - centerY) / centerY;
    const rotateX = yRatio * 2.5;
    const rotateY = -xRatio * 3;
    const translateX = xRatio * 2;
    const translateY = yRatio * 2;
    const translateZ = 5 - Math.min(Math.hypot(xRatio, yRatio) * 1.25, 2);

    this.renderer.setStyle(
      card,
      'transform',
      `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       scale3d(1.02, 1.02, 1.02)`
    );

    this.renderer.setStyle(
      card,
      'box-shadow',
      `${-xRatio * 4.5}px ${18 - yRatio * 2.5}px 46px rgba(7, 16, 31, 0.26)`
    );
  }
}
