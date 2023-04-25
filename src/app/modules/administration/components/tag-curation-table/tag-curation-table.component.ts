import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TagService } from '@data/service/tag.service';
import { TagsDataSource } from './tags-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, delay, merge, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Tag } from '@data/schema/tag.types';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tag-curation-table',
  templateUrl: './tag-curation-table.component.html',
  styleUrls: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class TagCurationTableComponent implements AfterViewInit, OnInit {
  dataSource: TagsDataSource;
  expandedElement: Tag | null;

  pageSize = 20;
  searchInputCtrl = new FormControl<string>('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.dataSource = new TagsDataSource(this.tagService);
    this.dataSource.loadTags('', 0, this.pageSize);

    this.searchInputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        tap(input => this.loadTags(input)),
        delay(200)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadTags()))
      .subscribe();
  }

  loadTags(filter?: string) {
    const sort = this.sort.active !== undefined ? this.sort.active + ',' + this.sort.direction : undefined;

    this.dataSource.loadTags(filter, this.paginator.pageIndex, this.paginator.pageSize, sort);
  }
}
