import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { CarouselItemComponent } from '../carousel-item/carousel-item.component';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterContentInit {
  @ContentChildren(CarouselItemComponent)
  items: QueryList<CarouselItemComponent>;

  @Input()
  numItems: number;

  page = 0;

  ngAfterContentInit(): void {
    this.pageItems();
  }

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
