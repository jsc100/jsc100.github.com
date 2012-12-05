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
	$$.plugin('spin',{
		conf:{
			cls:'spin',
			btnCls:'spin-btn',
			wrapperCls:'spin-box',
			up:{
				text:'',
				cls:'spin-up',
				hover:'spin-up-hover',
				press:'spin-up-press'
			},
			down:{
				text:'',
				cls:'spin-down',
				hover:'spin-down-hover',
				press:'spin-down-press'
			},
			wrap:true,
			event:'mousedown',
			keep:true,
			timer:{interval:150},
			context:null,
			invert:false,
			rotate:false,
			action:$$.fn,
			core:{
				min:0,
				max:100,
				step:1,
				value:0
			}
		},
		methods:{
			one:function(arg){
				_spinAction.call(this,{param:(arg=='up'?1:-1)*(this.spin('option','invert')?-1:1)});
				return this;
			},
			go:function(arg){
				var opt=this.data('spin');
				opt&&(opt.keep?opt.arrow[arg].trigger(opt.event+'.button'):this.spin('one',arg));
				return this;
			},
			end:function(){
				this.spin('option','btn').button('option',0,'timer').stop();
				return this;
			},
			update:_spinUpdate
		},
		create:function(opt){
			opt.context=$$.jq(opt.context)||this;
			var id='spinArrow',up=down=wrapper=null;
			function _sel(cls){return $('.'+$$.str2Arr(cls)[0],opt.context);};
			up=_sel(opt.up.cls);
			if(up.length){
				up.attr(id,'up');
				down=_sel(opt.down.cls).attr(id,'down');
				up.add(down).addClass(opt.btnCls);
			}else{
				up={node:'a',cls:opt.btnCls+' '+opt.up.cls,attr:{spinArrow:'up'},text:opt.up.text};
				down={node:'a',cls:opt.btnCls+' '+opt.down.cls,attr:{spinArrow:'down'},text:opt.down.text};
				opt.wrap&&(wrapper={node:'span',cls:opt.wrapperCls,sub:[up,down]});
				this.append($$.toHtml(wrapper||[up,down]));
				up=_sel(opt.up.cls);
				down=_sel(opt.down.cls);
			}
			opt.arrow={up:up,down:down};
			var btnOpt={
				cls:'',
				toolbarCls:'',
				selector:$$.is('!emptyStr',opt.btnCls)?'.'+$$.str2Arr(opt.btnCls)[0]:'.'+$$.str2Arr(opt.up.cls)[0]+',.'+$$.str2Arr(opt.down.cls)[0],
				id:id,
				context:this,
				timer:opt.timer,
				btnOpt:{
					up:{toggleCls:[$.extend({},opt.up,{cls:''})],param:opt.invert?-1:1},
					down:{toggleCls:[$.extend({},opt.down,{cls:''})],param:opt.invert?1:-1}
				}
			};
			opt.keep&&(btnOpt.keep=opt.event);
			btnOpt[opt.event]=_spinAction;
			opt.btn=(wrapper?up.parent():opt.context).button(btnOpt);
			_spinUpdate.call(this.addClass(opt.cls).data('spin',opt));
		}
	});
	function _spinAction(jsc){
		var opt=this.data('spin');
		if(!opt){
			return false;
		}
		opt.core.value+=jsc.param*opt.core.step;
		var res=_spinUpdate.call(this);
		jsc.plugin=this;
		jsc.value=opt.core.value;
		jsc.toggle=opt.toggle;
		opt.action.call(opt.context,jsc)===false&&(res=false);
		return res;
	};
	function _spinUpdate(){
		var opt=this.data('spin'),core=opt.core;
		opt.toggle=$$.between(core.value,[core.min,core.max],!opt.rotate);
		function _dis(a){
			opt.arrow[a||opt.disable].disable(!!a);
			opt.disable=a;
		};
		if(opt.toggle!=0){
			if(opt.rotate){
				core.value=core[opt.toggle==1?'min':'max'];
			}else{
				opt.disable&&_dis();
				core.value=core[opt.toggle==1?'max':'min'];
				_dis(opt.toggle*(opt.invert?-1:1)==1?'up':'down');
				return false;
			}
		}else if(!opt.rotate&&opt.disable){
			_dis();
		}
		return true;
	};
	$$.plugin('spinner',{
		conf:{
			cls:'spin spinner',
			readonly:true
		},
		methods:{
			val:function(val){
				var opt=this.data('spinner'),opt1=opt.plugin.data('spin'),core=opt1.core,jsc={plugin:opt.plugin,toggle:0};
				if(!isNaN(val=parseFloat(val))){
					if((res=$$.between(val,[core.min,core.max]))!=0){
						opt1.rotate?(val+=core.max*res*-1):(val=core[res==-1?'min':'max']);
						jsc.toggle=res;
					}
					jsc.value=core.value=val;
					opt.action.call(opt.plugin,jsc);
					opt.plugin.spin('update');
				}else{
					return core.value;
				}
			}
		},
		create:function(opt){
			if(this[0].nodeName.toLowerCase()=='input'&&this.attr('type')=='text'){
				this.wrap('<div></div>');
				opt.action=function(jsc){
					var input=this.find(':input');
					$.isFunction(opt.callback)&&opt.callback.call(input,jsc);
					input.val(jsc.value);
				};
				opt.plugin=this.parent().spin($.extend(true,{},opt,{wrap:true}));
				opt.plugin.width(this.outerWidth(true)-opt.plugin.delta('width',true));
				$$.is('ie6')&&this.width(0).next().width();
				this.fitParent({wh:'width',swh:'width'});
				var val=parseFloat(this.val()),core=opt.plugin.spin('option','core');
				isNaN(val)?this.val(core.value):(core.value=val,opt.plugin.spin('update'));
				opt.readonly?this.attr('readonly',true):this.change(function(){var $this=$(this);$this.spinner('val',$this.val());});
				this.data('spinner',opt);
			}
		}
	});
})(jQuery);
