import { WithRequired } from 'types';
import { Page } from './shared.types';
import { UserProfile } from './user.types';

export type Lecturer = WithRequired<UserProfile, 'lecturerProfile'>;

export type LecturerList = Page<Lecturer>;
