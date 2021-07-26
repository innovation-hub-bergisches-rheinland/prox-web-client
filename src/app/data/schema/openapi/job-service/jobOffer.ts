/**
 * PROX Job Service
 * This Service is part of [PROX](https://prox.innovation-hub.de/)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Creator } from './creator';

export interface JobOffer {
  id?: string;
  title: string;
  description: string;
  earliestStartOfEmployment?: string;
  createdAt?: string;
  createdBy?: Creator;
}
