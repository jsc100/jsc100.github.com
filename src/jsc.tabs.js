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
	$$.plugin('tabs',{
		conf:{
			axis:'x',
			cls:'tabs',
			headerBarCls:'tabs-header-bar',
			headerCls:'tabs-header',
			hoverCls:'tabs-header-hover',
			selectedCls:'tabs-header-selected',
			closeCls:'tabs-close',
			headerFootCls:'header-foot',
			bodyCls:'tabs-body',
			headerNodeName:'li',
			event:'click',
			headerSize:'auto',
			fit:'all',
			fillSpace:true,
			scrollable:true,
			collapsible:false,
			autoSelect:false,
			invert:false,
			interval:3000,
			index:0,
			data:[],
			open:{
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
			select:_tabSelect,
			insert:function(items){
				var idx=_tabInsert.call(this,items);
				return _tabSelect.call(this,idx);
			},
			remove:_tabRemove
		},
		create:function(opt){
			opt.selector={header:'.'+$$.str2Arr(opt.headerCls)[0],body:'>.'+$$.str2Arr(opt.bodyCls)[0]};
			var idx=$$.index(opt.axis,$$.ARR.axis);
			opt.wh=$$.ARR.wh[idx],opt.owh=$$.ARR.owh[idx];
			opt.ajax=$$.ajax($.extend(opt.ajax,{auto:false}));
			var me=this.addClass(opt.cls+' tabs-'+opt.axis).data('tabs',opt);
			function _createHeaderBar(){
				opt.headerBar=$($$.toHtml({cls:opt.headerBarCls,sub:[{node:(opt.headerNodeName=='li'||opt.headerNodeName=='LI')?'ul':'div'},{cls:opt.headerFootCls}]})).prependTo(this);				
			}
			if(this.children().length){
				opt.headerBar=this.find('.'+$$.str2Arr(opt.headerBarCls)[0]);
				opt.header=this.find(opt.selector.header);
				opt.body=this.find(opt.selector.body);
				!opt.headerBar.length&&_createHeaderBar.call(this);
				var headerParent=opt.headerBar.children(':first');
				if(opt.header.length){
					var parent=opt.header.parent();
					if(parent[0]!=headerParent[0]){
						headerParent.append(opt.header);
						parent[0]!=this[0]&&parent.remove();
					}
				}else{
					opt.header=headerParent.children().addClass(opt.headerCls);
				}
				!opt.body.length&&(opt.body=this.children().not(opt.headerBar[0]).addClass(opt.bodyCls));
				if(!opt.header.length){
					for(var i=0,len=opt.body.length;i<len;i++){
						var body=opt.body.eq(i),icon=body.attr('icon'),caption=body.attr('caption'),closeable=body.attr('closeable'),
						header=$($$.toHtml({node:opt.headerNodeName,cls:opt.headerCls,sub:[{node:'span',cls:icon||'',text:caption}]}));
						$.parseJSON(closeable)&&(header=header.wrapInner('<span class="'+opt.closeCls+'"/>'));
						headerParent.append(header);
					}
				}
			}else{
				_createHeaderBar.call(this);
			}
			opt.headerParent=opt.headerBar.children(':first');
			opt.header=this.find(opt.selector.header);
			opt.body=this.find(opt.selector.body);
			for(var i=0,len=opt.header.length;i<len;i++){
				_setTabIcon(opt.header[i],opt);
			}
			_tabInsert.call(this,opt.data);
			opt.fit&&this.fitParent({wh:opt.fit,trigger:true}).parent().on('jscResize.jsc',function(){
				me.fitParent({wh:opt.fit,trigger:true});
			});
			_tabSelect.call(this);
			this.on('jscResize.jsc',function(){
				opt.headerBar.fitParent({wh:opt.wh,trigger:true});
				opt.body.fitParent({wh:opt.fillSpace?'all':opt.wh,swh:$$.ARR.wh[($$.index(opt.wh,$$.ARR.wh)+1)%2],trigger:true});					
			}).triggerHandler('jscResize.jsc');
			if(opt.scrollable){
				opt.headerBar.children(':first').addClass('scroll-track');
				opt.headerBar.scrollable($.extend(true,{
					axis:opt.axis,
					cls:'',
					spinOpt:{
						cls:'',
						wrapperCls:'',
						event:'mousedown',
						timer:{interval:500}
					},
					rotate:false,
					autoScroll:false,
					invert:true
				},opt.scrollableOpt));
			}
			var btnConf={
				cls:opt.headerCls,
				toolbarCls:'',
				iconCls:'',
				toggleCls:[{cls:'',hover:opt.hoverCls,press:''}],
				selector:opt.selector.header,
				keep:null,
				context:me
			};
			btnConf[opt.event]=function(jsc){
				var $t=$(jsc.event.target),close=false;
				if($t.hasClass(opt.closeCls)&&opt.event=='click'){
					var pos=$t.getPos();
					pos.left=pos.right-11;
					pos.bottom=pos.top+11;
					close=$$.is('contain',[jsc.event.pageY,jsc.event.pageX],pos);
				}
				close?_tabRemove.call(me,opt.header.index(jsc.button)):_tabSelect.call(me,opt.header.index(jsc.button));
			};
			opt.headerBar.button(btnConf);
			if(opt.autoSelect){
				opt.timer=$$.timer($.extend({},{context:this,interval:opt.interval},{autoStart:true,param:{scroll:opt.invert?-1:1},action:_tabSelect}));
				this.hover(function(){opt.timer.stop()},function(){opt.timer.start()});
			}
		}
	});
	function _setTabIcon(header,opt){
		var $h=$(header),close=$('.'+opt.closeCls,header),title=$(':parent',header);
		for(var i=0;i<title.length;i++){
			var $t=$(title[i]),text=$t.text();
			if($t.html()==text){
				var cls=$t.attr('class');
				cls?cls+=' icon-left':null;
				$h.html('<span class="'+cls+'">'+text+'</span>');
				break;
			}
		}
		close.length&&$h.wrapInner('<span class="icon-right '+opt.closeCls+'"/>');
	};
	function _tabInsert(items){
		var opt=this.data('tabs'),idx=0;
		if(items){
			function _insert(item){
				var tab=opt.header.filter(function(i,n){return $(n).text()===item.caption});
				if(tab.length){return opt.header.index(tab);}
				var h=$($$.toHtml({node:opt.headerNodeName,cls:opt.headerCls,sub:[{node:'span',cls:item.icon,text:item.caption}]})).restrain('drag,select,contextMenu'),
				b={cls:opt.bodyCls,attr:{},text:item.content};
				item.closeable&&h.wrapInner('<span class="'+opt.closeCls+'"/>');
				item.url&&(b.attr.url=item.url);
				item.cache!=undefined&&(b.attr.cache=item.cache);
				if(opt.header.length){
					b=$($$.toHtml(b)).width(opt.body.width()).height(opt.body.height());
					if(item.index&&opt.header[item.index]){
						opt.header.eq(item.index).before(h);
						opt.body.eq(item.index).before(b);						
					}else{
						opt.header.last().after(h);
						opt.body.last().after(b);
						item.index=opt.header.length;
					}
				}else{
					opt.headerParent.append(h);
					this.append($$.toHtml(b)).triggerHandler('jscResize.jsc');
					item.index=0;
				}
				opt.header=opt.headerBar.find(opt.selector.header);
				opt.body=this.find(opt.selector.body);
				idx=item.index||(opt.header.length-1);
				_setTabIcon(opt.header[idx],opt);
				opt.body.eq(idx).hide();
				return idx;
			}
			if($.isArray(items)){
				for(var i=0,len=items.length;i<len;i++){
					idx=_insert.call(this,items[i]);					
				}					
			}else{
				idx=_insert.call(this,items);					
			}
		}
		return idx;
	};
	function _tabSelect(idx){
		var me=this,opt=this.data('tabs');
		function _load(target){
			var url=target.attr('url'),cache=target.attr('cache');
			cache=(cache!='false'&&cache!='FALSE');
			if($$.is('!emptyStr',url)){
				opt.ajax.load({
					url:url,
					cache:cache,
					context:target
				});
				cache&&target.removeAttr('url');
			}
		}
		if(idx==undefined){
			idx=opt.index;
			opt.header.eq(idx).addClass(opt.selectedCls);
			opt.body.hide();
			_load(opt.body.eq(idx).show());
		}else{
			if(!$.isNumeric(idx)&&idx.scroll){
				idx=(opt.index+idx.scroll)%opt.header.length;
			}
			if(idx==opt.index){
				if(opt.collapsable){
					var body=opt.body.eq(idx),isHide=body.is(':visible');
					body[isHide?'hide':'show']();
					!isHide&&_load(body);
					opt.header.eq(idx).toggleClass(opt.selectedCls);					
				}
			}else{
				opt.header.eq(opt.index).removeClass(opt.selectedCls);
				opt.header.eq(idx).addClass(opt.selectedCls);
				opt.body.eq(opt.index).hide();
				var body=opt.body.eq(idx).show();
				_load(body);
				opt.index=idx;
			}
		}
		opt.headerBar.triggerHandler('jscResize.jsc');
		opt.headerBar.data('scrollable')&&opt.headerBar.scrollable('scrollTo',idx);
		$.isFunction(opt.onSelect)&&opt.onSelect.call(this,idx);
		return this;
	};
	function _tabRemove(idx){
		var opt=this.data('tabs');
		if(opt.header[idx]){
			var header=opt.header.eq(idx).restrain('drag,select,contextMenu',false),hb=opt.body.eq(idx).add(header);
			if($$.is('ie')&&$.browser.version<9&&$$.vml){
				header.find('['+$$.vml.option('boxNode')+']').each(function(){
					$(this).triggerHandler('destroy.jsc');
				});
				hb.triggerHandler('destroy.jsc');
			}
			hb.find('[jscplugin]').each(function(){
				var $this=$(this),name=$.trim($this.attr('jscplugin'));
				name=$$.str2Arr(name);
				$$.each(name,function(i,n){
					var plugin=$.trim(n);
					$$.is('!emptyStr',plugin)&&$this[plugin]('destroy');
				});
			});
			hb.remove();
			opt.header=opt.headerBar.find(opt.selector.header);
			opt.body=this.find(opt.selector.body);
			idx<=opt.index&&opt.index&&(opt.index-=1);
			opt.header.length&&_tabSelect.call(this);
		}
		return this;		
	};
})(jQuery);
