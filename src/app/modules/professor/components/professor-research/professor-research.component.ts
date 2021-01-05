import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {
  Professor,
  ResearchSubject
} from '@data/schema/openapi/professor-profile-service/models';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-professor-research',
  templateUrl: './professor-research.component.html',
  styleUrls: ['./professor-research.component.scss'],
  host: { class: 'prof-research' }
})
export class ProfessorResearchComponent implements OnInit {
  professor$: Observable<Professor>;
  researchSubjects: ResearchSubject[];

  constructor() {}

  ngOnInit(): void {
    this.professor$.subscribe(
      res => (this.researchSubjects = res.researchSubjects),
      err => console.error(err)
    );
  }

  @Input()
  set professor(professor: Observable<Professor>) {
    this.professor$ = professor;
  }
}
