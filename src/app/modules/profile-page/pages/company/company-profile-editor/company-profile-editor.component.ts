import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { CompanyProfileService } from '@data/service/company-profile.service';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { mergeMap, map, startWith, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { SocialMedia } from '@data/schema/openapi/company-profile-service/socialMedia';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-company-profile-editor',
  templateUrl: './company-profile-editor.component.html',
  styleUrls: ['./company-profile-editor.component.scss']
})
export class CompanyProfileEditor implements OnInit {
  socialMediaPlatforms: [string, SocialMedia.TypeEnum, string, string][] = [
    ['facebook', SocialMedia.TypeEnum.Facebook, 'fa-facebook', 'Facebook'],
    ['twitter', SocialMedia.TypeEnum.Twitter, 'fa-twitter', 'Twitter'],
    ['instagram', SocialMedia.TypeEnum.Instagram, 'fa-instagram', 'Instagram'],
    ['xing', SocialMedia.TypeEnum.Xing, 'fa-xing', 'Xing'],
    ['linkedin', SocialMedia.TypeEnum.Linkedin, 'fa-linkedin', 'LinkedIn']
  ];

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
    vita: new FormControl(''),
    socialMedia: new FormGroup({}) //Populated in ngOnInit
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
   * Setter for company. When a company is set in the editor, the form fields should be filled.
   */
  set company(company: Company) {
    this._company = company;
    this.companyId = company.id;
    this.branches = company.branches;
    this.quarters = company.quarters;
    this.profileForm.setValue({
      name: company.information.name ?? '',
      foundation: company.information.foundingDate ?? '',
      homepage: company.information.homepage ?? '',
      numberOfEmployees: company.information.numberOfEmployees ?? '',
      vita: company.information.vita ?? '',
      headquarter: company.headquarter.location ?? '',
      socialMedia: this.buildSocialMediaObject(company)
    });
  }

  private buildSocialMediaObject(company: Company): any {
    const obj = {};
    this.socialMediaPlatforms.forEach(
      p => (obj[p[0]] = this.getSocialMediaLink(p[1], company))
    );
    return obj;
  }

  private getSocialMediaLink(type: SocialMedia.TypeEnum, company: Company) {
    return company.socialMedia.find(s => s.type == type)?.account ?? '';
  }

  /**
   * Getter for company. Whenever the company is retrieved from this component, it should return a company based on the form fields
   */
  get company(): Company {
    return {
      id: this.companyId,
      creatorId: this._company.creatorId ?? null,
      branches: this.branches,
      quarters: this.quarters,
      information: {
        name: this.profileForm.value['name'],
        foundingDate: this.profileForm.value['foundation'],
        homepage: this.profileForm.value['homepage'],
        numberOfEmployees: this.profileForm.value['numberOfEmployees'],
        vita: this.profileForm.value['vita']
      },
      headquarter: {
        location: this.profileForm.value['headquarter']
      },
      socialMedia: this.buildSocialMediaArray()
    };
  }

  private buildSocialMediaArray(): SocialMedia[] {
    const socialMedia: SocialMedia[] = [];
    //string is the form control name
    const socialMediaPlatforms: [string, SocialMedia.TypeEnum][] = [
      ['facebook', SocialMedia.TypeEnum.Facebook],
      ['twitter', SocialMedia.TypeEnum.Twitter],
      ['instagram', SocialMedia.TypeEnum.Instagram],
      ['xing', SocialMedia.TypeEnum.Xing],
      ['linkedin', SocialMedia.TypeEnum.Linkedin]
    ];
    socialMediaPlatforms.forEach(p =>
      this.getSocialMediaAndAddToArray(p[0], p[1], socialMedia)
    );
    return socialMedia;
  }

  private getSocialMediaAndAddToArray(
    sm: string,
    type: SocialMedia.TypeEnum,
    arr: SocialMedia[]
  ) {
    const smForm: FormGroup = this.profileForm.get('socialMedia') as FormGroup;
    const fc = smForm.get(sm) as FormControl;
    if (fc && !fc.invalid) {
      const value = (smForm.value[sm] as string).trim();
      if (value && value.length > 0) {
        arr.push({
          type: type,
          account: value
        });
      }
    }
  }

  ngOnInit() {
    this.socialMediaPlatforms.forEach(p =>
      (this.profileForm.get('socialMedia') as FormGroup).registerControl(
        p[0],
        new FormControl('', Validators.pattern(/^\s*[-a-zA-Z0-9()_\+.]*\s*$/g))
      )
    );

    this.companyProfileService
      .getAllLanguages()
      .subscribe(res => (this.allLanguages = res));

    this.filteredLanguages = this.languageCtrl.valueChanges.pipe(
      startWith(null as string),
      map((language: string | Language | null) =>
        language ? this._filterLanguages(language) : this.allLanguages.slice()
      )
    );

    this.route.params
      .pipe(
        mergeMap(params =>
          this.companyProfileService.getCompanyById(params['id'])
        ),
        tap(c => {
          this.keycloakService.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
              let userId = this.keycloakService.getKeycloakInstance().subject;
              this.hasPermission =
                this.keycloakService.isUserInRole('company-manager') &&
                userId === c.creatorId;
            }
          });
        })
      )
      .subscribe({
        next: company => {
          this.company = company;
          this.exists = true;
          this.imageSrc = this.companyProfileService.getCompanyLogoUrl(
            this.company.id
          );
          this.companyProfileService
            .getCompanyLanguages(this.company.id)
            .subscribe(res => this.languages.push(...res));
        },
        error: err => {
          if (err instanceof HttpErrorResponse && err.status == 404) {
            this.exists = false;
          } else {
            this.snackbar.open(
              'Konnte Profil nicht laden, versuchen Sie es später erneut.'
            );
          }
        }
      });
  }

  handleChipInput<T>(
    event: MatChipInputEvent,
    proj: (s: string) => T,
    action: (v: T) => void
  ) {
    const input = event.chipInput.inputElement;
    const value = event.value;

    if ((value || '').trim()) {
      const subject = value.trim();
      const obj = proj(subject);

      action(obj);
    }

    if (input) {
      input.value = '';
    }
  }

  addToArrayIfNotExists<T>(
    valueList: T[],
    value: T,
    predicate: (a: T, b: T) => boolean = (a, b) => _.isEqual(a, b)
  ) {
    if (valueList.filter(item => predicate(item, value)).length === 0) {
      valueList.push(value);
    }
  }

  removeFromArrayIfExists<T>(
    valueList: T[],
    predicate: (value: T, index: number, obj: T[]) => unknown
  ) {
    const index = valueList.findIndex(predicate);
    if (index >= 0) {
      valueList.splice(index, 1);
    }
  }

  addQuarter(event: MatChipInputEvent) {
    const mapping: (s: string) => Quarter = (s: string) => {
      return {
        location: s.trim()
      };
    };
    const action: (v: Quarter) => void = (v: Quarter) =>
      this.addToArrayIfNotExists(
        this.quarters,
        v,
        (a, b) => a.location.toLowerCase() === b.location.toLowerCase()
      );

    this.handleChipInput(event, mapping, action);
  }

  removeQuarter(subject: Quarter) {
    this.removeFromArrayIfExists(
      this.quarters,
      q => q.location.toLowerCase() === subject.location.toLowerCase()
    );
  }

  addBranch(event: MatChipInputEvent) {
    const mapping: (s: string) => Branch = (s: string) => {
      return {
        branchName: s.trim()
      };
    };
    const action: (v: Branch) => void = (v: Branch) =>
      this.addToArrayIfNotExists(
        this.branches,
        v,
        (a, b) => a.branchName.toLowerCase() === b.branchName.toLowerCase()
      );

    this.handleChipInput(event, mapping, action);
  }

  removeBranch(subject: Branch) {
    this.removeFromArrayIfExists(
      this.branches,
      b => b.branchName.toLowerCase() === subject.branchName.toLowerCase()
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addToArrayIfNotExists(
      this.languages,
      event.option.value as Language,
      (a, b) => a.id === b.id
    );
    this.languageInput.nativeElement.value = '';
    this.languageCtrl.setValue(null);
  }

  removeLanguage(subject: Language) {
    this.removeFromArrayIfExists(this.languages, l => l.id === subject.id);
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
    //When exists update, else save new
    const saveObservable: Observable<Company> = this.exists
      ? this.companyProfileService.updateCompanyProfile(
          this.companyId,
          this.company
        )
      : this.companyProfileService.saveCompanyProfile(this.company);

    let error = false;

    saveObservable.subscribe({
      next: p => {
        this.companyProfileService
          .saveCompanyLanguages(p.id, this.languages)
          .subscribe({
            error: err => {
              console.error(err);
              this.snackbar.open(
                'Konnte Sprachen nicht speichern. Bitte versuchen Sie es später erneut.'
              );
              error = true;
            }
          });
        if (this.image && !this.deleteImage) {
          this.companyProfileService
            .saveCompanyLogo(p.id, this.image)
            .subscribe({
              error: err => {
                console.error(err);
                this.snackbar.open(
                  'Konnte Profilbild nicht speichern. Bitte versuchen Sie es später erneut.'
                );
                error = true;
              }
            });
        } else if (this.deleteImage) {
          this.companyProfileService.deleteCompanyLogo(p.id).subscribe({
            error: err => {
              console.error(err);
              this.snackbar.open(
                'Konnte Profilbild nicht löschen. Bitte versuchen Sie es später erneut.'
              );
              error = true;
            }
          });
        }
      },
      error: err => {
        console.error(err);
        this.snackbar.open(
          'Konnte Profil nicht speichert. Bitte versuchen Sie es später erneut.'
        );
      },
      complete: () => {
        if (!error) {
          this.router.navigate(['..'], { relativeTo: this.route });
        }
      }
    });
  }

  private _filterLanguages(language: string | Language): Language[] {
    let filterValue = '';
    if (typeof language === 'string' || language instanceof String) {
      filterValue = language.toLowerCase();
    }

    return this.allLanguages
      .filter(lang => !this.languages.map(l => l.id).includes(lang.id))
      .filter(lang => lang.germanName.toLowerCase().includes(filterValue));
  }
}
