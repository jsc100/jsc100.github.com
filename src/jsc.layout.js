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
	$$.plugin('layout',{
		conf:{
			cls:'layout',
			proxyCls:'layout-proxy-drag',
			resizeBarCls:'bar-resize',
			closeCls:'button-close',
			collapseCls:'bar-collapsed',
			axis:'y',
			timeout:100,
			resizeBar:true,
			resizable:true,
			dragProxy:true,
			closeable:true,
			initClosed:false,
			Collapsable:false,
			minSize:100,
			maxSize:10000,
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
			toggle:function(side){
				var opt=this.data('layout');
				opt.bar[side]&&opt.bar[side].find('.'+opt.closeCls).click();
				return this;
			}
		},
		create:function(opt){
			if(this[0].tagName.toLowerCase()=='body'){
				$('html').css({'height':'100%','overflow':'hidden'});
				this.css({'height':'100%','overflow':'hidden','border':'none'});
				opt.timer=$$.timer({timeout:opt.timeout,context:this,action:function(){this.triggerHandler('jscResize.jsc',this.getPos());}});
				$(window).on('resize.layout',function(e){opt.timer.start();});				
			}
			opt.index=$.inArray(opt.axis,$$.ARR.axis),opt.panel={},opt.bar={};
			var me=this,lpArr=$$.ARR.lPanel[opt.index],center=lpArr[2],css={'display':'block','position':'absolute','overflow':'hidden'};
			$.each(lpArr,function(i,n){
				var panel=$('>div.'+n,me);
				if(panel.length){
					var opt1=$.extend(true,{},opt,opt[n]);
					opt.panel[n]=panel.addClass('layout-'+n).css(css);
					if(n!=center){
						var oppo=$$.oppo(n),wh=$$.ARR.wh[(opt.index+1)%2];
						opt.bar[n]=$($$.toHtml({cls:(opt.resizeBarCls+' '+opt.resizeBarCls+'-'+n)+(!opt1.resizeBar?' '+opt.resizeBarCls+'-'+n+'-none':''),css:css,sub:opt1.closeable?[{node:'span',cls:opt.closeCls+' '+opt.closeCls+'-'+n}]:[]})).insertAfter(panel);
						function _setPos(pl,side,mode,resize,trigger){
							resize=resize!==false;
							var pos=pl.posBy({by:this,side:side,mode:mode,resize:resize,margin:[true,true]});
							pl.setPos(pos,resize);
							trigger!==false&&pl.triggerHandler('jscResize.jsc',pos);
						}
						if(opt1.resizable){
							var isTL=$$.is('tl',n),opt2=$.extend({},opt,opt[center]);
							opt.bar[n].draggable({
								type:'drag',
								proxy:opt1.dragProxy,
								proxyCls:opt1.proxyCls,
								cursor:$$.ARR.lRCur[opt.index]+'-resize',
								axis:opt.axis,
								container:function(){
									var pos1=panel.getPos(),pos2=opt.panel[center].getPos(),
									sideVal=Math[isTL?'max':'min'](pos1[n]+opt1.minSize*(isTL?1:-1),pos2[oppo]+opt2.maxSize*(isTL?-1:1));
									pos1[oppo]=Math[isTL?'min':'max'](pos1[n]+opt1.maxSize*(isTL?1:-1),pos2[oppo]+opt2.minSize*(isTL?-1:1));
									pos1[n]=sideVal;
									return pos1;
								}
							}).on(opt1.dragProxy?'dragEnd.drag':'dragging.drag',function(){
								_setPos.call(this,panel,n,'margin');
								_setPos.call(this,opt.panel[center],oppo,'margin');
							});
						}
						if((btn=opt.bar[n].find('.'+opt.closeCls)).length){
							btn.button({
								cls:'',
								toggleCls:[{cls:opt.closeCls+'-'+n,hover:opt.closeCls+'-'+n+'-hover',press:''},
									{cls:opt.closeCls+'-'+oppo,hover:opt.closeCls+'-'+oppo+'-hover',press:''}],
								context:me,
								click:function(jsc){
									var oper=jsc.status?'close':'open';
									$$.toggle.call(panel,oper,opt1[oper]);
									opt.bar[n].mouseleave();
									opt1.Collapsable&&opt.bar[n].toggleClass(opt.resizeBarCls+' '+opt.resizeBarCls+'-'+n+' '+opt.collapseCls+' '+opt.collapseCls+'-'+n).fitParent({wh:wh});
									opt1.resizable&&opt.bar[n].draggable('option','drag','isDisabled',!!jsc.status);
									_setPos.call(jsc.status?this:panel,opt.bar[n],jsc.status?n:oppo,jsc.status?'padding':'margin',false,false);
									_setPos.call(opt.bar[n],opt.panel[center],oppo,'margin');
								}
							});
							if(opt1.initClosed){
								var btn1=btn;
								setTimeout(function(){btn1.click();},0);
							}
						}
					}					
				}				
			});
			this.addClass(opt.cls).data('layout',opt).on('jscResize.jsc',function(){
				var $this=$(this),opt=$this.data('layout'),arr=$$.ARR,lpArr=arr.lPanel[opt.index],idx=(opt.index+1)%2,wh=arr.wh[idx],
				cpos=arguments[1]||$this.getPos(),pposes=[],bposes=[],panels=[],bars=[],center=0,by=null,bySide=null,byMargin=0;
				for(var i=0,len=lpArr.length;i<len;i++){
					var side=lpArr[i],panel=opt.panel[side],bar=null;
					if(panel){
						var isVisible=i<2?panel.is(':visible'):true,ppos=bpos=null,posBy={by:cpos,mode:'padding',side:arr.side[idx],margin:[false,true]},
						fit={ppos:cpos,wh:i<2?wh:'all',swh:i<2?null:arr.wh[opt.index],siblings:i<2?null:$.grep(panels.concat(bars),function(n){return n.is(':visible')})};
						posBy.pos=$$.fitParent.call(panel,fit);
						ppos=panel.posBy(posBy);
						if(i<2){
							bar=opt.bar[side],bposBy={pos:ppos,by:cpos,side:side,mode:'padding',margin:[false,true]};
							ppos=panel.posBy(bposBy);
							var oppo=$$.oppo(side);
							isVisible&&(bposBy={by:ppos,side:oppo,mode:'margin',margin:[panel.margin(oppo),true]});
							posBy.pos=$$.fitParent.call(bar,fit);
							bposBy.pos=bar.posBy(posBy);
							bpos=bar.posBy(bposBy);
							!by&&(by=bpos,bySide=oppo,byMargin=bar.margin(bySide));
						}else{
							ppos=panel.posBy({pos:ppos,by:by,side:bySide,mode:'margin',margin:[byMargin,true]});
							center=panels.length;
						}
						panels.push(panel);
						pposes.push(ppos);
						bars.push(bar);
						bposes.push(bpos);
					}
				}
				for(var i=0,len=panels.length;i<len;i++){
					panels[i].setPos(pposes[i],center==i?true:wh).triggerHandler('jscResize.jsc',pposes[i]);
					bars[i]&&bars[i].setPos(bposes[i],wh);
				}
			}).triggerHandler('jscResize.jsc');
		}
	});
})(jQuery);
