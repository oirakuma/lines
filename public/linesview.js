//UI
(function(global){
  global.render = render;
  global.initialize = initialize;
  global.setEasyMode = setEasyMode;
  global.setHardMode = setHardMode;

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
    "gem01.svg",
    "gem02.svg",
    "gem03.svg",
    "gem04.svg",
    "gem05.svg",
    "gem06.svg",
    "gem07.svg",
    "medichara02_m07.png",
  ];
  var penguinImages = [
    "Rockhopper01",
    "Emperor01",
  ];
  var selectedBall = null;
  var cache = null;
  var status = 0;
  var penguinImage = null;
  var width = null;
  var mode = null;
  var ballCount = null;
  var score = null;
  var level = null;

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
      var x = ballImages[Math.floor(Math.random()*ballCount)];
      var img = image_tag(x).addClass("ball");
      img.css("width", width-0).css("height", width-0);
      return img;
    }
  }

  function checkLines() {
    var tds = $("#content td");

    //指定した座標から指定した方向のLineの長さを数える
    function countLine(x, y, vx, vy) {
      var img = $(tds[x*SIZE+y]).find("img");
      if (img.length == 0) return 0;
      var src1 = img.attr("src")
      var count = 1;
      while (true) {
        var x2 = x+count*vx;
        var y2 = y+count*vy;
        if (x2 < 0 || x2 >= SIZE || y2 < 0 || y2 >= SIZE) break;
        img = $(tds[x2*SIZE+y2]).find("img");
        if (img.length == 0) break;
        var src2 = img.attr("src");
        if (src1 != src2) break;
        count++;
      }
      return count;
    }

    function eraseLine(x, y, vx, vy, n) {
      var positions = [];
      for (var k = 0; k < n; k++) {
        if (cache[(x+k*vx)*SIZE+(y+k*vy)]) return;
        cache[(x+k*vx)*SIZE+(y+k*vy)] = true;
        var img = $(tds[(x+k*vx)*SIZE+(y+k*vy)]).find("img");
        positions.push(img.position());
        img.effect("puff", null, function(){
          $(this).remove();
        });
      }

      var tops = 0;
      var lefts = 0;
      positions.map(function(pos){
        tops += pos.top;
        lefts += pos.left;
      });

      var bubble = createBubble(n*n, {
        top: tops/positions.length,
        left: lefts/positions.length,
        "font-size": width*0.7
      });
      $("#contents").append(bubble);

      var score = parseInt($("#score").text());

      setTimeout(function(){
        $("#penguin img").attr("src", url_for(penguinImage+"_L-Leg.png"));
      }, 0);
      countup("#score", score, score+n*n, function(){
        $("#penguin img").attr("src", url_for(penguinImage+"_Center.png"));
      });
    }

    function eachDirection(f) {
      var vx = [1, 0, 1,  1];
      var vy = [0, 1, 1, -1];
      for (var i = 0; i < vx.length; i++)
        f(vx[i], vy[i]);
    }

    cache = {};
    var erased = false;
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        eachDirection(function(vx, vy){
          var n;
          if ((n = countLine(i, j,  vx, vy)) >= 5) {
            erased = true;
            eraseLine(i, j,  vx, vy, n);
          }
        });
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
    if (!screen_name) {
      var name = prompt("名前を入力するとランキングに参加できます。");
      if (!name) return;
    }

    var data = [
      "name="+name,
      "score="+$("#score").text(),
      "level="+level
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

  function isGameOver() {
    return ($("#content td:empty").length == 0);
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
            createNext();
          }
          if (isGameOver()) {
            status = GAMEOVER;
            $("#content").append($('<h3>GameOver</h3>'));
            showRetryButton();
            setTimeout(entryScore, 100);
          }
        }
      } else if (img.attr("src") != baseURI+"/images/medichara02_m07.png") {
        $(selectedBall).find("img").trigger("stopRumble");
        img.jrumble({
          speed: 50
        }).trigger("startRumble");
        selectedBall = this;
      }
    });
    td.css("width", width).css("height", width);
    return td;
  }

  function render() {
    var windowWidth = Math.min($(window).width(), $(window).height());
    width = Math.floor((windowWidth-20)/SIZE);

    $("#contents").empty();
    $("#contents").append('<div id="next"></div>');
    $("#contents").append('<div id="penguin"></div>');
    $("#contents").append('<div id="score"></div>');
    $("#contents").append('<div style="clear:left"></div>');
    $("#contents").append('<div id="content"></div>');
    var table = $("<table></table>").attr("cellspacing",1);
    for (var i = 0; i < SIZE; i++) {
      var tr = $("<tr></tr>");
      for (var j = 0; j < SIZE; j++)
        tr.append(createTd(i, j));
      table.append(tr);
    }
    var center = $("<center></center>");
    $("#content").html(center.append(table));
    $("#contents").append(button_to('戻る').click(function(){
      new TopView().render();
    }));
    initialize();

    $("#content img").remove();
    $("#score").html(score);
    createNext();
    copyNext();
    createNext();
  }

  function initialize() {
//    penguinImage = penguinImages[Math.floor(Math.random()*penguinImages.length)];
//    var img = image_tag(penguinImage+'_Center.png');
//    img.css("margin", "5px").css("height", "64px");
//    $("#penguin").append(img);
    score = 0;
  }

  function setEasyMode() {
    ballCount = 14;
    level = 0;
    render();
  }

  function setHardMode() {
    ballCount = 15;
    level = 1;
    render();
  }
})(this.self);
