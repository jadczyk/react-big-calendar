'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _eventLevels = require('./utils/eventLevels');

var _MonthDayCell = require('./MonthDayCell');

var _MonthDayCell2 = _interopRequireDefault(_MonthDayCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonthDayCellsRow = function (_React$Component) {
  _inherits(MonthDayCellsRow, _React$Component);

  function MonthDayCellsRow() {
    _classCallCheck(this, MonthDayCellsRow);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  MonthDayCellsRow.prototype.render = function render() {
    var _props = this.props,
        range = _props.range,
        events = _props.events,
        eventComponent = _props.eventComponent,
        eventWrapperComponent = _props.eventWrapperComponent,
        startAccessor = _props.startAccessor,
        endAccessor = _props.endAccessor,
        props = _objectWithoutProperties(_props, ['range', 'events', 'eventComponent', 'eventWrapperComponent', 'startAccessor', 'endAccessor']);

    var dayCells = [];

    var _loop = function _loop(i) {
      var date = range[i];
      var daySegments = events.reduce(function (result, e) {
        var segment = (0, _eventLevels.eventDaySegment)(e, date, { startAccessor: startAccessor, endAccessor: endAccessor });
        if (segment) {
          result.push(segment);
        }
        return result;
      }, []);

      dayCells.push(_react2.default.createElement(_MonthDayCell2.default, _extends({}, props, {
        style: (0, _eventLevels.segStyle)(1, range.length),
        key: i,
        date: date,
        dayOfWeek: i,
        daySegments: daySegments,
        eventComponent: eventComponent,
        eventWrapperComponent: eventWrapperComponent
      })));
    };

    for (var i = 0; i < range.length; i++) {
      _loop(i);
    }

    return _react2.default.createElement(
      'div',
      { className: 'rbc-row-month-day-cells-row' },
      dayCells
    );
  };

  return MonthDayCellsRow;
}(_react2.default.Component);

MonthDayCellsRow.propTypes = {
  children: _propTypes2.default.element,
  range: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date))
};

exports.default = MonthDayCellsRow;
module.exports = exports['default'];