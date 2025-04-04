export interface ScrollInfo {
	start: number
	end: number
	selected: number
	_itemAmount: number
}

export interface Scrollbar {
	size: number
	offset: number
}

export function createScroller(
	itemAmount: number,
	itemsToShow: number
): ScrollInfo {
	return {
		start: 0,
		end: (itemAmount < itemsToShow ? itemAmount : itemsToShow) - 1,
		selected: -1,
		_itemAmount: itemAmount
	}
}

export function nextItem({
	start,
	end,
	selected,
	_itemAmount
}: ScrollInfo): ScrollInfo {
	let newSelected = selected + 1

	if (newSelected === _itemAmount) {
		return createScroller(_itemAmount, end - start + 1)
	}

	let shouldScroll =
		newSelected === end && end !== (_itemAmount - 1)

	let s = (x: number): number =>
		shouldScroll ? x + 1 : x

	return {
		start: s(start),
		end: s(end),
		selected: newSelected,
		_itemAmount
	}
}

export function previousItem({
	start,
	end,
	selected,
	_itemAmount
}: ScrollInfo): ScrollInfo {
	let newSelected = selected - 1

	if (newSelected === -2) {
		return lastItem(createScroller(_itemAmount, end - start + 1))
	}

	let shouldScroll =
		newSelected === start && start !== 0

	let s = (x: number): number =>
		shouldScroll ? x - 1 : x

	return {
		start: s(start),
		end: s(end),
		selected: newSelected,
		_itemAmount
	}
}

export function firstItem(scroller: ScrollInfo): ScrollInfo {
	return nextItem(createScroller(
		scroller._itemAmount,
		scroller.end - scroller.start + 1
	))
}

export function lastItem({
	start,
	end,
	_itemAmount
}: ScrollInfo): ScrollInfo {
	return {
		start: _itemAmount - (end - start) - 1,
		end: _itemAmount - 1,
		selected: _itemAmount - 1,
		_itemAmount
	}
}

export function generateScrollbar({
	start,
	end,
	_itemAmount
}: ScrollInfo): Scrollbar {
	let trackHeight = (end - start) + 1
	let scale = trackHeight / _itemAmount

	let scrollbarStart = Math.floor(start * scale)
	let scrollbarHeight = Math.ceil(trackHeight * scale)

	return {
		size: scrollbarHeight,
		offset: scrollbarStart
	}
}
