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
	var dragManager={};
	$$.plugin('draggable',{
		conf:{
			which:1,
			type:'',
			selector:'',
			isDisabled:false,
			restrainClick:true,
			proxy:true,
			proxyCls:'proxy-drag',
			trigger:false
		},
		exist:true,
		methods:{
			option:function(opts,type,prop,val){
				var res=opts||this;
				opts&&type&&(res=$$._option.call(this,opts[type],prop,val));
				return res;
			}
		},
		create:function(opt){
			if(!$$.is('!emptyStr',opt.type)||((opts=this.data('draggable'))&&opts[opt.type])){return;}
			opt=$.extend({},$$.draggableDefault[opt.type],opt);
			$.isFunction(opt.onInit)&&opt.onInit.call(this,opt);
			this.triggerHandler('dragInit.'+opt.type,opt);
			var events=['mouseover','mouseout','mousemove','mousedown','click',''],bind=true;
			if(opts){
				for(var i=0,es=$._data(this[0]).events,hasSel=$$.is('!emptyStr',opt.selector),len=events.length-1;i<len;i++){
					for(var j=0,e=es[events[i]];j<e.length;j++){
						if(e[j].namespace==='draggable'&&$$.is('!emptyStr',e[j].selector)==hasSel){
							bind=false;
							e[j].quick=null;
							hasSel&&(e[j].selector+=','+opt.selector);
						}
					}
				}
			}
			(opts=opts||{})[opt.type]=opt;
			(opts.arr=opts.arr||[]).push({type:opt.type,level:opt.level});
			opts.arr.sort(function(a,b){return b.level-a.level;});
			if(bind){
				events.splice(0,2,'mouseenter','mouseleave');
				this.data('draggable',opts).on(events.join('.draggable '),opt.selector,function(e){
					if(dragManager.dragging){return;}
					var $this=$(this),plugin=$(e.delegateTarget),opts=plugin.data('draggable'),enable=!$this.isDisabled(),
					opt=(dragManager.id==e.delegateTarget&&dragManager.isTouch)?opts[dragManager.isTouch]:null;
					switch(e.type){
						case 'mouseenter':
						if(enable){
							for(var i=0,len=opts.arr.length;i<len;i++){
								opt=opts[opts.arr[i].type],hasSel=$$.is('!emptyStr',opt.selector);
								if(!opt.isDisabled&&hasSel==(this!=e.delegateTarget)&&(!hasSel||plugin.find(opt.selector).index(this)>-1)&&$.isFunction(opt.onTouch)&&opt.onTouch.call($this,e,opt)!==false){
									dragManager={id:e.delegateTarget,isTouch:opt.type,cursor:opt.cursor};
									$this.css('cursor',opt.cursor);
									return false;
								}
							}
						}
						break;
						case 'mouseleave':
						opt&&(dragManager={},$this.css('cursor',''));
						break;
						case 'mousemove':
						if(enable){
							for(var i=0,len=opts.arr.length;i<len;i++){
								var opt1=opts[opts.arr[i].type],hasSel=$$.is('!emptyStr',opt1.selector);
								if(!opt1.isDisabled&&hasSel==(this!=e.delegateTarget)&&(!hasSel||plugin.find(opt1.selector).index(this)>-1)&&$.isFunction(opt1.onMove)){
									if(opt1.onMove.call($this,e,opt1)!==false){
										opt!=opt1&&(opt=opt1,dragManager.id=e.delegateTarget,dragManager.isTouch=opt.type);
										e.stopImmediatePropagation();
										break;
									}else if(opt1==opt){
										dragManager.id=dragManager.isTouch=null;
										opt=null;
									}
								}
							}
							if(opt){
								if(!dragManager.cursor||dragManager.cursor!=opt.cursor){
									$this.css('cursor',opt.cursor);
									dragManager.cursor=opt.cursor;
								}
							}else if(dragManager.cursor){
								$this.css('cursor','');
								dragManager.cursor=null;
							}
						}
						break;
						case 'mousedown':
						if(opt){
							dragManager.dragging=true;
							$('body').css('cursor',opt.cursor).add($this).restrain('drag,select,contextMenu');
							$.isFunction(opt.onHold)&&opt.onHold.call($this,e,opt);
							$this.trigger('dragHold.'+opt.type,[e,opt]);
							$$.$doc.on('mousemove.draggable mouseup.draggable',{target:$this,opt:opt},function(e1){
								var me=e1.data.target,opt=e1.data.opt;
								switch(e1.type){
									case 'mousemove':
									if(!opt.isStarted){
										if($.isFunction(opt.onStart)&&opt.onStart.call(me,e1,opt)===false){return;}
										me.trigger('dragStart.'+opt.type,[e1,opt]);
										opt.isStarted=true;
										dragManager.restrainClick=opt.restrainClick;
									}
									opt.onDrag.call(me,e1,opt);
									me.trigger('dragging.'+opt.type,[e1,opt]);
									break;
									case 'mouseup':
									$$.$doc.off('.draggable');
									$('body').css('cursor','').add(me).restrain('drag,select,contextMenu',false);
									dragManager.dragging=false;
									if(opt.isStarted){
										$.isFunction(opt.onEnd)&&opt.onEnd.call(me,e1,opt);
										me.trigger('dragEnd.'+opt.type,[e1,opt]);
										opt.isStarted=false;
										if(e1.isTrigger){
											console.log('aa');
										}
										!e1.isTrigger&&me.trigger($.Event('mousemove.draggable!',{pageY:e1.pageY,pageX:e1.pageX}));
									}
									break;
								}
							});
						}
						break;
						case 'click':
						dragManager.restrainClick&&e.stopImmediatePropagation();
						dragManager.restrainClick=null;
					}					
				});
			}
		}
	});
	$$.draggableDefault={
		drag:{
			level:2,
			handle:null,
			cursor:'move',
			axis:'all',
			shiftKey:false,
			dis:1,
			step:1,
			revert:false,
			target:null,
			targetContext:null,
			keepPos:true,
			container:window,
			onInit:function(opt){
				opt.handle=$$.jq(opt.handle,this);
				opt.helper={
					box:opt.target?$$.getSington('dragBox'):null,
					proxy:opt.proxy?$$.getSington('dragProxy').html($$.is('ie6')?$$.ie6Mask:''):null
				};
			},
			onMove:function(e,opt){
				return opt.handle?$$.is('contain',[e.pageY,e.pageX],opt.handle.getPos()):true;
			},
			onHold:function(e,opt){
				opt.da={mouse:{x:e.pageX,y:e.pageY}};
			},
			onStart:function(e,opt){
				opt.da.pos=this.getPos();
				var h=opt.helper;
				if(h.box&&($t=$$.jq(opt.target,opt.targetContext||this.parent())).length){
					opt.da.target=[];
					for(var i=0,len=$t.length;i<len;i++){
						var $this=$t.eq(i),pos=$this.getPos(),css={'position':$this.css('position')},parent=$this.parent(),index=$this.index();
						if(opt.keepPos&&$this[0]!=this[0]){
							$$.each($$.ARR.side,function(i,n){
								opt.da.pos[n]=Math[i<2?'min':'max'](opt.da.pos[n],pos[n]);
							});
						}
						opt.da.target[i]={t:$this,pos:pos,p:parent,c:css,i:index};
					}
					h.box.css({width:'auto',height:'auto'}).setPos(opt.da.pos,opt.keepPos,{width:0,height:0});
					for(var i=0,len=opt.da.target.length;i<len;i++){
						var target=opt.da.target[i],pos=target.pos;
						target.t.appendTo(h.box);
						if(opt.keepPos){
							target.c.position!='absolute'&&target.t.css('position','absolute');
							target.t.setPos(target.c.position=='static'?$$.offset(pos,{top:-opt.da.pos.top,left:-opt.da.pos.left}):pos,true);
						}else{
							target.t.width($$.getSize('width',pos)).height($$.getSize('height',pos)).css({position:'static'});
						}
					}
					if(!opt.keepPos){
						opt.da.pos=h.box.getPos();
						var offset=this.offset();
						opt.da.pos=$$.offset(opt.da.pos,{top:opt.da.pos.top-offset.top,left:opt.da.pos.left-offset.left});
					}
				}
				if(opt.proxy===true){
					opt.dragger=h.proxy.addClass(opt.proxyCls).css({'z-index':$$.zIndex+4,'cursor':opt.cursor});
					opt.delta=opt.delta||{width:opt.dragger.delta('width'),height:opt.dragger.delta('height')};
					opt.dragger.setPos(opt.da.pos,true,opt.delta);
					_fitProxy.call(opt.dragger,opt.da.pos,opt.delta);
				}else if($.isFunction(opt.proxy)){
					opt.dragger=opt.proxy.call(this).appendTo('body').css({'z-index':$$.zIndex+4,'cursor':opt.cursor}).setPos(opt.da.pos);
				}else if(h.box){
					opt.dragger=h.box.css({'z-index':$$.zIndex+4,'cursor':opt.cursor});
				}else{
					opt.zIndex=this.css('z-index');
					opt.dragger=this.css('z-index',$$.zIndex+4);
				}
				opt.da.container=$$.getPos(opt.container);
				e.shiftKey&&opt.shiftKey&&(index=$$.index(opt.axis,$$.ARR.axis))>-1&&(opt.shiftAxis=$$.ARR.axis[(index+1)%2]);
				!opt.dragger.is(':visible')&&opt.dragger.show();
			},
			onDrag:function(e,opt){
				var pos=opt.da.pos,arr=$$.ARR;
				$$.each(arr.axis,opt.shiftAxis||opt.axis,function(i,n){
					var side=arr.side[i],ost=e['page'+$$.ucFirst(n)]-opt.da.mouse[n];
					if(opt.dis>Math.abs(ost)){return;}
					pos=$$.fitPos($$.pos2(pos,side,pos[side]+(opt.step>1?Math.round(ost/opt.step)*opt.step:ost)),opt.da.container,arr.wh[i]);
				});
				opt.dragger.offset(opt.da.offset=pos);
				opt.trigger&&!opt.proxy&&this.triggerHandler('jscMove.jsc',pos);
			},
			onEnd:function(e,opt){
				opt.shiftAxis=null;
				if(opt.proxy){
					(opt.helper.box||this).offset(opt.da.offset);
					opt.trigger&&this.triggerHandler('jscMove.jsc',opt.da.offset);
					$.isFunction(opt.proxy)?opt.dragger.remove():opt.helper.proxy.hide().removeClass(opt.proxyCls).css('cursor','');
				}else if(opt.revert){
					opt.dragger.offset(opt.da.pos);
				}
				if(opt.helper.box&&opt.helper.box.is(':parent')){
					for(var i=0,len=opt.da.target.length;i<len;i++){
						var target=opt.da.target[i],pos=target.t.offset();
						target.pos=pos;
					}
					opt.helper.box.hide();					
					for(var i=0,len=opt.da.target.length;i<len;i++){
						var target=opt.da.target[i],sib=target.p.children(':eq('+target.i+')');
						sib.length?sib.before(target.t):target.p.append(target.t);
						target.t.offset(target.pos).css(target.c);
					}
				}
				opt.dragger[0]==this[0]&&this.css('z-index',opt.zIndex);
			}
		},
		resize:{
			level:3,
			dir:'all',
			edgeWidth:5,
			limit:{
				width:{min:100,max:10000},
				height:{min:100,max:10000}
			},
			container:window,
			onInit:function(opt){
				opt.proxy=opt.proxy?$$.getSington('dragProxy').html($$.is('ie6')?$$.ie6Mask:''):null;
			},
			onMove:function(e,opt){
				var cursor='',sides=[],arr=$$.ARR,pos=this.getPos();
				for(var i=0,len=arr.rCur.length;i<len;i++){
					if(opt.dir=='all'||opt.dir.indexOf(arr.rCur[i])>-1){
						var j=i%2,side=arr.rSide[i],val=pos[side];
						if($$.between(i<2?e.pageY:e.pageX,[val,(val+opt.edgeWidth*(j?-1:1))])==0){
							if(opt.dir!='all'&&cursor.length&&opt.dir.indexOf(cursor+arr.rCur[i])<0){
								break;
							}
							cursor+=arr.rCur[i];
							sides.push(side);
						}
					}
				}
				if(cursor!=''){
					opt.cursor=cursor+'-resize';
					opt.sides=sides;
				}else{
					opt.cursor='';
					opt.sides=[];
					return false;
				}				
			},
			onHold:function(e,opt){
				opt.da={mouse:{x:e.pageX,y:e.pageY},pos:this.getPos(),offset:{}};
				$$.each(opt.sides,function(i,n){
					var xy=$$.ARR.axis[$$.index(n)%2];
					opt.da.offset[xy]=e['page'+$$.ucFirst(xy)]-opt.da.pos[n];
				});				
			},
			onStart:function(e,opt){
				if(opt.proxy){
					opt.proxy.addClass(opt.proxyCls).css({'z-index':$$.zIndex+4,'cursor':opt.cursor});
					opt.delta=opt.delta||{width:opt.proxy.delta('width'),height:opt.proxy.delta('height')};
					opt.proxy.setPos(opt.da.pos,true,opt.delta);
					_fitProxy.call(opt.proxy,opt.da.pos,opt.delta);
					opt.proxy.show();
				}
				opt.da.container=$$.getPos(opt.container);
			},
			onDrag:function(e,opt){
				var obj=opt.proxy||this,arr=$$.ARR,pos=opt.da.pos;
				$$.each(opt.sides,function(i,n){
					var index=$$.index(n)%2,xy=arr.axis[index],wh=arr.wh[index];
					pos[n]=e['page'+$$.ucFirst(xy)]-opt.da.offset[xy];
					if(opt.limit){
						var sign=$$.is('tl',n)?-1:1,delta=opt.delta?opt.delta[wh]:pos.delta[wh],size=(pos[n]-pos[$$.oppo(n)])*sign-delta;
						size>opt.limit[wh].max?pos[n]+=(opt.limit[wh].max-size)*sign:size<opt.limit[wh].min?pos[n]+=(opt.limit[wh].min-size)*sign:null;
					}
					pos=$$.fitPos(pos,opt.da.container,wh,true);
				});
				obj.setPos(opt.da.pos=pos,true,opt.delta);
				opt.proxy&&_fitProxy.call(opt.proxy,opt.da.pos,opt.delta);
				opt.trigger&&!opt.proxy&&this.triggerHandler('jscResize.jsc',pos);
			},
			onEnd:function(e,opt){
				if(opt.proxy){
					this.setPos(opt.da.pos,true);
					opt.trigger&&this.triggerHandler('jscResize.jsc',opt.da.pos);
					opt.proxy.hide().removeClass(opt.proxyCls).css('cursor','');
				}
			}
		},
		select:{
			level:1,
			target:'>*',
			cursor:'crosshair',
			mode:'half',
			shiftKey:true,
			touchCls:'select-touched',
			selectedCls:'select-selected',
			onInit:function(opt){
				opt.proxy=$$.getSington('dragProxy').html($$.is('ie6')?$$.ie6Mask:'');
			},
			onMove:function(e,opt){
				return $$.is('contain',[e.pageY,e.pageX],getClientSize.call(this));
			},
			onHold:function(e,opt){
				opt.da={mouse:{x:e.pageX,y:e.pageY}};
			},
			onStart:function(e,opt){
				opt.proxy.addClass(opt.proxyCls).css({'z-index':$$.zIndex+4,'cursor':opt.cursor});
				opt.delta=opt.delta||{width:opt.proxy.delta('width'),height:opt.proxy.delta('height')};
				var pos={top:opt.da.mouse.y,left:opt.da.mouse.x,bottom:opt.da.mouse.y,right:opt.da.mouse.x,delta:opt.delta};
				opt.proxy.setPos(pos,true);
				_fitProxy.call(opt.proxy,pos);
				opt.proxy.show();
				opt.da.container=getClientSize.call(this);
				opt.da.target=$(opt.target,this);
			},
			onDrag:function(e,opt){
				opt.proxy.setPos(pos=$$.fitPos($$.fixedPos({top:opt.da.mouse.y,left:opt.da.mouse.x,bottom:e.pageY,right:e.pageX,delta:opt.delta}),opt.da.container,true),true);
				_fitProxy.call(opt.proxy,pos);
				opt.da.target.each(function(){
					var $this=$(this);
					_testTouch.call($this,null,pos,e,opt.mode)?$this.addClass(opt.touchCls):$$.is('!emptyStr',opt.touchCls)?$this.removeClass(opt.touchCls):null;										
				});				
			},
			onEnd:function(e,opt){
				opt.da.target.each(function(){
					var $this=$(this);
					$this.hasClass(opt.selectedCls)&&opt.shiftKey&&!e.shiftKey&&$this.removeClass(opt.selectedCls);
					$this.hasClass(opt.touchCls)&&$this.removeClass(opt.touchCls).addClass(opt.selectedCls);
					$this.hasClass(opt.selectedCls)?$this.find(':checkbox').attr('checked',true):$this.find(':checkbox').attr('checked',false);																				
				});
				opt.proxy.hide().removeClass(opt.proxyCls).css('cursor','');
			}
		}
	};
	function _testTouch(pos,pos1,e,mode){
		var modes={
			enter:function(t,c,e){
				return $$.is('contain',[e.pageY,e.pageX],t);
			},
			fit:function(t,c){
				return $$.is('contain',t,c);
			},
			middle:function(t,c){
				return $$.is('contain',[t.top+(t.bottom-t.top)*.5,t.left+(t.right-t.left)*.5],c);
			},
			half:function(t,c){
				return modes.middle(t,c)&&((c.bottom-c.top)>=(t.bottom-t.top)/2)&&((c.right-c.left)>=(t.right-t.left)/2);
			},
			overlap:function(t,c){
				return !!Math.max(0,Math.min(c.bottom,t.bottom)-Math.max(c.top,t.top))
					*Math.max(0,Math.min(c.right,t.right)-Math.max(c.left,t.left));
			},
			intersect:function(t,c,e){
				return $$.is('contain',[e.pageY,e.pageX],t)||modes.overlap(t,c);
			}
		};
		return modes[mode](pos||this.getPos(),pos1||this.getPos(),e);
	};
	function _fitProxy(pos,delta){
		$$.is('ie6')&&this.find('>div').setSize(pos,'height',delta);
	};
	function getClientSize(){
		var offset=this.offset();
		return {top:offset.top,left:offset.left,bottom:offset.top+this[0].clientHeight,right:offset.left+this[0].clientWidth};
	};
	var dropManager=[];
	$$.plugin('droppable',{
		conf:{
			cls:'droppable',
			placeholderCls:'placeholder-drop',
			dropStartCls:'drop-start',
			dropTouchCls:'drop-touch',
			droppedCls:'dropped',
			accept:'',
			selector:'>*',
			mode:'middle',
			placeholder:false,
			adsorb:0
		},
		methods:{
			destroy:function(){
				var me=this;
				dropManager=$.grep(dropManager,function(n,i){return n[0]!=me[0];});
				!dropManager.length&&$$.$doc.off('.drag');
			}
		},
		create:function(opt){
			opt.placeholder&&(opt.placeholder=$$.getSington(opt.placeholderCls).addClass(opt.placeholderCls));
			if(!dropManager.length){
				$$.$doc.on('dragStart.drag dragging.drag dragEnd.drag',function(e){
					var init=false,opt1=arguments[2];
					for(var i=0,len=dropManager.length;i<len;i++){
						var dropper=dropManager[i],opt=dropper.data('droppable');
						switch(e.type){
							case 'dragStart':
							if(!(accept=$$.is('!emptyStr',opt.accept))||accept&&$(e.target).is(opt.accept)){
								opt.dropping=true;
								opt.pos=dropper.addClass(opt.dropStartCls).getPos();
								$$.is('!emptyStr',opt.droppedCls)&&dropper.removeClass(opt.droppedCls);
								if(!init&&opt.placeholder){
									opt.placeholder.setPos(opt1.da.pos,true,{width:opt.placeholder.delta('width'),height:opt.placeholder.delta('height')}).css('position','');
									init=true;
								}
								opt.target=$$.is('!emptyStr',opt.selector)?dropper.find(opt.selector):null;
								$.isFunction(opt.onStart)&&opt.onStart.apply(dropper,arguments);
							}else{
								opt.dropping=false;
							}
							break;
							case 'dragging':
							if(opt.dropping){
								var move=false,arg=arguments[1],dragPos=opt1.da.offset,touch=_testTouch(dragPos,opt.pos,arg,opt.mode);
								function _offset(pos){
									opt1.proxy&&(opt1.helper.box.is(':visible')?opt1.helper.box.offset(pos):$(e.target).offset(pos));
								};
								if(touch){
									if(!opt.isTouch){
										dropper.addClass(opt.dropTouchCls);
										opt.isTouch=true;
										opt.placeholder&&_offset(opt.placeholder.appendTo(dropper).show().offset());
										$.isFunction(opt.onOver)&&opt.onOver.apply(dropper,arguments);
									}
									if(opt.placeholder&&opt.target){
										var touch1=false;
										opt.target.each(function(){
											if(_testTouch.call($(this),null,dragPos,arg,opt.mode)){
												opt.placeholder.next()[0]!=this&&_offset(opt.placeholder.insertBefore(this).offset());
												return touch1=true;
											}
										});
										if(_testTouch.call(opt.placeholder,null,dragPos,arg,opt.mode)){return;}
										!touch1&&opt.placeholder.next().length&&_offset(opt.placeholder.appendTo(dropper).offset());
									}
								}else{
									if(opt.isTouch){
										$$.is('!emptyStr',opt.dropTouchCls)&&dropper.removeClass(opt.dropTouchCls);
										opt.isTouch=false;
										opt.placeholder&&(opt.placeholder.hide().appendTo('body'),_offset(opt1.da.pos));
										$.isFunction(opt.onOut)&&opt.onOut.apply(dropper,arguments);
									}
								}
							}
							break;
							case 'dragEnd':
							if(opt.dropping){
								opt.dropping=false;
								$$.is('!emptyStr',opt.dropStartCls)&&dropper.removeClass(opt.dropStartCls);
								if(opt.isTouch){
									dropper.addClass(opt.droppedCls);
									$$.is('!emptyStr',opt.dropTouchCls)&&dropper.removeClass(opt.dropTouchCls);
									if(opt.placeholder){
										if(opt1.helper.box&&opt1.da.target.length){
											for(var i=0,len=opt1.da.target.length;i<len;i++){
												opt1.da.target[i].t.removeAttr('style').insertBefore(opt.placeholder);
											}
										}else{
											$(e.target).insertBefore(opt.placeholder);
										}
										opt.placeholder.hide().appendTo('body');								
									}
									opt.isTouch=false;
									$.isFunction(opt.onDrop)&&opt.onDrop.apply(dropper,arguments);
								}
							}
							break;
						}
					}
				});
			}
			dropManager.push(this.data('droppable',opt));
		}		
	});
})(jQuery);
