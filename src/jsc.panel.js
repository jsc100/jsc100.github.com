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
	$$.plugin('panel',{
		conf:{
			cls:'panel',
			headerCls:'panel-header',
			iconCls:'panel-header-icon',
			titleCls:'panel-header-title ellipsis',
			headerToolCls:'header-tool',
			toolGroupCls:'tool-box',
			bodyCls:'panel-body',
			fit:false,
			autoHeight:false,
			icon:'icon-panel',
			title:'panel',
			systemMenu:[],
			headerTools:[],
			toolId:'tool',
			toolAction:$$.fn,
			systemAction:$$.fn,
			ajaxContent:{auto:true},
			bars:[]
		},
		methods:{
			title:function(text){
				var opt=this.data('panel');
				if($$.is('!emptyStr',text)){
					opt.header.find('.'+$$.str2Arr(opt.titleCls)[0]).text(opt.title=text);
					return this;
				}else{
					return opt.title;
				}				
			},
			getBar:function(id){
				var bar=this.find('#'+id);
				!bar.length&&(bar=this.find('.'+id));
				return bar.length?bar:null;
			}
		},
		create:function(opt){
			opt.body=this.find('>.'+$$.str2Arr(opt.bodyCls)[0]);
			if(!opt.body.length){
				opt.body=this.wrapInner('<div class="'+opt.bodyCls+'"></div>').children();
				var css='',zero=true;
				for(var i=0;i<4;i++){
					var p=this.padding($$.ARR.side[i]);
					p&&(zero=false);
					css+=p+'px ';
				}
				if(!zero){
					opt.body.css('padding',css);
					this.css('padding','none');
				}
			}
			var header=this.find('.'+$$.str2Arr(opt.headerCls)[0]);
			if(!header.length){
				header={cls:opt.headerCls,sub:[{node:'span',cls:opt.titleCls,text:opt.title}]};
				if($$.is('!emptyStr',opt.icon)){
					header.sub.unshift({node:'span',cls:opt.iconCls+' '+opt.icon});
				}
				var group={node:'span',cls:opt.toolGroupCls,sub:[]};
				if($.isArray(opt.headerTools)){
					for(var i=0,len=opt.headerTools.length;i<len;i++){
						var tool=opt.headerTools[i];
						if($$.is('!emptyStr',tool)&&!(tool=headerToolsDefault[tool])){
							continue;
						}
						var attr=tool.attr||{};
						!attr[opt.toolId]&&(attr[opt.toolId]=opt.toolId+$$.uuid++);
						group.sub.push({node:'a',cls:opt.headerToolCls+' '+tool.cls,attr:attr});
						opt.headerTools[i]={attr:attr,opt:tool};
					}
				}
				header.sub.push(group);
				opt.header=$($$.toHtml(header));
			}else{
				opt.header=header;
			}
			this.prepend(opt.header.restrain('drag,select,contextMenu'));
			var icon=opt.header.find('.'+$$.str2Arr(opt.iconCls)[0]),group=opt.header.find('.'+$$.str2Arr(opt.toolGroupCls)[0]);
			if(icon.length){
				opt.header.css('paddingLeft',opt.header.padding('left')+icon.outerWidth(true));
				$$.is('ie6')&&$$.vml&&$$.vml.option('ie6PngFix')&&icon.addClass($$.vml.option('ie6PngFixCls'));
				if($.isArray(opt.systemMenu)&&opt.systemMenu.length){
					icon.menu($.extend(true,{},{data:opt.systemMenu,click:opt.systemAction},opt.menuOpt));
				}
			}
			opt.header.css('paddingRight',opt.header.padding('right')+group.outerWidth(true));
			if($.isArray(opt.bars)){
				for(var i=0,len=opt.bars.length;i<len;i++){
					var bar=opt.bars[i];
					opt.body[bar.pos=='top'?'before':'after']($$.toHtml(bar));
				}
			}
			var pos=this.getPos(),me=this;
			this.addClass(opt.cls).data('panel',opt).on('jscResize.jsc',function(e){
				if(!opt.autoHeight){
					var pos1=$$.fitParent.call(opt.body,{wh:'height',swh:'height'});
					opt.body.setPos(pos1,'height').triggerHandler('jscResize.jsc',pos1);
				}
			});
			if(opt.fit){
				function _(obj){
					var pos2=$$.fitParent.call(obj,{wh:opt.fit});
					this.setPos(pos2,opt.fit).triggerHandler('jscResize.jsc',pos2);
				};
				_(this);
				this.parent().on('jscResize.jsc',this,function(e){
					_(e.data);
				});
			}else{
				var pos2=this.getPos();
				!opt.autoHeight&&this.height($$.getSize('height',pos2)+pos2.delta.height-pos.delta.height);
				this.width($$.getSize('width',pos2)+pos2.delta.width-pos.delta.width).triggerHandler('jscResize.jsc');
			}
			if($$.is('ie')&&$$.vml){
				opt.radii=$$.vml.getRadii.call(this[0]);
				if(opt.radii){
					$$.vml.applyVML.call(this[0]);
					$$.vml.applyVML.call(opt.header[0],[opt.radii[0],opt.radii[1],0,0]);
					$$.vml.applyVML.call(this.children(':last')[0],[0,0,opt.radii[2],opt.radii[3]]);							
				}					
			}
			group.button({
				cls:'',
				toolbarCls:'',
				selector:'>*',
				keep:false,
				id:opt.toolId,
				btns:opt.headerTools,
				context:this,
				click:opt.toolAction,
				mousedown:function(){return false;}
			});
			opt.ajaxContent&&$$.is('!emptyStr',opt.ajaxContent.url)&&(opt.ajax=$$.ajax($.extend({context:opt.body},opt.ajaxContent)));
		}
	});
	$$.plugin('dialog',{
		conf:{
			cls:'dialog',
			width:500,
			height:300,
			icon:'icon-dialog',
			title:'dialog',
			ajaxContent:null,
			ctrlBarCls:'dialog-bar-control',
			btnIconCls:'icon-left',
			ctrlBtns:[],
			btnAlign:'center',
			draggable:true,
			resizable:true,
			collapsible: false,
			minimizable: true,
			maximizable: true,
			closable:true,
			model:true,
			overlay:false,
			fixed:true,
			open:{
				auto:true,
				before:$$.fn,
				after:$$.fn,
				effect:'default'
			},
			close:{
				before:$$.fn,
				after:$$.fn,
				effect:'default'
			}
		},
		methods:{
			open:function(){return this.popup('open');},
			close:function(){return this.popup('close');},
			title:function(text){
				var opt=this.data('dialog');
				return $$.is('!emptyStr',text)?this.panel('title',opt.title=text):opt.title;
			}
		},
		create:function(opt){
			opt.panelOpt=opt.panelOpt||{};
			var headerTools=opt.panelOpt.headerTools||opt.headerTools||[];
			opt.collapsible&&headerTools.push('slideUp');
			opt.minimizable&&headerTools.push('min');
			opt.maximizable&&headerTools.push('max');
			opt.closable&&headerTools.push('close');
			opt.panelOpt.headerTools=headerTools;
			if($.isArray(opt.ctrlBtns)&&(len=opt.ctrlBtns.length)){
				opt.panelOpt.bars=[{pos:'bottom',cls:opt.ctrlBarCls}];
			}
			this.addClass(opt.cls).width(opt.width).height(opt.height).panel($.extend(true,{icon:opt.icon,title:opt.title,autoHeight:opt.height=='auto',ajaxContent:opt.ajaxContent},opt.panelOpt));
			var ctrlBar=this.panel('getBar',opt.ctrlBarCls);
			if(ctrlBar){
				for(var i=0;i<len;i++){
					var btn=opt.ctrlBtns[i];
					opt.ctrlBtns[i]={group:'default',icon:btn.icon,text:btn.text,opt:{param:btn.param,click:btn.click}};
				}
				ctrlBar.css('textAlign',opt.btnAlign).button({
					iconCls:opt.btnIconCls,
					context:this,
					selector:'>*>*',
					toolbarCls:'',
					id:'ctrl',
					btns:opt.ctrlBtns			
				});
			}
			this.data('dialog',opt).popup($.extend(true,{cls:'',model:opt.model,overlay:opt.overlay,active:true,fixed:opt.fixed,open:opt.open,close:opt.close},opt.popupOpt));
			opt.resizable&&this.draggable($.extend({},opt.resizeOpt,{type:'resize',trigger:true}));
			opt.draggable&&this.draggable($.extend({},opt.dragOpt,{type:'drag',handle:this.panel('option','header'),trigger:false}));
		}
	});
	var promptManager={dlg:null,callback:null};
	function _prompt(arg){
		if(!promptManager.dlg){
			function _fn(jsc){this.dialog('close');$.isFunction(promptManager.callback)&&promptManager.callback.call(this,jsc.param);}
			promptManager.dlg=$$.getSington('jsc-prompt').dialog({
				icon:'',
				title:'',
				width:300,
				height:'auto',
				btnAlign:'center',
				draggable:true,
				resizable:false,
				collapsible: false,
				minimizable: false,
				maximizable: false,
				closable:true,
				model:true,
				overlay:true,
				fixed:true,
				dragOpt:{proxy:false},
				popupOpt:{repos:true},
				open:{auto:false},
				ctrlBtns:[
					{icon:'icon-ok',text:'\u786E\u5B9A',param:true,click:_fn},
					{icon:'icon-cancel',text:'\u53D6\u6D88',param:false,click:_fn}
				]				
			});
		}
		if(promptManager.dlg.is(':visible')){
			return;
		}		
		var opt=promptManager.dlg.panel('option'),cancel=promptManager.dlg.find('.icon-cancel').parent();
		opt.body.removeClass().addClass(opt.bodyCls+' '+arg.type).html(arg.msg);
		promptManager.dlg.dialog('title',arg.title);
		promptManager.dlg.dialog('open');
		arg.type=='alert'?cancel.hide():cancel.show();
	};
	$$.alert=function(arg){
		promptManager.callback=arg.callback;
		_prompt({type:'alert',msg:arg.msg||arg,title:arg.title||'alert'});
	};
	$$.confirm=function(arg){
		promptManager.callback=arg.callback;
		_prompt({type:'confirm',msg:arg.msg||arg,title:arg.title||'confirm'});
	};
	$$.prompt=function(arg){
		promptManager.callback=function(jsc){$.isFunction(arg.callback)&&arg.callback(jsc.param?this.panel('option','body').find(':input').val():null)};
		_prompt({type:'prompt',msg:'<div>'+(arg.msg||'place input:')+'</div><input>',title:arg.title||'prompt'});
	};
	var headerToolsDefault={
		min:{
			cls:'min',
			toggleCls:[{hover:'min-hover',press:''}],
			click:function(jsc){
				this.data('popup')?this.popup('close'):this.hide();
			}
		},
		max:{
			cls:'max',
			toggleCls:[{cls:'max',hover:'max-hover',press:''},{cls:'restore',hover:'restore-hover',press:''}],
			click:function(jsc){
				var s=jsc.status,css=this.css('position'),sTop=css=='fixed'?$$.$doc.scrollTop():0,sLeft=css=='fixed'?$$.$doc.scrollLeft():0;
				var pos=s?this.getPos():jsc.button.data('pos');
				pos=$$.offset(pos,[sTop*(s?1:-1),sLeft*(s?1:-1)]);
				this.setPos(s?$(window).getPos():pos,true);
				jsc.button[s?'data':'removeData']('pos',pos);
				if(opt=this.draggable('option')){
					this.trigger($.Event('mousemove.draggable',{pageY:jsc.event.pageY,pageX:jsc.event.pageX}));
					opt.drag&&(opt.drag.isDisabled=!!s);
					opt.resize&&(opt.resize.isDisabled=!!s);
				}
				this.triggerHandler('jscResize.jsc');
			}
		},
		close:{
			cls:'close',
			toggleCls:[{hover:'close-hover',press:''}],
			click:function(jsc){
				this.data('popup')?this.popup('close'):this.hide();
			}
		},
		slideUp:{
			cls:'slide-up',
			toggleCls:[{cls:'slide-up',hover:'slide-up-hover',press:''},{cls:'slide-down',hover:'slide-down-hover',press:''}],
			param:'bottom',
			click:_slide
		},
		slideDown:{
			cls:'close',
			toggleCls:[{hover:'close-hover',press:''},{hover:'close-hover',press:''}],
			param:'top',
			click:_slide
		}
	};
	function _slide(jsc){
		this.stop(true,true);
		var me=this,size=0;
		if(jsc.status){
			size=this.height()-this.panel('option','header').outerHeight()+1;
			jsc.button.data('slide_'+jsc.param,size);					
		}else{
			size=jsc.button.data('slide_'+jsc.param);
			jsc.button.removeData('slide_'+jsc.param);
		}
		var isTL=$$.is('tl',jsc.param),wh=$$.getWH(jsc.param),param={};
		isTL&&(param[jsc.param]=(jsc.status?'+=':'-=')+size);
		param[wh]=(jsc.status?'-=':'+=')+size;
		this.animate(param,function(){
			me.triggerHandler('jscResize.jsc');
			if(opt=me.data('draggable')){
				opt.drag&&(opt.drag.isDisabled=!!jsc.status);
				opt.resize&&(opt.resize.isDisabled=!!jsc.status);
				me.triggerHandler('mouseleave');
			}
		});
	};
})(jQuery);