import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';

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
export class PaginatorComponent implements OnInit, OnChanges {
  iconFirstPage = faAngleDoubleLeft;
  iconPrevious = faAngleLeft;
  iconNextPage = faAngleRight;
  iconLastPage = faAngleDoubleRight;

  @Input()
  pageSize = 10;

  @Input()
  pageIndex = 0;

  @Input()
  length = 0;

  @Input()
  maxButtons = 8;

  @Output()
  page = new EventEmitter<PageEvent>();
  paginatorButtons$: Observable<PaginatorButton[]>;

  get numberOfPages(): number {
    return Math.floor(this.length / this.pageSize);
  }

  private get _paginatorButtons(): PaginatorButton[] {
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

  ngOnChanges(changes: SimpleChanges): void {
    // Change detection sometimes messes around with the pagination. That causes the DOM to be re-rendered in an
    // infinite loop causing way to much performance overhead and makes it impossible to use. Therefore, we use this
    // workaround in the change detection lifecycle hook where we check whether any change on the property binding has been
    // done and then create a new observable which would bind to the model.
    // We could also do this inside of the ngAfterViewChecked lifecycle method but this would cause way to many
    // invocations.
    const paginationHasBeenChanged = (changes: SimpleChanges) =>
      ['pageSize', 'pageIndex', 'length', 'maxButtons'].some(item => changes[item]?.currentValue !== changes[item]?.previousValue);

    if (paginationHasBeenChanged(changes)) {
      this.paginatorButtons$ = of(this._paginatorButtons);
    }
  }

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
