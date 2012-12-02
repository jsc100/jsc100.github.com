/**
 * jQuery jsc 1.0
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Copyright 2012 caoshujun [ jsc100@qq.com ] 
 * 
 */
(function($){
	$$.plugin('comboBox',{
		conf:{
			cls:'comboBox',
			arrowCls:'combo-arrow',
			hoverCls:'combo-arrow-hover',
			iconCls:'',
			titleCls:'combo-title',
			dropdownCls:'combo-dropdown',
			listCls:'combo-list',
			groupCls:'combo-group',
			itemCls:'combo-item',
			itemHoverCls:'combo-item-hover',
			itemSelectedCls:'combo-item-selected',
			width:'auto',
			height:'auto',
			readonly:true,
			name:'',
			multiple:false,
			resize:false,
			data:null
		},
		create:function(opt){
			var node=this[0].nodeName.toLowerCase(),plugin={cls:opt.cls,sub:[{node:'span',cls:opt.arrowCls,sub:[{node:'span',cls:opt.iconCls}]}]},
			dropdown={cls:opt.dropdownCls,sub:{node:'ul'}};
			if(node==='select'){
				opt.multiple=opt.multiple||this.attr('multiple');
				opt.data=[];
				this.children().each(function(){
					var $this=$(this);
					function _(){
						return {text:$.trim(this.text()),cls:this.attr('selected'),value:this.val(),selected:this.attr('selected')};
					}
					if(this.nodeName.toLowerCase()=='optgroup'){
						var group={text:$this.attr('label'),cls:opt.groupCls,isLeaf:false,children:[]};
						$this.children().each(function(){
							group.children.push(_.call($(this)));
						});
						opt.data.push(group);
					}else{
						opt.data.push(_.call($this));
					}
				});
				this.after($$.toHtml([plugin,dropdown])).css('display','none');
				opt.plugin=this.next();
				opt.readonly=true;
			}else if(node==='input'&&this.attr('type')=='text'){
				this.after($$.toHtml(dropdown)).wrap($$.toHtml(plugin));
				opt.plugin=this.parent().parent().parent();
			}else{
				this.addClass(opt.cls).html($$.toHtml(plugin.sub)).after($$.toHtml(dropdown));
				opt.plugin=this;
			}
			opt.plugin.width(this.outerWidth()-opt.plugin.delta('width'));
			opt.plugin.find('>span>span').html('<input type="text" class="combo-text" style="width:0;"/>');
			opt.textField=opt.plugin.find('input[type=text]').fitParent({wh:'width'}).attr('readonly',opt.readonly);
			!$$.is('!emptyStr',opt.name)&&(opt.name=this.attr('name'));
			this.removeAttr('name');
			opt.listCls=='tree'&&(opt.multiple=false);
			!opt.multiple&&$$.is('!emptyStr',opt.name)&&(opt.valueField=$('<input type="hidden",name="'+opt.name+'" />').insertAfter(opt.textField));
			opt.comboPanel=opt.plugin.next();
			opt.comboPanel.width(opt.width=='auto'?opt.plugin.outerWidth()-opt.comboPanel.delta('width'):opt.width).height(opt.height)
				.popup({
					cls:'',
					pos:[
						{by:opt.plugin,mode:'margin',side:'bottom',container:window,adjustMode:'changeSide,offset,resize'},
						{by:opt.plugin,mode:'padding',side:'left'}
					],
					repos:true,
					open:{auto:false}
				});
			var treeOpt={
				cls:opt.listCls,
				radioOrCheckbox:'',
				closeSilbings:false,
				adapter:function(attr,obj){attr.value=obj.value||obj.text;obj.selected&&(attr.selected=obj.selected);},
				data:opt.data,
				click:function(jsc){
					text=jsc.button.text(),value=jsc.button.attr('value'),oldText=opt.textField.val();
					if(text!=oldText){
						opt.textField.val(text);
						if(opt.valueField){
							opt.valueField.val(value);
						}
						$.isFunction(opt.onchange)&&opt.onchange.call(this,value);
					}
					$$.$doc.mousedown();
				}
			};
			if(opt.listCls!='tree'){
				$.extend(treeOpt,{
					nodeCls:opt.itemCls,
					expendedCls:opt.groupCls,
					textCls:opt.titleCls,
					lastItem:'',
					folderCls:'',
					subtreeCls:'',
					hitareaCls:'',
					leafCls:'',
					selectedCls:opt.itemSelectedCls,
					iconCls:opt.iconCls,
					initOpen:true,
					buttonOpt:{
						selector:'li>span',
						mouseenter:function(jsc){
							!jsc.button.hasClass(opt.groupCls)&&jsc.button.addClass(opt.itemHoverCls);
						},
						mouseleave:function(jsc){
							!jsc.button.hasClass(opt.groupCls)&&jsc.button.removeClass(opt.itemHoverCls);
						},
						click:function(jsc){
							if(!jsc.button.hasClass(opt.groupCls)){
								if(opt.multiple){
									jsc.button.toggleClass(opt.itemSelectedCls);
									var text='',values=[],oldText=opt.textField.val();
									jsc.plugin.find('.'+opt.itemSelectedCls).each(function(){
										var title=$(this).find('.'+opt.titleCls);
										text+=title.text()+';';
										values.push(title.attr('value'));
									});
									if(text!=oldText){
										opt.textField.val(text);
										if($$.is('!emptyStr',opt.name)){
											opt.textField.nextAll('input:hidden').remove();
											var valueField=$();
											for(var i=0;i<values.length;i++){
												valueField=valueField.add('<input type="hidden" name="'+opt.name+'" value="'+values[i]+'"/>');
											}
											opt.textField.after(valueField);
										}
										$.isFunction(opt.onchange)&&opt.onchange.call(this,values);
									}									
								}else{
									jsc.plugin.find('.'+opt.itemCls).removeClass(opt.itemSelectedCls);
									jsc.button.addClass(opt.itemSelectedCls);
									var title=jsc.button.find('.'+opt.titleCls),
									text=title.text(),value=title.attr('value'),oldText=opt.textField.val();
									if(text!=oldText){
										opt.textField.val(text);
										$$.is('!emptyStr',opt.iconCls)&&opt.textField.parent().attr('class',title.prev().attr('class'));
										if(opt.valueField){
											opt.valueField.val(value);
										}
										$.isFunction(opt.onchange)&&opt.onchange.call(this,value);
									}
									$$.$doc.mousedown();
								}
							}							
						}
					}
				});
			}
			var tree=opt.comboPanel.find('ul').tree(treeOpt);
			var sel=tree.find('[selected]');
			if(sel.length){
				var onchange=opt.onchange;
				opt.onchange=null;
				sel.click();
				opt.onchange=onchange;
				sel.removeAttr('selected');
			}
			opt.plugin.children().button({cls:'',iconOnly:'',toggleCls:[{cls:'',hover:opt.hoverCls,press:''}],mousedown:function(){opt.isOpen=opt.comboPanel.is(':visible')},click:function(){!opt.isOpen&&opt.comboPanel.popup('open')}});
		}
	});
})(jQuery);
