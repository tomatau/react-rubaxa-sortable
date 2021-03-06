"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var assign = _interopRequire(require("object-assign"));

var React = _interopRequire(require("react/addons"));

var Sortable = _interopRequire(require("sortablejs"));

var ReactSortable = React.createClass({
  displayName: "ReactSortable",
  componentDidMount: function () {
    var options = assign({}, this.props.sortable);
    var eventNames = ["onStart", "onEnd", "onAdd", "onRemove", "onUpdate", "onSort", "onFilter"];

    for (var i = 0; i < eventNames.length; i++) {
      (function () {
        var eventName = eventNames[i];
        if (options[eventName]) {
          (function () {
            var callback = options[eventName];
            options[eventName] = function (eventName) {
              callback(this, eventName);
            };
          })();
        }
      })();
    }

    this.sortable = Sortable.create(this.getDOMNode(), options);
    this.renderList();
  },

  componentDidUpdate: function () {
    this.renderList();
  },

  componentWillUnmount: function () {
    var childNodes = this.getDOMNode().childNodes
      , node = childNodes.length-1;
    for(;node >= 0; node--){
      React.unmountComponentAtNode(childNodes[node]);
    }
    this.sortable.destroy();
  },

  getDefaultProps: function () {
    return {
      component: "div",
      childElement: "div"
    };
  },

  render: function () {
    var otherProps = assign({}, this.props);

    var consumedProps = ["sortable", "component", "childElement", "children"];
    for (var i = 0; i < consumedProps.length; i++) {
      delete otherProps[consumedProps[i]];
    }

    return React.createElement(this.props.component, otherProps);
  },

  renderList: function () {
    var _this = this;
    var domChildMap = {};
    for (var i = 0; i < this.getDOMNode().childNodes.length; i++) {
      var child = this.getDOMNode().childNodes[i];
      domChildMap[child.dataset.id] = child;
    }

    React.Children.forEach(this.props.children, function (reactChild) {
      var domChild = domChildMap[reactChild.key];
      delete domChildMap[reactChild.key];
      if (!domChild) {
        domChild = document.createElement(_this.props.childElement);
        if (_this.props.sortable.draggable) {
          domChild.className = _this.props.sortable.draggable.slice(1);
        }
        domChild.dataset.id = reactChild.key;
        _this.getDOMNode().appendChild(domChild);
      }
      React.render(reactChild, domChild);
    });

    for (var key in domChildMap) {
      React.unmountComponentAtNode(domChildMap[key]);
      this.getDOMNode().removeChild(domChildMap[key]);
    }
  }
});

module.exports = ReactSortable;