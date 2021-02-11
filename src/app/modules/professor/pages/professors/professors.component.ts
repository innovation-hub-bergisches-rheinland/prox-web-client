import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import {
  EntityModelProfessorOverviewDto,
  PagedModelEntityModelProfessor,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorOverview } from '@modules/professor/pages/professors-item/professor-overview';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Faculty } from './faculty';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss']
})
export class ProfessorsComponent implements OnInit {
  _professors: ProfessorOverview[] = [];
  faculties: Faculty[] = [];
  filteredProfessors: ProfessorOverview[] = [];
  professorPage: ProfessorOverview[] = [];
  searchString = new FormControl('');
  selectedFaculty = new FormControl('');
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  set professors(professors: ProfessorOverview[]) {
    this._professors = professors;
    professors.sort((a, b) => a.name.localeCompare(b.name));
  }

  get professors(): ProfessorOverview[] {
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

  getProfessorUrl(id: string): Observable<string> {
    return this.professorProfileService.getProfessorImageUrl(id);
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
    if (facultyId) {
      this.filteredProfessors = this.professors.filter(
        p => p.facultyId == facultyId
      );
    } else {
      this.filteredProfessors = this.professors;
    }
    this.pageProfessors();
  }
}
