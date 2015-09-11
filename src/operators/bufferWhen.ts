import Operator from '../Operator';
import Observer from '../Observer';
import Subscriber from '../Subscriber';
import Observable from '../Observable';
import Subject from '../Subject';
import Subscription from '../Subscription';

import tryCatch from '../util/tryCatch';
import {errorObject} from '../util/errorObject';
import bindCallback from '../util/bindCallback';

export default function bufferWhen<T>(closingSelector: () => Observable<any>) : Observable<T[]> {
  return this.lift(new BufferWhenOperator(closingSelector));
}

class BufferWhenOperator<T, R> implements Operator<T, R> {

  constructor(private closingSelector: () => Observable<any>) {
  }

  call(observer: Observer<T>): Observer<T> {
    return new BufferWhenSubscriber(observer, this.closingSelector);
  }
}

class BufferWhenSubscriber<T> extends Subscriber<T> {
  private buffer: T[];
  private closingNotification: Subscription<any>;
  
  constructor(destination: Observer<T>, private closingSelector: () => Observable<any>) {
    super(destination);
    this.openBuffer();
  }

  _next(value: T) {
    this.buffer.push(value);
  }
  
  _error(err: any) {
    this.buffer = null;
    this.destination.error(err);
  }
  
  _complete() {
    const buffer = this.buffer;
    this.destination.next(buffer);
    this.buffer = null;
    this.destination.complete();
  }
  
  openBuffer() {
    const prevClosingNotification = this.closingNotification;
    if (prevClosingNotification) {
      this.remove(prevClosingNotification);
      prevClosingNotification.unsubscribe();
    }
    
    const buffer = this.buffer;
    if (buffer) {
      this.destination.next(buffer);
    }
    this.buffer = [];
    
    let closingNotifier = tryCatch(this.closingSelector)();
    if (closingNotifier === errorObject) {
      const err = closingNotifier.e;
      this.buffer = null;
      this.destination.error(err);
    } else {
      this.add(this.closingNotification = closingNotifier._subscribe(new BufferClosingNotifierSubscriber(this))); 
    }
  }
}

class BufferClosingNotifierSubscriber<T> extends Subscriber<T> {
  constructor(private parent: BufferWhenSubscriber<any>) {
    super(null);
  }
  
  _next() {
    this.parent.openBuffer();
  }
  
  _error(err) {
    this.parent.error(err);
  }
  
  _complete() {
    // noop
  }
}