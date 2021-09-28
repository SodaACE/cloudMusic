  function debounce(fn,delay=300) {
    var timer = null
    return function() {
      if(timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(()=> {
        fn()
      },delay)
    }
  }

export default debounce