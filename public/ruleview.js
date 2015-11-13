var RuleView = Backbone.View.extend({
  el: "#contents",
  render: function() {
    var div = $('<div></div>');
    var ol = $('<ol></ol>');
    ol.append(li('宝石を移動してたて・よこ・ななめに5個以上並べて消して下さい。'));
    ol.append(li('5個だと25点、6個だと50点、7個だと100点、8個だと200点。'));
    ol.append(li('連続で宝石を消すと高得点になります。'));
    ol.append(li('宝石で道がふさがっているとその先には移動できません。'));
    ol.append(li('移動する度に3個の宝石がランダムに追加されます。'));
    ol.append(li('全部埋まるとゲーム終了。'));
    ol.append(li('レベル1はウィルス（障害物）が登場します。'));
    div.append(ol);
    div.append(button_to('OK').click(function(){
      new TopView().render();
    }));
    this.$el.html(div);
  }
});
