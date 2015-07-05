var TopView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    var div = $('<div></div>');
    div.append('<h1 class="animated bounce">Lines</h1>');
    var center = $('<center></center>');
    for (var i = 1; i <= 7; i++)
      center.append(image_tag("gem0"+i+".svg", {width:40}));
    div.append(center);
    div.append(button_to('スタート').click(function(){
      render();
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
