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
	$$.plugin('button',{
		conf:{
			cls:'button',
			toggleCls:[{
				cls:'',
				hover:'button-hover',
				press:'button-press'
			}],
			node:'a',
			icon:'',
			iconCls:'icon-left',
			iconOnly:'icon-only',
			text:'',
			cursor:'pointer',
			isDisabled:false,
			keep:null,
			timer:{
				interval:500
			},
			param:null,
			context:null,
			selector:'',
			toolbarCls:'toolbar',
			groupCls:'button-group',
			id:'id',
			btns:[]
		},
		exist:true,
		methods:{
			option:function(opts,index,prop,val){
				var res=opts||this;
				if(opts&&arguments.length){
					!$.isNumeric(index)&&(val=prop,prop=index,index=0);					
					opts[index]&&(res=$$._option.call(this,opts[index],prop,val));
				}
				return res;
			},
			attach:function(btn,method,fn){
				var me=this,opts=this.data('button');
				$$.is('!emptyStr',btn)&&(btn=this.find(btn));
				$$.each(opts,function(i,n){
					if($$.is('!emptyStr',n.selector)){
						me.find(n.selector).each(function(){
							if(this==btn[0]){
								var $this=$(this),prop=$this.attr(n.id);
								if(prop){
									if(n.btnOpt&&n.btnOpt[prop]){
										n.btnOpt[prop][method]=fn;
									}
								}else{
									prop='jsc-btn'+$$.uuid++;
									$this.attr(opt.id,prop);
									!n.btnOpt&&(n.btnOpt={});
									n.btnOpt[prop]={};
									n.btnOpt[prop][method]=fn;
								}
							}
						});
					}
				});
				return this;
			},
			destroy:function(){
				if($$.vml){
					this[0].vml&&$$.vml.destroyVML.call(this[0]);
					this.find('['+$$.vml.option('boxNode')+']').each(function(){
						$$.vml.destroyVML.call(this);
					});
				}
			}
		},
		create:function(opt){
			var me=this,hasSel=$$.is('!emptyStr',opt.selector);
			if((opts=this.data('button'))&&(!$$.is('!emptyStr',opts[0].selector)||!hasSel)){return;}
			opt.context=$$.jq(opt.context)||this;
			if(hasSel){
				opt.btnOpt=opt.btnOpt||{};
				try{
					var nodes=[],group={};
					for(var i=0,len=opt.btns.length;i<len;i++){
						var btnOpt=opt.btns[i];
						btnOpt.attr=btnOpt.attr||{};
						if(btnOpt.opt){
							btnOpt.attr[opt.id]=btnOpt.attr[opt.id]||'jsc-btn'+$$.uuid++;
							opt.btnOpt[btnOpt.attr[opt.id]]=btnOpt.opt;
						}
						if(!btnOpt.attr[opt.id]||!this.find('['+opt.id+'='+btnOpt.attr[opt.id]+']').length){
							var btn={node:opt.node,cls:opt.cls,attr:btnOpt.attr,sub:[{node:'span',cls:btnOpt.icon,text:btnOpt.text}]};
							if(!btnOpt.group){
								nodes.push({cls:opt.groupCls,sub:[btn]});
							}else{
								if(!group[btnOpt.group]){
									if((g=this.find('['+opt.id+'='+btnOpt.group+']')).length){
										$.isNumeric(btnOpt.index)&&(t=g.children(':eq('+btnOpt.index+')')).length?t.before($$.toHtml(btn)):g.append($$.toHtml(btn));
									}else{
										var attr={};
										attr[opt.id]=btnOpt.group;
										group[btnOpt.group]={cls:opt.groupCls,attr:attr,sub:[btn]};
										nodes.push(group[btnOpt.group]);
									}									
								}else{
									$.isNumeric(btnOpt.index)?group[btnOpt.group].sub.splice(btnOpt.index,0,btn):group[btnOpt.group].sub.push(btn);
								}
							}								
						}
 					}
					this.append($$.toHtml(nodes));
				}catch(e){}
				var icon=this.find(opt.selector).find('>span[class]');
				icon.filter(':empty').addClass(opt.iconOnly);
				icon.not(':empty').addClass(opt.iconCls);
			}else{
				var icon=this.children(),text=this.text();
				!icon.length&&opt.icon&&(this.wrapInner('<span class="'+opt.icon+'"></span>'),icon=this.children());
				!$$.is('!emptyStr',text)&&$$.is('!emptyStr',opt.text)&&(text=opt.text,(icon.length?icon:this).text(text));
				icon.length&&icon.attr('class')&&icon.addClass($$.is('!emptyStr',text)?opt.iconCls:opt.iconOnly);
			}
			(hasSel?this.addClass(opt.toolbarCls).find(opt.selector).addClass(opt.cls):this.addClass(opt.cls)).restrain('drag,select,contextMenu');
			if($$.is('ie')&&$$.vml){
				$$.is('!emptyStr',opt.cls)&&$$.vml.addRule('.'+opt.cls);
				$$.is('ie6')&&$$.vml.option('ie6PngFix')&&$$.is('!emptyStr',opt.iconCls)&&$$.is('!emptyStr',opt.iconOnly)&&$$.vml.addRule('.'+opt.iconCls+',.'+opt.iconOnly);
			}
			opt.keep&&(opt.timer=$$.timer($.extend({context:opt.context},opt.timer,{autoStart:false})));
			var events=['mouseover','mouseout','mousedown','mouseup','click','dblclick',''];
			if(opts){
				var events1=$._data(me[0]).events;
				for(var i=0,len=events.length-1;i<len;i++){
					var e=events1[events[i]];
					for(var j=0;j<e.length;j++){
						var event=e[j];
						if(event.namespace==='button'&&event.selector){
							event.quick=null;
							event.selector+=','+opt.selector;
						}
					}
				}
				opts=opts.push(opt);
			}else{
				events.splice(0,2,'mouseenter','mouseleave');
				me.data('button',[opt]).on(events.join('.button '),opt.selector,function(e){
					var $this=$(this),plugin=$(e.delegateTarget),opts=plugin.data('button'),myOpt=opt=opts[0],opt1=null;
					if(opts.length>1){
						for(var i=0,len=opts.length;i<len;i++){
							if(plugin.find(opts[i].selector).index(this)>-1){
								myOpt=opt=opts[i];
								break;
							}
						}
					}
					opt.btnOpt&&(opt1=opt.btnOpt[$this.attr(opt.id)],myOpt=$.extend(true,{},myOpt,opt1));
					var status=myOpt.status||0,toggle=$.isArray(myOpt.toggleCls)?myOpt.toggleCls[status]:null,enable=!$this.isDisabled()&&!myOpt.isDisabled,hoverCls=null;							
					switch(e.type){
						case 'mouseenter':
						if(enable){
							opt.press&&$$.$doc.off('.button');
							toggle&&$$.is('!emptyStr',toggle.hover)&&$this.addClass(toggle.hover);
							$this.css('cursor',opt.cursor);
						}
						break;
						case 'mouseleave':
						opt.press&&$$.$doc.on('mouseup.button',function(){$$.$doc.off('.button');$this.triggerHandler('mouseup.button!');});
						toggle&&$$.is('!emptyStr',toggle.hover)&&$this.removeClass(toggle.hover);
						opt.keep=='mouseenter'&&opt.timer.stop();
						$this.css('cursor','');
						break;
						case 'mousedown':
						if(enable){
							opt.press=true;
							toggle&&$$.is('!emptyStr',toggle.press)&&$this.addClass(toggle.press);
							$$.is('ie')&&(de=1);
						}
						break;
						case 'mouseup':
						toggle&&$$.is('!emptyStr',toggle.press)&&$this.removeClass(toggle.press);
						opt.keep=='mousedown'&&opt.timer.stop();
						opt.press=false;
						e.isTrigger&&e.stopImmediatePropagation();
						break;
						case 'click':
						if(enable&&$.isArray(myOpt.toggleCls)&&(len=myOpt.toggleCls.length)>1){
							status=(status+1)%len;
							var cls=($$.is('!emptyStr',toggle.cls)?toggle.cls:'')+' '+($$.is('!emptyStr',toggle.hover)?toggle.hover:'')+' '+($$.is('!emptyStr',toggle.press)?toggle.press:'');
							$$.is('!emptyStr',cls)&&$this.removeClass(cls);
							$$.is('!emptyStr',myOpt.toggleCls[status].cls)&&$this.addClass(myOpt.toggleCls[status].cls);
							if(!e.isTrigger&&$$.is('!emptyStr',myOpt.toggleCls[status].hover)){
								$this.addClass(myOpt.toggleCls[status].hover);
								setTimeout(function(){
									!$$.is('contain',[e.pageY,e.pageX],$this.getPos())&&$this.removeClass(myOpt.toggleCls[status].hover);
								},100);
							}
							(opt1||opt).status=status;
						}
						break;
					}
					var fn=myOpt[e.type];
					if(enable&&$.isFunction(fn)){
						var param={event:e,param:myOpt.param,button:$this,plugin:plugin,status:status};
						var res=fn.call(opt.context,param)!==false;
						if(res&&myOpt.keep==e.type&&(e.type=='mouseenter'||e.type=='mousedown')){
							opt.timer.option('param',param).option('action',fn).start();
						}
						return res;
					}
				});
			}
		}
	});
})(jQuery);