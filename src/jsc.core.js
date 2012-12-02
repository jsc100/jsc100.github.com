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
	$.jsc=$$={
		version:1.0,
		uuid:1,
		zIndex:1000,
		$doc:$(document),
		ARR:{
			side:['top','left','bottom','right'],
			wh:['height','width'],
			owh:['outerHeight','outerWidth'],
			axis:['y','x'],
			rCur:['n','s','w','e'],
			rSide:['top','bottom','left','right'],
			lPanel:[['top','bottom','middle'],['left','right','center']],
			lRCur:['row','col']
		},
		index:function(el){return $.inArray(el,$.isArray(arguments[1])?arguments[1]:$$.ARR[arguments[1]||'side'])},
		oppo:function(side){return (idx=$$.index(side))>-1?$$.ARR.side[(idx+2)%4]:null;},
		getWH:function(side){return (idx=$$.index(side))>-1?$$.ARR.wh[idx%2]:null;},
		ie6Mask:'<div class="mask-div"></div><iframe class="mask-iframe" src="javascript:false;"></iframe>',
		fn:function(){},
		parseInt:function(num){return isNaN(num=parseInt(num))?0:num;},
		parseDate:function(str,pattern){
			var dt=new Date(),rf=/(\w{4})|(\w{2})|(\w{1})/g,rd=/(\d{4})|(\d{2})|(\d{1})/g,fmts=pattern.match(rf),dts=str.match(rd);
			if(fmts&&dts&&fmts.length==dts.length){
				for(var i=0,len=fmts.length;i<len;i++){
					switch(fmts[i]){
						case 'yy':
						case 'yyyy':
						dt.setFullYear(parseInt(dts[i].length==2?(dt.getFullYear()+'').subStr(0,2)+dts[i]:dts[i]));
						break;
						case 'MM':
						case 'M':
						dt.setMonth(parseInt(dts[i])-1);
						break;
						case 'dd':
						case 'd':
						dt.setDate(parseInt(dts[i]));
						break;
						case 'HH':
						case 'H':
						dt.setHours(parseInt(dts[i]));
						break;
						case 'mm':
						case 'm':
						dt.setMinutes(parseInt(dts[i]));
						break;
						case 'ss':
						case 's':
						dt.setSeconds(parseInt(dts[i]));
					}
				}
			}
			return dt;			
		},
		jq:function(obj){return obj?obj.jquery?obj:(obj==window||obj.nodeName||typeof obj=='string')&&($obj=$(obj,arguments[1])).length?$obj:null:null;},
		str2Arr:function(str){return $$.is('str',str)?str.split(arguments[1]||/,| |\|/):str;},
		ucFirst:function(str){return str.replace(/\b\w+\b/g,function(w){return w.substring(0,1).toUpperCase()+w.substring(1);});},
		obj2Arr:function(obj){
			if($.isArray(obj)){return obj;}
			for(var res=[],i=0,arr=$$.str2Arr(arguments[1])||$$.ARR.side,len=arr.length;i<len;i++){
				res[i]=obj[arr[i]];
			}
			return res;
		},
		arr2Obj:function(arr){
			if(!$.isArray(arr)){return arr};
			for(var res={},i=0,prop=$$.str2Arr(arguments[1])||['node','cls','sub','text','css','attr'],len=prop.length;i<len;i++){
				res[prop[i]]=arr[i];
			}
			return res;
		},
		format:function(str,rep){
			rep=$$.str2Arr(rep);
			return str.replace(/{(\w+)}/g,function(){return rep[arguments[1]];});
		},
		each:function(arr,val,cbk){
			if(!$.isArray(arr)){
				$.isFunction(arr)?(cbk=arr,val=null):(cbk=val,val=arr);
				arr=$$.ARR.wh;
			}else if($.isFunction(val)){
				cbk=val;
				val=null;
			}
			for(var b=(idx=$$.index(val,arr))>-1,i=(b?idx:0),len=(b?idx+1:arr.length);i<len;i++){
				if(cbk(i,arr[i])===false){return false;}
			}
		},
		between:function(t,c,eq){
			var t0=t1=t[0]!=undefined?t[0]:t,c0=c1=c[0];
			t[1]!=undefined&&(t[1]<t0?t0=t[1]:t1=t[1]);
			c[1]<c[0]?c0=c[1]:c1=c[1];
			return (eq?t0<=c0:t0<c0)?-1:(eq?t1>=c1:t1>c1)?1:0;				
		},
		is:function(t){
			switch(t){
				case 'ie':return $.browser.msie;
				case 'ie6':return $.browser.msie&&$.browser.version == "6.0";
				case 'str':return arguments[1]!=undefined&&typeof arguments[1]=='string';
				case '!emptyStr':return $$.is('str',arguments[1])&&$.trim(arguments[1])!=='';
				case 'tl':return (idx=$$.index(arguments[1]))>-1&&idx<2;
				case 'contain':
				var res=true,t=$$.obj2Arr(arguments[1]),c=$$.obj2Arr(arguments[2]),wh,cbk;
				$.isFunction(arguments[3])?(cbk=arguments[3],wh=null):(wh=arguments[3],cbk=arguments[4]);
				$$.each(wh,function(i,n){
					var val=$$.between(t[i+2]!=undefined?[t[i],t[i+2]]:t[i],[c[i],c[i+2]]);
					if(val!=0){
						$.isFunction(cbk)&&cbk($$.ARR.side[val==-1?i:i+2]);
						res=false;
					}
				});
				return res;
			}
		},
		toHtml:function(obj){
			var str='',arr=['attr','css'],arg=arguments;
			if(!obj){return str;}
			function _(o){
				str+='<'+(o.node||'div')+(o.cls?' class="'+o.cls+'"':'');
				for(j=0;j<2;j++){
					if(o[arr[j]]){
						var a=j?'':' ',b=j?':':'="',c=j?';':'"';
						str+=j?' style="':' ';
						for(var p in o[arr[j]]){
							str+=a+p+b+o[arr[j]][p]+c;
						}
						str+=j?'"':'';
					}					
				}
				str+='>'+(o.sub?arg.callee(o.sub):(o.text||''))+'</'+(o.node||'div')+'>';				
			}
			if($.isArray(obj)){
				for(var i=0,len=obj.length;i<len;i++){
					_(obj[i]);
				}				
			}else{
				_(obj);
			}
			return str;
		},
		getPos:function(obj){return ($obj=obj&&obj.jquery?obj:$$.jq(obj))&&$obj.length?$obj.getPos():$.isFunction(obj)?obj():obj;},
		getSize:function(wh,pos,delta){
			var arr=$$.ARR,isNum=$.isNumeric(wh),idx=isNum?wh:$$.index(wh,arr.wh),wh=isNum?arr.wh[wh]:wh,
			size=pos?pos[arr.side[idx+2]]-pos[arr.side[idx]]-(delta?delta[wh]:pos.delta[wh]):this[wh]();
			return size<0?0:size;
		},
		fixedPos:function(pos){
			$$.each(arguments[1],function(i,n){
				var side=$$.ARR.side[i],oppo=$$.ARR.side[i+2];
				if(pos[side]>pos[oppo]){
					var temp=pos[side];
					pos[side]=pos[oppo];
					pos[oppo]=temp;
				}
			});
			return pos;
		},
		pos2:function(pos,side,val,resize){
			var res={delta:{width:pos.delta.width,height:pos.delta.height}},arr=$$.ARR.side;
			for(var i=0;i<4;i++){
				res[arr[i]]=side==arr[i]?val:pos[arr[i]];
			}
			!resize&&(res[$$.oppo(side)]+=val-pos[side]);
			return res;
		},
		offset:function(pos,point){
			var res=pos,arr=$$.ARR.side;
			for(var i=0;i<2;i++){
				var side=arr[i],val=point[side]||point[i];
				val&&(res=$$.pos2(res,side,res[side]+val));
			}
			return res;
		},
		fitPos:function(pos,c,wh,resize){
			typeof wh=='boolean'&&(resize=wh,wh=null);
			var res=pos;
			$$.is('contain',pos,c,wh,function(side){
				res=$$.pos2(res,side,c[side],resize);
			});
			return res;
		},
		fitParent:function(opt){
			opt=opt||{};
			var me=this,arr=$$.ARR,parent=opt.parent||me[0].nodeName.toLowerCase()=='body'?$(window):me.parent(),
			pos=opt.pos||this.getPos();
			$$.each(opt.wh,function(i,n){
				var side=arr.side[i],oppo=arr.side[i+2],owh=arr.owh[i],size=$$.getSize.call($$.jq(parent),n,opt.parent);
				if(opt.swh==n){
					for(var i=0,sib=opt.siblings||me.siblings(':visible'+($$.vml?':not('+$$.vml.option('boxNode')+')':'')),len=sib.length;i<len;i++){
						me.index(sib[i])==-1&&(size-=$$.jq(sib[i])[owh](true));
					}
				}
				pos=$$.pos2(pos,oppo,pos[side]+size-me.margin(side)-me.margin(oppo),true);
			});
			return pos;
		},
		toggle:function(oper,param,trigger){
			!$$.is('str',oper)&&(trigger=param,param=oper,oper=null);
			var isVisible=this.is(':visible');
			oper=oper||(isVisible?'close':'open');
			if(param&&$.isFunction(param.before)&&param.before.call(this)===false){return false;}
			if(param&&param.effect&&param.effect!='default'){
				//todo
			}else{
				this[oper=='open'?'show':'hide']();
				param&&$.isFunction(param.after)&&param.after.call(this);
				trigger&&this.triggerHandler('jsc'+$$.ucFirst(oper)+'.jsc');
			}
			return true;
		},
		getSington:function(id){return (obj=$('#'+id)).length?obj:$($$.toHtml({attr:id?{id:id}:{},css:{position:'absolute'}})).hide().appendTo('body');},
		_option:function(opt,prop,val){
			if(prop==undefined){return opt;}
			$$.is('!emptyStr',prop)&&(prop=$$.str2Arr(prop,'.'));
			if(prop.length>1){
				return arguments.callee.call(this,opt[prop[0]],prop.slice(1),val);
			}
			if(val!==undefined){
				opt[prop[0]]=val;
				return this;
			}else{
				return opt[prop[0]];
			}			
		},
		timer:function(conf){
			return new function(){
				var id={timeout:null,interval:null},opt=$.extend({timeout:-1,interval:0,acceleration:null,autoStart:false,context:null,param:null,action:$$.fn},conf);
				this.isRun=function(){return !!id.timeout||!!id.interval;};
				this.option=function(prop,val){return $$._option.call(this,opt,prop,val);};
				this.start=function(){
					var me=this.stop();
					opt.timeout>-1&&(id.timeout=setTimeout(function(){opt.action.call(opt.context,opt.param)===false&&me.stop();},opt.timeout));
					opt.interval>0&&(id.interval=setInterval(function(){opt.action.call(opt.context,opt.param)===false&&me.stop();},opt.interval));
					return this;
				};
				this.stop=function(){
					id.timeout&&(clearTimeout(id.timeout),id.timeout=null);
					id.interval&&(clearInterval(id.interval),id.interval=null);
					return this;					
				};
				opt.autoStart&&this.start();
			}
		},
		plugin:function(name,plugin){
			$.fn[name]=function(conf){
				if(!this.length){return this;}
				plugin.methods=plugin.methods||{};
				plugin.methods.option=plugin.methods.option||function(prop,val){
					return $$._option.call(this,this.data(name),prop,val);
				};
				var destroy=plugin.methods.destroy||$$.fn;
				plugin.methods.destroy=function(){
					this.each(function(){
						var $this=$(this),sign=$this.attr('jscplugin'),opt=$this.data(name);
						destroy.call($this);
						if(opt){
							opt.timer&&opt.timer.stop&&opt.timer.stop();
							$this.off('.'+name);
							$this.removeData(name);
						}
						sign=sign.replace(name,'');
						$this.attr('jscplugin',$.trim(sign));
					});
				};
				if($$.is('!emptyStr',conf)){
					return (method=plugin.methods[conf])?method.apply(this,Array.prototype.slice.call(arguments,1)):this;
				}
				if(opt=this.data(name)){
					if(plugin.exist!==undefined){
						if(plugin.exist===false){
							return this;
						}
					}else{
						return this.data(name,$.extend(true,{},opt,conf));
					}
				}
				this.attr('jscplugin',(this.attr('jscplugin')||'')+' '+name);
				return this.each(function(){plugin.create.call($(this),$.extend(true,{},plugin.conf,conf));});
			}
		}
	};
	$.each(['margin','padding','border'],function(i,n){
		$.fn[n]=function(side,style){
			var res={},me=this;
			function _get(type,side,style){
				function _css(arr){res[css=arr.join('-')]=me.css(css);};
				if(type=='border'){
					if(style){
						_css([type,side,style]);
					}else{
						for(var i=0,arr=['style','width','color'],len=arr.length;i<len;i++){
							_css([type,side,arr[i]]);
						}
					}
				}else{
					_css([type,side]);
				}
			};
			try{
				var arr=$$.ARR.side;
				if($.inArray(side,arr)>-1){
					_get(n,side,style);
				}else{
					for(var i=0,len=arr.length;i<len;i++){
						_get(n,arr[i],side);
					}
				}
				return (n!=='border'&&side||n=='border'&&style=='width')?$$.parseInt(res[(style?[n,side,style]:[n,side]).join('-')]):res;				
			}catch(e){
				return 0;
			}
		}
	});
	$.fn.extend({
		delta:function(wh){return this[$$.ARR.owh[$$.index(wh,$$.ARR.wh)]](arguments[1])-this[wh]();},
		getPos:function(){
			var arr=$$.ARR,pos=this.offset();
			pos.delta={};
			for(var i=0;i<2;i++){
				var side=arr.side[i],oppo=arr.side[i+2],wh=arr.wh[i],owh=arr.owh[i],outer=this[owh]();
				pos[oppo]=pos[side]+outer;
				pos.delta[wh]=outer-this[wh]();
			}
			return pos;
		},
		setSize:function(pos,wh,delta){
			var me=this,ie6=$$.is('ie6'),ovfl;
			ie6&&(ovfl=this.css('overflow'))!='hidden'&&this.css('overflow','hidden');
			$$.each(wh,function(i,n){
				delta&&delta[n]===true&&(delta[n]=me.delta(n));
				me[n]($$.getSize(n,pos,delta));
			});
			ie6&&ovfl!='hidden'&&setTimeout(function(){me.css('overflow',ovfl);},0);
			return this;
		},
		setPos:function(pos,resize,delta){
			resize&&this.setSize(pos,resize,delta);
			return this.offset(pos);
		},
		fitParent:function(opt){
			opt=opt||{};
			var pos=$$.fitParent.call(this,opt);
			this.setSize(pos,opt.wh);
			opt.trigger&&this.triggerHandler('jscResize.jsc',pos);
			return this;
		},
		posBy:function(opt){
			opt.pos=opt.pos||this.getPos();
			var opt1=$.extend({
				mode:'padding',//'margin',
				side:'top',
				margin:[0,0],
				offset:0,
				center:false,
				resize:false,
				container:null,
				adjustMode:''//'changeSide,offset,resize,none'
			},opt);
			function _(s,o){
				var mySide=isMg?o:s,sign=$$.is('tl',mySide)?1:-1,val=(tpos[s]!==undefined)?tpos[s]:tpos;
				if(opt.center&&!isMg){
					opt1.offset=Math.round((Math.abs((tpos[s]||0)-(tpos[o]||0))-Math.abs(opt1.pos[s]-opt1.pos[o]))/2)*sign;
				}else{
					isMg&&(val+=(opt1.margin[0]===true&&t?t.margin(s):opt1.margin[0]||0)*($$.is('tl',s)?-1:1));
					val+=(opt1.margin[1]===true?me.margin(mySide):opt1.margin[1]||0)*sign;
				}
				return $$.pos2(opt1.pos,mySide,val+opt1.offset,opt1.resize);
			};
			var me=this,arr=$$.ARR,idx=$$.index(opt1.side),wh=arr.wh[idx%2],oppo=arr.side[(idx+2)%4],
			t=$$.jq(opt1.by),tpos=$$.getPos(t||opt1.by),isMg=opt1.mode=='margin',pos=_(opt1.side,oppo);			
			if($$.is('!emptyStr',opt1.adjustMode)){
				var cpos=$$.getPos(opt1.container),side;
				if(cpos&&!$$.is('contain',pos,cpos,wh,function(s){side=s;})){
					for(var i=0,mode=$$.str2Arr(opt1.adjustMode),len=mode.length;i<len;i++){
						switch(mode[i]){
							case 'changeSide':
								opt1.offset=-opt1.offset;
								var pos1=_(oppo,opt1.side);
								if($$.is('contain',pos1,cpos,wh)){return opt.pos=pos1;}
							break;
							case 'offset':
							case 'resize':
								return opt.pos=$$.pos2(pos,side,cpos[side],mode[i]=='resize');
							case 'none':
								return opt.pos;
						}
					}
				}
			}
			return opt.pos=pos;
		},
		restrain:function(act){
			var b=arguments[1]!==false,fn=function(){return !b;},map={drag:'ondragstart',select:'onselectstart',contextMenu:'oncontextmenu'};
			for(var i=0,len=(act=$$.str2Arr(act)).length;i<len;i++){
				this.each(function(){
					this[map[act[i]]]=fn;
					act[i]=='select'&&(this.style.MozUserSelect=b?'none':'');
				});				
			}
			return this;
		},
		disable:function(){
			var b=arguments[0]!==false,input=this.is(':input')?this:this.find(':input');
			input[b?'attr':'removeAttr']('disabled','disabled');
			return this.restrain('drag,select,contextMenu',b)[b?'addClass':'removeClass']('disabled').css('cursor',b?'no-drop':'');
		},
		isDisabled:function(){return this.hasClass('disabled')||!!this.parents('.disabled').length;}
	});
	$.extend($.expr[':'],{
		css:function(el,i,m){
			var res=false,css=m[3].split(','),style=el.currentStyle||getComputedStyle(el);
			function _toProp(prop){return prop.replace(/-([a-z])/g,function(){return arguments[1].toUpperCase();});};
			for(var i=0,len=css.length;i<len;i++){
				var res1=true,styles=$.trim(css[i]).split(' ');
				for(var j=0,len1=styles.length;j<len1;j++){
					var property=$.trim(styles[j]).split('='),prop=$.trim(property[0]),val=$.trim(property[1]),hasVal=$$.is('!emptyStr',val),end=val1=null;
					if(hasVal){
						var len2=prop.length-1,end=prop.substring(len2);
						/\^|\$|\*|\!/.test(end)&&(prop=prop.substring(0,len2));						
					}
					val1=style[prop];
					if(!(res1=val1!==undefined&&val1!=='')){
						val1=style[_toProp(prop)];
						res1=val1!==undefined&&val1!=='';							
					}
					if(res1&&hasVal){
						var match=(val1+'').match(val);
						res1=end=='^'?match&&match.index==0:end=='$'?match&&match.index==val1.length-val.length:
						end=='*'?match:end=='!'?val1!=val:val1==val;						
					}
					if(!res1){break;}
				}
				res1&&(res=true);
			}
			return res;
		}
	});
	$.swap=function(elem,opt,cbk){
		var old={},el=elem.jquery?elem[0]:elem;
		opt.visibility=='hidden'&&(!el.style||el.style.display!='none')&&(el=(elem.jquery?elem:$(el)).parents(':css(display=none)')[0]||el);
		for(var name in opt){
			old[name]=el.style[name];
			el.style[name]=opt[name];
		}
		var res=cbk.call(elem);
		for(name in opt){
			el.style[name]=old[name];
		}
		return res;
	};
	var _is=$.fn.is,_offset=$.fn.offset;
	$.fn.is=function(){
		var caller=arguments.callee.caller;
		return caller==$.event.dispatch?$(arguments[0],caller.arguments[0].delegateTarget||caller.arguments[0].currentTarget).index(this)>-1:_is.apply(this,arguments);
	};
	$.fn.offset=function(){
		if(arguments[0]){
			$$.pos=arguments[0];
		}
		return this[0]==window?{top:$$.$doc.scrollTop(),left:$$.$doc.scrollLeft()}:!this.is(':visible')&&!arguments[0]?
		$.swap(this,{visibility:'hidden',display:'block'},_offset):_offset.apply(this,arguments);
	};
	Date.prototype.format=function(pattern){
		var str=pattern,dt={'M+':this.getMonth()+1,'d+':this.getDate(),'H+':this.getHours(),'m+':this.getMinutes(),'s+':this.getSeconds()};
		if(/(y+)/.test(pattern)){
			var year=this.getFullYear()+'';  
			str=str.replace(RegExp.$1,RegExp.$1.length=4?year:year.substr(4-RegExp.$1.length));
		}  
		for(var i in dt){
			if(new RegExp('('+i+')').test(pattern)){
				str=str.replace(RegExp.$1,RegExp.$1.length==1?dt[i]:('0'+dt[i]).substr((''+dt[i]).length-1));
			}
		}
		return str;			
	};		
	if($$.is('ie6')){try{document.execCommand("BackgroundImageCache", false, true);}catch(e){}};
})(jQuery);
