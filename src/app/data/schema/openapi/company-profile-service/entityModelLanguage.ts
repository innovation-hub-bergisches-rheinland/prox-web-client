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
import { Link } from './link';

export interface EntityModelLanguage {
  id: string;
  isoIdentifier2: string;
  englishName: string;
  germanName: string;
  iso3166Mapping?: string;
  type: EntityModelLanguage.TypeEnum;
  _links?: { [key: string]: Link };
}
export namespace EntityModelLanguage {
  export type TypeEnum = 'ANCIENT' | 'LIVING' | 'CONSTRUCTED' | 'HISTORICAL' | 'EXTINCT' | 'NONE';
  export const TypeEnum = {
    Ancient: 'ANCIENT' as TypeEnum,
    Living: 'LIVING' as TypeEnum,
    Constructed: 'CONSTRUCTED' as TypeEnum,
    Historical: 'HISTORICAL' as TypeEnum,
    Extinct: 'EXTINCT' as TypeEnum,
    None: 'NONE' as TypeEnum
  };
}
