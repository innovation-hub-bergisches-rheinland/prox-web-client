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
import { ModuleType } from './moduleType';
import { Links } from './links';

export interface EntityModelOfProject {
  created?: string;
  creatorID: string;
  creatorName: string;
  description?: string;
  id?: string;
  links?: Links;
  modified?: string;
  modules?: Array<ModuleType>;
  name: string;
  requirement?: string;
  shortDescription: string;
  supervisorName: string;
}
