import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Faculty,
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
  professors: Professor[] = [];
  faculties: Faculty[] = [];
  filteredProfessors: Professor[] = [];
  searchString = new FormControl('');
  selectedFaculty = new FormControl('');

  constructor(private professorProfileService: ProfessorProfileService) {}

  ngOnInit(): void {
    this.professorProfileService.getAllProfessors().subscribe(
      res => (this.professors = this.filteredProfessors = res),
      err => console.error(err)
    );
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
    if (this.selectedFaculty.value) {
      this.professorProfileService
        .getProfessorsByFaculty(this.selectedFaculty.value.id)
        .subscribe(
          res => (this.filteredProfessors = this.professors = res),
          err => console.error(err)
        );
    } else {
      this.professorProfileService.getAllProfessors().subscribe(
        res => (this.professors = this.filteredProfessors = res),
        err => console.error(err)
      );
    }
  }

  filterProfessorsBySearchString() {
    if (this.searchString.value) {
      const fuseOptions: Fuse.IFuseOptions<Professor> = {
        minMatchCharLength: this.searchString.value.length,
        threshold: 0.1,
        distance: Number.MAX_SAFE_INTEGER,
        keys: [
          {
            name: 'name',
            weight: 0.25
          },
          {
            name: 'mainSubject',
            weight: 0.05
          },
          {
            name: 'researchSubjects.subject',
            weight: 0.2
          }
        ]
      };
      const fuse = new Fuse(this.filteredProfessors, fuseOptions);
      const results = fuse.search(this.searchString.value);

      this.filteredProfessors = results.map(result => result.item);
    } else {
      this.filteredProfessors = this.professors;
    }
  }
}
