import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { formatCurrency } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { KeycloakService } from 'keycloak-angular';
import { of } from 'rxjs';
import {
  combineLatest,
  forkJoin,
  from,
  merge,
  Observable,
  throwError
} from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-professor-profile-editor',
  templateUrl: './professor-profile-editor.component.html',
  styleUrls: ['./professor-profile-editor.component.scss']
})
export class ProfessorProfileEditorComponent implements OnInit {
  _professor: Professor;
  professorId: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  researchSubjects: string[] = [];
  image: File;
  imageSrc;
  deleteImage = false;
  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    affiliation: new FormControl(''),
    subject: new FormControl(''),
    room: new FormControl(''),
    consultationHour: new FormControl(''),
    telephone: new FormControl(''),
    email: new FormControl(''),
    homepage: new FormControl(''),
    collegePage: new FormControl(''),
    vita: new FormControl(''),
    publications: new FormControl('') //TODO Validator
  });
  faculties: Faculty[] = [];
  selectedFaculty: Faculty;
  hasPermission: boolean = false;
  facultySelection: FormControl = new FormControl('');
  private exists: boolean = false;

  constructor(
    private keycloakService: KeycloakService,
    private route: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorProfileService,
    private snackbar: MatSnackBar
  ) {}

  /**
   * Setter for professor. When a professor is set in the editor, the form fields should be filled.
   */
  set professor(professor: Professor) {
    this._professor = professor;
    this._professor.id = this.professorId;
    this.profileForm.setValue({
      name: professor.name ? professor.name : '',
      affiliation: professor.affiliation ? professor.affiliation : '',
      subject: professor.mainSubject ? professor.mainSubject : '',
      room: professor.contactInformation.room
        ? professor.contactInformation.room
        : '',
      consultationHour: professor.contactInformation.consultationHour
        ? professor.contactInformation.consultationHour
        : '',
      telephone: professor.contactInformation.telephone
        ? professor.contactInformation.telephone
        : '',
      email: professor.contactInformation.email
        ? professor.contactInformation.email
        : '',
      homepage: professor.contactInformation.homepage
        ? professor.contactInformation.homepage
        : '',
      collegePage: professor.contactInformation.collegePage
        ? professor.contactInformation.collegePage
        : '',
      vita: professor.vita ? professor.vita : '',
      publications: professor.publications
        ? professor.publications.map(p => p.publication).join('\n\n')
        : []
    });
    this.researchSubjects = professor.researchSubjects
      ? professor.researchSubjects.map(s => s.subject)
      : [];
  }

  /**
   * Getter for professor. Whenever the professor is retrieved from this component, it should return a professor based on the form fields
   */
  get professor(): Professor {
    return {
      id: this.professorId,
      name: this.profileForm.value.name,
      affiliation: this.profileForm.value.affiliation,
      mainSubject: this.profileForm.value.subject,
      contactInformation: {
        room: this.profileForm.value.room,
        consultationHour: this.profileForm.value.consultationHour,
        telephone: this.profileForm.value.telephone,
        email: this.profileForm.value.email,
        homepage: this.profileForm.value.homepage,
        collegePage: this.profileForm.value.collegePage
      },
      vita: this.profileForm.value.vita,
      researchSubjects: this.researchSubjects?.map(s => ({ subject: s })),
      //publications are separeted with at least two line-breaks
      publications: this.profileForm.value.publications
        ? this.profileForm.value.publications
            .trim()
            .split(/\n\n+/)
            .filter(p => p && p.trim().length !== 0)
            .map(p => ({ publication: p.trim() }))
        : null
    };
  }

  ngOnInit() {
    //Permission depends on if the user is logged in AND the requested path equals to the userId AND user is in professor role
    combineLatest([
      from(this.keycloakService.isLoggedIn()),
      this.route.params
    ]).subscribe(([isLoggedIn, params]) => {
      this.hasPermission =
        isLoggedIn &&
        params['id'] == this.keycloakService.getKeycloakInstance().subject &&
        this.keycloakService.isUserInRole('professor');
      this.professorId = params['id'];
    });

    this.route.params
      .pipe(
        mergeMap(
          params => this.professorService.getProfessorProfile(params['id']) //Get Professor ID from active path and load profile
        )
      )
      .subscribe(
        professor => {
          this.professor = professor; //Set professor (note the setter)
          this.exists = true;
          //TODO get rid of inner subscriptions
          //Build image url and set it
          of(
            this.professorService.getProfessorImageUrl(this.professor.id)
          ).subscribe(
            url => (this.imageSrc = url),
            err =>
              this.snackbar.open(
                'Konnte Profilbild nicht laden, versuchen Sie es später erneut'
              )
          );
          //Load faculty and set it
          this.professorService
            .getProfessorFaculty(this.professor.id)
            .subscribe(
              faculty => {
                this.selectedFaculty = faculty;
                this.facultySelection.setValue(this.selectedFaculty);
              },
              err =>
                this.snackbar.open(
                  'Konnte Fakultät nicht laden, versuchen Sie es später erneut'
                )
            );
        },
        err => {
          //If the professor is NOT existent pre-fill the name and email based on keycloak service
          if (err instanceof HttpErrorResponse && err.status == 404) {
            this.keycloakService.loadUserProfile().then(u => {
              this.professor.name = `${u.firstName} ${u.lastName}`;
              this.professor.contactInformation.email = u.email ?? '';
              this.profileForm.controls['name'].setValue(
                `${u.firstName} ${u.lastName}` ?? ''
              );
              this.profileForm.controls['email'].setValue(u.email ?? '');
            });
          } else {
            this.snackbar.open(
              'Konnte Profil nicht laden, versuchen Sie es später erneut.'
            );
          }
        }
      );

    //When no image is present (likely when no profile exists)
    if (!this.imageSrc) {
      this.imageSrc = 'assets/images/blank-profile-picture.png';
    }

    //Load available faculties
    this.professorService.getAllFaculties().subscribe(
      res => (this.faculties = res),
      err => console.error(err)
    );
  }

  /**
   * Adds a research Subject to array and cleans up the chip input
   * @param event
   */
  addSubject(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const subject = value.trim();
      if (!this.researchSubjects.includes(subject)) {
        //Distinct
        this.researchSubjects.push(subject);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  /**
   * Removes researchSubject from array
   */
  removeSubject(subject: string) {
    const index = this.researchSubjects.indexOf(subject);

    if (index >= 0) {
      this.researchSubjects.splice(index, 1);
    }
  }

  /**
   * Handles image upload and sets the preview image
   * @param files
   */
  uploadImage(files: FileList) {
    this.image = files[0];
    if (this.image) {
      const reader = new FileReader();

      this.deleteImage = false;

      reader.onload = e => {
        this.imageSrc = e.target.result;
      };

      reader.readAsDataURL(this.image); //Set preview
    }
  }

  /**
   * Button Handler for delete Image
   */
  deleteProfileImage() {
    this.deleteImage = true;
    this.imageSrc = 'assets/images/blank-profile-picture.png';
  }

  /**
   * Compare faculties for equality
   * @param object1
   * @param object2
   */
  compareFaculties(object1: Faculty, object2: Faculty) {
    return object1 && object2 && object1.id == object2.id;
  }

  /**
   * Saves the professor
   */
  onSubmit() {
    //When exists update, else save new
    const saveObservable: Observable<Professor> = this.exists
      ? this.professorService.updateProfessorProfile(this.professor)
      : this.professorService.saveProfessorProfile(this.professor);

    let error = false;

    //TODO refactor
    saveObservable.subscribe(
      p => {
        if (this.selectedFaculty) {
          this.professorService
            .saveProfessorFaculty(p.id, this.selectedFaculty.id)
            .subscribe(
              _ => {},
              err => {
                this.snackbar.open(
                  'Konnte Fakultät nicht speichern. Bitte versuchen Sie es später erneut.'
                );
                error = true;
              }
            );
        }
        if (this.image && !this.deleteImage) {
          this.professorService.saveProfessorImage(p.id, this.image).subscribe(
            _ => {},
            err => {
              this.snackbar.open(
                'Konnte Profilbild nicht speichern. Bitte versuchen Sie es später erneut.'
              );
              error = true;
            }
          );
        } else if (this.deleteImage) {
          this.professorService.deleteImage(p.id).subscribe(
            _ => {},
            err => {
              this.snackbar.open(
                'Konnte Profilbild nicht löschen. Bitte versuchen Sie es später erneut.'
              );
              error = true;
            }
          );
        }
      },
      _ =>
        this.snackbar.open(
          'Konnte Profil nicht speichert. Bitte versuchen Sie es später erneut.'
        ),
      () => {
        if (!error) {
          this.router.navigate(['..'], { relativeTo: this.route });
        }
      }
    );
  }
}
