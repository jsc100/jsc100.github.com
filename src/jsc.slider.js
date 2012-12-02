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
	$$.plugin('slider',{
		conf:{
			axis:'x',
			cls:'slider',
			trackCls:'slider-track',
			handleCls:'slider-handle',
			handleLeftCls:'left-bar',
			handleRightCls:'right-bar',
			handleCenterCls:'center-bar',
			handleHoverCls:'handle-hover',
			handlePressCls:'handle-press',
			scaleCls:'slider-scale',
			showScale:true,
			showSpinCls:'spin-show',
			showSpin:false,
			spinOpt:{},
			core:{
				min:0,
				max:10,
				step:1,
				value:0
			},
			dragStep:true,
			action:$$.fn
		},
		create:function(opt){
			opt.index=$$.index(opt.axis,$$.ARR.axis),opt.side=$$.ARR.side[opt.index],
			opt.wh=$$.ARR.wh[opt.index],opt.owh=$$.ARR.owh[opt.index];
			this.html($$.toHtml({cls:opt.trackCls+' '+opt.trackCls+'-'+opt.axis,sub:[{cls:opt.scaleCls,css:{'display':opt.showScale?'block':'none'}},
				{cls:opt.handleCls+' '+opt.handleCls+'-'+opt.axis,sub:[
					{node:'span',cls:opt.handleLeftCls},{node:'span',cls:opt.handleRightCls},{node:'span',cls:opt.handleCenterCls}]}
			]}));
			opt.track=this.children();
			opt.track.setPos($$.fitParent.call(opt.track,{wh:opt.wh}),opt.wh);
			opt.handle=opt.track.find('>.'+$$.str2Arr(opt.handleCls)[0]);
			opt.scale=opt.track.find('>.'+$$.str2Arr(opt.scaleCls)[0]);
			var total=opt.track[opt.owh]()-opt.handle[opt.owh](true),len=(opt.core.max-opt.core.min)/opt.core.step,
			ori=opt.track.offset()[opt.side];
			opt.step=Math.round(total/len);
			var spinOpt=$.extend({invert:true},opt.spinOpt,{cls:'',action:_update});
			spinOpt.core=opt.dragStep?opt.core:{min:0,max:total,step:1,value:opt.core.value*opt.step};
			this.spin(spinOpt);
			if(opt.showSpin){
				this.addClass(opt.showSpinCls);				
			}else{
				var arrow=this.spin('option','arrow');
				arrow.up.add(arrow.down).hide();
			}
			opt.handle.button({cls:'',toggleCls:[{cls:'',hover:opt.handleHoverCls,press:opt.handlePressCls}],mousedown:function(){return false;}})
			.draggable({
				type:'drag',axis:opt.axis,proxy:false,cursor:'',container:opt.track,trigger:true,step:opt.dragStep?opt.step:1
			}).on('jscMove.jsc',this,function(e){
				opt.showScale&&opt.scale.setPos(opt.scale.posBy({by:opt.handle,mode:'margin',side:opt.side,resize:true,container:null}),opt.wh);
				var offset=opt.handle.offset()[opt.side],value=Math.round((offset-ori)/opt.step);
				if(value!=opt.core.value){
					opt.core.value=value;
					opt.action.call(e.data,opt.core.value);					
				}
				opt.dragStep?value!=opt.core.value&&e.data.spin('option','core.value',value).spin('update'):e.data.spin('option','core.value',offset-ori).spin('update');
			});
			function _update(jsc){
				var offset=opt.handle.offset(),value=value1=0;
				if(!jsc){
					value=Math.round(opt.core.value*opt.step);
					value1=opt.core.value;
				}else{
					if(opt.dragStep){
						value=jsc.value*opt.step;
						value1=jsc.value;
					}else{
						value=jsc.value;
						value1=Math.round(jsc.value/opt.step);
					}
				}
				offset[opt.side]=ori+value;
				opt.handle.offset(offset);
				opt.showScale&&opt.scale.setPos(opt.scale.posBy({by:opt.handle,mode:'margin',side:opt.side,resize:true,container:null}),opt.wh);
				if(value1!=opt.core.value){
					opt.core.value=value1;
					opt.action.call(this,opt.core.value);
				}
				if(opt.end&&((jsc.param>0&&opt.end<=offset[opt.side])||(jsc.param<0&&opt.end>=offset[opt.side]))){
					opt.end=null;
					return false;
				}						
			};
			opt.track.button({cls:'',toggleCls:[{cls:'',hover:'',press:''}],cursor:'pointer',keep:false,context:this,mousedown:function(jsc){
				opt.end=jsc.event['page'+$$.ucFirst(opt.axis)];
				opt.dragStep&&(opt.end=Math.floor((opt.end-ori)/opt.step)*opt.step+ori);
				var dis=opt.end-opt.handle.offset()[opt.side];
				dis!=0&&this.spin('go',dis>0?'down':'up');
			},mouseup:function(){this.spin('end');opt.end=null;}});
			_update.call(this);
			this.addClass(opt.cls).data('slider',opt);
		}
	});
})(jQuery);
