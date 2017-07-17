import eachList from './each-list'
import eachDictionary from './each-dictionary'
import { isList, isDictionary } from '../utils'

/**
 * each
 *
 * @param  {Array|Object} listOrDictionary
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Array|Object}
 */
export default function each(listOrDictionary, fn, concurrency) {
  if (isList(listOrDictionary)) {
    return eachList(listOrDictionary, fn, concurrency)
  }
  if (isDictionary(listOrDictionary)) {
    return eachDictionary(listOrDictionary, fn, concurrency)
  }
  throw new TypeError('First argument structure must be List or Dictionary')
}
