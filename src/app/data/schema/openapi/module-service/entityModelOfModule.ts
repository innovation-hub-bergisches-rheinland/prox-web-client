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
import { Link } from '../common/link';

export interface EntityModelOfModule {
  description?: string;
  id?: string;
  _links: { [key: string]: Link };
  name?: string;
  projectType?: EntityModelOfModule.ProjectTypeEnum;
}

export namespace EntityModelOfModule {
  export type ProjectTypeEnum = 'BA' | 'MA' | 'PP' | 'UNDEFINED';
  export const ProjectTypeEnum = {
    Ba: 'BA' as ProjectTypeEnum,
    Ma: 'MA' as ProjectTypeEnum,
    Pp: 'PP' as ProjectTypeEnum,
    Undefined: 'UNDEFINED' as ProjectTypeEnum
  };
}
