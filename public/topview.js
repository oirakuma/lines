var TopView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    var div = $('<div></div>');
    div.append('<h1 class="animated bounce">Lines</h1>');
    var center = $('<center></center>');
    if (screen_name)
      center.append('<p>ようこそ '+screen_name+' さん!</p>');
    for (var i = 1; i <= 7; i++)
      center.append(image_tag("gem0"+i+".svg", {width:40}));
    div.append(center);

    div.append(button_to('レベル0 スタート').click(function(){
      setEasyMode();
    }));

    div.append(button_to('レベル1 スタート').click(function(){
      setHardMode();
    }));

    div.append(button_to('ルール').click(function(){
      new RuleView().render();
    }));

    div.append(button_to('ランキング').click(function(){
      new RankingView().render();
    }));

    div.append(link_to('Twitterログイン', baseURI+"/request_token"));

    this.$el.html(div);
  }
});
