var RankingView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    var self = this;
    $.getJSON(baseURI+"/ranking", function(rankings){
      var div = $('<div></div>');
      div.append('<h2>ランキング</h2>');
      [0,1,2].map(function(level){
        div.append('<h3>Level'+level+'</h3>');
        var ol = $('<ol data-role="listview">');
        rankings[level].map(function(r){
          ol.append(li(r[0]+'<span class="ui-li-count">'+r[1]+'</span>'));
        });
        ol.listview();
        div.append(ol);
      });
      div.append(button_to('OK').click(function(){
        new TopView().render();
      }));
      self.$el.html(div);
    });
  }
});
