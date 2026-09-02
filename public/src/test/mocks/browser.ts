import { vi } from 'vitest'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds: ReadonlyArray<number> = []
  readonly scrollMargin = ''
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(_target: Element): void {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this)
  }

  unobserve(): void {}

  disconnect(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (!('IntersectionObserver' in globalThis)) {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
}

if (!('ResizeObserver' in globalThis)) {
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
}

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList