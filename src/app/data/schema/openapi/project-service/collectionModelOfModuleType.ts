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
import { EmbeddedCollectionOfModuleType } from './embeddedCollectionOfModuleType';
import { Link } from './link';

/**
 * Resources of ModuleType
 */
export interface CollectionModelOfModuleType {
  _embedded: EmbeddedCollectionOfModuleType;
  /**
   * Link collection
   */
  _links: { [key: string]: Link };
}
