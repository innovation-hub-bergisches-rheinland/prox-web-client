import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export type PageEvent = {
  pageIndex: number;
  previousPageIndex?: number;
  pageSize: number;
  length: number;
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

  @Output()
  page = new EventEmitter<PageEvent>();

  get pageNumbers(): number[] {
    return Array(Math.floor(this.length / this.pageSize))
      .fill(0)
      .map((_x, i) => i);
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
