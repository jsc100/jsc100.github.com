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
	$$.plugin('menu',{
		conf:{
			type:'menu',//contextMenu
			cls:'menu',
			itemCls:'menu-item',
			titleCls:'ellipsis',
			sepCls:'menu-item-sep',
			iconCls:'menu-icon pngfix',
			tipCls:'submenu-tip',
			tipIconCls:'tip-arrow',
			hoverCls:'menu-item-hover',
			width:[180,140],
			pos:null,
			container:window,
			open:{
				before:$$.fn,
				after:$$.fn,
				effect:'default'
			},
			close:{
				before:$$.fn,
				after:$$.fn,
				effect:'default'				
			},
			attach:null,
			data:null,
			callback:$$.fn,
			click:$$.fn
		},
		create:function(opt){
			function _html(json){
				var menu=null,sub=[];
				arguments[1]&&(menu={node:'ul',sub:sub});
				$$.each(json,function(i,n){
					if($$.is('!emptyStr',n.text)){
						var item={node:'li',attr:n.attr,sub:[{node:'span',cls:n.cls||'',text:n.text}]};
						n.sub&&item.sub.push(_html(n.sub,true));
						sub.push(item);
					}else{
						sub.push({node:'li'});
					}
				});
				return menu||sub;
			}
			function _icon(menu){
				menu.find('ul').add(menu).addClass(opt.cls);
				var li=menu.find('li'),item=li.filter(':parent').addClass(opt.itemCls);
				li.filter(':empty').addClass(opt.sepCls);
				item.find('>span').each(function(){
					var $this=$(this);
					var hasSub=!!$this.next().length;
					var cls=opt.tipCls+(hasSub?' '+opt.tipIconCls:'');
					$this.html($this.text()).addClass(opt.iconCls+' '+opt.titleCls).wrap('<span class="'+cls+'"></span>');
					$$.is('ie6')&&$this.removeClass(opt.titleCls).wrapInner('<span class="'+opt.titleCls+'"></span>');
				});
			}
			var before=opt.open.before;
			opt.open.before=function(){
				this.children().each(function(){
					var $this=$(this);
					$this.removeClass(opt.hoverCls);
					if(this.submenu){
						var b=true;
						this.submenu.children().each(function(){
							b=!this.submenu;
						});
						if(b&&$.isFunction(opt.callback)){
							var res=opt.callback.call($this);
							if(res){
								this.submenu.empty();
								if($.isEmptyObject(res)){
									$this.disable();
								}else{
									this.submenu.append($$.toHtml(_html(res)));
									_icon(this.submenu);
									$this.disable(false);
								}
							}
						}
					}
				});
				before.call(this);
			};
			opt.menu=$($$.is('!emptyStr',opt.data)?opt.data:$$.toHtml(_html(opt.data,true))).addClass(opt.cls).width(opt.width[0]);
			_icon(opt.menu);
			var container=$('<div></div>');
			function _sub(menu){
				container.append(menu);
				$.each(menu.find('>*>*:not(span)'),function(i,n){
					var $this=$(n).addClass(opt.cls).width(opt.width[1]);
					$this.parent()[0].submenu=$this;
					_sub($this);
				});				
			}
			_sub(opt.menu);
			var pos=[{mode:'padding',side:'top',container:opt.container,adjustMode:'changeSide,offset'},{mode:'margin',side:'right',container:opt.container,adjustMode:'changeSide,offset',offset:-3}];
			container.css({'position':'relative','zIndex':2000}).appendTo('body').restrain('contextMenu').children().restrain('contextMenu').popup({model:false,overlay:false,repos:true,fixed:false,open:$.extend(opt.open,{auto:false}),close:opt.close,trigger:false})
				.each(function(){
					$(this).children().each(function(){
						if(this.submenu){
							this.submenu.popup('option','pos',[$.extend({},pos[0],{by:this}),$.extend({},pos[1],{by:this})]);
						}
					});
				});
			var pos1=[{by:this,mode:'margin',side:'bottom',container:opt.container,adjustMode:'changeSide,offset'},{by:this,mode:'padding',side:'left',container:opt.container,adjustMode:'changeSide,offset'}];
			if(opt.type=='menu'){
				opt.menu.popup('option','pos',opt.pos||pos1);
				$.isFunction(opt.attach)?opt.attach.call(this,opt):this.button($.extend({cls:''},opt.buttonOpt,{click:function(){opt.menu.popup('open');$$.is('ie')&&opt.menu[0].fireEvent('onmove');}}));
			}else{
				this.restrain('contextMenu').on('mousedown.menu',function(e){
					if(e.which==3){
						pos1[0].by=e.pageY;
						pos1[1].by=e.pageX;
						opt.menu.popup('option','pos',pos1).popup('open');
					}
				});
			}
			container.button({
				cls:'',
				iconCls:'',
				toolbarCls:'',
				toggleCls:[{cls:'',hover:'',press:''}],
				selector:'.'+$$.str2Arr(opt.itemCls)[0],
				mouseenter:function(jsc){
					opt.mousein=true;
					jsc.button.siblings().removeClass(opt.hoverCls).end().addClass(opt.hoverCls).parent().nextAll('ul:visible').popup('close');						
					jsc.button[0].submenu&&jsc.button[0].submenu.popup('open');
					return false;
				},
				mouseleave:function(jsc){
					opt.mousein=false;
					setTimeout(function(){
						!opt.mousein&&jsc.button.removeClass(opt.hoverCls).parent().nextAll('ul:visible').popup('close');
					},100);						
				},
				click:function(jsc){
					if(!jsc.button[0].submenu){
						opt.click.call(jsc.button,jsc);
						$$.$doc.mousedown();
					}
				},
				mousedown:function(){return false;}
			});
			this.data('menu',opt);
		}
	});
})(jQuery);
