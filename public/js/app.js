$(function() {
  $('.fixrepo').on('click', function (e) {
    e.preventDefault()
    $.ajax({
      url: e.target.href,
      method: 'POST'
    }, function (res) {
      console.log(res);
    }, function (err) {
      console.log(err)
    })
  })
});
