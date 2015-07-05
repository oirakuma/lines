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
          ol.append(li(self.link_to_twitter(r[0], r[0]+'<span class="ui-li-count">'+r[1]+'</span>')));
        });
        ol.listview();
        div.append(ol);
      });
      div.append(button_to('OK').click(function(){
        new TopView().render();
      }));
      self.$el.html(div);
    });
  },

  link_to_twitter: function(screen_name, html) {
    return $('<a></a>').html(html).attr("rel", "external").attr("href", "https://twitter.com/"+screen_name);
  }
});
