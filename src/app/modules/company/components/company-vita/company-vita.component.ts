import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-company-vita',
  templateUrl: './company-vita.component.html',
  styleUrls: ['./company-vita.component.scss'],
  host: { class: 'company-vita' }
})
export class CompanyVitaComponent implements OnInit {
  @Input()
  vita: string;

  constructor() {}

  ngOnInit(): void {}
}
