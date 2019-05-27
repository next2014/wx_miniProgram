var rp = require('request-promise')

exports.main = (event, context) => {
  //  var res = rp('http://api.douban.com/v2/book/isbn/'+ event.isbn).then( html => {
  var res = rp('http://api.douban.com/v2/movie/subject/' + event.isbn).then(html => {
      return html;
   }).catch( err => {
      console.log(err);
   })
  return res
}