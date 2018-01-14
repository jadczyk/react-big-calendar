'use strict'

exports.__esModule = true
exports.endOfRange = endOfRange
exports.eventSegments = eventSegments
exports.segStyle = segStyle
exports.eventLevels = eventLevels
exports.inRange = inRange
exports.segsOverlap = segsOverlap
exports.sortEvents = sortEvents
exports.eventDaySegStyle = eventDaySegStyle
exports.eventDaySegment = eventDaySegment

var _findIndex = require('lodash/findIndex')

var _findIndex2 = _interopRequireDefault(_findIndex)

var _dates = require('./dates')

var _dates2 = _interopRequireDefault(_dates)

var _accessors = require('./accessors')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var DAY_MINUTES = 24 * 60

function endOfRange(dateRange) {
  var unit =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'day'

  return {
    first: dateRange[0],
    last: _dates2.default.add(dateRange[dateRange.length - 1], 1, unit),
  }
}

function eventSegments(event, first, last, _ref, range) {
  var startAccessor = _ref.startAccessor,
    endAccessor = _ref.endAccessor

  var slots = _dates2.default.diff(first, last, 'day')
  var start = _dates2.default.max(
    _dates2.default.startOf(
      (0, _accessors.accessor)(event, startAccessor),
      'day'
    ),
    first
  )
  var end = _dates2.default.min(
    _dates2.default.ceil((0, _accessors.accessor)(event, endAccessor), 'day'),
    last
  )

  var padding = (0, _findIndex2.default)(range, function(x) {
    return _dates2.default.eq(x, start, 'day')
  })
  var span = _dates2.default.diff(start, end, 'day')

  span = Math.min(span, slots)
  span = Math.max(span, 1)

  return {
    event: event,
    span: span,
    left: padding + 1,
    right: Math.max(padding + span, 1),
  }
}

function segStyle(span, slots) {
  var per = span / slots * 100 + '%'
  return {
    WebkitFlexBasis: per,
    flexBasis: per,
    maxWidth: per, // IE10/11 need max-width. flex-basis doesn't respect box-sizing
  }
}

function eventLevels(rowSegments) {
  var limit =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity

  var i = void 0,
    j = void 0,
    seg = void 0,
    levels = [],
    extra = []

  for (i = 0; i < rowSegments.length; i++) {
    seg = rowSegments[i]

    for (j = 0; j < levels.length; j++) {
      if (!segsOverlap(seg, levels[j])) break
    }
    if (j >= limit) {
      extra.push(seg)
    } else {
      ;(levels[j] || (levels[j] = [])).push(seg)
    }
  }

  for (i = 0; i < levels.length; i++) {
    levels[i].sort(function(a, b) {
      return a.left - b.left
    }) //eslint-disable-line
  }

  return { levels: levels, extra: extra }
}

function inRange(e, start, end, _ref2) {
  var startAccessor = _ref2.startAccessor,
    endAccessor = _ref2.endAccessor

  var eStart = _dates2.default.startOf(
    (0, _accessors.accessor)(e, startAccessor),
    'day'
  )
  var eEnd = (0, _accessors.accessor)(e, endAccessor)

  var startsBeforeEnd = _dates2.default.lte(eStart, end, 'day')
  // when the event is zero duration we need to handle a bit differently
  var endsAfterStart = !_dates2.default.eq(eStart, eEnd, 'minutes')
    ? _dates2.default.gt(eEnd, start, 'minutes')
    : _dates2.default.gte(eEnd, start, 'minutes')

  return startsBeforeEnd && endsAfterStart
}

function segsOverlap(seg, otherSegs) {
  return otherSegs.some(function(otherSeg) {
    return otherSeg.left <= seg.right && otherSeg.right >= seg.left
  })
}

function sortEvents(evtA, evtB, _ref3) {
  var startAccessor = _ref3.startAccessor,
    endAccessor = _ref3.endAccessor,
    allDayAccessor = _ref3.allDayAccessor

  var startSort =
    +_dates2.default.startOf(
      (0, _accessors.accessor)(evtA, startAccessor),
      'day'
    ) -
    +_dates2.default.startOf(
      (0, _accessors.accessor)(evtB, startAccessor),
      'day'
    )

  var durA = _dates2.default.diff(
    (0, _accessors.accessor)(evtA, startAccessor),
    _dates2.default.ceil((0, _accessors.accessor)(evtA, endAccessor), 'day'),
    'day'
  )

  var durB = _dates2.default.diff(
    (0, _accessors.accessor)(evtB, startAccessor),
    _dates2.default.ceil((0, _accessors.accessor)(evtB, endAccessor), 'day'),
    'day'
  )

  return (
    startSort || // sort by start Day first
    Math.max(durB, 1) - Math.max(durA, 1) || // events spanning multiple days go first
    !!(0, _accessors.accessor)(evtB, allDayAccessor) -
      !!(0, _accessors.accessor)(evtA, allDayAccessor) || // then allDay single day events
    +(0, _accessors.accessor)(evtA, startAccessor) -
      +(0, _accessors.accessor)(evtB, startAccessor)
  ) // then sort by start time
}

function eventDaySegStyle(segStart, segEnd) {
  var startMinutes = segStart.getHours() * 60 + segStart.getMinutes()
  var endMinutes = segEnd.getHours() * 60 + segEnd.getMinutes()
  if (endMinutes === 0) {
    //whole day segment
    endMinutes = DAY_MINUTES
  }
  var startPer = startMinutes / DAY_MINUTES * 100 + '%'
  var endPer = endMinutes / DAY_MINUTES * 100 + '%'
  var height = (endMinutes - startMinutes) / DAY_MINUTES * 100 + '%'
  return { top: startPer, height: height, position: 'relative' }
}

//supershort events not supported
function eventDaySegment(event, date, _ref4) {
  var startAccessor = _ref4.startAccessor,
    endAccessor = _ref4.endAccessor

  var eStart = (0, _accessors.accessor)(event, startAccessor)
  var eEnd = (0, _accessors.accessor)(event, endAccessor)

  var dayStart = date
  var dayEnd = _dates2.default.add(date, 1, 'day')

  //start within day
  if (
    _dates2.default.gte(eStart, dayStart) &&
    _dates2.default.lt(eStart, dayEnd)
  ) {
    var segmentEnd = _dates2.default.min(eEnd, dayEnd)
    var segmentStart = eStart
    return {
      event: event,
      segmentStart: segmentStart,
      segmentEnd: segmentEnd,
      style: eventDaySegStyle(segmentStart, segmentEnd),
    }
  } else if (
    _dates2.default.gt(eEnd, dayStart) &&
    _dates2.default.lte(eEnd, dayEnd)
  ) {
    //start previous day (otherwise we would enter 1st condition), end within day
    var _segmentStart = dayStart
    var _segmentEnd = eEnd
    return {
      event: event,
      segmentStart: _segmentStart,
      segmentEnd: _segmentEnd,
      style: eventDaySegStyle(_segmentStart, _segmentEnd),
    }
  } else if (
    _dates2.default.gt(eEnd, dayStart) &&
    _dates2.default.lt(eStart, dayStart)
  ) {
    //multiday event
    var _segmentStart2 = dayStart
    var _segmentEnd2 = dayEnd
    return {
      event: event,
      segmentStart: dayStart,
      segmentEnd: dayEnd,
      style: eventDaySegStyle(_segmentStart2, _segmentEnd2),
    }
  }

  return null
}
