export * from './jobOfferController.service';
import { JobOfferControllerService } from './jobOfferController.service';
import { JobOfferEntryLevelControllerService } from './jobOfferEntryLevelController.service';
import { JobOfferTypeControllerService } from './jobOfferTypeController.service';

export * from './jobOfferEntryLevelController.service';

export * from './jobOfferTypeController.service';

export const APIS = [JobOfferControllerService, JobOfferEntryLevelControllerService, JobOfferTypeControllerService];
