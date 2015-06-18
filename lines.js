//UI
(function(global){
  global.render = render;
  global.initialize = initialize;

  var SIZE = 9;
  var ballImages= [
    "gem01.svg",
    "gem02.svg",
    "gem03.svg",
    "gem04.svg",
    "gem05.svg",
    "gem06.svg",
    "gem07.svg",
  ];
  var selectedBall = null;

  function shuffle(a) {
    return a.sort(function(){
      return Math.random()-0.5;
    });
  }

  function initialize() {
  }

  function createBall() {
    var x = ballImages[Math.floor(Math.random()*ballImages.length)];
    var img = $('<img class="ball" src="images/'+x+'">');
    img.click(function(e){
      e.stopPropagation();
      $(this).toggleClass("selected");
      selectedBall = this;
    });
    return img;
  }

  function copyNext() {
    for (var i = 0; i < 3; i++) {
      var img = $("#next img")[0];
      $(shuffle($("td:empty"))[0]).html(img);
    }
  }

  function createNext() {
    var table = $("<table></table>");
    var tr = $("<tr></tr>");
    for (var i = 0; i < 3; i++)
      tr.append($('<td></td>').append(createBall()));
    table.append(tr);
    $("#next").html(table);
  }

  function checkLine() {
    var tds = $("#content td");

    function isLined(x, y, vx, vy) {
      var img = $(tds[x*SIZE+y]).find("img");
      if (img.length == 0) return false;
      var src1 = img.attr("src")
      for (var k = 1; k < 3; k++) {
        var x2 = x+k*vx;
        var y2 = y+k*vy;
        if (x2 < 0 || x2 >= SIZE || y2 < 0 || y2 >= SIZE) return false;
        img = $(tds[x2*SIZE+y2]).find("img");
        if (img.length == 0) return false;
        var src2 = img.attr("src");
        if (src1 != src2)
          return false;
      }
      return true;
    }

    function eraseLine(x, y, vx, vy) {
      for (var k = 0; k < 3; k++) {
        var img = $(tds[(x+k*vx)*SIZE+(y+k*vy)]).find("img");
        $(img).effect("explode", null, "slow", function(){
          $(this).remove();
        });
      }
      var score = parseInt($("#score").text());
      $("#score").text(score+25);
    }

    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        if (isLined(i, j,  1,  0))
          eraseLine(i, j,  1,  0);
        if (isLined(i, j,  0,  1))
          eraseLine(i, j,  0,  1);
        if (isLined(i, j,  1,  1))
          eraseLine(i, j,  1,  1);
        if (isLined(i, j,  1, -1))
          eraseLine(i, j,  1, -1);
      }
    }
  }

  function render() {
    var table = $("<table></table>").attr("cellspacing",1);
    for (var i = 0; i < SIZE; i++) {
      var tr = $("<tr></tr>");
      for (var j = 0; j < SIZE; j++) {
        var td = $('<td></td>').click(function(){
          if (selectedBall) {
            $(this).append(selectedBall);
            $(selectedBall).removeClass("selected");
            selectedBall = null;
            setTimeout(function(){
              checkLine();
              copyNext();
              createNext();
            }, 100);
          }
        });
        tr.append(td);
      }
      table.append(tr);
    }
    $("#content").html(table);
    createNext();
    copyNext();
    createNext();

    $("#score").html("0");
  }
})(this.self);

$(document).ready(function(){
  initialize();
  render();
});
