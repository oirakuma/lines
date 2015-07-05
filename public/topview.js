var TopView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    var div = $('<div></div>');
    div.append('<h1 class="animated bounce">Lines</h1>');
    var center = $('<center></center>');
    for (var i = 1; i <= 7; i++)
      center.append(image_tag("gem0"+i+".svg", {width:40}));
    div.append(center);

    div.append(button_to('レベル0 スタート').click(function(){
      render();
    }));
    div.append(button_to('レベル1 スタート').click(function(){
      setLevel(1);
    }));
    div.append(button_to('レベル2 スタート').click(function(){
      setLevel(2);
    }));
    div.append(button_to('ルール').click(function(){
      new RuleView().render();
    }));
    div.append(button_to('ランキング').click(function(){
      new RankingView().render();
    }));
    this.$el.html(div);
  }
});
