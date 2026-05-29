export function isEventCardFavoriteTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('.event-card__favorite'))
}

export function navigateUnlessFavoriteClick(
  event: MouseEvent | KeyboardEvent,
  navigate: (e?: MouseEvent) => void,
): void {
  if (isEventCardFavoriteTarget(event.target)) {
    event.preventDefault()
    return
  }
  navigate(event instanceof MouseEvent ? event : undefined)
}
