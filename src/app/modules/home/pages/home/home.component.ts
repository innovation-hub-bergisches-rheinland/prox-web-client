import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { Tag } from '@data/schema/tag.types';
import { TagService } from '@data/service/tag.service';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';

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

  placeholder = '';
  typewriter: Typewriter;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private tagService: TagService
  ) {}

  async ngOnInit() {
    this.popularTags$ = this.tagService.getPopular();
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }

    this.startTypewriter();
  }

  startTypewriter() {
    this.placeholder = '';
    this.typewriter = new Typewriter(null, {
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
      this.typewriter = this.typewriter.typeString(keyword).pauseFor(300).deleteAll();
    }
    this.typewriter.start();
  }

  stopTypewriter() {
    this.typewriter.stop();
    this.placeholder = 'Suchbegriff';
  }

  async onSubmit() {
    let params = {};

    const searchValue = this.searchForm.value['searchInput'] as string | null;
    if (searchValue && searchValue.length > 0) {
      params = this.buildParams({ txt: searchValue });
    }

    await this.router.navigate(['projects'], {
      queryParams: params
    });
  }

  async navigateToTagSearch(tag: Tag) {
    await this.router.navigate(['projects'], {
      queryParams: this.buildParams({ tags: [tag.tagName] })
    });
  }

  async navigateToSearch(search: ProjectSearch) {
    await this.router.navigate(['projects'], {
      queryParams: this.buildParams(search)
    });
  }

  private buildParams(search: ProjectSearch): Params {
    const params = {};

    if (search.txt) {
      params['q'] = search.txt;
    }

    if (search.status) {
      params['state'] = search.status;
    }

    if (search.moduleTypes && search.moduleTypes.length > 0) {
      params['moduleType'] = search.moduleTypes.join(',');
    }

    if (search.disciplines && search.disciplines.length > 0) {
      params['discipline'] = search.disciplines.join(',');
    }

    if (search.tags && search.tags.length > 0) {
      params['tags'] = search.tags.join(',');
    }

    return params;
  }
}
