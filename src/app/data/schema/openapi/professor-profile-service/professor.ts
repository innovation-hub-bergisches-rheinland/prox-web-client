/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Publication } from './publication';
import { ResearchSubject } from './researchSubject';
import { ContactInformation } from './contactInformation';

export interface Professor {
  id?: string;
  name?: string;
  affiliation?: string;
  mainSubject?: string;
  contactInformation?: ContactInformation;
  researchSubjects?: Array<ResearchSubject>;
  publications?: Array<Publication>;
  vita?: string;
}
