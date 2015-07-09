function li(html) {
  return $('<li></li>').html(html);
}

function button_to(label) {
  return $('<a>'+label+'</a>').addClass("ui-btn").addClass("ui-shadow");
}

function link_to(label, href) {
  return button_to(label).attr("href", href).attr("rel", "external");
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

function createBubble(text, option) {
  var div = $('<div>'+text+'</div>');
  div.css("position","absolute");
  div.css("font-size", "large");
  div.css("color", "white");
  div.css("top", option.top);
  div.css("left", option.left);
  div.addClass("animated").addClass("bounce");
  div.on({
    "animationend": function() {
      $(this).remove();
    },
  });
  return div;
}
