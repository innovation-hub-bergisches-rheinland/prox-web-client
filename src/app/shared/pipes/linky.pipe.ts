import { Input, Pipe, PipeTransform } from '@angular/core';
import Autolinker, { AutolinkerConfig } from 'autolinker';

@Pipe({
  name: 'linky'
})
export class LinkyPipe implements PipeTransform {
  defaultOptions: AutolinkerConfig = {
    urls: {
      schemeMatches: true,
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

  @Input()
  rel: string | undefined;

  transform(value: string, options?: AutolinkerConfig): string {
    return Autolinker.link(value, {
      ...this.defaultOptions,
      ...options,
      replaceFn: match => {
        const tag = match.buildTag();
        if (this.rel) {
          tag.setAttr('rel', this.rel);
        }
        return tag;
      }
    });
  }
}
