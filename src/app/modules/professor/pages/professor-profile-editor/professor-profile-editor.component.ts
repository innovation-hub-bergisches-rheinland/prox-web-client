import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-professor-profile-editor',
  templateUrl: './professor-profile-editor.component.html',
  styleUrls: ['./professor-profile-editor.component.scss']
})
export class ProfessorProfileEditor implements OnInit {
  _professor: Professor;
  isLoggedIn = false;
  professorId: string;
  name: string;
  faculties: Faculty[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  researchSubjects: string[] = [];
  image: File;
  imageSrc;
  professorProfileFormControl: FormGroup;

  @Input()
  set professor(professor: Professor) {
    this._professor = professor;
  }

  constructor(
    private keycloakService: KeycloakService,
    private route: ActivatedRoute,
    private professorService: ProfessorProfileService,
    private formBuilder: FormBuilder
  ) {}

  get hasPermission(): boolean {
    if (this.isLoggedIn) {
      let userId = this.keycloakService.getKeycloakInstance().subject;
      return (
        this.keycloakService.isUserInRole('professor') &&
        userId === this.professorId
      );
    }
    return false;
  }

  ngOnInit() {
    this.keycloakService
      .isLoggedIn()
      .then(isLoggedIn => (this.isLoggedIn = isLoggedIn));

    this.route.params.subscribe(res => (this.professorId = res['id']));

    if (this.professor) {
      //Set Input fields
    } else {
      this.keycloakService
        .loadUserProfile()
        .then(u => (this.name = `${u.firstName} ${u.lastName}`));
    }

    if (!this.imageSrc) {
      this.imageSrc = 'assets/images/blank-profile-picture.png';
    }

    this.professorService.getAllFaculties().subscribe(
      res => (this.faculties = res),
      err => console.log(err)
    );
  }

  addSubject(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const subject = value.trim();
      if (!this.researchSubjects.includes(subject)) {
        this.researchSubjects.push(subject);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeSubject(subject: string) {
    const index = this.researchSubjects.indexOf(subject);

    if (index >= 0) {
      this.researchSubjects.splice(index, 1);
    }
  }

  uploadImage(files: FileList) {
    this.image = files[0];
    if (this.image) {
      const reader = new FileReader();

      reader.onload = e => {
        this.imageSrc = e.target.result;
      };

      reader.readAsDataURL(this.image);
    }
  }

  saveProfile(professor: Professor) {
    console.log(professor);
  }
}
