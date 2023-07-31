import { Injectable } from '@angular/core';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private PROJECT_SEARCHES_KEY = 'projectSearches';

  constructor() {}

  saveProjectSearch(search: ProjectSearch) {
    const searches = this.getProjectSearches();
    const index = searches.findIndex(s => JSON.stringify(s) === JSON.stringify(search));

    if (index >= 0) {
      searches.splice(index, 1);
    }
    searches.unshift(search);

    // Keep only the most recent 5 searches
    searches.splice(5);

    localStorage.setItem(this.PROJECT_SEARCHES_KEY, JSON.stringify(searches));
  }

  getProjectSearches(): ProjectSearch[] {
    const current = localStorage.getItem(this.PROJECT_SEARCHES_KEY);
    const searches = current ? (JSON.parse(current) as ProjectSearch[]) : [];
    return searches;
  }
}
