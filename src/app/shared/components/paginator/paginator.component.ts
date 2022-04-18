import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export type PageEvent = {
  pageIndex: number;
  previousPageIndex?: number;
  pageSize: number;
  length: number;
};

type PaginatorButton = {
  pageIndex: number;
  display: string;
  enabled: boolean;
};

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  iconFirstPage = faAngleDoubleLeft;
  iconPrevious = faAngleLeft;
  iconNextPage = faAngleRight;
  iconLastPage = faAngleDoubleRight;

  @Input()
  pageSize = 0;

  @Input()
  pageIndex = 0;

  @Input()
  length = 0;

  @Input()
  maxButtons = 8;

  @Output()
  page = new EventEmitter<PageEvent>();

  get numberOfPages(): number {
    return Math.floor(this.length / this.pageSize);
  }

  get paginatorButtons(): PaginatorButton[] {
    const buttons: PaginatorButton[] = Array(this.numberOfPages)
      .fill(0)
      .map((_x, i) => {
        return {
          enabled: true,
          display: String(i + 1),
          pageIndex: i
        };
      });

    if (buttons.length <= this.maxButtons) {
      return buttons;
    }

    const lowerLimit = this.pageIndex + this.maxButtons - 3;
    const upperLimit = this.pageIndex - this.maxButtons + 3;
    const isInLimit = (idx: number) => idx <= lowerLimit && idx >= upperLimit;
    const isExactlyLimit = (idx: number) => idx === lowerLimit || idx === upperLimit;
    const isFirstPage = (idx: number) => idx === 0;
    const isLastPage = (idx: number) => idx === buttons.length - 1;

    return buttons
      .filter(x => isFirstPage(x.pageIndex) || isLastPage(x.pageIndex) || isInLimit(x.pageIndex))
      .map(btn => {
        if (isExactlyLimit(btn.pageIndex) && !isFirstPage(btn.pageIndex) && !isLastPage(btn.pageIndex)) {
          return {
            ...btn,
            enabled: false,
            display: '...'
          };
        }
        return btn;
      });
  }

  constructor() {}

  ngOnInit(): void {}

  pageNext() {
    this.pageIndexed(this.pageIndex, this.pageIndex + 1);
  }

  pagePrevious() {
    this.pageIndexed(this.pageIndex, this.pageIndex - 1);
  }

  pageLast() {
    this.pageIndexed(this.pageIndex, Math.floor(this.length / this.pageSize) - 1);
  }

  pageFirst() {
    this.pageIndexed(this.pageIndex, 0);
  }

  pageIndexed(oldIndex: number, newIndex: number) {
    this.page.emit({
      length: this.length,
      pageSize: this.pageSize,
      pageIndex: newIndex,
      previousPageIndex: oldIndex
    });
  }
}
