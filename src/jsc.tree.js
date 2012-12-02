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
	$$.plugin('tree',{
		conf:{
			cls:'tree',
			nodeCls:'tree-node',
			lastItem:'item-last',
			textCls:'tree-title',
			subtreeCls:'subtree',
			hitareaCls:'tree-node-hitarea',
			hitareaHoverCls:'tree-node-hitarea-hover',
			checkedCls:'tree-node-checked',
			harfCheckedCls:'tree-node-checked-part',
			selectedCls:'tree-node-selected',
			expendedCls:'tree-node-expended',
			iconCls:'tree-icon',
			folderCls:'tree-folder',
			leafCls:'tree-leaf',
			hoverCls:'tree-node-hover',
			ajax:{
				url:null,
				type:'get',
				dataType:'json',//'xml'
				data:{'parentId':0},
				loaderMsg:'\u6B63\u5728\u52A0\u8F7D\u2026'
			},
			initOpen:false,
			selectFolder:false,
			closeSilbings:true,
			closeChildren:true,
			radioOrCheckbox:'checkbox',//'radio','checkbox'
			cascade:true,
			data:null,
			prefix:'jsc-tree-',
			key:'id',
			edit:{
				url:null,
				col:1,
				fields:[{lable:'tree_id',name:'id',type:'text',value:'',hiddend:true},
					{lable:'title',name:'text',type:'text'},
					{lable:'parent_id',name:'parentId',type:'select'}
				]
			},
			click:$$.fn
		},
		create:function(opt){
			this.addClass(opt.cls).data('tree',opt);
			var adapter=opt.adapter||$$.fn;
			opt.adapter=function(obj){
				var attr={};
				obj[opt.key]!=undefined&&(attr[opt.prefix+opt.key]=obj[opt.key]);
				adapter(attr,obj);
				return attr;
			};
			function _(data){
				var me=this;
				data&&this.append($$.toHtml((function(arr){
					var json=[],showCB=$$.is('!emptyStr',opt.radioOrCheckbox);
					for(var i=0,len=arr.length;i<len;i++){
						var node=arr[i],item={node:'li',cls:i==len-1?opt.lastItem:'',sub:[]};
						var span={node:'span',cls:opt.nodeCls+(node.isLeaf!==false?' '+opt.leafCls:(opt.initOpen?' '+opt.expendedCls:'')),sub:[{node:'span',cls:opt.hitareaCls}]};
						if(showCB){
							span.sub.push({node:'span',cls:opt.radioOrCheckbox});
							me.prev().hasClass(opt.checkedCls)&&(span.cls+=' '+opt.checkedCls);
						}
						$$.is('!emptyStr',opt.iconCls)&&span.sub.push({node:'span',cls:opt.iconCls+' '+(node.cls||opt.folderCls)});
						span.sub.push({node:'span',cls:opt.textCls,text:node.text,attr:opt.adapter(node)});
						item.sub.push(span);
						if(!node.isLeaf&&$.isArray(node.children)){
							var ul={node:'ul',cls:opt.subtreeCls,css:{display:opt.initOpen?'block':'none'}};
							ul.sub=arguments.callee(node.children);
							item.sub.push(ul);
						}
						json.push(item);
					}
					return json;					
				})($.isArray(data)?data:data.children)));
				opt.closeSilbings&&!this.hasClass(opt.cls)&&this.parent().siblings().find('.'+opt.expendedCls).removeClass(opt.expendedCls).next().slideUp('fast');
				this.slideDown('fast').prev().addClass(opt.expendedCls);						
			};
			if($$.is('!emptyStr',this.html())){
				this.find('li>span').each(function(){
					var $this=$(this),cdrn=$this.children();
					if(!cdrn.length){
						cdrn=$this.wrap('<span></span>');
						$this=cdrn.parent();
					}
					$this.addClass(opt.nodeCls);
					if($$.is('!emptyStr',opt.iconCls)){
						var cls=cdrn.attr('class'),hasCls=$$.is('!emptyStr',cls);
						$this.prepend('<span class="'+opt.iconCls+' '+(hasCls?cls:opt.folderCls)+'"></span>');
						hasCls&&cdrn.attr('class','');
					}
					cdrn.addClass(opt.textCls);					
					$$.is('!emptyStr',opt.radioOrCheckbox)&&$this.prepend('<span class="'+opt.radioOrCheckbox+'"></span>');
					$this.prepend('<span class="'+opt.hitareaCls+'"></span>');				
				});
				var nds=this.find('li>span');
				nds.filter(':only-child').addClass(opt.leafCls);
				nds.parent(':last-child').addClass(opt.lastItem);
				var sub=nds.next('ul').addClass(opt.subtreeCls);
				sub.css('display',opt.initOpen?'block':'none');
				sub.prev().toggleClass(opt.expendedCls,opt.initOpen);				
			}else if($$.is('!emptyStr',opt.ajax.url)){
				opt.ajax=$$.ajax($.extend({},opt.ajax,{
					show:{loader:false,message:false},
					autoSubmit:true,
					context:this,
					beforeSend:function(){this.prev().children('.'+opt.iconCls).addClass('tree-loader')},
					complate:function(){this.prev().children('.'+opt.iconCls).removeClass('tree-loader');},
					success:function(data){_.call(this,data);}
				}));
			}else{
				_.call(this,opt.data);				
			}
			function _toggle(btn){
				if(btn.hasClass(opt.expendedCls)){
					opt.closeChildren&&btn.next().find('.'+opt.expendedCls).removeClass(opt.expendedCls).next().slideUp('fast');
					btn.removeClass(opt.expendedCls).next().slideUp('fast');
				}else{
					if(!btn.next().length){
						btn.after('<ul class="'+opt.subtreeCls+'" style="display:none;"></ul>');
						var id='',date={};
						for(var p in opt.ajax.option('data')){
							id=p;
							break;
						}
						date[id]=btn.find('>span:parent').attr(opt.prefix+opt.key);
						opt.ajax.load({'context':btn.next(),data:date});
					}else{
						opt.closeSilbings&&btn.parent().siblings().find('.'+opt.expendedCls).removeClass(opt.expendedCls).next().slideUp('fast');
						btn.addClass(opt.expendedCls).next().slideDown('fast');						
					}
				}
			};
			this.button($.extend({
				cls:'',
				toolbarCls:'',
				iconCls:'',
				iconOnly:'',
				cursor:'',
				toggleCls:[{cls:'',hover:'',press:''}],
				selector:'li>span>span',
				mouseenter:function(jsc){
					var btn=jsc.button;
					if(btn.hasClass(opt.hitareaCls)){
						btn.addClass(opt.hitareaHoverCls);
					}else if(btn.hasClass(opt.textCls)){
						btn.parent().addClass(opt.hoverCls);
						btn.css('cursor','pointer');
					}
				},
				mouseleave:function(jsc){
					var btn=jsc.button;
					if(btn.hasClass(opt.hitareaCls)){
						btn.removeClass(opt.hitareaHoverCls);
					}else if(btn.hasClass(opt.textCls)){
						btn.parent().removeClass(opt.hoverCls);
						btn.css('cursor','');
					}
				},
				click:function(jsc){
					var btn=jsc.button,parent=btn.parent();
					if(btn.hasClass(opt.hitareaCls)){
						!parent.hasClass(opt.leafCls)&&_toggle(parent);
					}else if(btn.hasClass(opt.radioOrCheckbox)){
						parent.removeClass(opt.harfCheckedCls).toggleClass(opt.checkedCls);
						if(opt.cascade){
							parent.next().find('li>span').removeClass(opt.harfCheckedCls).toggleClass(opt.checkedCls,parent.hasClass(opt.checkedCls));
							parent.parent().parents('li').each(function(){
								var $this=$(this),c=$this.find('>span'),sib=c.next().find('>li>span'),checked=sib.filter('.'+opt.checkedCls);
								if(checked.length){
									c.removeClass(checked.length==sib.length?opt.harfCheckedCls:opt.checkedCls)
										.addClass(checked.length==sib.length?opt.checkedCls:opt.harfCheckedCls);
								}else{
									c.removeClass(opt.checkedCls).toggleClass(opt.harfCheckedCls,sib.hasClass(opt.harfCheckedCls));
								}
							});
						}
					}else if(btn.hasClass(opt.textCls)){
						function _done(){
							if($$.is('!emptyStr',opt.selectedCls)){
								jsc.plugin.find('.'+opt.selectedCls).removeClass(opt.selectedCls);
								parent.addClass(opt.selectedCls);								
							}
							opt.click.call(this,jsc);
						}
						parent.hasClass(opt.leafCls)?_done():opt.selectFolder?_done():_toggle(parent);
					}
				}
			},opt.buttonOpt));
		}
	});
})(jQuery);
