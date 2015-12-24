(function (chaiJSkit) {
  "use strict";
  // Module systems magic dance.
  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // NodeJS
    module.exports = chaiJSkit;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
      return chaiJSkit;
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(chaiJSkit);
  }
}(function chaiJSkit(chai, utils) {
  "use strict";
  var isArray = _.isArray;
  var any = _.any;
  var tail = _.tail;
  var contains = _.contains;
  var first = _.first;
  var flatten = _.flatten;
  var keys = _.keys;

  chai.Assertion.addMethod("action", function (action, methodName) {
    var assertMessage = "expected #{this} to have an " + action + " action mapped to the " + methodName + " method";
    var refuteMessage = "expected #{this} to NOT have an " + action + " action mapped to the " + methodName + " method";

    if (arguments.length == 1) {
      methodName = action;
      assertMessage = "expected #{this} to have an " + action + " action";
      refuteMessage = "expected #{this} to NOT have an " + action + " action";
    }

    this.assert(_.isFunction(this._obj[methodName]), assertMessage, refuteMessage);
  });

  function missingAction(action, controller) {
    return !controller.elements[action];
  }

  function missingElement(element, action, controller) {
    return !controller.elements[action][element];
  }

  function hasNoEventHandlers(element, action, controller) {
    return !isArray(controller.elements[action][element]);
  }

  function hasNoRegisteredEvents(element, eventName, handler, action, controller) {
    return !any(tail(controller.elements[action][element]), function(eventHandlers) {
      return eventHandlers[eventName] === handler;
    });
  }

  function assertWithReason(result, assertMessage, refuteMessage, reason) {
    this.assert(result, [assertMessage, reason].join(", except "), refuteMessage);
  }

  chai.Assertion.addMethod("registerEvent", function(action, element, eventName, handler) {
    utils.flag(this, "action", action);
    utils.flag(this, "element", element);
    var controller = this._obj;
    var pass = false;
    var assertMessage = "expected #{this} to register `" + handler + "` on `" + eventName + "` of the `$" + element + "` element, for the `" + action + "` action";
    var refuteMessage = "expected #{this} to NOT register `" + handler + "` on `" + eventName + "` of the `$" + element + "` element, for the `" + action + "` action";

    if (missingAction(action, controller)) return assertWithReason.call(this,pass, assertMessage, refuteMessage, "there is no `" + action + "` action");
    if (missingElement(element, action, controller)) return assertWithReason.call(this,pass, assertMessage, refuteMessage, "there is no `$" + element + "` element");
    if (hasNoEventHandlers(element, action, controller)) return assertWithReason.call(this,pass, assertMessage, refuteMessage, "the `" + element + "` element has no event handlers");
    if (hasNoRegisteredEvents(element, eventName, handler, action, controller)) return assertWithReason.call(this,pass, assertMessage, refuteMessage, "the `" + handler + "` function is not registered to the `" + eventName + "` event on `$" + element + "`");
  });

  chai.Assertion.addMethod("registerDynamicEvent", function(action, element, eventName, handler) {
    if (!sinon) throw new Error("registerDynamicEvent requires sinon-chai https://github.com/domenic/sinon-chai");

    var assertMessage = "expected #{this} to register `" + handler + "` on `" + eventName + "` of the `$" + element + "` element, for the `" + action + "` action dynamically";
    var refuteMessage = "expected #{this} to NOT register `" + handler + "` on `" + eventName + "` of the `$" + element + "` element, for the `" + action + "` action dynamically";
    var subject = this._obj;

    sinon.stub(subject, handler);
    subject.registerEvents(action);
    subject["$" + element].trigger(eventName);
    this.assert(subject[handler].called, assertMessage, refuteMessage);
  });

  chai.Assertion.addMethod("cacheElement", function(action, element, selector) {
    var subject = this._obj;
    if (!contains(keys(subject.elements[action]), element)) return assertWithReason.call(this, pass, assertMessage, refuteMessage, "there is no cache key `" + element + "`");
    if (!first(flatten([subject.elements[action][element]])) === selector) return assertWithReason.call(this, pass, assertMessage, refuteMessage, "`" + selector + "` is not the selector for the cache key `" + element + "`");
    if (!subject["$" + element].length) return assertWithReason.call(this, pass, assertMessage, refuteMessage, "`" + selector + "` is not in the DOM");
  });
}));
