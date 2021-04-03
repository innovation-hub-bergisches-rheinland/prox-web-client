/**
 * PROX Professor Profile Service
 * This Service is part of [PROX](https://prox.innovation-hub.de/) and is used to give professors the opportunity to create a custom profile as an informative source about him/her and the projects he/her offers
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CollectionModelEntityModelProfessorOverviewDtoEmbedded } from './collectionModelEntityModelProfessorOverviewDtoEmbedded';
import { Link } from './link';

export interface CollectionModelEntityModelProfessorOverviewDto {
  _embedded?: CollectionModelEntityModelProfessorOverviewDtoEmbedded;
  _links?: { [key: string]: Link };
}
