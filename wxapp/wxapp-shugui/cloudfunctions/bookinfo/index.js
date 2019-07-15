var rp = require('request-promise')

exports.main = (event, context) => {
<<<<<<< HEAD
  //  var res = rp('http://api.douban.com/v2/book/isbn/'+ event.isbn).then( html => {
  var res = rp('http://api.douban.com/v2/movie/subject/' + event.isbn).then(html => {
=======
   var res = rp('http://api.douban.com/v2/book/isbn/'+ event.isbn).then( html => {
      // var res = rp('http://api.douban.com/v2/book/isbn/'+ event.isbn).then( html => {
  //  var res = rp('https://douban.uieee.com/v2/movie/subject/' + event.isbn).then(html => {
>>>>>>> e463f3df2f0b66e902151d4dfd17c3dfc7843b4c
      return html;
   }).catch( err => {
      console.log(err);
   })
  return res
}