import everyList from './every-list'
import everyDictionary from './every-dictionary'
import { isList, isDictionary } from '../utils'

/**
 * every
 *
 * @param  {Array|Object} listOrDictionary
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Array|Object}
 */
export default function every(listOrDictionary, fn, concurrency) {
  if (isList(listOrDictionary)) {
    return everyList(listOrDictionary, fn, concurrency)
  }
  if (isDictionary(listOrDictionary)) {
    return everyDictionary(listOrDictionary, fn, concurrency)
  }
  throw new TypeError('First argument structure must be List or Dictionary')
}
