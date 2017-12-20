import everyList from './every-list'
import everyDictionary from './every-dictionary'
import { isList, isDictionary } from '../utils'

/**
 * Equivalent to everyList or everyDictionary.
 * @async
 * @param  {Array|Object} listOrDictionary list or dictionary
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time
 * @return {Promise<Array|Object>} A list or dictionary
 * @throws {TypeError} First argument must be a List or Dictionary
 */
export default function every(listOrDictionary, fn, concurrency) {
  if (isList(listOrDictionary)) {
    return everyList(listOrDictionary, fn, concurrency)
  }
  if (isDictionary(listOrDictionary)) {
    return everyDictionary(listOrDictionary, fn, concurrency)
  }
  throw new TypeError('First argument must be a List or Dictionary')
}
