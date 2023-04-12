import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { RecommendationResponse } from '@data/schema/recommendation.types';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  getRecommendations(seedTags: string[]): Observable<RecommendationResponse> {
    if (!seedTags || seedTags.length === 0) {
      return EMPTY;
    }
    const params = new HttpParams().set('seedTags', seedTags.join(','));
    return this.httpClient.get<RecommendationResponse>(`${this.basePath}/recommendations`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      params: params,
      observe: 'body',
      reportProgress: false
    });
  }
}