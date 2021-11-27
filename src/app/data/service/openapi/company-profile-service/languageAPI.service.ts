/**
 * PROX Company Profile Service
 * This Service is part of [PROX](https://prox.innovation-hub.de/) and is used to give companies the opportunity to create a custom profile as an informative source about it and the projects it offers
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec
} from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

import { ApiError } from '@data/schema/openapi/company-profile-service/models';
import { CollectionModelEntityModelLanguage } from '@data/schema/openapi/company-profile-service/models';
import { EntityModelLanguage } from '@data/schema/openapi/company-profile-service/models';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class LanguageAPIService {
  protected basePath = 'https://api.prox.innovation-hub.de';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  private addToHttpParams(
    httpParams: HttpParams,
    value: any,
    key?: string
  ): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(
    httpParams: HttpParams,
    value?: any,
    key?: string
  ): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(
          elem =>
            (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key))
        );
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(
            key,
            (value as Date).toISOString().substr(0, 10)
          );
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          k =>
            (httpParams = this.addToHttpParamsRecursive(
              httpParams,
              value[k],
              key != null ? `${key}.${k}` : k
            ))
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * Get all langauges
   * @param types
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getAllLanguages(
    types?: Array<
      'ANCIENT' | 'LIVING' | 'CONSTRUCTED' | 'HISTORICAL' | 'EXTINCT' | 'NONE'
    >,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<CollectionModelEntityModelLanguage>;
  public getAllLanguages(
    types?: Array<
      'ANCIENT' | 'LIVING' | 'CONSTRUCTED' | 'HISTORICAL' | 'EXTINCT' | 'NONE'
    >,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpResponse<CollectionModelEntityModelLanguage>>;
  public getAllLanguages(
    types?: Array<
      'ANCIENT' | 'LIVING' | 'CONSTRUCTED' | 'HISTORICAL' | 'EXTINCT' | 'NONE'
    >,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpEvent<CollectionModelEntityModelLanguage>>;
  public getAllLanguages(
    types?: Array<
      'ANCIENT' | 'LIVING' | 'CONSTRUCTED' | 'HISTORICAL' | 'EXTINCT' | 'NONE'
    >,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<any> {
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (types) {
      types.forEach(element => {
        queryParameters = this.addToHttpParams(
          queryParameters,
          <any>element,
          'types'
        );
      });
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/hal+json'];
      httpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      httpHeaderAcceptSelected &&
      httpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.get<CollectionModelEntityModelLanguage>(
      `${this.configuration.basePath}/languages`,
      {
        params: queryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Get language
   * @param id UUID of language
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getLanguage(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<EntityModelLanguage>;
  public getLanguage(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpResponse<EntityModelLanguage>>;
  public getLanguage(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpEvent<EntityModelLanguage>>;
  public getLanguage(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling getLanguage.'
      );
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [
        'application/json',
        'application/hal+json'
      ];
      httpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      httpHeaderAcceptSelected &&
      httpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.get<EntityModelLanguage>(
      `${this.configuration.basePath}/languages/${encodeURIComponent(
        String(id)
      )}`,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
