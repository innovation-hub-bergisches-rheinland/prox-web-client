import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import {
  Faculty,
  PagedModelEntityModelProfessor,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss']
})
export class ProfessorsComponent implements OnInit {
  _professors: Professor[] = [];
  faculties: Faculty[] = [];
  filteredProfessors: Professor[] = [];
  searchString = new FormControl('');
  selectedFaculty = new FormControl('');
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  set professors(professors: Professor[]) {
    this._professors = professors;
    professors.sort((a, b) => a.name.localeCompare(b.name));
  }

  get professors(): Professor[] {
    return this._professors;
  }

  constructor(private professorProfileService: ProfessorProfileService) {}

  ngOnInit(): void {
    this.getProfessors();
    this.professorProfileService.getAllFaculties().subscribe(
      res => (this.faculties = res),
      err => console.error(err)
    );
  }

  getFacultyName(professor: Professor): Observable<string> {
    return this.professorProfileService
      .getProfessorFaculty(professor.id)
      .pipe(map(f => f.name));
  }

  getProfessorUrl(professor: Professor): Observable<string> {
    return this.professorProfileService.getProfessorImageUrl(professor);
  }

  filterProfessorsByFaculty() {
    this.getProfessors();
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getProfessors();
  }

  public getProfessors(
    searchParameters: { faculty?: Faculty; search?: string } = {
      faculty: this.selectedFaculty.value,
      search: this.searchString.value
    }
  ) {
    const faculty = searchParameters.faculty;
    const search = searchParameters.search;

    let professors$: Observable<PagedModelEntityModelProfessor>;

    if (faculty && search) {
      professors$ = this.professorProfileService.getProfessorsByFacultyIdAndName(
        faculty.id,
        search,
        this.pageIndex,
        this.pageSize
      );
    } else if (faculty) {
      professors$ = this.professorProfileService.getProfessorsByFaculty(
        faculty.id,
        this.pageIndex,
        this.pageSize
      );
    } else if (search) {
      professors$ = this.professorProfileService.getProfessorsByName(
        search,
        this.pageIndex,
        this.pageSize
      );
    } else {
      professors$ = this.professorProfileService.getAllProfessors(
        this.pageIndex,
        this.pageSize
      );
    }
    professors$.subscribe(
      res => {
        console.log(res);
        this.professors = this.filteredProfessors =
          res?._embedded?.professorList ?? [];
        this.pageIndex = res.page.number;
        this.pageSize = res.page.size;
        this.totalItems = res.page.totalElements;
      },
      err => console.error(err)
    );
  }

  filterProfessorsBySearchString() {
    this.getProfessors();
  }
}
