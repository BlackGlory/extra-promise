/**
 * promisify
 *
 * @param  {function} fn
 * @return {function}
 */
export default function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, function(err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }
}
