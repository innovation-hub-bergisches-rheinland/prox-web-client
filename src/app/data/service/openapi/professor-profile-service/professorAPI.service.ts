/**
 * PROX Professor Profile Service
 * This Service is part of [PROX](https://prox.innovation-hub.de/) and is used to give professors the opportunity to create a custom profile as an informative source about him/her and the projects he/her offers
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParameterCodec, HttpParams, HttpResponse } from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

import { ApiError } from '@data/schema/openapi/professor-profile-service/models';
import { CollectionModelEntityModelProfessorOverviewDto } from '@data/schema/openapi/professor-profile-service/models';
import { EntityModelFaculty } from '@data/schema/openapi/professor-profile-service/models';
import { EntityModelProfessor } from '@data/schema/openapi/professor-profile-service/models';
import { PagedModelEntityModelProfessor } from '@data/schema/openapi/professor-profile-service/models';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class ProfessorAPIService {
  protected basePath = 'https://api.prox.innovation-hub.de';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
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

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(elem => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          k => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k))
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
   * deletes profile picture
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteProfessorImage(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<any>;
  public deleteProfessorImage(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<HttpResponse<any>>;
  public deleteProfessorImage(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<HttpEvent<any>>;
  public deleteProfessorImage(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteProfessorImage.');
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (Bearer) required
    credential = this.configuration.lookupCredential('Bearer');
    if (credential) {
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.delete<any>(`${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}/image`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * get all professors
   * @param sort
   * @param page
   * @param size
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getAllProfessors(
    sort?: Array<string>,
    page?: number,
    size?: number,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<PagedModelEntityModelProfessor>;
  public getAllProfessors(
    sort?: Array<string>,
    page?: number,
    size?: number,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpResponse<PagedModelEntityModelProfessor>>;
  public getAllProfessors(
    sort?: Array<string>,
    page?: number,
    size?: number,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpEvent<PagedModelEntityModelProfessor>>;
  public getAllProfessors(
    sort?: Array<string>,
    page?: number,
    size?: number,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<any> {
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (sort) {
      sort.forEach(element => {
        queryParameters = this.addToHttpParams(queryParameters, <any>element, 'sort');
      });
    }
    if (page !== undefined && page !== null) {
      queryParameters = this.addToHttpParams(queryParameters, <any>page, 'page');
    }
    if (size !== undefined && size !== null) {
      queryParameters = this.addToHttpParams(queryParameters, <any>size, 'size');
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.get<PagedModelEntityModelProfessor>(`${this.configuration.basePath}/professors`, {
      params: queryParameters,
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * get professors faculty
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getFaculty(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<EntityModelFaculty>;
  public getFaculty(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpResponse<EntityModelFaculty>>;
  public getFaculty(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpEvent<EntityModelFaculty>>;
  public getFaculty(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getFaculty.');
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.get<EntityModelFaculty>(`${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}/faculty`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * get professor
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProfessor(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<EntityModelProfessor>;
  public getProfessor(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpResponse<EntityModelProfessor>>;
  public getProfessor(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpEvent<EntityModelProfessor>>;
  public getProfessor(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getProfessor.');
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.get<EntityModelProfessor>(`${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * find professor with name like
   * @param names
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findProfessorWithNameLike(
    names: Array<string>,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<{ [key: string]: string }>;
  public findProfessorWithNameLike(
    names: Array<string>,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<HttpResponse<{ [key: string]: string }>>;
  public findProfessorWithNameLike(
    names: Array<string>,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<HttpEvent<{ [key: string]: string }>>;
  public findProfessorWithNameLike(
    names: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<any> {
    if (names === null || names === undefined) {
      throw new Error('Required parameter names was null or undefined when calling findProfessorWithNameLike.');
    }

    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (names) {
      names.forEach(element => {
        queryParameters = this.addToHttpParams(queryParameters, <any>element, 'names');
      });
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType_ = 'text';
    }

    return this.httpClient.get<{ [key: string]: string }>(`${this.configuration.basePath}/professors/search/findProfessorIdsByNames`, {
      params: queryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * get professor image
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProfessorImage(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/png' }
  ): Observable<Array<string>>;
  public getProfessorImage(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/png' }
  ): Observable<HttpResponse<Array<string>>>;
  public getProfessorImage(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'image/png' }
  ): Observable<HttpEvent<Array<string>>>;
  public getProfessorImage(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'image/png' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getProfessorImage.');
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['image/png'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.get<Array<string>>(`${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}/image`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * Responds with a compact overview
   * This API gives the basic information summary over all professors and a small project statistic
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProfessorOverview(
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<CollectionModelEntityModelProfessorOverviewDto>;
  public getProfessorOverview(
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpResponse<CollectionModelEntityModelProfessorOverviewDto>>;
  public getProfessorOverview(
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpEvent<CollectionModelEntityModelProfessorOverviewDto>>;
  public getProfessorOverview(
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<any> {
    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.get<CollectionModelEntityModelProfessorOverviewDto>(`${this.configuration.basePath}/professors/overview`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * uploads profile picture
   * @param id UUID of Professor
   * @param image GIF / PNG / JPG Image
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postProfessorImage(
    id: string,
    image?: Blob,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<any>;
  public postProfessorImage(
    id: string,
    image?: Blob,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<HttpResponse<any>>;
  public postProfessorImage(
    id: string,
    image?: Blob,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<HttpEvent<any>>;
  public postProfessorImage(
    id: string,
    image?: Blob,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling postProfessorImage.');
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (Bearer) required
    credential = this.configuration.lookupCredential('Bearer');
    if (credential) {
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['multipart/form-data'];

    const canConsumeForm = this.canConsumeForm(consumes);

    let formParams: { append(param: string, value: any): any };
    let useForm = false;
    let convertFormParamsToString = false;
    // use FormData to transmit files using content-type "multipart/form-data"
    // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
    useForm = canConsumeForm;
    if (useForm) {
      formParams = new FormData();
    } else {
      formParams = new HttpParams({ encoder: this.encoder });
    }

    if (image !== undefined) {
      formParams = (formParams.append('image', <any>image) as any) || formParams;
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.post<any>(
      `${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}/image`,
      convertFormParamsToString ? formParams.toString() : formParams,
      {
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * set professors faculty
   * @param id
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public saveFaculty(
    id: string,
    body: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<EntityModelFaculty>;
  public saveFaculty(
    id: string,
    body: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpResponse<EntityModelFaculty>>;
  public saveFaculty(
    id: string,
    body: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpEvent<EntityModelFaculty>>;
  public saveFaculty(
    id: string,
    body: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling saveFaculty.');
    }
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling saveFaculty.');
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (Bearer) required
    credential = this.configuration.lookupCredential('Bearer');
    if (credential) {
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['text/plain'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.put<EntityModelFaculty>(
      `${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}/faculty`,
      body,
      {
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * save professor
   * @param professor
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public saveProfessor(
    professor: Professor,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<EntityModelProfessor>;
  public saveProfessor(
    professor: Professor,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpResponse<EntityModelProfessor>>;
  public saveProfessor(
    professor: Professor,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpEvent<EntityModelProfessor>>;
  public saveProfessor(
    professor: Professor,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<any> {
    if (professor === null || professor === undefined) {
      throw new Error('Required parameter professor was null or undefined when calling saveProfessor.');
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (Bearer) required
    credential = this.configuration.lookupCredential('Bearer');
    if (credential) {
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.post<EntityModelProfessor>(`${this.configuration.basePath}/professors`, professor, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * update professor
   * @param id
   * @param professor
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateProfessor(
    id: string,
    professor: Professor,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<EntityModelProfessor>;
  public updateProfessor(
    id: string,
    professor: Professor,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpResponse<EntityModelProfessor>>;
  public updateProfessor(
    id: string,
    professor: Professor,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<HttpEvent<EntityModelProfessor>>;
  public updateProfessor(
    id: string,
    professor: Professor,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'application/hal+json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling updateProfessor.');
    }
    if (professor === null || professor === undefined) {
      throw new Error('Required parameter professor was null or undefined when calling updateProfessor.');
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (Bearer) required
    credential = this.configuration.lookupCredential('Bearer');
    if (credential) {
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'application/hal+json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }

    return this.httpClient.put<EntityModelProfessor>(
      `${this.configuration.basePath}/professors/${encodeURIComponent(String(id))}`,
      professor,
      {
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
