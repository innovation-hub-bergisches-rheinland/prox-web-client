import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../search.service';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProjectState } from '@data/schema/project.types';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html'
})
export class RecentSearchesComponent {
  @Output()
  searchClicked: EventEmitter<ProjectSearch> = new EventEmitter<ProjectSearch>();

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

  get searches() {
    return this.searchService.getProjectSearches();
  }

  onSearchClick(search: ProjectSearch) {
    this.searchClicked.emit(search);
  }

  identify(index, item: ProjectSearch) {
    return index;
  }

  translateStates(state: ProjectState[]) {
    return state.map(s => this.stateTranslations[s]);
  }
}
