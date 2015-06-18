//UI
(function(global){
  global.render = render;

  var SIZE = 9;
  var GAMEOVER = -1;
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
  var status = 0;

  function shuffle(a) {
    return a.sort(function(){
      return Math.random()-0.5;
    });
  }

  function copyNext() {
    var count = Math.min(3, $("#content td:empty").length);
    for (var i = 0; i < count; i++) {
      var img = $("#next img")[0];
      $(shuffle($("#content td:empty"))[0]).append($(img).effect("pulsate"));
    }
  }

  function createNext() {
    var table = $("<table></table>");
    var tr = $("<tr></tr>");
    for (var i = 0; i < 3; i++)
      tr.append($('<td></td>').append(createBall()));
    table.append(tr);
    $("#next").html(table);

    function createBall() {
      var x = ballImages[Math.floor(Math.random()*ballImages.length)];
      var img = $('<img>').addClass("ball").attr("src", "images/"+x);
      return img;
    }
  }

  function checkLines() {
    var tds = $("#content td");

    function isLined(x, y, vx, vy) {
      var img = $(tds[x*SIZE+y]).find("img");
      if (img.length == 0) return false;
      var src1 = img.attr("src")
      for (var k = 1; k < 5; k++) {
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
      for (var k = 0; k < 5; k++) {
        var img = $(tds[(x+k*vx)*SIZE+(y+k*vy)]).find("img");
        $(img).effect("explode", null, "slow", function(){
          $(this).remove();
        });
      }
      var score = parseInt($("#score").text());
      $("#score").text(score+25);
    }

    var erased = false;
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        if (isLined(i, j,  1,  0)) {
          erased = true;
          eraseLine(i, j,  1,  0);
        }
        if (isLined(i, j,  0,  1)) {
          erased = true;
          eraseLine(i, j,  0,  1);
        }
        if (isLined(i, j,  1,  1)) {
          erased = true;
          eraseLine(i, j,  1,  1);
        }
        if (isLined(i, j,  1, -1)) {
          erased = true;
          eraseLine(i, j,  1, -1);
        }
      }
    }
    return erased;
  }

  var cache = null;

  function canMove(x1, y1, x2, y2, level) {
    if (x1 < 0 || x1 >= SIZE || y1 < 0 || y1 >= SIZE) return false;

    //check cache
    if (cache[x1*SIZE+y1]) return false;
    cache[x1*SIZE+y1] = true;

    //check ball
    if (level > 0 && $($("#content td")[x1*SIZE+y1]).find("img").length > 0)
      return false;

    //check goal
    if (x1 == x2 && y1 == y2) return true;

    if (canMove(x1  , y1+1, x2, y2, level+1)) return true;
    if (canMove(x1+1, y1  , x2, y2, level+1)) return true;
    if (canMove(x1  , y1-1, x2, y2, level+1)) return true;
    if (canMove(x1-1, y1  , x2, y2, level+1)) return true;

    return false;
  }

  function createTd(x, y) {
    var td = $('<td></td>').addClass("x"+x+"-"+y).click(function(){
      var img = $(this).find("img");
      if (img.length == 0) {
        if (selectedBall) {
          var x1 = parseInt($(selectedBall).attr("class")[1]);
          var y1 = parseInt($(selectedBall).attr("class")[3]);
          var x2 = parseInt($(this).attr("class")[1]);
          var y2 = parseInt($(this).attr("class")[3]);

          cache = {};
          if (!canMove(x1, y1, x2, y2, 0)) return;
          $(selectedBall).find("img").removeClass("selected");
          $(this).append($(selectedBall).find("img"));
          selectedBall = null;
          setTimeout(function(){
            var erased = checkLines();
            if (!erased) {
              copyNext();
              if ($("#content td:empty").length == 0) {
                status = GAMEOVER;
                $("#content").append($('<div>Game Over</div>').effect("bounce"));
              }
              createNext();
            }
          }, 100);
        }
      } else {
        $(selectedBall).find("img").removeClass("selected");
        img.toggleClass("selected");
        selectedBall = this;
      }
    });
    return td;
  }

  function render() {
    var table = $("<table></table>").attr("cellspacing",1);
    for (var i = 0; i < SIZE; i++) {
      var tr = $("<tr></tr>");
      for (var j = 0; j < SIZE; j++)
        tr.append(createTd(i, j));
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
