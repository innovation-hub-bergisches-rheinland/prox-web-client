import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  ExternalConfiguration,
  ExternalConfigurationHandlerInterface
} from 'angular4-hal';

import { environment } from '@env';

@Injectable()
export class ExternalConfigurationService
  implements ExternalConfigurationHandlerInterface {
  constructor(private http: HttpClient) {}

  getProxyUri(): string {
    return environment.apiUrl;
  }

  getRootUri(): string {
    return environment.apiUrl;
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getExternalConfiguration(): ExternalConfiguration {
    return null;
  }

  setExternalConfiguration(externalConfiguration: ExternalConfiguration) {}

  deserialize(): any {}

  serialize(): any {}
}
