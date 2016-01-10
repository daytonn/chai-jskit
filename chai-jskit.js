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

  function controllerIsMissingAction(controller, action) {
    return !controller.elements[action];
  }

  function controllerIsMissingElement(controller, element) {
    return !controller[element];
  }

  function controllerHasNoEventHandlersForElementOnAction(controller, element, action) {
    return !isArray(controller.elements[action][element]);
  }

  function handlerIsNotRegisteredToEventOnElementForAction(handler, eventName, element, action, controller) {
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
    var elementKey = element.replace(/^\$/, "");
    var controller = this._obj;
    var testResult = { pass: true, reason: "" };
    var assertMessage = "expected #{this} to register `" + handler + "` on `" + eventName + "` of the `" + element + "` element, for the `" + action + "` action";
    var refuteMessage = "expected #{this} to NOT register `" + handler + "` on `" + eventName + "` of the `" + element + "` element, for the `" + action + "` action";

    if (sinon && controller[handler]) {
      var stub = sinon.stub(controller, handler);
      controller.registerEvents(action);
      controller[element].trigger(eventName);

      testResult = {
        pass: stub.called,
        reason: "the `" + handler + "` function did not fire when `" + element + "` triggered the `" + eventName + "` event"
      };
    }

    if (controllerIsMissingElement(controller, element)) {
      testResult = {
        pass: false,
        reason: "there is no `$" + element + "` element"
      };
    }

    if (controllerHasNoEventHandlersForElementOnAction(controller, elementKey, action)) {
      testResult = {
        pass: false,
        reason: "the `" + element + "` element has no event handlers"
      };
    }

    if (!testResult.pass && handlerIsNotRegisteredToEventOnElementForAction(handler, eventName, elementKey, action, controller)) {
      testResult = {
        pass: false,
        reason: "the `" + handler + "` function is not registered to the `" + eventName + "` event on `" + element + "`"
      };
    }

    assertWithReason.call(this, testResult.pass, assertMessage, refuteMessage, testResult.reason);
  });

  chai.Assertion.addMethod("cacheElement", function(action, element, selector) {
    var testResult = { pass: true, reason: "" };
    var elementKey = element.replace(/^\$/, "");
    var assertMessage = "expected #{this} to cache the `" + selector + "` element on the `" + action + "` action";
    var refuteMessage = "expected #{this} NOT to cache the `" + selector + "` element on the `" + action + "` action";
    var subject = this._obj;

    if (!subject[element]) {
      testResult = {
        pass: false,
        reason: "there is no cache key `" + element + "`"
      };
    }

    if (!first(flatten([subject.elements[action][elementKey]])) === selector) {
      testResult = {
        pass: false,
        reason: "`" + selector + "` is not the selector for the cache key `" + element + "`"
      };
    }

    if (!subject[element].length) {
      testResult = {
        pass: false,
        reason: "`" + selector + "` is not in the DOM"
      };
    }

    assertWithReason.call(this, testResult.pass, assertMessage, refuteMessage, testResult.reason);
  });
}));
