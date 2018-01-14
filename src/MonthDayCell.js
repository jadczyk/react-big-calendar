import React from 'react'
import PropTypes from 'prop-types'
import { accessor as get } from './utils/accessors'
import cn from 'classnames'
import { isSelected } from './utils/selection'

class MonthDayCell extends React.Component {
	render() {
		const {
			date,
			dayOfWeek,
			daySegments,
			eventComponent: Event,
			eventWrapperComponent: EventWrapper,
			onSelect,
			onDoubleClick,
			className,
			eventPropGetter,
			titleAccessor,
			startAccessor,
			endAccessor,
				selected,
				...props
		} = this.props;

		return <div className="rbc-month-day-cell" style={{...props.style}}>
			{daySegments.map((seg, idx) => {
				let event = seg.event;
				let title = get(event, titleAccessor),
				end = get(event, endAccessor),
						start = get(event, startAccessor);
				if (eventPropGetter)
					var { style, className: xClassName } = eventPropGetter(
							event,
							start,
							end,
							selected
					)

						return <EventWrapper event={event} key={event.id}>
							<div
									style={{...style, ...seg.style}}
									className={cn('rbc-event', className, xClassName, {
										'rbc-selected': isSelected(event, selected),
										// 'rbc-event-continues-prior': continuesPrior,
										// 'rbc-event-continues-after': continuesAfter,
									})}
									onClick={e => onSelect(event, e)}
									onDoubleClick={e => onDoubleClick(event, e)}
							>
								<div className="rbc-event-content" title={title}>
									{Event ? (
											<Event event={event} title={title}/>
									) : (
											title
									)}
								</div>
							</div>
						</EventWrapper>
					}
			)}
		</div>
	}
}

MonthDayCell.propTypes = {
	date: PropTypes.instanceOf(Date),
	dayOfWeek: PropTypes.number,
	daySegments: PropTypes.array,
	eventComponent: PropTypes.func,
	eventWrapperComponent: PropTypes.func,
	onSelect: PropTypes.func,
	onDoubleClick: PropTypes.func
}

export default MonthDayCell
