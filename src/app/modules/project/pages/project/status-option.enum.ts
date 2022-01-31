import { Status } from '@data/schema/project-service.types';

export type StatusOption = Record<Status, string>;
export const StatusOption: StatusOption = {
  FINISHED: 'Abgeschlossen',
  RUNNING: 'Laufend',
  AVAILABLE: 'Verfügbar'
};
