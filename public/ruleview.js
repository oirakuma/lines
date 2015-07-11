var RuleView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    var div = $('<div></div>');
    var ol = $('<ol></ol>');
    ol.append(li('宝石を移動してたて・よこ・ななめに5個以上並べて消す。'));
    ol.append(li('5個だと25点、6個だと36点、7個だと49点。'));
    ol.append(li('宝石で道がふさがっているとその先には移動できない。'));
    ol.append(li('移動する度に3個の宝石がランダムに追加される。'));
    ol.append(li('全部埋まるとゲーム終了。'));
    ol.append(li('レベル1はウィルス（障害物）が登場します。'));
    div.append(ol);
    div.append(button_to('OK').click(function(){
      new TopView().render();
    }));
    this.$el.html(div);
  }
});
