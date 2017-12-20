import mapList from './map-list'
import mapDictionary from './map-dictionary'
import { isList, isDictionary } from '../utils'

/**
 * Equivalent to mapList or mapDictionary.
 * @async
 * @param  {Array|Object} listOrDictionary list or dictionary
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time
 * @return {Promise<Array|Object>} A list or dictionary
 * @throws {TypeError} First argument must be a List or Dictionary
 */
export default function map(listOrDictionary, fn, concurrency) {
  if (isList(listOrDictionary)) {
    return mapList(listOrDictionary, fn, concurrency)
  }
  if (isDictionary(listOrDictionary)) {
    return mapDictionary(listOrDictionary, fn, concurrency)
  }
  throw new TypeError('First argument must be a List or Dictionary')
}
