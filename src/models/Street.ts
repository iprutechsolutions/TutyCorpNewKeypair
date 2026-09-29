import {Ward} from './Ward';
import {Zone} from './Zone';

export interface Street {
  streetId: number;
  streetName: string;
  ward: Ward;
  zone: Zone;
}
