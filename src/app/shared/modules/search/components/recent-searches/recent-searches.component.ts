import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from '../../search.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Discipline, ModuleType, ProjectState } from '@data/schema/project.types';
import { ProjectSearchEntry } from '@data/schema/user.types';
import { Observable } from 'rxjs';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html'
})
export class RecentSearchesComponent implements OnInit {
  @Output()
  searchClicked: EventEmitter<ProjectSearchEntry> = new EventEmitter<ProjectSearchEntry>();

  searches$: Observable<ProjectSearchEntry[]>;

  // TODO: Translate properly at all places. This is a hack.
  stateTranslations: Record<ProjectState, string> = {
    PROPOSED: 'Vorschlag',
    OFFERED: 'Verfügbar',
    ARCHIVED: 'Archiviert',
    COMPLETED: 'Abgeschlossen',
    STALE: 'Veraltet',
    RUNNING: 'Laufend'
  };

  searchIcon = faSearch;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searches$ = this.searchService.getProjectSearches();
  }

  onSearchClick(search: ProjectSearchEntry) {
    this.searchClicked.emit(search);
  }

  identify(index, item: ProjectSearchEntry) {
    return index;
  }

  translateStates(state: ProjectState[]) {
    return state.map(s => this.stateTranslations[s]);
  }

  translateDisciplines(disciplines: Discipline[]) {
    return disciplines.map(d => d.key);
  }

  translateModuleTypes(modules: ModuleType[]) {
    return modules.map(d => d.key);
  }

  translateTags(tags: Tag[]) {
    return tags.map(t => t.tagName);
  }
}
