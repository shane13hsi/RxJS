import {ReplaySubject} from '../subject/ReplaySubject';
import {Observable} from '../Observable';
import {Scheduler} from '../Scheduler';
import {multicast} from './multicast';

export function publishReplay(bufferSize: number = Number.POSITIVE_INFINITY,
                              windowTime: number = Number.POSITIVE_INFINITY,
                              scheduler?: Scheduler) {
  return multicast.call(this, new ReplaySubject(bufferSize, windowTime, scheduler));
}

Observable.prototype.publishReplay = publishReplay;
