import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface HubLink {
  label: string;
  url: string;
  description: string;
}

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  links: HubLink[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<HubLink[]>('/projects.json').subscribe({
      next: (links) => {
        this.links = links;
      },
      error: () => {
        // Fallback to avoid an empty menu if static file loading fails.
        this.links = [
          {
            label: 'torrent',
            url: 'https://torrent.linkenparis.com',
            description: 'a space for monitoring and tools around content sharing and useful resources'
          },
          {
            label: 'fossason',
            url: 'https://fossason.linkenparis.com',
            description: 'my main project, a living showcase website with product and design experiments'
          }
        ];
      }
    });
  }

  hoveredDescription = '';

  onHover(link: HubLink): void {
    this.hoveredDescription = link.description;
  }

  onLeave(): void {
    this.hoveredDescription = '';
  }

}
