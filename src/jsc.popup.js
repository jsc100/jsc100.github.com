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
	var popupManager={overlay:null,count:0,active:null,fixed:[],modeless:[]};
	$$.plugin('popup',{
		conf:{
			cls:'popup',
			ie6MaskCls:'mask-ie6',
			overlayCls:'overlay',
			activeCls:'active',
			model:false,
			overlay:false,
			pos:null,
			repos:false,
			fixed:false,
			active:false,
			open:{
				auto:true,
				before:$$.fn,
				after:$$.fn,
				effect:'default'
			},
			close:{
				auto:false,
				hoverStop:true,
				timer:{timeout:3000},
				before:$$.fn,
				after:$$.fn,
				effect:'default'
			},
			trigger:false
		},
		methods:{
			open:function(){return this.each(function(){_openPopup.call($(this));});},
			close:function(){return this.each(function(){_closePopup.call($(this));});},
			setPos:function(){return this.each(function(){_setPosPopup.call($(this));});},
			active:function(){
				var pm=popupManager,opt=this.data('popup');
				if(opt.active){
					if(arguments[0]!==false){
						pm.active&&pm.active.popup('active',false);
						opt.zIndex=this.css('zIndex');
						this.css('zIndex',$$.zIndex+3);
						opt.overlay&&pm.overlay.css('zIndex',$$.zIndex+1);
						pm.active=this;
					}else{
						pm.active==this&&this.css('zIndex',opt.zIndex);
					}
				}
				return this;
			},
			destroy:function(){
				var pm=popupManager,opt=this.data('popup'),me=this[0];
				if(opt.overlay){
					if(--pm.count==0){
						$(window).off('.popup');
						pm.overlay.off('.popup').remove();
						pm.overlay=null;
					}
				}
				if(!opt.model){
					pm.modeless=$.grep(pm.modeless,function(n,i){return n[0]!=me;});
					pm.modeless.length==0&&$$.$doc.off('.popup').removeData('popup');
				}
				pm.active==me&&(pm.active=null);
				this.off('.drag').off('.resize');
				if($$.is('ie6')){
					opt.fixed&&(pm.fixed=$.grep(pm.fixed,function(n,i){return n[0]!=me;}));
					if(opt.mask){
						this.off('.jsc');
						opt.mask.remove();
					}					
				}
				me.vml&&$$.vml.destroyVML.call(me);
			}
		},
		create:function(opt){
			var pm=popupManager,me=this.addClass(opt.cls).css({'position':opt.fixed&&!$$.is('ie6')?'fixed':'absolute',zIndex:$$.zIndex++}).data('popup',opt);
			function _setStyle(pos){
				function _exp(side,val){return 'eval((document.documentElement.scroll'+side+'||document.body.scroll'+side+')+'+val+')+"px"';};
				var method=pos?'setExpression':'removeExpression',top=pos?_exp('Top',pos[0]):null,left=pos?_exp('Left',pos[1]):null;
				this[0].style[method]('top',top);
				this[0].style[method]('left',left);
			}
			if(opt.overlay){
				if(!pm.overlay){
					var $win=$(window);
					pm.overlay=$$.getSington(opt.overlayCls).html($$.is('ie6')?$$.ie6Mask:'')
					.addClass(opt.overlayCls).css({top:'0px',left:'0px'}).restrain('drag,select,contextMenu')
						.on('click.popup mousedown.popup',function(e){e.stopImmediatePropagation();return false;});
					function _setSize(){this.width($win.width()).height($win.height());};
					$win.on('resize.popup',$.proxy(_setSize,pm.overlay));
					$$.is('ie6')?_setStyle.call(pm.overlay,[0,0]):pm.overlay.css('position','fixed');
					_setSize.call(pm.overlay);					
				}
				pm.count++;
			}
			if(!opt.model){
				pm.modeless.push(this);
				!$$.$doc.data('popup')&&$$.$doc.data('popup',true).on('mousedown.popup',function(e){
					for(var i=0,len=pm.modeless.length;i<len;i++){
						var $this=pm.modeless[i];
						(e.isTrigger||!$$.is('contain',[e.pageY,e.pageX],$this.getPos()))&&_closePopup.call($this);
					}					
				});
			}
			if(opt.close.auto){
				opt.timer=$$.timer($.extend(opt.close.timer,{context:this,autoStart:false,action:_closePopup}));
				opt.close.hoverStop&&this.on('mouseenter.popup mouseleave.popup',function(e){
					opt.timer[e.type=='mouseenter'?'stop':'start']();
				});
			}
			opt.active&&this.on('mousedown.popup',function(){$(this).popup('active');});
			if($$.is('ie')){
				$$.vml&&this[0].currentStyle['box-shadow']&&$$.vml.applyVML.call(this[0]);
				if($$.is('ie6')){
					opt.mask=this.after($$.toHtml({cls:opt.ie6MaskCls,css:{position:'absolute',zIndex:$$.zIndex-2,top:'0px',left:'0px'},text:$$.ie6Mask})).next();
					function _setStyle1(offset){
						var pos=this.offset();
						offset=offset||{top:0,left:0};
						pos.top-=$$.$doc.scrollTop(),pos.left-=$$.$doc.scrollLeft();						
						_setStyle.call(this,[pos.top-offset.top,pos.left-offset.left]);
					}
					this.on('jscMove.jsc jscResize.jsc',function(e){
						var $this=$(this),rs=e.type=='jscResize',pos=arguments[1]||$this[rs?'getPos':'offset'](),vml=this.vml;
						if(vml&&vml.shapes.shadow){
							var off=vml.shadow.blur+vml.shadow.spread;
							vml.shadow.offY<0?(pos.top+=vml.shadow.offY-off):(rs&&(pos.bottom+=vml.shadow.offY+off));
							vml.shadow.offX<0?(pos.left+=vml.shadow.offX-off):(rs&&(pos.right+=vml.shadow.offX+off));
						}
						opt.mask.setPos(pos,rs,{width:0,height:0});
						if(opt.fixed){
							_setStyle1.call($this);
							_setStyle1.call(opt.mask);							
						}
					}).on('propertychange.jsc',function(e){
						var $t=$(e.target),pn=event.propertyName;
						pn=='style.display'&&opt.mask.css('display',$t.css('display'));
						pn=='style.zIndex'&&opt.mask.css('zIndex',$t.css('zIndex')-1);
					});
					if(opt.fixed){
						pm.fixed.push(this);
						_setStyle1.call(this,{top:this.margin('top'),left:this.margin('left')});
						this.on('dragStart.drag dragStart.resize',function(){
							for(var i=0,len=pm.fixed.length;i<len;i++){
								_setStyle.call(pm.fixed[i]);
								_setStyle.call(pm.fixed[i].data('popup').mask);
							}
							pm.overlay&&_setStyle.call(pm.overlay);
						}).on('dragEnd.drag dragEnd.resize',function(){
							for(var i=0,len=pm.fixed.length;i<len;i++){
								var t=pm.fixed[i];
								_setStyle1.call(t);
								_setStyle1.call(t.data('popup').mask);
							}
							pm.overlay&&_setStyle.call(pm.overlay,[0,0]);
						});						
					}
					setTimeout(function(){
						me.triggerHandler('jscResize.jsc');
						if(opt.fixed){
							var mask=me.data('popup').mask,pos=mask.offset();
							_setStyle.call(mask,[pos.top,pos.left]);
						}
					},0);
				}
			}
			opt.open.auto?_openPopup.call(this):_closePopup.call(this);
		}
	});
	function _setPosPopup(){
		var me=this,opt=this.data('popup');
		if(!opt.pos){
			var by=$(window);
			opt.pos=[{by:by,mode:'padding',side:'top',center:true,container:null},{by:by,mode:'padding',side:'left',center:true,container:null}];
		}
		var pos=opt.pos;
		if($.isArray(opt.pos)){
			opt.pos[0].pos=null;
			opt.pos[1].pos=this.posBy(opt.pos[0]);
			pos=this.posBy(opt.pos[1]);
		}
		this.setPos(pos).triggerHandler('jscMove.jsc',pos);
		setTimeout(function(){
			me.triggerHandler('jscResize.jsc',pos);
			if($$.is('ie')&&$.browser.version<9&&$$.vml){
				me.find('['+$$.vml.option('boxNode')+']').andSelf().each(function(){
					this.fireEvent('onmove');
				});
				me[0].vml&&me[0].fireEvent('onresize');
			}			
		},0);
	};
	function _openPopup(){
		var opt=this.data('popup');
		if($$.toggle.call(this,'open',opt.open,opt.trigger)){
			this.popup('active');
			(opt.repos||!opt.once)&&_setPosPopup.call(this);
			opt.once=true;
			opt.overlay&&popupManager.overlay.css('zIndex',this.css('zIndex')-1).show();
			opt.close.auto&&opt.timer.start();
		}
	};
	function _closePopup(){
		var opt=this.data('popup');
		opt.close.auto&&opt.timer.stop();
		$$.toggle.call(this,'close',opt.close,opt.trigger)&&opt.overlay&&popupManager.overlay.hide();
	};
	var messageManager=[];
	$$.messageDefault={cls:'message',pos:[{by:window,side:'top',mode:'padding',offset:1,container:null},{by:window,side:'left',center:true,container:null}],overlay:false,keep:3000};
	$$.message=function(msg,pos,keep){
		$.isNumeric(pos)&&(keep=pos,pos=null);
		if(messageManager.length==0||$.grep(messageManager,function(n,i){return !n.is(':visible');}).length==0){
			messageManager.push($$.getSington().popup({cls:$$.messageDefault.cls,model:true,active:true,overlay:$$.messageDefault.overlay,fixed:true,repos:true,open:{auto:false},close:{auto:true,timer:{timeout:$$.messageDefault.keep}}}));
		}
		var pos1=pos,messager=$.grep(messageManager,function(n,i){return !n.is(':visible');})[0];
		messager.popup('option','timer').option('timeout',keep||$$.messageDefault.keep);
		if(!pos1){
			if((arr=$.grep(messageManager,function(n,i){return n.is(':visible');})).length>0){
				pos1=[$.extend({},$$.messageDefault.pos[0],{by:arr[arr.length-1],side:'bottom',mode:'margin'}),$$.messageDefault.pos[1]];
			}else{
				pos1=$$.messageDefault.pos;
			}
		}
		messager.html(msg).popup('option','pos',pos1).popup('open');
	};
})(jQuery);
