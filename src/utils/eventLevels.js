import findIndex from 'lodash/findIndex'
import dates from './dates'
import { accessor as get } from './accessors'

const DAY_MINUTES = 24 * 60;

export function endOfRange(dateRange, unit = 'day') {
  return {
    first: dateRange[0],
    last: dates.add(dateRange[dateRange.length - 1], 1, unit),
  }
}

export function eventSegments(
  event,
  first,
  last,
  { startAccessor, endAccessor },
  range
) {
  let slots = dates.diff(first, last, 'day')
  let start = dates.max(dates.startOf(get(event, startAccessor), 'day'), first)
  let end = dates.min(dates.ceil(get(event, endAccessor), 'day'), last)

  let padding = findIndex(range, x => dates.eq(x, start, 'day'))
  let span = dates.diff(start, end, 'day')

  span = Math.min(span, slots)
  span = Math.max(span, 1)

  return {
    event,
    span,
    left: padding + 1,
    right: Math.max(padding + span, 1),
  }
}

export function segStyle(span, slots) {
  let per = span / slots * 100 + '%'
  return { WebkitFlexBasis: per, flexBasis: per, maxWidth: per } // IE10/11 need max-width. flex-basis doesn't respect box-sizing
}

export function eventLevels(rowSegments, limit = Infinity) {
  let i,
    j,
    seg,
    levels = [],
    extra = []

  for (i = 0; i < rowSegments.length; i++) {
    seg = rowSegments[i]

    for (j = 0; j < levels.length; j++) if (!segsOverlap(seg, levels[j])) break

    if (j >= limit) {
      extra.push(seg)
    } else {
      ;(levels[j] || (levels[j] = [])).push(seg)
    }
  }

  for (i = 0; i < levels.length; i++) {
    levels[i].sort((a, b) => a.left - b.left) //eslint-disable-line
  }

  return { levels, extra }
}

export function inRange(e, start, end, { startAccessor, endAccessor }) {
  let eStart = dates.startOf(get(e, startAccessor), 'day')
  let eEnd = get(e, endAccessor)

  let startsBeforeEnd = dates.lte(eStart, end, 'day')
  // when the event is zero duration we need to handle a bit differently
  let endsAfterStart = !dates.eq(eStart, eEnd, 'minutes')
    ? dates.gt(eEnd, start, 'minutes')
    : dates.gte(eEnd, start, 'minutes')

  return startsBeforeEnd && endsAfterStart
}

export function segsOverlap(seg, otherSegs) {
  return otherSegs.some(
    otherSeg => otherSeg.left <= seg.right && otherSeg.right >= seg.left
  )
}

export function sortEvents(
  evtA,
  evtB,
  { startAccessor, endAccessor, allDayAccessor }
) {
  let startSort =
    +dates.startOf(get(evtA, startAccessor), 'day') -
    +dates.startOf(get(evtB, startAccessor), 'day')

  let durA = dates.diff(
    get(evtA, startAccessor),
    dates.ceil(get(evtA, endAccessor), 'day'),
    'day'
  )

  let durB = dates.diff(
    get(evtB, startAccessor),
    dates.ceil(get(evtB, endAccessor), 'day'),
    'day'
  )

  return (
    startSort || // sort by start Day first
    Math.max(durB, 1) - Math.max(durA, 1) || // events spanning multiple days go first
    !!get(evtB, allDayAccessor) - !!get(evtA, allDayAccessor) || // then allDay single day events
    +get(evtA, startAccessor) - +get(evtB, startAccessor)
  ) // then sort by start time
}

export function eventDaySegStyle(segStart, segEnd) {
  let startMinutes = segStart.getHours() * 60 + segStart.getMinutes();
  let endMinutes = segEnd.getHours() * 60 + segEnd.getMinutes();
  if(endMinutes === 0) {	//whole day segment
		endMinutes = DAY_MINUTES;
	}
  let startPer = startMinutes / DAY_MINUTES * 100 + '%';
  let endPer = endMinutes / DAY_MINUTES * 100 + '%';
  let height = (endMinutes - startMinutes) / DAY_MINUTES * 100 + '%';
	return { top: startPer, height: height, position: 'relative'};
}

//supershort events not supported
export function eventDaySegment(event, date, { startAccessor, endAccessor })
{
	let eStart = get(event, startAccessor);
	let eEnd = get(event, endAccessor);

	let dayStart = date;
	let dayEnd = dates.add(date, 1, 'day');

	//start within day
	if(dates.gte(eStart, dayStart) && dates.lt(eStart, dayEnd)) {
	  let segmentEnd = dates.min(eEnd, dayEnd);
	  let segmentStart = eStart;
		return {
			event,
			segmentStart: segmentStart,
			segmentEnd: segmentEnd,
			style: eventDaySegStyle(segmentStart, segmentEnd)
		};
  }
  //start previous day (otherwise we would enter 1st condition), end within day
  else if(dates.gt(eEnd, dayStart) && dates.lte(eEnd, dayEnd)) {
		let segmentStart = dayStart;
		let segmentEnd = eEnd;
		return {
			event,
			segmentStart: segmentStart,
			segmentEnd: segmentEnd,
			style: eventDaySegStyle(segmentStart, segmentEnd)
		}
	}
	//multiday event
	else if(dates.gt(eEnd, dayStart) && dates.lt(eStart, dayStart)) {
		let segmentStart = dayStart;
		let segmentEnd = dayEnd;
    return {
      event,
      segmentStart: dayStart,
      segmentEnd: dayEnd,
			style: eventDaySegStyle(segmentStart, segmentEnd)
    }
  }

	return null;
}
