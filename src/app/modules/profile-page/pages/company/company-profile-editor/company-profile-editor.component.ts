import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { formatCurrency } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { hasFlag } from 'country-flag-icons';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from '@data/schema/openapi/company-profile-service/branch';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { Language } from '@data/schema/openapi/company-profile-service/language';
import { Quarter } from '@data/schema/openapi/company-profile-service/quarter';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { CompanyProfileService } from '@data/service/company-profile.service';
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
import { mergeMap, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-company-profile-editor',
  templateUrl: './company-profile-editor.component.html',
  styleUrls: ['./company-profile-editor.component.scss']
})
export class CompanyProfileEditor implements OnInit {
  _company: Company;
  companyId: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  branches: Branch[] = [];
  quarters: Quarter[] = [];
  image: File;
  imageSrc;
  deleteImage = false;
  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    numberOfEmployees: new FormControl(''),
    headquarter: new FormControl(''),
    homepage: new FormControl(''),
    foundation: new FormControl(''),
    vita: new FormControl('')
  });
  languageCtrl = new FormControl();
  allLanguages: Language[] = [];
  languages: Language[] = [];
  filteredLanguages: Observable<Language[]>;
  hasPermission: boolean = false;
  private exists: boolean = false;

  @ViewChild('languageInput') languageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private keycloakService: KeycloakService,
    private route: ActivatedRoute,
    private router: Router,
    private companyProfileService: CompanyProfileService,
    private snackbar: MatSnackBar
  ) {}

  /**
   * Setter for professor. When a professor is set in the editor, the form fields should be filled.
   */
  set company(company: Company) {
    this._company = company;
    this.branches = [...company.branches];
    this.quarters = [...company.quarters];
    this.profileForm.setValue({
      name: company.information.name ?? '',
      foundation: company.information.foundingDate ?? '',
      homepage: company.information.homepage ?? '',
      numberOfEmployees: company.information.numberOfEmployees ?? '',
      vita: company.information.vita ?? '',
      headquarter: company.headquarter.location ?? ''
    });
  }

  /**
   * Getter for professor. Whenever the professor is retrieved from this component, it should return a professor based on the form fields
   */
  get company(): Company {
    return {
      id: this.companyId,
      creatorId: this._company.creatorId ?? null,
      branches: new Set(this.branches),
      quarters: new Set(this.quarters),
      information: {
        name: this.profileForm.value['name'],
        foundingDate: this.profileForm.value['foundation'],
        homepage: this.profileForm.value['homepage'],
        numberOfEmployees: this.profileForm.value['numberOfEmployees'],
        vita: this.profileForm.value['vita']
      },
      headquarter: {
        location: this.profileForm.value['headquarter']
      }
    };
  }

  ngOnInit() {
    this.hasPermission = true; //TODO

    this.companyProfileService
      .getAllLanguages()
      .subscribe(res => (this.allLanguages = res));

    this.filteredLanguages = this.languageCtrl.valueChanges.pipe(
      startWith(null),
      map((language: string | Language | null) =>
        language ? this._filterLanguages(language) : this.allLanguages.slice()
      )
    );

    this.route.params
      .pipe(
        mergeMap(params =>
          this.companyProfileService.getCompanyById(params['id'])
        )
      )
      .subscribe(
        company => {
          this.company = company;
          this.exists = true;
          this.imageSrc = this.companyProfileService.getCompanyLogoUrl(
            this.company.id
          );
        },
        err => {
          if (err instanceof HttpErrorResponse && err.status == 404) {
            this.exists = false;
          } else {
            this.snackbar.open(
              'Konnte Profil nicht laden, versuchen Sie es später erneut.'
            );
          }
        }
      );
  }

  addQuarter(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const subject = value.trim();
      if (
        this.quarters.filter(
          q => q.location.toLowerCase() === subject.toLowerCase()
        ).length === 0
      ) {
        this.quarters.push({
          location: subject.trim()
        });
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeQuarter(subject: Quarter) {
    const index = this.quarters.findIndex(
      q => q.location.toLowerCase() === subject.location.toLowerCase()
    );

    if (index >= 0) {
      this.quarters.splice(index, 1);
    }
  }

  addBranch(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const subject = value.trim();
      if (
        this.branches.filter(
          b => b.branchName.toLowerCase() === subject.toLowerCase()
        ).length === 0
      ) {
        //Distinct
        this.branches.push({
          branchName: subject.trim()
        });
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeBranch(subject: Branch) {
    const index = this.branches.findIndex(
      b => b.branchName.toLowerCase() === subject.branchName.toLowerCase()
    );

    if (index >= 0) {
      this.branches.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.languages.push(event.option.value);
    this.languageInput.nativeElement.value = '';
    this.languageCtrl.setValue(null);
  }

  removeLanguage(subject: Language) {
    const index = this.languages.map(l => l.id).indexOf(subject.id);

    if (index >= 0) {
      this.languages.splice(index, 1);
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
   * Saves the professor
   */
  onSubmit() {
    console.log(this.company);
  }

  hasFlag(language: Language): boolean {
    return hasFlag(language.isoIdentifier2.toUpperCase());
  }

  getFlagUrl(language: Language): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${language.isoIdentifier2.toUpperCase()}.svg`;
  }

  private _filterLanguages(language: string | Language): Language[] {
    let filterValue = '';
    if (typeof language === 'string' || language instanceof String) {
      filterValue = language.toLowerCase();
    }

    return this.allLanguages.filter(lang =>
      lang.germanName.toLowerCase().includes(filterValue)
    );
  }
}
