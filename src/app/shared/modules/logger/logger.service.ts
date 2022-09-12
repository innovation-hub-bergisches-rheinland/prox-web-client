import { Injectable } from '@angular/core';
import { environment } from '@env';

export type Toast = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  config = environment.loggingConfig;

  constructor() {}

  error(message?: any, ...optionalParams: any[]) {
    if (!this.config.error) {
      return;
    }

    console.error(message, optionalParams);
  }

  info(message?: any, ...optionalParams: any[]) {
    if (!this.config.info) {
      return;
    }

    console.info(message, optionalParams);
  }

  warning(message?: any, ...optionalParams: any[]) {
    if (!this.config.warn) {
      return;
    }

    console.warn(message, optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]) {
    if (!this.config.debug) {
      return;
    }

    console.log(message, optionalParams);
  }
}
