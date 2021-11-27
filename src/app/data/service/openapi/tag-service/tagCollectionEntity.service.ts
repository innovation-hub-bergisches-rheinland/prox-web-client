/**
 * Api Documentation
 * Api Documentation
 *
 * The version of the OpenAPI document: 1.0
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

import { CollectionModelOfTag } from '@data/schema/openapi/tag-service/models';
import { CollectionModelOfTagCollection } from '@data/schema/openapi/tag-service/models';
import { EntityModelOfTag } from '@data/schema/openapi/tag-service/models';
import { EntityModelOfTagCollection } from '@data/schema/openapi/tag-service/models';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class TagCollectionEntityService {
  protected basePath = 'http://10.255.0.7:8081';
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
   * findAllTagCollection
   * @param page page
   * @param size size
   * @param sort sort
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findAllTagCollectionUsingGET(
    page?: number,
    size?: number,
    sort?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: {
      httpHeaderAccept?:
        | 'application/json'
        | 'application/hal+json'
        | 'text/uri-list'
        | 'application/x-spring-data-compact+json';
    }
  ): Observable<CollectionModelOfTagCollection>;
  public findAllTagCollectionUsingGET(
    page?: number,
    size?: number,
    sort?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: {
      httpHeaderAccept?:
        | 'application/json'
        | 'application/hal+json'
        | 'text/uri-list'
        | 'application/x-spring-data-compact+json';
    }
  ): Observable<HttpResponse<CollectionModelOfTagCollection>>;
  public findAllTagCollectionUsingGET(
    page?: number,
    size?: number,
    sort?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: {
      httpHeaderAccept?:
        | 'application/json'
        | 'application/hal+json'
        | 'text/uri-list'
        | 'application/x-spring-data-compact+json';
    }
  ): Observable<HttpEvent<CollectionModelOfTagCollection>>;
  public findAllTagCollectionUsingGET(
    page?: number,
    size?: number,
    sort?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: {
      httpHeaderAccept?:
        | 'application/json'
        | 'application/hal+json'
        | 'text/uri-list'
        | 'application/x-spring-data-compact+json';
    }
  ): Observable<any> {
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (page !== undefined && page !== null) {
      queryParameters = this.addToHttpParams(
        queryParameters,
        <any>page,
        'page'
      );
    }
    if (size !== undefined && size !== null) {
      queryParameters = this.addToHttpParams(
        queryParameters,
        <any>size,
        'size'
      );
    }
    if (sort !== undefined && sort !== null) {
      queryParameters = this.addToHttpParams(
        queryParameters,
        <any>sort,
        'sort'
      );
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [
        'application/json',
        'application/hal+json',
        'text/uri-list',
        'application/x-spring-data-compact+json'
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

    return this.httpClient.get<CollectionModelOfTagCollection>(
      `${this.configuration.basePath}/tagCollections`,
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
   * findByIdTagCollection
   * @param id id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findByIdTagCollectionUsingGET(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<EntityModelOfTagCollection>;
  public findByIdTagCollectionUsingGET(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<EntityModelOfTagCollection>>;
  public findByIdTagCollectionUsingGET(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<EntityModelOfTagCollection>>;
  public findByIdTagCollectionUsingGET(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling findByIdTagCollectionUsingGET.'
      );
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.get<EntityModelOfTagCollection>(
      `${this.configuration.basePath}/tagCollections/${encodeURIComponent(
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

  /**
   * tagCollectionTags
   * @param id id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public tagCollectionTagsUsingGET(
    id: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<CollectionModelOfTag>;
  public tagCollectionTagsUsingGET(
    id: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpResponse<CollectionModelOfTag>>;
  public tagCollectionTagsUsingGET(
    id: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<HttpEvent<CollectionModelOfTag>>;
  public tagCollectionTagsUsingGET(
    id: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/hal+json' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling tagCollectionTagsUsingGET.'
      );
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

    return this.httpClient.get<CollectionModelOfTag>(
      `${this.configuration.basePath}/tagCollections/${encodeURIComponent(
        String(id)
      )}/tags`,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * tagCollectionTags
   * @param id id
   * @param tagId tagId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public tagCollectionTagsUsingGET1(
    id: string,
    tagId: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<EntityModelOfTag>;
  public tagCollectionTagsUsingGET1(
    id: string,
    tagId: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<EntityModelOfTag>>;
  public tagCollectionTagsUsingGET1(
    id: string,
    tagId: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<EntityModelOfTag>>;
  public tagCollectionTagsUsingGET1(
    id: string,
    tagId: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling tagCollectionTagsUsingGET1.'
      );
    }
    if (tagId === null || tagId === undefined) {
      throw new Error(
        'Required parameter tagId was null or undefined when calling tagCollectionTagsUsingGET1.'
      );
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.get<EntityModelOfTag>(
      `${this.configuration.basePath}/tagCollections/${encodeURIComponent(
        String(id)
      )}/tags/${encodeURIComponent(String(tagId))}`,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * tagCollectionTags
   * @param id id
   * @param requestBody
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public tagCollectionTagsUsingPATCH(
    id: string,
    requestBody?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<CollectionModelOfTag>;
  public tagCollectionTagsUsingPATCH(
    id: string,
    requestBody?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<CollectionModelOfTag>>;
  public tagCollectionTagsUsingPATCH(
    id: string,
    requestBody?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<CollectionModelOfTag>>;
  public tagCollectionTagsUsingPATCH(
    id: string,
    requestBody?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling tagCollectionTagsUsingPATCH.'
      );
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (JWT) required
    credential = this.configuration.lookupCredential('JWT');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
      httpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json',
      'application/x-spring-data-compact+json',
      'text/uri-list'
    ];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      httpHeaderAcceptSelected &&
      httpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.patch<CollectionModelOfTag>(
      `${this.configuration.basePath}/tagCollections/${encodeURIComponent(
        String(id)
      )}/tags`,
      requestBody,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * tagCollectionTags
   * @param id id
   * @param requestBody
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public tagCollectionTagsUsingPOST(
    id: string,
    requestBody?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<CollectionModelOfTag>;
  public tagCollectionTagsUsingPOST(
    id: string,
    requestBody?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<CollectionModelOfTag>>;
  public tagCollectionTagsUsingPOST(
    id: string,
    requestBody?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<CollectionModelOfTag>>;
  public tagCollectionTagsUsingPOST(
    id: string,
    requestBody?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling tagCollectionTagsUsingPOST.'
      );
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (JWT) required
    credential = this.configuration.lookupCredential('JWT');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
      httpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json',
      'application/x-spring-data-compact+json',
      'text/uri-list'
    ];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      httpHeaderAcceptSelected &&
      httpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.post<CollectionModelOfTag>(
      `${this.configuration.basePath}/tagCollections/${encodeURIComponent(
        String(id)
      )}/tags`,
      requestBody,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * tagCollectionTags
   * @param id id
   * @param requestBody
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public tagCollectionTagsUsingPUT(
    id: string,
    requestBody?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<CollectionModelOfTag>;
  public tagCollectionTagsUsingPUT(
    id: string,
    requestBody?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<CollectionModelOfTag>>;
  public tagCollectionTagsUsingPUT(
    id: string,
    requestBody?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<CollectionModelOfTag>>;
  public tagCollectionTagsUsingPUT(
    id: string,
    requestBody?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling tagCollectionTagsUsingPUT.'
      );
    }

    let headers = this.defaultHeaders;

    let credential: string | undefined;
    // authentication (JWT) required
    credential = this.configuration.lookupCredential('JWT');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
      httpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['text/uri-list'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      httpHeaderAcceptSelected &&
      httpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.put<CollectionModelOfTag>(
      `${this.configuration.basePath}/tagCollections/${encodeURIComponent(
        String(id)
      )}/tags`,
      requestBody,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * findAllUsingTagsTagCollection
   * @param tagIds tagIds
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findAllUsingTagsTagCollectionUsingGET(
    tagIds?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<CollectionModelOfTagCollection>;
  public findAllUsingTagsTagCollectionUsingGET(
    tagIds?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<CollectionModelOfTagCollection>>;
  public findAllUsingTagsTagCollectionUsingGET(
    tagIds?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<CollectionModelOfTagCollection>>;
  public findAllUsingTagsTagCollectionUsingGET(
    tagIds?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (tagIds !== undefined && tagIds !== null) {
      queryParameters = this.addToHttpParams(
        queryParameters,
        <any>tagIds,
        'tagIds'
      );
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.get<CollectionModelOfTagCollection>(
      `${this.configuration.basePath}/tagCollections/search/findAllUsingTags`,
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
   * findAllUsingTagsUsingNameTagCollection
   * @param tags tags
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findAllUsingTagsUsingNameTagCollectionUsingGET(
    tags?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<CollectionModelOfTagCollection>;
  public findAllUsingTagsUsingNameTagCollectionUsingGET(
    tags?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpResponse<CollectionModelOfTagCollection>>;
  public findAllUsingTagsUsingNameTagCollectionUsingGET(
    tags?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<HttpEvent<CollectionModelOfTagCollection>>;
  public findAllUsingTagsUsingNameTagCollectionUsingGET(
    tags?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*' }
  ): Observable<any> {
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (tags !== undefined && tags !== null) {
      queryParameters = this.addToHttpParams(
        queryParameters,
        <any>tags,
        'tags'
      );
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.get<CollectionModelOfTagCollection>(
      `${this.configuration.basePath}/tagCollections/search/findAllUsingTagsUsingName`,
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
}
