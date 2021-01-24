import * as React from 'react'

import {
  each,
  isArray,
  isPlainObject,
  isString,
  parseInt
} from 'lodash'

export const useViewport = (queries = {}) => {
  const [viewportSize, setViewportSize] = React.useState({
    currentWidth: undefined,
    currentHeight: undefined,
    activeBreakpoint: undefined
  })

  React.useEffect(() => {
    let b // breakpoint

    const handleResize = () => {
      const w = window.innerWidth

      /**
       * Evaluates `min` against the current screen width.
       *
       * @param  {String} min Min breakpoint value
       * @param  {String} k   Key of breakpoint in query object
       * @return {String}     Key of active breakpoint
       */
      const min = (min, k) => {
        min = parseInt(min)
        b = w >= min ? k : b
      }

      /**
       * Evaluates `max` against the current screen width.
       *
       * @param  {String} max Max breakpoint value
       * @param  {String} k   Key of breakpoint in query object
       * @return {String}     Key of active breakpoint
       */
      const max = (max, k) => {
        max = parseInt(max)
        b = w <= max ? k : b
      }

      /**
       * Evaluates `min` and `max` against the current screen width.
       *
       * @param  {String} min Min breakpoint value
       * @param  {String} max Max breakpoint value
       * @param  {String} k   Key of breakpoint in query object
       * @return {String}     Key of active breakpoint
       */
      const rng = (min, max, k) => {
        min = parseInt(min)
        max = parseInt(max)
        b = w >= min && w <= max ? k : b
      }

      /**
       * Evaluates compound media query against the current screen width.
       *
       * @param  {Object} q Min/max breakpoint values
       * @param  {String} k Key of breakpoint in query object
       * @return {String}   Key of active breakpoint
       */
      const mlt = (q, k) => {
        if (q.min && !q.max) min(q.min, k)
        if (!q.min && q.max) max(q.max, k)
        if (q.min && q.max) rng(q.min, q.max, k)
      }

      each(queries, (v, k) => {
        if (isString(v)) { // min
          min(v, k)
        }
        if (isPlainObject(v)) { // max
          each(v, () => mlt(v, k))
        }
        if (isArray(v)) { // multi-range
          each(v, o => each(o, () => mlt(o, k)))
        }
      })

      setViewportSize({
        currentWidth: window.innerWidth,
        currentHeight: window.innerHeight,
        activeBreakpoint: b
      })
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewportSize
}
