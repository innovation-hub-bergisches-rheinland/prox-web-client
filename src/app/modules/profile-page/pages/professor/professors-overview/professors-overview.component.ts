import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import {
  EntityModelProfessorOverviewDto,
  Faculty,
  PagedModelEntityModelProfessor,
  Professor,
  ProfessorOverviewDto
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import Fuse from 'fuse.js';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-professors-overview',
  templateUrl: './professors-overview.component.html',
  styleUrls: ['./professors-overview.component.scss']
})
export class ProfessorsOverviewComponent implements OnInit {
  _professors: EntityModelProfessorOverviewDto[] = [];
  faculties: Faculty[] = [];
  filteredProfessors: EntityModelProfessorOverviewDto[] = [];
  professorPage: EntityModelProfessorOverviewDto[] = [];
  searchString = new FormControl('');
  selectedFaculty = new FormControl('');
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  set professors(professors: EntityModelProfessorOverviewDto[]) {
    this._professors = professors;
    professors.sort((a, b) => a.name.localeCompare(b.name));
  }

  get professors(): EntityModelProfessorOverviewDto[] {
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

  getFacultyName(
    professor: EntityModelProfessorOverviewDto
  ): Observable<string> {
    return this.professorProfileService
      .getProfessorFaculty(professor.id)
      .pipe(map(f => f.name));
  }

  getProfessorUrl(professor: EntityModelProfessorOverviewDto): string {
    return this.professorProfileService.getProfessorImageUrl(professor.id);
  }

  getResearchSubjects(professor: EntityModelProfessorOverviewDto): string[] {
    console.log(professor);
    return professor.researchSubjects ?? [];
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProfessors();
  }

  private pageProfessors() {
    this.setPageMetadata();
    this.professorPage = this.filteredProfessors.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  public getProfessors() {
    this.professorProfileService.getProfessorOverview().subscribe(
      p => {
        this.professors = this.filteredProfessors = p.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        this.pageProfessors();
      },
      err => console.error(err)
    );
  }

  setPageMetadata() {
    this.totalItems = this.filteredProfessors.length;
    while (
      this.pageIndex > 0 &&
      this.pageSize * this.pageIndex >= this.totalItems
    ) {
      this.pageIndex -= 1;
    }
  }

  filterProfessors() {
    const facultyId = this.selectedFaculty?.value?.id;
    const search = this.searchString.value as string;
    if (facultyId) {
      this.filteredProfessors = this.professors.filter(
        p => p.facultyId == facultyId
      );
      if (search) {
        this.filteredProfessors = this.filteredProfessors.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }
    } else {
      if (search) {
        this.filteredProfessors = this.professors.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        this.filteredProfessors = this.professors;
      }
    }
    this.pageProfessors();
  }
}
