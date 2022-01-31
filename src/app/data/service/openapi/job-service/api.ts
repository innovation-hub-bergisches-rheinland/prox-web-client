export * from './jobOfferController.service';
import { JobOfferControllerService } from './jobOfferController.service';
export * from './jobOfferEntryLevelController.service';
import { JobOfferEntryLevelControllerService } from './jobOfferEntryLevelController.service';
export * from './jobOfferTypeController.service';
import { JobOfferTypeControllerService } from './jobOfferTypeController.service';
export const APIS = [JobOfferControllerService, JobOfferEntryLevelControllerService, JobOfferTypeControllerService];
