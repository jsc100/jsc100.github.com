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
	$$.plugin('accordion',{
		conf:{
			axis:'y',
			cls:'accordion',
			headerCls:'accordion-header',
			hoverCls:'accordion-header-hover',
			selectedCls:'accordion-header-selected',
			bodyCls:'accordion-body',
			tipIconCls:'icon-accordion-tip',
			tipIconPos:'icon-right',
			headerNodeName:'a',
			icon:true,
			event:'click',
			fit:true,
			fillSpace:true,
			minSize:100,
			collapsable:false,
			scrollable:true,
			data:[],
			index:0,
			open:{
				before:$$.fn,
				after:$$.fn,
				effect:'slidDown'
			},
			close:{
				before:$$.fn,
				after:$$.fn,
				effect:'slidUp'
			}
		},
		methods:{
			insert:function(items){
				var index=_accordionInsert.call(this,items);
				this.parent().triggerHandler('jscResize.jsc');
				return _accordionSelect.call(this,index);
			},
			remove:function(idx){
				var opt=this.data('accordion');
				if(opt.header[idx]){
					var header=opt.header.eq(idx).restrain('drag,select,contextMenu',false),hb=opt.body.eq(idx).add(header);
					if($$.is('ie')&&$.browser.version<9&&$$.vml){
						header.find('['+$$.vml.option('boxNode')+']').each(function(){
							$(this).triggerHandler('destroy.jsc');
						});
						hb.triggerHandler('destroy.jsc');
					}
					hb.find('[jscplugin]').each(function(){
						var $this=$(this),name=$this.attr('jscplugin');
						name=$$.str2Arr(name);
						$$.each(name,function(i,n){
							var plugin=$.trim(n);
							$$.is('!emptyStr',plugin)&&$this[plugin]('destroy');
						});
					});
					hb.remove();					
					opt.header=this.find(opt.selector.header);
					opt.body=this.find(opt.selector.body);
					idx<=opt.index&&(opt.index-=1);
					this.parent().triggerHandler('jscResize.jsc');
					_accordionSelect.call(this);
				}
				return this;
			},
			select:_accordionSelect
		},
		create:function(opt){
			opt.selector={header:'.'+$$.str2Arr(opt.headerCls)[0],body:'.'+$$.str2Arr(opt.bodyCls)[0]};
			var idx=$$.index(opt.axis,$$.ARR.axis);
			opt.wh=$$.ARR.wh[idx],opt.owh=$$.ARR.owh[idx];
			opt.ajax=$$.ajax({auto:false});
			var me=this.addClass(opt.cls).css('overflow',opt.scrollable?'hidden':'auto').data('accordion',opt);
			if(this.children().length){
				opt.header=this.find(opt.selector.header);
				if(!opt.header.length){
					opt.body=this.children().addClass(opt.bodyCls).each(function(){
						var $this=$(this),caption=$this.attr('caption'),icon=$this.attr('icon');
						$(this).before($$.toHtml({node:opt.headerNodeName,cls:opt.headerCls,sub:[{node:'span',cls:icon||'',text:caption}]}));
					});
					opt.header=this.find(opt.selector.header);
				}else{
					opt.body=this.find(opt.selector.body);
					!opt.body.length&&(opt.body=opt.header.next().addClass(opt.bodyCls));
				}
				for(var i=0,len=opt.header.length;i<len;i++){
					_setAccordionIcon(opt.header[i],opt);
				}
			}
			_accordionInsert.call(this,opt.data);
			opt.fit&&this.fitParent({wh:opt.fit}).parent().on('jscResize.jsc',function(){
				me.fitParent({wh:opt.fit});
				_setSize.call(me);
				me.triggerHandler('jscResize.jsc');
			}).triggerHandler('jscResize.jsc');
			_accordionSelect.call(this);
			function _setSize(){
				opt.wh=='width'&&me.children().fitParent({wh:'height'});
				if(opt.fillSpace){
					var scrollOpt=me.data('scrollable'),size=me[opt.wh]()-opt.header[opt.owh](true)*opt.header.length;
					size<opt.minSize&&(size=opt.minSize);
					opt.body[opt.wh](size-opt.body.delta(opt.wh,true)).triggerHandler('jscResize.jsc');
					if(scrollOpt&&scrollOpt.showSpin=='show'){
						scrollOpt.view.fitParent({wh:opt.wh});
						var len=scrollOpt.track[opt.wh]()-scrollOpt.view[opt.wh]();
						if(len>0){
							size-=len;
							size<opt.minSize&&(size=opt.minSize);
							opt.body[opt.wh](size-opt.body.delta(opt.wh,true)).triggerHandler('jscResize.jsc');								
						}
					}
				}
			};
			this.on('jscResize.jsc',function(e){_setSize.call($(this));}).triggerHandler('jscResize.jsc');
			opt.scrollable&&this.css('position','relative').scrollable($.extend(true,{
				axis:opt.axis,
				cls:'',					
				spinOpt:{
					cls:'',
					wrapperCls:'',
					event:'mousedown'
				},
				animate:false,
				rotate:false,
				timer:{interval:50},
				autoScroll:false,
				invert:true
			},opt.scrollableOpt));
			var btnConf={
				cls:'',
				toolbarCls:'',
				iconCls:'',
				toggleCls:[{cls:'',hover:opt.hoverCls,press:''}],
				selector:opt.selector.header,
				keep:null,
				context:me
			};
			btnConf[opt.event]=function(jsc){_accordionSelect.call(this,opt.header.index(jsc.button));};
			this.button(btnConf);
		}
	});
	function _setAccordionIcon(header,opt){
		var child=$('>span',header);
		child.html(child.text());
		opt.tipIconPos=='icon-right'&&opt.icon?child.addClass('icon-left ellipsis').wrap('<span class="'+opt.tipIconPos+' '+opt.tipIconCls+'"/>'):child.attr('class',opt.tipIconPos+' ellipsis '+opt.tipIconCls);
		$$.is('ie6')&&child.removeClass('ellipsis').wrapInner('<span class="ellipsis"/>');
	};
	function _accordionInsert(items){
		var opt=this.data('accordion'),idx=0;
		if(items){
			function _insert(item){
				var h={node:opt.headerNodeName,cls:opt.headerCls,sub:[{node:'span',cls:item.icon,text:item.caption}]},
				b={cls:opt.bodyCls,attr:{},text:item.content},i=item.index!=undefined&&opt.header[item.index];
				item.url&&(b.attr.url=item.url);
				item.cache!=undefined&&(b.attr.cache=item.cache);
				i?opt.header.eq(item.index).before($$.toHtml([h,b])):this.append($$.toHtml([h,b]));
				opt.header=this.find(opt.selector.header);
				opt.body=this.find(opt.selector.body);
				var idx=i?item.index:opt.header.length-1;
				opt.header.eq(idx).restrain('drag,select,contextMenu');
				opt.body.eq(idx).hide();
				return idx;
			}
			if($.isArray(items)){
				for(var i=0,len=items.length;i<len;i++){
					idx=_insert.call(this,items[i]);					
					_setAccordionIcon(opt.header[idx],opt);
				}					
			}else{
				idx=_insert.call(this,items);
				_setAccordionIcon(opt.header[idx],opt);
			}
		}
		return idx;
	};
	function _accordionSelect(idx){
		var me=this,opt=this.data('accordion');
		function _load(t){
			var url=t.attr('url'),cache=t.attr('cache');
			cache=(cache!='false'&&cache!='FALSE');
			if($$.is('!emptyStr',url)){
				opt.ajax.load({
					url:url,
					cache:cache,
					context:t
				});
				cache&&t.removeAttr('url');
			}
		}
		if(idx==undefined){
			opt.body.hide();
			idx=opt.index;
			opt.header.eq(idx).addClass(opt.selectedCls);
			_load(opt.body.eq(idx).show());
		}else{
			if(idx==opt.index){
				if(opt.collapsable){
					var body=opt.body.eq(idx),isHide=body.is(':visible');
					body.slideToggle(function(){!isHide&&_load(body),me.triggerHandler('jscResize.jsc');});
					opt.header.eq(idx).toggleClass(opt.selectedCls);
				}
			}else{
				opt.header.eq(opt.index).removeClass(opt.selectedCls);
				opt.header.eq(idx).addClass(opt.selectedCls);
				opt.body.eq(opt.index).slideUp();
				var body=opt.body.eq(idx).slideDown('normal','easeOutBounce',function(){_load(body);});
				opt.index=idx;
			}
		}
		$.isFunction(opt.onSelect)&&opt.onSelect.call(this,idx);
		return this;
	};
})(jQuery);
