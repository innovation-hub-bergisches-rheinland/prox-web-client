import { Pipe, PipeTransform } from '@angular/core';
import Autolinker, { AutolinkerConfig } from 'autolinker';

@Pipe({
  name: 'linky'
})
export class LinkyPipe implements PipeTransform {
  defaultOptions: AutolinkerConfig = {
    urls: {
      schemeMatches: true,
      wwwMatches: true,
      tldMatches: true
    },
    email: true,
    phone: true,
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
  };

  transform(value: string, options?: AutolinkerConfig): string {
    return Autolinker.link(value, {
      ...this.defaultOptions,
      ...options
    });
  }
}
