import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private meta: Meta) {}

  ngOnInit(): void {
    // Note that we are just adding the tag, but do not remove it.
    // This is because the googlebot (and hopefully other bots) will
    // only index the first page they see and follow the links individually.
    // This should make it uneccessary to remove the tag.
    this.meta.addTag({ name: 'robots', content: 'noindex' });
  }
}
