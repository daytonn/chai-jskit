describe("Chai-JSkit", function() {
  var subject;
  var app;
  beforeEach(function() {
    $("body").append("<div id='fixtures'/>")
    var fixtures = $("#fixtures");
    fixtures.append("<div class='test' />");
    fixtures.append("<div class='todo-list' />");
    fixtures.append("<div class='dynamic' />");
    app = JSkit.createApplication();
    subject = app.createController("TestController", {
      actions: [
        "index",
        {
          new: "form",
          create: "form",
          edit: "form",
          update: "form"
        }
      ],
      elements: {
        index: {
          test: ".test",
          dynamic: [".dynamic", function(on) {
            on("click", this.handleDynamicBound);
          }],
          todoList: [".todo-list", { click: "handleTodoListClick" }]
        }
      },
      index: function() {},
      form: function() {},
      handleTodoListClick: function() {},
      handleDynamicBound: function() {}
    })
  });

  describe("#action", function() {
    it("asserts the existence of a valid named action", function() {
      expect(subject).to.have.action("index");
    });

    it("asserts the existence of a valid mapped action", function() {
      expect(subject).to.have.action("edit", "form");
    });

    it("refutes the existence of an invalid named action", function() {
      expect(subject).to.not.have.action("nonexistent");
    });

    it("refutes the existence of an invalid mapped action", function() {
      expect(subject).to.not.have.action("nonexistent", "mapped");
    });
  });

  describe("#registerEvent", function() {
    it("asserts the registration of event handlers", function() {
      expect(subject).to.registerEvent("index", "todoList", "click", "handleTodoListClick");
    });

    it("refutes the registration of event handlers", function() {
      expect(subject).to.not.registerEvent("nonexistent");
    });
  });

  describe("#registerDynamicEvent", function() {
    it("asserts the registration of dynamic event handlers", function() {
      expect(subject).to.registerDynamicEvent("index", "dynamic", "click", "handleDynamicBound");
    });
  });

  describe("#cacheElement", function() {
    it("asserts the controller caches an element", function() {
      expect(subject).to.cacheElement("index", "todoList", ".todo-list");
    });
  });
});
