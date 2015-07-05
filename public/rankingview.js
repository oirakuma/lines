var RankingView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    $.getJSON(baseURI+"/ranking", function(rankings){
      var div = $('<div></div>');
      div.append('<h2>ランキング</h2>');
      var ol = $('<ol data-role="listview">');
      rankings.map(function(r){
        ol.append('<li>'+r[0]+'<span class="ui-li-count">'+r[1]+'</span></li>');
      });
      ol.listview();
      div.append(ol);
      div.append(button_to('OK').click(function(){
        new TopView().render();
      }));
      console.log(this.el);
      $("#contents").html(div);
    });
  }
});
