import eachList from './each-list'
import eachDictionary from './each-dictionary'
import { isList, isDictionary } from '../utils'

/**
 * Equivalent to eachList or eachDictionary.
 * @async
 * @param  {Array|Object} listOrDictionary list or dictionary
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time, default is all at the same time
 * @return {Promise<void>} Promise state changes to Resolved when all asynchronous tasks have completed
 * @throws {TypeError} First argument must be a List or Dictionary
 */
export default function each(listOrDictionary, fn, concurrency) {
  if (isList(listOrDictionary)) {
    return eachList(listOrDictionary, fn, concurrency)
  }
  if (isDictionary(listOrDictionary)) {
    return eachDictionary(listOrDictionary, fn, concurrency)
  }
  throw new TypeError('First argument must be a List or Dictionary')
}
