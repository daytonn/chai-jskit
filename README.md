Chai-JSkit
==========

This is a simple chai plugin to make testing [jskit](https://github.com/daytonn/jskit) applications.

Testing Actions
---------------

```js
// controller:
...
actions: ["index"],
...

// expectation:
expect(subject).to.have.action("index");
```

```js
// controller:
...
actions: [{ edit: "setupForm" }],
...

// expectation:
expect(subject).to.have.action("edit", "setupForm");
```

Testing Elements
----------------

```js
// controller:
...
elements: {
    index: {
        menuToggleButton: ".menu-toggle"
    }
}
...

// expectation:
expect(subject).to.cacheElement("index", "$menuToggleButton", ".menu-toggle");
```

Testing Events
--------------

```js
// controller:
...
elements: {
  index: {
    todoListItem: [".todo-list-item", { click: "handleTodoListClick" }]
  }
},
...
handleTodoListClick: function() {},

// expectation:
expect(subject).to.registerEvent("index", "$todoListItem", "click", "handleTodoListClick");
```

### Dynamic event binding:

```js
// controller:
...
elements: {
  index: {
    todoListItem: [".todo-list-item", function() {
        on("click", this.handleTodoListClick);
    }]
  }
},
...
handleTodoListClick: function() {},

// expectation:
expect(subject).to.registerEvent("index", "$todoListItem", "click", "handleTodoListClick");
```
