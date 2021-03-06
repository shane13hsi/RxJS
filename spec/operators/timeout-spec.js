/* globals describe, it, expect, expectObservable, expectSubscriptions, cold, hot, rxTestScheduler */
var Rx = require('../../dist/cjs/Rx');
var Observable = Rx.Observable;

describe('Observable.prototype.timeout()', function () {
  var defaultTimeoutError = new Error('timeout');

  it('should timeout after a specified timeout period', function () {
    var e1 =  cold('-');
    var e1subs =   '^    !';
    var expected = '-----#';

    var result = e1.timeout(50, null, rxTestScheduler);

    expectObservable(result).toBe(expected, null, defaultTimeoutError);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should timeout after specified timeout period and send the passed error', function () {
    var e1 =  cold('-');
    var e1subs =   '^    !';
    var expected = '-----#';
    var value = 'hello';

    var result = e1.timeout(50, value, rxTestScheduler);

    expectObservable(result).toBe(expected, null, value);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not timeout if source completes within absolute timeout period', function () {
    var e1 =   hot('--a--b--c--d--e--|');
    var e1subs =   '^                !';
    var expected = '--a--b--c--d--e--|';

    var timeoutValue = new Date(rxTestScheduler.now() + (expected.length + 2) * 10);

    expectObservable(e1.timeout(timeoutValue, null, rxTestScheduler)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not timeout if source emits within timeout period', function () {
    var e1 =   hot('--a--b--c--d--e--|');
    var e1subs =   '^                !';
    var expected = '--a--b--c--d--e--|';

    expectObservable(e1.timeout(50, null, rxTestScheduler)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should allow unsubscribing explicitly and early', function () {
    var e1 =   hot('--a--b--c---d--e--|');
    var unsub =    '          !        ';
    var e1subs =   '^         !        ';
    var expected = '--a--b--c--        ';

    var result = e1.timeout(50, null, rxTestScheduler);

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should timeout after a specified timeout period between emit with default ' +
  'error while source emits', function () {
    var e1 =   hot('---a---b---c------d---e---|');
    var e1subs =   '^               !          ';
    var expected = '---a---b---c----#          ';
    var values = {a: 'a', b: 'b', c: 'c'};

    var result = e1.timeout(50, null, rxTestScheduler);

    expectObservable(result).toBe(expected, values, defaultTimeoutError);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should timeout after a specified delay with passed error while source emits', function () {
    var value = 'hello';
    var e1 =   hot('---a---b---c------d---e---|');
    var e1subs =   '^               !          ';
    var expected = '---a---b---c----#          ';
    var values = {a: 'a', b: 'b', c: 'c'};

    var result = e1.timeout(50, value, rxTestScheduler);

    expectObservable(result).toBe(expected, values, value);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should timeout at a specified Date', function () {
    var e1 =  cold('-');
    var e1subs =   '^         !';
    var expected = '----------#';

    var result = e1.timeout(new Date(rxTestScheduler.now() + 100), null, rxTestScheduler);

    expectObservable(result).toBe(expected, null, defaultTimeoutError);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should timeout specified Date with default error while source emits', function () {
    var e1 =   hot('--a--b--c--d--e--|');
    var e1subs =   '^         !       ';
    var expected = '--a--b--c-#       ';
    var values = {a: 'a', b: 'b', c: 'c'};

    var result = e1.timeout(new Date(rxTestScheduler.now() + 100), null, rxTestScheduler);

    expectObservable(result).toBe(expected, values, defaultTimeoutError);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should timeout specified Date with passed error while source emits', function () {
    var value = 'hello';
    var e1 =   hot('--a--b--c--d--e--|');
    var e1subs =   '^         !       ';
    var expected = '--a--b--c-#       ';
    var values = {a: 'a', b: 'b', c: 'c'};

    var result = e1.timeout(new Date(rxTestScheduler.now() + 100), value, rxTestScheduler);

    expectObservable(result).toBe(expected, values, value);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });
});
