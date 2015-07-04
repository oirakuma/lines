//UI
(function(global){
  global.render = render;
  global.initialize = initialize;
  global.setLevel = setLevel;

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
  var penguinImages = [
    "Rockhopper01",
    "Emperor01",
  ];
  var selectedBall = null;
  var cache = null;
  var status = 0;
  var penguinImage = null;
  var level = 0;

  function copyNext() {
    var count = Math.min(3, $("#content td:empty").length);
    for (var i = 0; i < count; i++) {
      var img = $("#next img")[0];
      var tds = $("#content td:empty");
      $(tds[Math.floor(Math.random()*tds.length)]).append($(img).effect("pulsate"));
    }
  }

  function createNext() {
    var table = $("<table></table>").attr("cellspacing",1);
    var tr = $("<tr></tr>");
    for (var i = 0; i < 3; i++)
      tr.append($('<td></td>').append(createBall()));
    table.append(tr);
    $("#next").html(table);

    function createBall() {
      var x = ballImages[Math.floor(Math.random()*ballImages.length)];
      var img = $('<img>').addClass("ball").attr("src", baseURI+"/images/"+x);
      return img;
    }
  }

  function checkLines() {
    var tds = $("#content td");

    function isLined(x, y, vx, vy) {
      var img = $(tds[x*SIZE+y]).find("img");
      if (img.length == 0) return false;
      var src1 = img.attr("src")
      var k = 1;
      while (true) {
        var x2 = x+k*vx;
        var y2 = y+k*vy;
        if (x2 < 0 || x2 >= SIZE || y2 < 0 || y2 >= SIZE) break;
        img = $(tds[x2*SIZE+y2]).find("img");
        if (img.length == 0) break;
        var src2 = img.attr("src");
        if (src1 != src2) break;
        k++;
      }
      return k;
    }

    function eraseLine(x, y, vx, vy, n) {
      for (var k = 0; k < n; k++) {
        if (cache[(x+k*vx)*SIZE+(y+k*vy)]) return;
        cache[(x+k*vx)*SIZE+(y+k*vy)] = true;
        var img = $(tds[(x+k*vx)*SIZE+(y+k*vy)]).find("img");
        img.effect("puff", null, function(){
          $(this).remove();
        });
      }
      var score = parseInt($("#score").text());
      var count = 0;
      setTimeout(function(){
        $("#penguin img").attr("src", "images/"+penguinImage+"_L-Leg.png");
      }, 0);
      var timerId = setInterval(function(){
        count++;
        $("#score").text(score+count);
        if (count == n*n) {
          $("#penguin img").attr("src", "images/"+penguinImage+"_Center.png");
          clearTimeout(timerId);
        }
      }, 50);
    }

    cache = {};
    var erased = false;
    var n;
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        var vx = [1, 0, 1,  1];
        var vy = [0, 1, 1, -1];
        for (var k = 0; k < vx.length; k++) {
          if ((n = isLined(i, j,  vx[k], vy[k])) >= 5) {
            erased = true;
            eraseLine(i, j,  vx[k], vy[k], n);
          }
        }
      }
    }
    return erased;
  }

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

  function entryScore() {
    var name = prompt("名前を入力するとランキングに参加できます。");
    if (!name) return;

    var data = [
      "name="+name,
      "score="+$("#score").text()
    ].join("&");
    $.ajax({
      url: baseURI+"/entry",
      type: "POST",
      data: data
    });
  }

  function showRetryButton() {
    var button = $('<a>リトライ</a>');
    button.addClass("ui-btn");
    button.click(function(){
      initialize();
      $(this).remove();
      $("h3").remove();
    });
    $("#content").append(button);
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
          $(selectedBall).find("img").trigger("stopRumble");
          $(this).append($(selectedBall).find("img"));
          selectedBall = null;
          var erased = checkLines();
          if (!erased) {
            copyNext();
            checkLines();
            if ($("#content td:empty").length == 0) {
              status = GAMEOVER;
              $("#content").append($('<h3>GameOver</h3>'));
              showRetryButton();
              setTimeout(entryScore, 500);
            }
            createNext();
          }
        }
      } else {
        $(selectedBall).find("img").trigger("stopRumble");
        img.jrumble({
          speed: 50
        }).trigger("startRumble");
        selectedBall = this;
      }
    });
    var width = Math.min($(window).width(), $(window).height());
    td.css("width", Math.floor((width-20)/SIZE)-4);
    td.css("height", Math.floor((width-20)/SIZE)-4);
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
    var center = $("<center></center>");
    $("#content").html(center.append(table));
    initialize();
  }

  function initialize() {
    penguinImage = penguinImages[Math.floor(Math.random()*penguinImages.length)];
    var img = $('<img src="images/'+penguinImage+'_Center.png">');
    img.css("margin", "5px").css("height", "64px");
    $("#penguin").append(img);
    $("#content img").remove();
    $("#score").html("0");
    createNext();
    copyNext();
    createNext();
  }

  function setLevel(_level) {
    level = _level;
  }
})(this.self);

$(document).ready(function(){
  $("input[type=radio]").click(function(){
    var level = parseInt($(this).val());
    setLevel(level);
  });
  render();
});
