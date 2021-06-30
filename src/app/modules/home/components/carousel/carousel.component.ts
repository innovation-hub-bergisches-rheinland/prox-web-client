import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';
import { CarouselItem } from '../carousel-item/carousel-item.component';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  host: { class: 'carousel' }
})
export class Carousel implements OnInit, AfterContentInit {
  @ContentChildren(CarouselItem)
  items: QueryList<CarouselItem>;

  @Input()
  numItems: number;

  page: number = 0;

  constructor() {}

  ngAfterContentInit(): void {
    this.pageItems();
  }

  ngOnInit(): void {}

  goBackward(): void {
    if (this.items.length <= this.numItems) {
      return;
    }
    // Is at limit
    if (this.page === 0) {
      this.page = Math.trunc(this.items.length / this.numItems);
    } else {
      this.page -= 1;
    }
    this.pageItems();
  }

  goForward(): void {
    if (this.items.length <= this.numItems) {
      return;
    }
    // Is at limit
    if ((this.page + 1) * this.numItems >= this.items.length) {
      this.page = 0;
    } else {
      this.page += 1;
    }
    this.pageItems();
  }

  private pageItems() {
    let startIndex = this.page * this.numItems;
    let endIndex = startIndex + this.numItems;
    // Carousel should always display amount of numItems
    if (endIndex > this.items.length) {
      endIndex = this.items.length;
      startIndex = endIndex - this.numItems;
    }
    this.items.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }
}