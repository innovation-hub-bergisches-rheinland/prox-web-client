import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { FormControl, FormGroup } from '@angular/forms';
export interface ProfileSearch {
  txt?: string;
  tags?: string[];
}

@Component({
  selector: 'app-profile-search-panel',
  templateUrl: './profile-search-panel.component.html',
  styleUrls: ['./profile-search-panel.component.scss']
})
export class ProfileSearchPanelComponent implements OnInit {
  searchIcon = faSearch;

  searchForm = new FormGroup({
    tags: new FormControl([]),
    txt: new FormControl('')
  });

  @Output()
  search = new EventEmitter<ProfileSearch>();

  @Input()
  set searchValues(value: ProfileSearch) {
    this.searchForm.patchValue(value);
  }

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.search.emit({
      txt: this.searchForm.controls.txt.value || undefined,
      tags: this.searchForm.controls.tags.value || undefined
    });
  }
}
