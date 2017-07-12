import mapList from './map-list'
import mapDictionary from './map-dictionary'
import { isList, isDictionary } from '../utils'

/**
 * map
 *
 * @param  {Array|Object} listOrDictionary
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Array|Object}
 */
export default function map(listOrDictionary, fn, concurrency) {
  if (isList(listOrDictionary)) {
    return mapList(listOrDictionary, fn, concurrency)
  }
  if (isDictionary(listOrDictionary)) {
    return mapDictionary(listOrDictionary, fn, concurrency)
  }
  throw new TypeError('First argument structure must be List or Dictionary')
}
