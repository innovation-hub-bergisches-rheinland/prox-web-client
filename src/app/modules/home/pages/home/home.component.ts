import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QueryParamsHandling, Router } from '@angular/router';
import { Tag } from '@data/schema/tag.resource';
import { TagService } from '@data/service/tag.service';
import { QueryParams } from '@modules/project/pages/project/project.component';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable } from 'rxjs';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails: KeycloakProfile;
  popularTags$: Observable<Tag[]>;

  searchForm = this.formBuilder.group({
    searchInput: ''
  });

  placeholder: string = '';
  typewriter = new Typewriter(null, {
    loop: true,
    delay: 75,
    onCreateTextNode: character => {
      this.placeholder += character;
      return null;
    },
    onRemoveNode: () => {
      if (this.placeholder) {
        this.placeholder = this.placeholder.slice(0, -1);
      }
    }
  });

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tagService: TagService
  ) {}

  async ngOnInit() {
    this.popularTags$ = this.tagService.getPopularTags();
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }

    console.log(this.typewriter);

    this.setupTypewriter();
  }

  private setupTypewriter() {
    const keywords = [
      'Künstliche Intelligenz',
      'Agil',
      'Datenverarbeitung',
      'Predictive Maintenance',
      'Prototyp',
      'Prozessoptimierung',
      'Digitaler Zwilling',
      'IoT'
    ];

    // Shuffle array
    let j, x, index;
    for (index = keywords.length - 1; index > 0; index--) {
      j = Math.floor(Math.random() * (index + 1));
      x = keywords[index];
      keywords[index] = keywords[j];
      keywords[j] = x;
    }

    for (const keyword of keywords) {
      this.typewriter = this.typewriter
        .typeString(keyword)
        .pauseFor(300)
        .deleteAll();
    }
    this.typewriter.start();
  }

  editProject() {
    if (this.keycloakService.isLoggedIn()) {
      this.router.navigate(['/', 'projects']);
    } else {
      this.keycloakService.login({
        redirectUri: window.location.href + 'projects'
      });
    }
  }

  onSubmit() {
    this.router.navigate(['projects'], {
      queryParams: {
        filter: this.searchForm.value['searchInput']?.trim() ?? ''
      } as QueryParams
    });
  }

  // TODO Filter Tags instead of setting a text filter
  private buildTagFilter(tag: Tag): QueryParams {
    return {
      filter: tag.tagName
    };
  }
}
