import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../search.service';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html'
})
export class RecentSearchesComponent {
  @Output()
  searchClicked: EventEmitter<ProjectSearch> = new EventEmitter<ProjectSearch>();

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
}
