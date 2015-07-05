function li(html) {
  return $('<li></li>').html(html);
}

function button_to(label) {
  return $('<a>'+label+'</a>').addClass("ui-btn").addClass("ui-shadow");
}

function url_for(name) {
  return baseURI+"/images/"+name;
}

function image_tag(name, option) {
  if (!option)
    option = {};
  var img = $('<img>').attr("src", url_for(name));
  for (var p in option)
    img.css(p, option[p]);
  return img;
}
