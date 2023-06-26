import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TagService } from '@data/service/tag.service';
import { TagsDataSource } from './tags-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, delay, filter, forkJoin, map, merge, mergeMap, of, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Tag } from '@data/schema/tag.types';
import { MatSort } from '@angular/material/sort';
import { faArrowsSplitUpAndLeft, faCodeMerge, faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TagMergeDialogComponent, TagMergeDialogData, TagMergeDialogResult } from '../tag-merge-dialog/tag-merge-dialog.component';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { TagEditDialogComponent, TagEditResult, TagUpdateDialogData } from '../tag-edit-dialog/tag-edit-dialog.component';
import { TagFindDialogComponent, TagFindDialogData } from '../tag-find-dialog/tag-find-dialog.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TagSplitDialogComponent, TagSplitDialogData, TagSplitDialogResult } from '../tag-split-dialog/tag-split-dialog.component';

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
  faEdit = faEdit;
  faSearch = faSearch;
  faTrash = faTrash;
  faSplit = faArrowsSplitUpAndLeft;

  constructor(private tagService: TagService, private dialog: MatDialog, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.dataSource = new TagsDataSource(this.tagService);

    this.searchInputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        tap(input => {
          this.paginator.firstPage();
          return this.loadTags(input);
        }),
        delay(200)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadTags(this.searchInputCtrl.value)))
      .subscribe();
    this.loadTags('');
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

  openEditDialog(tag: Tag) {
    const dialogRef = this.dialog.open(TagEditDialogComponent, {
      width: '500px',
      data: { tag } satisfies TagUpdateDialogData
    });

    dialogRef.afterClosed().subscribe((result: TagEditResult) => {
      if (result) {
        this.tagService.updateTag(result.tag.id, result.updatedTag).subscribe({
          next: () => {
            this.loadTags();
          },
          error: err => {
            console.log(err);
            this.notificationService.error('Fehler beim Editieren des Tags');
          }
        });
      }
    });
  }

  openFindDialog(tag: Tag) {
    const dialogRef = this.dialog.open(TagFindDialogComponent, {
      data: { tag } satisfies TagFindDialogData
    });
  }

  openSplitDialog(tag: Tag) {
    const dialogRef = this.dialog.open(TagSplitDialogComponent, {
      width: '500px',
      data: { tagToSplit: tag } satisfies TagSplitDialogData
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: TagSplitDialogResult) => !!result),
        mergeMap((result: TagSplitDialogResult) =>
          forkJoin({
            synchronizedTags: this.tagService.synchronize(result.splitted),
            result: of(result)
          })
        )
      )
      .subscribe(result => {
        if (result) {
          this.tagService
            .split(
              result.result.tagToSplit.id,
              result.synchronizedTags.tags.map(t => t.id)
            )
            .subscribe({
              next: () => {
                this.loadTags();
              },
              error: err => {
                console.log(err);
                this.notificationService.error('Fehler beim Splitten der Tags');
              }
            });
        }
      });
  }

  deleteTag(tag: Tag) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Tag löschen',
        message: `Soll der Tag <strong>${tag.tagName}</strong> wirklich gelöscht werden?`
      } satisfies ConfirmationDialogData
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.tagService.deleteTag(tag.id).subscribe({
          next: () => {
            this.loadTags();
          },
          error: err => {
            console.log(err);
            this.notificationService.error('Fehler beim Löschen des Tags');
          }
        });
      }
    });
  }
}
