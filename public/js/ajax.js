
document.getElementById("commentform").addEventListener("submit", commentsubmit);
function commentsubmit() {
  var title_name = document.getElementById('title')
  var review= document.getElementById('review')
  $.ajax({
    url: '/comment/' + title_name,
    type: 'POST',
    data: {
      title: title_name.value,
      review: review
    },
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });
}