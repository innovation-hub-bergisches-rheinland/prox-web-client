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
import { Module } from './module';

export interface StudyCourse {
  academicDegree?: StudyCourse.AcademicDegreeEnum;
  id?: string;
  modules?: Set<Module>;
  name?: string;
}

export namespace StudyCourse {
  export type AcademicDegreeEnum = 'BACHELOR' | 'MASTER' | 'UNKNOWN';
  export const AcademicDegreeEnum = {
    Bachelor: 'BACHELOR' as AcademicDegreeEnum,
    Master: 'MASTER' as AcademicDegreeEnum,
    Unknown: 'UNKNOWN' as AcademicDegreeEnum
  };
}
