import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-professor-vita',
  templateUrl: './professor-vita.component.html',
  styleUrls: ['./professor-vita.component.scss'],
  host: { class: 'prof-vita' }
})
export class ProfessorVitaComponent implements OnInit {
  professor$: Observable<Professor>;
  vita: string;

  constructor() {}

  ngOnInit(): void {
    this.professor$.subscribe(
      res => (this.vita = res.vita),
      err => console.log(err)
    );
  }

  @Input()
  set professor(professor: Professor) {
    this.professor$ = of(professor);
  }
}
