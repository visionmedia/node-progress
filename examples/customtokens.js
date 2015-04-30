var ProgressBar = require('../')

// Demonstrates the use of custom tokens

var list = [
  'image01.jpg', 'image02.jpg', 'image03.jpg', 'image04.jpg', 'image05.jpg',
  'image06.jpg', 'image07.jpg', 'image08.jpg', 'image09.jpg', 'image10.jpg'
]

var bar = new ProgressBar(':percent eta: :eta downloading :current/:total :file', {
  total: list.length
})

var id = setInterval(function (){
  bar.tick({
    'file': list[bar.curr]
  })
  if (bar.complete) {
    clearInterval(id)
  }
}, 500)
