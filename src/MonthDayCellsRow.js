import React from 'react'
import PropTypes from 'prop-types'
import { eventDaySegment, segStyle } from './utils/eventLevels'
import MonthDayCell from './MonthDayCell'

class MonthDayCellsRow extends React.Component {
  render() {
    const {
      range,
      events,
      eventComponent,
      eventWrapperComponent,
      startAccessor,
      endAccessor,
      ...props
    } = this.props

    const dayCells = []
    for (let i = 0; i < range.length; i++) {
      let date = range[i]
      const daySegments = events.reduce((result, e) => {
        let segment = eventDaySegment(e, date, { startAccessor, endAccessor })
        if (segment) {
          result.push(segment)
        }
        return result
      }, [])

      dayCells.push(
        <MonthDayCell
          {...props}
          style={segStyle(1, range.length)}
          key={i}
          date={date}
          dayOfWeek={i}
          daySegments={daySegments}
          eventComponent={eventComponent}
          eventWrapperComponent={eventWrapperComponent}
        />
      )
    }

    return <div className="rbc-row-month-day-cells-row">{dayCells}</div>
  }
}

MonthDayCellsRow.propTypes = {
  children: PropTypes.element,
  range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
}

export default MonthDayCellsRow
