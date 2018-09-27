// Helpers
exports.getDataArray = function(arr) {
    return new Promise(function(resolve) {
        resolve(arr)
    })
}

var sortBy = exports.sortBy = function(arr, param) {
    return new Promise(async(resolve,reject) => {
        if (arr.length === 1) {
            resolve( arr )
        }
        else {
    
            const middle = Math.floor(arr.length / 2) 
            const left = arr.slice(0, middle)
            const right = arr.slice(middle) 
        
            resolve( await merge(
                await sortBy(left, param),
                await sortBy(right, param),
                param
            ) )
        }
    })
  }
  
  // compare the arrays item by item and return the concatenated result
  function merge (left, right, param) {
      return new Promise(function(resolve,reject) {
        let result = []
        let indexLeft = 0
        let indexRight = 0
    
        while (indexLeft < left.length && indexRight < right.length) {
          if (left[indexLeft][param] > right[indexRight][param]) {
            result.push(left[indexLeft])
            indexLeft++
          } else {
            result.push(right[indexRight])
            indexRight++
          }
        }
      
        resolve( result.concat(left.slice(indexLeft)).concat(right.slice(indexRight)) )
      })
  }