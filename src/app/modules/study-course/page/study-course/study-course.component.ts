import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { HalOptions } from 'angular4-hal';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseService } from '@data/service/study-course.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-study-course',
  templateUrl: './study-course.component.html',
  styleUrls: ['./study-course.component.scss']
})
export class StudyCourseComponent implements OnInit {
  studyCourses: StudyCourse[] = [];
  filteredStudyCourses: StudyCourse[] = [];
  academicDegrees: string[] = [];
  selectedName: string;
  selectedAcademicDegree: string;

  constructor(
    private studyCourseService: StudyCourseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllStudyCourses();
  }

  getAllStudyCourses() {
    const options: HalOptions = { sort: [{ path: 'name', order: 'ASC' }] };
    this.studyCourseService.getAll(options).subscribe(
      studyCourses => {
        this.studyCourses = studyCourses;
      },
      error => {
        console.error('study course service error', error);
        this.openSnackBar(
          'Studiengänge konnten nicht geladen werden! Versuchen Sie es später noch mal.'
        );
      },
      () => this.fillAcademicDegrees(this.studyCourses)
    );
  }

  academicDegreeFilter(academicDegree: string) {
    this.studyCourseService
      .findByAcademicDegree(academicDegree)
      .subscribe(studyCourses => {
        this.studyCourses = studyCourses;
      });
  }

  nameFilter(name: string) {
    if (this.selectedAcademicDegree) {
      this.studyCourseService
        .findByAcademicDegree(this.selectedAcademicDegree)
        .subscribe(studyCourses => this.filterStudyCourses(studyCourses, name));
    } else {
      this.studyCourseService
        .getAll()
        .subscribe(studyCourses => this.filterStudyCourses(studyCourses, name));
    }
  }

  filterStudyCoursesByAcademicDegree(event: MatSelectChange) {
    const academicDegree = event.value;
    if (academicDegree) {
      this.selectedAcademicDegree = academicDegree;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.academicDegreeFilter(academicDegree);
      }
    } else {
      this.selectedAcademicDegree = null;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.getAllStudyCourses();
      }
    }
  }

  filterStudyCoursesByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.selectedName = name;
      this.nameFilter(name);
    } else {
      this.selectedName = null;
      if (this.selectedAcademicDegree) {
        this.academicDegreeFilter(this.selectedAcademicDegree);
      } else {
        this.getAllStudyCourses();
      }
    }
  }

  private fillAcademicDegrees(studyCourses: StudyCourse[]) {
    studyCourses.forEach(studyCourse =>
      this.academicDegrees.push(studyCourse.academicDegree)
    );
    this.academicDegrees = this.academicDegrees.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }

  private filterStudyCourses(studyCourses: StudyCourse[], name?: string) {
    for (const studyCourse of studyCourses as StudyCourse[]) {
      if (studyCourse.name.toLowerCase().includes(name.toLowerCase())) {
        this.filteredStudyCourses.push(studyCourse);
      }
    }
    this.studyCourses = this.filteredStudyCourses;
    this.filteredStudyCourses = [];
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }
}
