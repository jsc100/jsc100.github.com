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
	$$.plugin('scrollable',{
		conf:{
			cls:'scrollable',
			viewCls:'scroll-view',
			trackCls:'scroll-track',
			showSpinCls:'spin-show',
			axis:'y',
			invert:false,
			step:1,
			indexStep:true,
			animate:true,
			duration:300,
			autoScroll:false,
			hoverStop:true,
			timer:{
				interval:1000
			},
			rotate:true,
			revert:false,
			showSpin:'auto',//'show':'hide':hover
			spinOpt:{},
			action:$$.fn
		},
		methods:{
			scrollTo:_scrollTo,
			update:_updateScroll
		},
		create:function(opt){
			var arr=$$.ARR,idx=$$.index(opt.axis,arr.axis),tvArr=['track','view'];
			opt.side=arr.side[idx],opt.wh=arr.wh[idx],opt.owh=arr.owh[idx];
			var ucf=$$.ucFirst(opt.side);
			opt.marginProp='margin'+ucf,opt.scrollProp='scroll'+ucf;
			for(var i=0;i<2;i++){
				var tv=tvArr[i];
				opt[tv]=$('.'+$$.str2Arr(opt[tv+'Cls'])[0],this);
				if(!opt[tv].length){
					opt.track.length?opt.track.wrap('<div class="'+opt[tv+'Cls']+'"></div>'):this.wrapInner('<div class="'+opt[tv+'Cls']+'"></div>');
					opt[tv]=opt.track.length?opt.track.parent():this.children();
				}
			}
			opt.view.css({'overflow':'hidden','position':'relative'});
			opt.wh=='height'&&opt.track.height('auto');
			opt.itemLen=opt.track.children()[opt.owh](true),opt.itemCount=opt.indexStep?opt.step:Math.ceil(opt.step/opt.itemLen);
			this.spin($.extend({cls:'',invert:opt.invert,rotate:opt.rotate,timer:opt.timer,action:_scroll,core:{step:opt.indexStep?opt.step*opt.itemLen:opt.step}},opt.spinOpt))			
				.addClass(opt.cls+' '+(opt.showSpin!='hide'?opt.showSpinCls:'')).data('scrollable',opt)
				.on('jscResize.jsc',function(e,wh){_updateScroll.call($(this));}).triggerHandler('jscResize.jsc');
			var me=this,tim=null,isHover=false;
			if(opt.showSpin=='hover'||opt.autoScroll&&opt.hoverStop){
				var arrow=this.spin('option','arrow'),t=!$$.is('contain',arrow.up.getPos(),this.getPos())?this.add(arrow.up).add(arrow.down):this;
				t.hover(function(){
					isHover=true;
					opt.showSpin=='hover'&&arrow.up.add(arrow.down).show();
					opt.autoScroll&&opt.hoverStop&&me.spin('end');
				},function(){
					isHover=false;
					opt.showSpin=='hover'&&arrow.up.add(arrow.down).hide();
					if(opt.autoScroll&&opt.hoverStop){
						tim&&clearTimeout(tim);
						tim=setTimeout(function(){!isHover&&me.spin('go','up')},opt.timer.interval);						
					}
				});
			}
			opt.autoScroll&&(tim=setTimeout(function(){me.spin('go','up')},opt.timer.interval));
		}
	});
	function _updateScroll(){
		var opt=this.data('scrollable');
		function _fitWidth(){
			if(opt.wh=='width'){
				var width=0;
				opt.track.width(10000).children(':visible').each(function(){
					width+=$(this).outerWidth(true);
				});
				opt.track.width(width+2);
			}			
		}
		_fitWidth();
		var len=opt.track[opt.owh](true)-this[opt.wh](),arrow=this.spin('option','arrow'),visible=arrow.up.is(':visible');
		if(opt.rotate&&!opt.revert){
			var items=opt.track.children(),step=this.spin('option','core.step');
			while(len-(step<opt.itemLen?opt.itemLen:step)<=0){
				items.clone().appendTo(opt.track);
				_fitWidth();
				len=opt.track[opt.owh](true)-this[opt.wh]();
			}
		}
		if(opt.showSpin=='auto'){
			if(len>0&&!visible){
				this.addClass(opt.showSpinCls);
				arrow.up.add(arrow.down).show();
			}else if(len<=0&&visible){
				this.removeClass(opt.showSpinCls);
				arrow.up.add(arrow.down).hide();
			}			
		}else if(opt.showSpin=='show'){
			len&&(len+=opt.view.delta(opt.wh,true));
			arrow.up.add(arrow.down).disable(len<=0);
		}else{
			arrow.up.add(arrow.down).hide();
		}
		opt.view.fitParent({wh:opt.wh});
		this.spin('option','core.max',len+opt.view.delta(opt.wh,true));
		opt.showSpin=='auto'&&arrow.up.is(':visible')&&this.spin('update');
	};
	function _scroll(jsc){
		var opt=jsc.plugin.data('scrollable');
		if(opt.rotate&&!opt.revert){
			opt.track.is(':animated')&&opt.track.stop(true,true);
			var margin={},tm=opt.track.margin(opt.side),abs=Math.abs(tm),step=this.spin('option','core.step'),
			ref=Math.max(step,opt.itemLen),m=tm,sign=jsc.param<0&&abs<ref||jsc.param>0&&abs>=ref;
			if(sign){
				var items=jsc.param<0?opt.track.children().slice('-'+(opt.itemCount)):opt.track.children(':lt('+opt.itemCount+')');
				opt.track[jsc.param<0?'prepend':'append'](items);
				m+=opt.itemCount*opt.itemLen*(jsc.param<0?-1:1);
				margin[opt.marginProp]=m+'px';
				opt.track.css(margin);				
			}
			if(opt.animate){
				margin[opt.marginProp]=(jsc.param<0?'+=':'-=')+step+'px';
				opt.track.animate(margin,opt.duration);
			}else{
				margin[opt.marginProp]=(m+step*(jsc.param<0?1:-1))+'px';
				opt.track.css(margin);
			}
		}else{
			if(opt.animate){
				opt.view.is(':animated')&&opt.view.stop(true,true);
				var ani={};
				ani[opt.scrollProp]=jsc.value;
				opt.view.animate(ani,opt.duration);
			}else{
				opt.view[opt.scrollProp](jsc.value);			
			}
		}
		opt.action.call(this,jsc);
	};
	function _scrollTo(idx){
		var opt=this.data('scrollable');
		var track=opt.track,view=opt.view,core=this.spin('option','core'),pos=track.getPos(),len=null;
		if(opt.indexStep){
			var target=track.children($$.vml&&':not('+$$.vml.option('boxNode')+')').eq(idx),pos1=target.getPos();
			if(!$$.is('contain',pos1,view.getPos(),opt.wh)||arguments[1]){
				len=pos1[opt.side]-pos[opt.side];
				len>core.max&&(len-=(view[opt.owh]()-target[opt.owh](true)));
			}else{
				return this;
			}
		}else{
			len=idx-pos[opt.side];
			len=idx>core.max?core.max:idx<core.min?core.min:len;
		}
		core.value=len;
		this.spin('update');
		_scroll.call(this,{plugin:this,value:core.value});
		return this;
	};
})(jQuery);
