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
import { StoreService } from '../services/store.service';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
 


  // stocke le handler pour pouvoir le désactiver
  private unlistenMouseMove: (() => void) | null = null;
  private bounds!: DOMRect;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public store: StoreService // Assurez-vous d'importer et d'injecter StoreService
  ) {}

  ngOnInit() {
    // … votre init météo…
  }

  ngOnDestroy() {
    // on nettoie le mousemove s’il est en place
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }
  }

  onMouseEnter(e: MouseEvent) {
    // SSR-safe : on ne fait ça que dans le browser
    if (!isPlatformBrowser(this.platformId)) return;

    // calculer les bounds au moment du enter
    const card = this.elRef.nativeElement.querySelector('.card') as HTMLElement;
    this.bounds = card.getBoundingClientRect();

    // installer un listener global mousemove via Renderer2
    this.unlistenMouseMove = this.renderer.listen(
      'document',
      'mousemove',
      (moveEvent: MouseEvent) => this.rotateToMouse(moveEvent, card)
    );
  }

  onMouseLeave() {
    // désinstaller le listener global
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }

    // reset styles
    const card = this.elRef.nativeElement.querySelector('.card') as HTMLElement;
    const glow = card.querySelector('.glow') as HTMLElement;
    this.renderer.setStyle(card, 'transform', '');
    this.renderer.setStyle(glow, 'backgroundImage', '');
  }

  private rotateToMouse(e: MouseEvent, card: HTMLElement) {
    const glow = card.querySelector('.glow') as HTMLElement;
    const mouseX = e.clientX - this.bounds.x;
    const mouseY = e.clientY - this.bounds.y;
    const cx = mouseX - this.bounds.width / 2;
    const cy = mouseY - this.bounds.height / 2;
    const dist = Math.hypot(cx, cy) + 1;

    // tilt
    const rotX =  cy / 100;
    const rotY = -cx / 100;
    const rotZ = Math.log(dist) * 2;

    this.renderer.setStyle(
      card,
      'transform',
      `scale3d(1.07,1.07,1.07)
       rotate3d(${rotX},${rotY},0,${rotZ}deg)`
    );

    // glow
    const posX = cx * 2 + this.bounds.width  / 2;
    const posY = cy * 2 + this.bounds.height / 2;
    this.renderer.setStyle(
      glow,
      'backgroundImage',
      `radial-gradient(circle at ${posX}px ${posY}px,
                       #ffffff55, #0000000f)`
    );
  }
}
