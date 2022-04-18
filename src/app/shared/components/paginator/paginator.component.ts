import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  pageIndexed(oldIndex: number, newIndex: number) {
    this.page.emit({
      length: this.length,
      pageSize: this.pageSize,
      pageIndex: newIndex,
      previousPageIndex: oldIndex
    });
  }
}
