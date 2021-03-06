var Rx = require('../../dist/cjs/Rx');

var AsyncSubject = Rx.AsyncSubject;
var nextTick = Rx.Scheduler.nextTick;
var Observable = Rx.Observable;

describe('AsyncSubject', function () {
  it('should emit the last value when complete', function () {
    var subject = new AsyncSubject();
    var results = [];

    subject.subscribe(function (x) {
      results.push(x);
    }, null, function () {
      results.push('done');
    });

    subject.next(1);
    expect(results).toEqual([]);
    subject.next(2);
    expect(results).toEqual([]);
    subject.complete();
    expect(results).toEqual([2, 'done']);
  });

  it('should just complete if no value has been nexted into it', function () {
    var subject = new AsyncSubject();
    var results = [];

    subject.subscribe(function (x) {
      results.push(x);
    }, null, function () {
      results.push('done');
    });

    expect(results).toEqual([]);
    subject.complete();
    expect(results).toEqual(['done']);
  });

  it('should only error if an error is passed into it', function () {
    var subject = new AsyncSubject();
    var results = [];

    subject.subscribe(function (x) {
      results.push(x);
    }, function (err) {
      results.push(err);
    }, function () {
      throw 'should not be called';
    });

    subject.next(1);
    expect(results).toEqual([]);
    subject.error(new Error('bad'));
    expect(results).toEqual([new Error('bad')]);
  });

  it('should only error if an error is passed into it', function () {
    var subject = new AsyncSubject();
    var results = [];

    subject.subscribe(function (x) {
      results.push(x);
    }, function (err) {
      results.push(err);
    }, function () {
      throw 'should not be called';
    });

    subject.next(1);
    expect(results).toEqual([]);
    subject.error(new Error('bad'));
    expect(results).toEqual([new Error('bad')]);
  });
});