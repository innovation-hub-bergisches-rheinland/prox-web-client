import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Page } from '@data/schema/shared.types';
import { Tag } from '@data/schema/tag.types';
import { TagService } from '@data/service/tag.service';
import { BehaviorSubject, Observable, catchError, finalize } from 'rxjs';

export class TagsDataSource implements DataSource<Tag> {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  length = 0;

  constructor(private tagService: TagService) {}

  connect(_collectionViewer: CollectionViewer): Observable<readonly Tag[]> {
    return this.tagsSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.tagsSubject.complete();
  }

  loadTags(query: string, pageIndex: number, pageSize: number, sort?: string): void {
    this.loadingSubject.next(true);

    this.tagService
      .findTagsPage(query, {
        page: pageIndex,
        size: pageSize,
        sort
      })
      .pipe(
        catchError(() => []),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((page: Page<Tag>) => {
        this.length = page.totalElements;
        this.tagsSubject.next(page.content);
      });
  }
}
