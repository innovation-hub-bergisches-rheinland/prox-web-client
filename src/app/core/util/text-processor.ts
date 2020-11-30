import { Injectable } from '@angular/core';
import Autolinker from 'autolinker';

@Injectable({
  providedIn: 'root'
})
export class TextProcessor {
  autolinker = new Autolinker({
    urls: {
      schemeMatches: true,
      wwwMatches: true,
      tldMatches: true
    },
    email: true,
    phone: false,
    mention: false,
    hashtag: false,

    stripPrefix: true,
    stripTrailingSlash: true,
    newWindow: true,

    truncate: {
      length: 0,
      location: 'end'
    },

    className: ''
  });

  process(text: string): string {
    return this.autolinker.link(text);
  }
}
