import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { faFacebook, faInstagram, faLinkedin, faTwitter, faXing, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-organization-editor-social-media',
  templateUrl: './organization-editor-social-media.component.html',
  styleUrls: ['./organization-editor-social-media.component.scss']
})
export class OrganizationEditorSocialMediaComponent {
  @Input()
  organizationSocialMediaForm: UntypedFormGroup;

  facebookIcon = faFacebook;
  instagramIcon = faInstagram;
  twitterIcon = faTwitter;
  linkedinIcon = faLinkedin;
  xingIcon = faXing;
  youtubeIcon = faYoutube;
}

export function socialMediaHandleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowed = !control.value || /^[^/]*$/g.test(control.value);
    return allowed ? null : { forbiddenHandle: { value: control.value } };
  };
}
