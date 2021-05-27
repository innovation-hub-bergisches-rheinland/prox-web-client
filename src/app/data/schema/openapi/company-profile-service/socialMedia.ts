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

export interface SocialMedia {
  type?: SocialMedia.TypeEnum;
  account?: string;
}
export namespace SocialMedia {
  export type TypeEnum =
    | 'FACEBOOK'
    | 'TWITTER'
    | 'INSTAGRAM'
    | 'XING'
    | 'LINKEDIN';
  export const TypeEnum = {
    Facebook: 'FACEBOOK' as TypeEnum,
    Twitter: 'TWITTER' as TypeEnum,
    Instagram: 'INSTAGRAM' as TypeEnum,
    Xing: 'XING' as TypeEnum,
    Linkedin: 'LINKEDIN' as TypeEnum
  };
}
