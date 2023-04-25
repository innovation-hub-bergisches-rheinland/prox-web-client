import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TagService } from '@data/service/tag.service';
import { TagsDataSource } from './tags-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, delay, merge, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Tag } from '@data/schema/tag.types';
import { MatSort } from '@angular/material/sort';
import { faCodeMerge } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TagMergeDialogComponent, TagMergeDialogData, TagMergeDialogResult } from '../tag-merge-dialog/tag-merge-dialog.component';
import { NotificationService } from '@shared/modules/notifications/notification.service';

@Component({
  selector: 'app-tag-curation-table',
  templateUrl: './tag-curation-table.component.html',
  styleUrls: []
})
export class TagCurationTableComponent implements AfterViewInit, OnInit {
  dataSource: TagsDataSource;
  expandedElement: Tag | null;

  pageSize = 20;
  searchInputCtrl = new FormControl<string>('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  faMerge = faCodeMerge;

  constructor(private tagService: TagService, private dialog: MatDialog, private notificationService: NotificationService) {}

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

  openMergeDialog(tag: Tag) {
    const dialogRef = this.dialog.open(TagMergeDialogComponent, {
      width: '500px',
      data: { tagToMerge: tag } satisfies TagMergeDialogData
    });

    dialogRef.afterClosed().subscribe((result: TagMergeDialogResult) => {
      if (result) {
        console.log(result);
        this.tagService.merge(result.tagToMerge.id, result.targetTag.id).subscribe({
          next: () => {
            this.loadTags();
          },
          error: err => {
            console.log(err);
            this.notificationService.error('Fehler beim Zusammenführen der Tags');
          }
        });
      }
    });
  }
}
