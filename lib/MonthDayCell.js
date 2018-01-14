'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _accessors = require('./utils/accessors');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _selection = require('./utils/selection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonthDayCell = function (_React$Component) {
  _inherits(MonthDayCell, _React$Component);

  function MonthDayCell() {
    _classCallCheck(this, MonthDayCell);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  MonthDayCell.prototype.render = function render() {
    var _props = this.props,
        date = _props.date,
        daySegments = _props.daySegments,
        Event = _props.eventComponent,
        EventWrapper = _props.eventWrapperComponent,
        onSelect = _props.onSelect,
        _onDoubleClick = _props.onDoubleClick,
        className = _props.className,
        eventPropGetter = _props.eventPropGetter,
        titleAccessor = _props.titleAccessor,
        startAccessor = _props.startAccessor,
        endAccessor = _props.endAccessor,
        selected = _props.selected,
        props = _objectWithoutProperties(_props, ['date', 'daySegments', 'eventComponent', 'eventWrapperComponent', 'onSelect', 'onDoubleClick', 'className', 'eventPropGetter', 'titleAccessor', 'startAccessor', 'endAccessor', 'selected']);

    return _react2.default.createElement(
      'div',
      { className: 'rbc-month-day-cell', style: _extends({}, props.style) },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('rbc-date-cell') },
        date.getDate()
      ),
      _react2.default.createElement(
        'div',
        { className: 'rbc-month-day-cell-events' },
        daySegments.map(function (seg, idx) {
          var event = seg.event;
          var title = (0, _accessors.accessor)(event, titleAccessor),
              end = (0, _accessors.accessor)(event, endAccessor),
              start = (0, _accessors.accessor)(event, startAccessor);
          if (eventPropGetter) var _eventPropGetter = eventPropGetter(event, start, end, selected),
                style = _eventPropGetter.style,
                xClassName = _eventPropGetter.className;

          return _react2.default.createElement(
            EventWrapper,
            { event: event, key: event.id },
            _react2.default.createElement(
              'div',
              {
                style: _extends({}, style, seg.style),
                className: (0, _classnames2.default)('rbc-event', className, xClassName, {
                  'rbc-selected': (0, _selection.isSelected)(event, selected),
                  'rbc-event-continues-earlier': seg.continuesPrior,
                  'rbc-event-continues-later': seg.continuesAfter
                }),
                onClick: function onClick(e) {
                  return onSelect(event, e);
                },
                onDoubleClick: function onDoubleClick(e) {
                  return _onDoubleClick(event, e);
                }
              },
              _react2.default.createElement(
                'div',
                { className: 'rbc-event-content', title: title },
                Event ? _react2.default.createElement(Event, { event: event, title: title }) : title
              )
            )
          );
        })
      )
    );
  };

  return MonthDayCell;
}(_react2.default.Component);

MonthDayCell.propTypes = {
  date: _propTypes2.default.instanceOf(Date),
  dayOfWeek: _propTypes2.default.number,
  daySegments: _propTypes2.default.array,
  eventComponent: _propTypes2.default.func,
  eventWrapperComponent: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  onDoubleClick: _propTypes2.default.func
};

exports.default = MonthDayCell;
module.exports = exports['default'];