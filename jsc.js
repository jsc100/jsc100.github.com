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
				if($$.is('!emptyStr',conf)){
					var methods=plugin.methods||{};
					if(conf==='option'){
						var method=methods.option||$$._option;
						Array.prototype.splice.call(arguments,0,1,this.data(name));
						return method.apply(this,arguments);
					}else if(conf==='destroy'){
						return this.each(function(){
							var $this=$(this),sign=$this.attr('jscplugin'),opt=$this.data(name);
							methods.destroy&&methods.destroy.call($this);
							if(opt){
								opt.timer&&opt.timer.stop&&opt.timer.stop();
								$this.off('.'+name);
								$this.removeData(name);
							}
							sign=sign.replace(name,'');
							$this.attr('jscplugin',$.trim(sign));							
						});
					}else{
						return (method=plugin.methods[conf])?method.apply(this,Array.prototype.slice.call(arguments,1)):this;						
					}
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
				this.attr('jscplugin',name+' '+(this.attr('jscplugin')||''));
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
	var jscVML={
		ns:'jsc',
		boxNode:'jscvml',
		shadowInner:true,
		ie6PngFixCls:'pngfix',
		ie6PngFix:true
	};
	var VML={
		sideArr:['Top','Right','Bottom','Left'],
		shapeArr:['shadow','bgColor','bgImage','border'],
		styleSheet:null,
		rules:[],
		events:{
			move:function(){
				VML.offset.call(event.srcElement);
			},
			resize:function(){
				var me=event.srcElement;
				if(me.vml){
					me.vml.update.radii=true;
					VML.draw.call(me);
				}				
			},
			propertychange:function(){
				var t=event.srcElement;
				switch(event.propertyName){
					case 'className':
						VML.calc.call(t);
						VML.draw.call(t);
						VML.fill.call(t);
						break;
					case 'style.display':
						t.vml.box.runtimeStyle.display=t.style.display;
						break;
					case 'style.zIndex':
						VML.zIndex.call(t);
						break;
				}			
			}			
		},
		str2Arr:function(str){
			if($$.is('str',str)){
				str=str.replace(/[^0-9 ]/g, '').split(' ');
				for(var i=0;i<4;i++){
					str[i]=(!str[i]&&str[i]!==0)?str[Math.max((i-2),0)]:str[i];
				}
			}
			return str;
		},
		isZero:function(arr){
			if($.isArray(arr)){
				for(var i=0,len=arr.length;i<len;i++){
					if(arr[i]){
						return false;
					}
				}
			}
			return true;
		},
		create:function(radii){
			this.setAttribute(jscVML.boxNode,true);
			this.vml={radii:null,box:null,shapes:{},fills:{},update:{}};
			var parent=this.parentNode,style=this.currentStyle,box=document.createElement(jscVML.boxNode),bs=box.runtimeStyle;
			(function(){
				for(var i=0,len=arguments.length;i<len;i++){
					var el=arguments[i];
					el.style.zoom=1;
					el.currentStyle.position=='static'&&(el.style.position='relative');
				}
			})(this,parent);
			this.vml.box=box;
			bs.cssText='behavior:none; margin:0; padding:0; border:0; background:none;display:none;';
			bs.position=!$$.is('ie6')&&style.position=='fixed'?'fixed':'absolute';
			VML.calc.call(this,radii);
			VML.draw.call(this);
			VML.fill.call(this);
			parent.insertBefore(box,this);
			bs.display=style.display!='none'?'block':'none';
			VML.offset.call(this);
			VML.zIndex.call(this);
			for(var e in VML.events){
				this.attachEvent('on'+e,VML.events[e]);
			}
			$(this).on('destroy.jsc',function(){
				$(this).off('destroy.jsc');
				$$.vml.destroyVML.call(this);
			});
		},
		calc:function(radii){
			this.runtimeStyle.cssText='';
			var style=this.currentStyle,vml=this.vml,upd=vml.update;
			var method={
				shadow:function(){
					if(sStr=style['box-shadow']){
						var shadow={},props=['offX','offY','blur','spread'],
							rgba=/\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+|\d*\.\d+)\s*\)\s*/,
							arr=sStr.split(' '),
							m=sStr.match(rgba);
						for(var i=0;i<4;i++){
							shadow[props[i]]=$$.parseInt(arr[i]);
						}
						shadow.color=m?'rgb('+m[1]+','+m[2]+','+m[3]+')':arr[4];
						shadow.alpha=m?parseFloat(m[4]):1;
						if(vml.shadow){
							if($.param(shadow)!=$.param(vml.shadow)){
								upd.shadow=vml.shadow.color!=shadow.color?'fill':true;
								vml.shadow=shadow;
							}else{
								upd.shadow=false;
							}
						}else{
							upd.shadow=true;
							vml.shadow=shadow;
						}
					}else if(vml.shadow){
						vml.shadow=null;
					}
				},
				bgColor:function(){
					if(bgColor=style.backgroundColor=='transparent'?null:style.backgroundColor){
						upd.bgColor=!vml.bgColor?true:bgColor!=vml.bgColor?'fill':false;
						vml.bgColor=bgColor;
					}else if(vml.bgColor){
						vml.bgColor=null;
					}
				},
				bgImage:function(){
					var bgImage={};
					if(this.nodeName.toLowerCase()=='img'){
						bgImage.url=this.src;
						bgImage.isImg=true;
					}else if((bgi=style.backgroundImage)&&bgi!='none'){
						bgImage.url=/\"(.+)\"/.exec(bgi)[1];
						bgImage.pos={x:style.backgroundPositionX,y:style.backgroundPositionY};
						bgImage.repeat=style.backgroundRepeat;
					}
					if(bgImage.url){
						if(!vml.bgImage){
							upd.bgImage=true;
						}else{
							var upd1=bgImage.url!=vml.bgImage.url?'fill':false;
							($.param(bgImage.pos)!=$.param(vml.bgImage.pos)||bgImage.repeat!=vml.bgImage.repeat)&&(upd1=upd1?true:'clip');
							upd.bgImage=upd1;
						}
						vml.bgImage=bgImage;
					}else if(vml.bgImage){
						vml.bgImage=null;
					}
				},
				border:function(){
					var border={widthArr:[0,0,0,0],style:null,color:null,filter:null};
					for(var i=0;i<4;i++){
						if((s=style['border'+VML.sideArr[i]+'Style'])!='none'){
							border.widthArr[i]=$$.parseInt(style['border'+VML.sideArr[i]+'Width']);
							border.color=style['border'+VML.sideArr[i]+'Color'];
							border.style=s;
						}
					}
					if($$.is('ie6')&&style.filter){
						if(style.filter.match('chroma')){
							border.filter=/=(.+)\)/.exec(style.filter)[1];
							this.runtimeStyle.filter=this.className.indexOf('disabled')>-1?'alpha(opacity=40) gray':'';
						}
					}
					if(vml.border){
						if($.param(border)!=$.param(vml.border)){
							var upd1=vml.border.color!=border.color?'fill':false;
							$.param(border.widthArr)!=$.param(vml.border.widthArr)&&(upd1=upd1?true:'draw');
							upd.border=upd1;
						}else{
							upd.border=false;
						}
					}else{
						upd.border=true;
					}
					vml.border=border;
				}
			};
			for(var i=0;i<4;i++){
				var type=VML.shapeArr[i];
				method[type].call(this);
			}
			if(radii){
				radii=VML.str2Arr(radii);
			}else{
				radii=$$.vml.getRadii.call(this);
			}
			if(radii){
				vml.radii=radii;
				upd.radii=!(vml.radii&&$.param(radii)==$.param(vml.radii));
			}else if(vml.radii){
				vml.radii=[0,0,0,0];
				upd.radii=true;
			}
		},
		clipImage:function(w1,h1){
			var vml=this.vml,fill=vml.fills.bgImage,bgi=vml.bgImage,t=this.offsetTop,l=this.offsetLeft,bg={x:0,y:0};
			if(!bgi.width||!bgi.height){
				var me=this,arg=arguments,img=new Image();
				img.onload=function(){
					img.onload=null;
					bgi.width=img.width;
					bgi.height=img.height;
					arg.callee.apply(me,arg);
				};
				img.src=bgi.url;
				return;
			}
			if(!w1){
				var $this=$(this);
				w1=$this.innerWidth();
				h1=$this.innerHeight();
			}
			if(bgi){
				for(var i=0;i<2;i++){
					var axis=i?'y':'x';
					if(bgi.isImg){
						bg[axis]=parseInt(style['padding'+VML.sideArr[(i+3)%4]],10)+1;
					}else{
						var side=bgi.pos[axis],fraction=true;
						if($.inArray(side,$$.ARR.side)>-1){
							bg[axis]=$$.is('tl',side)?0:1;
						}else if(side=='center'){
							bg[axis]=0.5;
						}else{
							side.match('%')?bg[axis]=parseInt(side,10)/100:fraction=false;
						}
						bg[axis]=Math.ceil(fraction?((i?h1:w1)*bg[axis]-bgi[i?'height':'width']*bg[axis]):parseInt(side,10))+1;
					}
				}
				fill.position=(bg.x/(w1+1))+','+(bg.y/(h1+1));
				var repeat=vml.bgImage.repeat,c={t:1,r:w1+1,b:h1+1,l:1};
				if(repeat!='repeat'){
					c={t:bg.y,r:bg.x+bgi.width,b:bg.y+bgi.height,l:bg.x};
					if(repeat&&repeat.match('repeat-')){
						var axis=$$.str2Arr(repeat,'-')[1];
						c[axis=='x'?'l':'t']=1;
						c[axis=='x'?'r':'b']=(axis=='x'?w1:h1)+1;
					}
					c.b>h1&&(c.b=h1+1);
				}
				vml.shapes.bgImage.style.clip='rect('+c.t+'px '+c.r+'px '+c.b+'px '+c.l+'px)';
			}				
		},
		draw:function(){
			var style=this.currentStyle,vml=this.vml;
			function _path(l,t,w,h,b,r,m,d){
				var cmd=d?['m', 'qy', 'l', 'qx', 'l', 'qy', 'l', 'qx', 'l'] : ['qx', 'l', 'qy', 'l', 'qx', 'l', 'qy', 'l', 'm'];
				for(var i=0;i<4;i++){
					arguments[i]=(arguments[i]+(i<2?-1:2)*b)*m;
				}
				var bm=b*m,f=Math.floor,c=Math.ceil,R=[];
				for(var i=0;i<4;i++){
					R[i]=Math.min(w/2,h/2,r[i]*m);
				}
				var coords=[
					cmd[0]+f(l)+','+f(R[0]+t+(R[0]?bm:b)),
					cmd[1]+f(R[0]+l+(R[0]?bm:b))+','+f(t),
					cmd[2]+c(w-R[1]+l-(R[1]?bm:b))+','+f(t),
					cmd[3]+c(w+l)+','+f(R[1]+t+(R[1]?bm:b)),
					cmd[4]+c(w+l)+','+c(h-R[2]+t-(R[2]?bm:b)),
					cmd[5]+c(w-R[2]+l-(R[2]?bm:b))+','+c(h+t),
					cmd[6]+f(R[3]+l+(R[3]?bm:b))+','+c(h+t),
					cmd[7]+f(l)+','+c(h-R[3]+t-(R[3]?bm:b)),
					cmd[8]+f(l)+','+f(R[0]+t+(R[0]?bm:b))
				];
				!d&&coords.reverse();
				return coords.join('');
			};
			var shapes=vml.shapes,$this=$(this),w=$this.outerWidth(),h=$this.outerHeight(),
			b=vml.border.widthArr,w1=w-b[3]-b[1],h1=h-b[0]-b[2],radii=vml.radii,rad=[];
			for(var i=0;i<4;i++){
				rad[i]=Math.max(radii[i]-Math.max(b[(i+3)%4],b[i]),0);
			}
			function getPath(type){
				switch(type){
					case 'shadow':
					var sd=vml.shadow;
					return _path(0,0,w,h,sd.spread+(sd.blur?sd.blur+1:0),VML.isZero(radii)?[2,2,2,2]:radii,2,true)+
					(jscVML.shadowInner?_path(b[3]-sd.offX,b[0]-sd.offY,w1,h1,0,rad,2):'');
					case 'bgColor':
					return _path(b[3],b[0],w1,h1,0,rad,2);
					case 'bgImage':
					return _path(b[3],b[0],w1+1,h1+1,0,rad,1,true);
					case 'border':
					return _path(0,0,w,h,0,radii,2,true)+_path(b[3],b[0],w1,h1,0,rad,2);
				}
			}
			function _createShape(type){
				var shapes=vml.shapes;
				if(!shapes[type]){
					var shape=document.createElement(jscVML.ns+':shape'),fill=document.createElement(jscVML.ns+':fill');
					shape.appendChild(fill);
					shape.jscRule=type;
					shape.stroked=false;
					shape.filled=true;
					shape.coordorigin='1,1';
					shape.style.top=0;
					shape.style.left=0;
					var index=$.inArray(type,VML.shapeArr);
					vml.box.insertBefore(shape,vml.box.children[index]||null);
					shapes[type]=shape;
					vml.fills[type]=fill;
				}
			};
			function _removeShape(type){
				if(shapes[type]){
					vml.box.removeChild(shapes[type]);
					shapes[type]=null;
					fills[type]=null;					
				}
			};
			for(var i=0;i<4;i++){
				var type=VML.shapeArr[i];
				vml[type]&&(type!='border'||!VML.isZero(vml.border.widthArr))?_createShape(type):_removeShape(type);
				if(shape=vml.shapes[type]){
					var upd=vml.update,ss=shape.style;
					if(upd.radii||upd[type]===true||upd[type]==='draw'){
						shape.path=getPath(type);
						ss.width=w;
						ss.height=h;
						shape.coordsize=i==2?(w+','+h):(w*2+','+h*2);
						i==2&&VML.clipImage.call(this,w1,h1);
						if(i==0){
							var sd=vml.shadow;
							ss.left=sd.offX;
							ss.top=sd.offY;
							var fill=vml.fills.shadow;
							if(sd.blur){
								var bl=sd.blur+2/sd.alpha,sp=sd.spread,
								width=(bl+sp)*2+w,height=(bl+sp)*2+h,fx=(bl*2)/width,fy=(bl*2)/height;
								fill.focusposition=fx+','+fy;
								fill.focussize=(1-fx*2)+','+(1-fy*2);
								if(sd.alpha<0.2&&(w<30||h<30)){
									fill.focusposition='0.2,0.2';
									fill.focussize='0.001,0.001';
								}
							}							
						}						
					}else if(i==2&&upd[type]=='clip'){
						VML.clipImage.call(this,w1,h1);
					}
				}
			}
		},
		fill:function(){
			var style=this.currentStyle,vml=this.vml,upd=vml.update;
			var method={
				shadow:function(){
					if(upd.shadow===true||upd.shadow==='fill'){
						var sd=vml.shadow,fsd=vml.fills.shadow,ssd=vml.shapes.shadow;
						if(sd.blur){
							fsd.type='gradienttitle';
							fsd.color2=vml.shadow.color;
							fsd.opacity=0;
						}else{
							fsd.opacity=sd.alpha;
						}							
						ssd.filled=true;
						ssd.fillcolor=sd.color;						
					}
				},
				bgColor:function(){
					if(upd.bgColor===true||upd.bgColor==='fill'){
						var bgc=vml.shapes.bgColor;
						bgc.filled=true;
						bgc.fillcolor=vml.bgColor;						
					}
					this.runtimeStyle.backgroundColor='transparent';
				},
				bgImage:function(){
					if(upd.bgImage===true||upd.bgImage==='fill'){
						var bgi=vml.shapes.bgImage,fill=vml.fills.bgImage;
						bgi.filled=true;
						bgi.fillcolor='none';
						fill.type='tile';
						fill.src=vml.bgImage.url;
						fill.color='none';
					}
					vml.bgImage.isImg?this.runtimeStyle.filter='alpha(opacity=0)':this.runtimeStyle.backgroundImage='url(about:blank)';				
				},
				border:function(){
					var rs=this.runtimeStyle,bd=vml.border,sbd=vml.shapes.border,sa=VML.sideArr;
					if(upd.border===true||upd.border==='fill'){
						if(bd.color=='transparent'||bd.filter&&bd.filter==bd.color){
							sbd.filled=false;
						}else{
							sbd.filled=true;
							sbd.fillcolor=bd.color;
						}
					}
					for(var i=0;i<4;i++){
						rs['padding'+sa[i]]=$$.parseInt(this.currentStyle['padding'+sa[i]])+bd.widthArr[i]+'px';
					}
					rs.border='none';
				}				
			};
			for(var i=0;i<4;i++){
				var type=VML.shapeArr[i];
				vml.shapes[type]&&method[type].call(this);
			}
		},
		offset:function(){
			if(this.vml){
				var $box=$(this.vml.box),$this=$(this),offsetBox=$box.offset(),offset=$(this).offset();
				if(offsetBox.top!=offset.top||offsetBox.left!=offset.left){
					$box.offset(offset);
				}
			}			
		},
		zIndex:function(){
			this.vml&&(this.vml.box.runtimeStyle.zIndex=this.currentStyle.zIndex);			
		}
	};
	$$.vml={
		option:function(prop){return jscVML[prop];},
		init:function(ns,boxNode,ie6PngFix,fixCls,shadowInner){
			if($$.is('ie')&&$.browser.version<9){
				if(!VML.styleSheet){
					ns&&(jscVML.ns=ns);
					boxNode&&(jscVML.boxNode=boxNode);
					ie6PngFix!==undefined&&(jscVML.ie6PngFix=ie6PngFix);
					fixCls&&(jscVML.ie6PngFixCls=fixCls);
					shadowInner!==undefined&&(jscVML.shadowInner=shadowInner);
					document.namespaces&&!document.namespaces[jscVML.ns]&&document.namespaces.add(jscVML.ns,'urn:schemas-microsoft-cm:vml');
					var ss = document.createElement('STYLE');
					document.documentElement.firstChild.appendChild(ss);
					ss.styleSheet.addRule(jscVML.ns+'\\:shape',"behavior: url(#default#VML);display:inline;position:absolute;");
					ss.styleSheet.addRule(jscVML.ns+'\\:fill',"behavior: url(#default#VML);display:inline;position:absolute;");
					VML.styleSheet=ss.styleSheet;
				}
				return true;
			}
		},
		addRule:function(selector){
			if(this.init()&&(selector=$$.str2Arr(selector,','))){
				for(var i=0,len=selector.length;i<len;i++){
					if($$.index(selector[i],VML.rules)==-1){
						VML.styleSheet.addRule(selector[i],'behavior:url(vml.htc)');
						VML.rules.push(selector[i]);
					}
				}
			}
			return this;
		},
		applyVML:function(){
			this.style.behavior='none';
			if(!this.vml){
				var allowed={BODY:false,TABLE:false,TR:false,TD:false,SELECT:false,OPTION:false,TEXTAREA:false};
				$$.vml.init()&&allowed[this.nodeName]!==false&&VML.create.apply(this,arguments);
			}else{
				this.vml.box.runtimeStyle.position=!$$.is('ie6')&&this.currentStyle.position=='fixed'?'fixed':'absolute';
				VML.calc.apply(this,arguments);
				VML.draw.call(this);
				VML.fill.call(this);
			}
		},
		destroyVML:function(){
			this.runtimeStyle.cssText='';
			for(var e in VML.events){
				this.detachEvent('on'+e,VML.events[e]);
			}
			this.parentNode.removeChild(this.vml.box);
			this.vml=this.radii=null;
		},
		getRadii:function(){
			var radii=[0,0,0,0],style=this.currentStyle;
			if(style){
				var radi=style['border-radius'];
				if(radi){
					radii=VML.str2Arr(radi);
				}else{
					for(var i=0;i<4;i++){
						var tb=i<2?'top':'bottom',lr=i>0&&i<3?'right':'left';
						radii[i]=$$.parseInt(style['border-'+tb+'-'+lr+'-radius']);
					}				
				}				
			}
			return radii;
		}
	};
	$(window).load(function(){
		$$.is('ie6')&&jscVML.ie6PngFix&&$$.vml.addRule('.'+jscVML.ie6PngFixCls);
	});	
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
								var move=false,dragPos=opt1.da.offset,touch=_testTouch(dragPos,opt.pos,arguments[1],opt.mode);
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
											if(_testTouch.call($(this),null,dragPos,arguments[1],opt.mode)){
												opt.placeholder.next()[0]!=this&&_offset(opt.placeholder.insertBefore(this).offset());
												return touch1=true;
											}
										});
										if(_testTouch.call(opt.placeholder,null,dragPos,arguments[1],opt.mode)){return;}
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
	var loaderManager=[];
	$$.loaderDefault={cls:'loader-ajax',overlay:false};
	function _ajaxInit(opt){
		var beforeSend=opt.beforeSend,res={success:opt.success,error:opt.error};
		pos=[{side:'top',mode:'padding',center:true},{side:'left',mode:'padding',center:true}];
		opt.beforeSend=function(){
			if(beforeSend.call(this)===false){
				return false;
			}
			if(opt.show.loader){
				if(loaderManager.length==0||$.grep(loaderManager,function(n,i){return !n.is(':visible');}).length==0){			
					loaderManager.push($$.getSington().popup({cls:$$.loaderDefault.cls,model:true,overlay:$$.loaderDefault.overlay,fixed:true,repos:true,open:{auto:false},close:{auto:false}}));					
				}
				opt.loader=$.grep(loaderManager,function(n,i){return !n.is(':visible');})[0];
				pos[0].by=pos[1].by=this.getPos();
				opt.loader.html('<div class="background"></div><div class="content">\u6B63\u5728'+opt.msg+'\u2026</div>').popup('active').popup('option','pos',pos).popup('open');
			}
		};
		opt.complete=opt.complate||function(){
			opt.show.loader&&opt.loader.popup('close');
		};
		if(opt.show.message){
			var arr=['\u6210\u529F\uFF01','\u5931\u8D25\uFF01'];
			$$.each(['success','error'],function(i,n){
				opt[n]=function(){
					pos[0].by=pos[1].by=this.getPos();
					pos[0].pos=pos[1].pos=null;
					$$.message(opt.msg+arr[i],pos,opt.mesKeep);
					res[n].apply(this,arguments);
				}
			});
		}
	};
	$$.ajax=function(conf){
		return new function(){
			var opt=$.extend({
				type:'GET',
				dataType:'html',
				context:null,
				cache:true,
				auto:true,
				msg:'\u52A0\u8F7D',
				show:{
					loader:true,
					message:true
				},
				mesKeep:1000,
				success:function(html){
					this.html(html);
				},
				error:$$.fn,
				beforeSend:$$.fn
			},conf);
			opt.context=$$.jq(opt.context||window);
			_ajaxInit(opt);
			this.option=function(prop,val){return $$._option.call(this,opt,prop,val);};
			this.load=function(opt1){
				opt1=$.extend(true,{},opt,opt1);
				$$.is('!emptyStr',opt1.url)&&$.ajax(opt1);
				return this;
			};
			opt.auto&&this.load();
		}
	};
	$$.plugin('formAjax',{
		conf:{
			type:'POST',
			dataType:'json',
			auto:false,
			msg:'\u63D0\u4EA4',
			show:{
				loader:true,
				message:true
			},
			success:$$.fn,
			error:$$.fn,
			beforeSend:$$.fn
		},
		methods:{
			submit:function(data){
				if(data){
					for(var n in data){
						(input=this.find('input[name='+n+']')).length?input.val(data[n]):this.append('<input type="hidden" name="'+n+'" value="'+data[n]+'">');
					}					
				}
				return this.submit();
			},
			destroy:function(){
				var target=this.attr('target');
				target.off('load').remove();
			}
		},
		create:function(opt){
			if(this[0].tagName.toLowerCase()=='form'){
				opt.context=$$.jq(opt.context)||this;
				_ajaxInit(opt);
				!$$.is('!emptyStr',this.attr('action'))&&$$.is('!emptyStr',opt.url)&&this.attr('action',opt.url);
				this.find(':file').length&&this.attr({method:'POST',enctype:'multipart/form-data'});
				var id='jsc-ajaxTarget'+$$.uuid++;
				$('<iframe id="'+id+'" name="'+id+'" src="about:blank" style="position:absolute;top:-1000px;left:-1000px;" />').appendTo('body')
					.load(function(){
						try{
							var data,doc=$(this).contents();
							if($.isXMLDoc(doc[0])||doc[0].XMLDocument){
								data=doc[0].XMLDocument||doc[0];
							}else{
								data=doc.find('body').html();
								switch(opt.dataType){
									case 'xml':
										data=$.parseXML(data);
										break;
									case 'json':
										data=$.parseJSON(data);
										break;
								}							
							}
							data.success?opt.success.call(opt.context,data):opt.error.call(opt.context);
						}catch(e){
							opt.error.call(opt.context,e);
						}finally{
							opt.complete.call(opt.context);
						}
					});
				this.attr('target',id).data('formAjax',opt).submit(function(){
					return opt.beforeSend.call(opt.context)!==false;
				});
				opt.auto&&this.formAjax('submit');
			}
		}
	});
	$$.plugin('button',{
		conf:{
			cls:'button',
			toggleCls:[{
				cls:'',
				hover:'button-hover',
				press:'button-press'
			}],
			node:'a',
			icon:'',
			iconCls:'icon-left',
			iconOnly:'icon-only',
			text:'',
			cursor:'pointer',
			isDisabled:false,
			keep:null,
			timer:{
				interval:500
			},
			param:null,
			context:null,
			selector:'',
			toolbarCls:'toolbar',
			groupCls:'button-group',
			id:'id',
			btns:[]
		},
		exist:true,
		methods:{
			option:function(opts,index,prop,val){
				var res=opts||this;
				if(opts&&arguments.length){
					!$.isNumeric(index)&&(val=prop,prop=index,index=0);					
					opts[index]&&(res=$$._option.call(this,opts[index],prop,val));
				}
				return res;
			},
			attach:function(btn,method,fn){
				var me=this,opts=this.data('button');
				$$.is('!emptyStr',btn)&&(btn=this.find(btn));
				$$.each(opts,function(i,n){
					if($$.is('!emptyStr',n.selector)){
						me.find(n.selector).each(function(){
							if(this==btn[0]){
								var $this=$(this),prop=$this.attr(n.id);
								if(prop){
									if(n.btnOpt&&n.btnOpt[prop]){
										n.btnOpt[prop][method]=fn;
									}
								}else{
									prop='jsc-btn'+$$.uuid++;
									$this.attr(opt.id,prop);
									!n.btnOpt&&(n.btnOpt={});
									n.btnOpt[prop]={};
									n.btnOpt[prop][method]=fn;
								}
							}
						});
					}
				});
				return this;
			},
			destroy:function(){
				if($$.vml){
					this[0].vml&&$$.vml.destroyVML.call(this[0]);
					this.find('['+$$.vml.option('boxNode')+']').each(function(){
						$$.vml.destroyVML.call(this);
					});
				}
			}
		},
		create:function(opt){
			var me=this,hasSel=$$.is('!emptyStr',opt.selector);
			if((opts=this.data('button'))&&(!$$.is('!emptyStr',opts[0].selector)||!hasSel)){return;}
			opt.context=$$.jq(opt.context)||this;
			if(hasSel){
				opt.btnOpt=opt.btnOpt||{};
				try{
					var nodes=[],group={};
					for(var i=0,len=opt.btns.length;i<len;i++){
						var btnOpt=opt.btns[i];
						btnOpt.attr=btnOpt.attr||{};
						if(btnOpt.opt){
							btnOpt.attr[opt.id]=btnOpt.attr[opt.id]||'jsc-btn'+$$.uuid++;
							opt.btnOpt[btnOpt.attr[opt.id]]=btnOpt.opt;
						}
						if(!btnOpt.attr[opt.id]||!this.find('['+opt.id+'='+btnOpt.attr[opt.id]+']').length){
							var btn={node:opt.node,cls:opt.cls,attr:btnOpt.attr,sub:[{node:'span',cls:btnOpt.icon,text:btnOpt.text}]};
							if(!btnOpt.group){
								nodes.push({cls:opt.groupCls,sub:[btn]});
							}else{
								if(!group[btnOpt.group]){
									if((g=this.find('['+opt.id+'='+btnOpt.group+']')).length){
										$.isNumeric(btnOpt.index)&&(t=g.children(':eq('+btnOpt.index+')')).length?t.before($$.toHtml(btn)):g.append($$.toHtml(btn));
									}else{
										var attr={};
										attr[opt.id]=btnOpt.group;
										group[btnOpt.group]={cls:opt.groupCls,attr:attr,sub:[btn]};
										nodes.push(group[btnOpt.group]);
									}									
								}else{
									$.isNumeric(btnOpt.index)?group[btnOpt.group].sub.splice(btnOpt.index,0,btn):group[btnOpt.group].sub.push(btn);
								}
							}								
						}
 					}
					this.append($$.toHtml(nodes));
				}catch(e){}
				var icon=this.find(opt.selector).find('>span[class]');
				icon.filter(':empty').addClass(opt.iconOnly);
				icon.not(':empty').addClass(opt.iconCls);
			}else{
				var icon=this.children(),text=this.text();
				!icon.length&&opt.icon&&(this.wrapInner('<span class="'+opt.icon+'"></span>'),icon=this.children());
				!$$.is('!emptyStr',text)&&$$.is('!emptyStr',opt.text)&&(text=opt.text,(icon.length?icon:this).text(text));
				icon.length&&icon.attr('class')&&icon.addClass($$.is('!emptyStr',text)?opt.iconCls:opt.iconOnly);
			}
			(hasSel?this.addClass(opt.toolbarCls).find(opt.selector).addClass(opt.cls):this.addClass(opt.cls)).restrain('drag,select,contextMenu');
			if($$.is('ie')&&$$.vml){
				$$.is('!emptyStr',opt.cls)&&$$.vml.addRule('.'+opt.cls);
				$$.is('ie6')&&$$.vml.option('ie6PngFix')&&$$.is('!emptyStr',opt.iconCls)&&$$.is('!emptyStr',opt.iconOnly)&&$$.vml.addRule('.'+opt.iconCls+',.'+opt.iconOnly);
			}
			opt.keep&&(opt.timer=$$.timer($.extend({context:opt.context},opt.timer,{autoStart:false})));
			var events=['mouseover','mouseout','mousedown','mouseup','click','dblclick',''];
			if(opts){
				var events1=$._data(me[0]).events;
				for(var i=0,len=events.length-1;i<len;i++){
					var e=events1[events[i]];
					for(var j=0;j<e.length;j++){
						var event=e[j];
						if(event.namespace==='button'&&event.selector){
							event.quick=null;
							event.selector+=','+opt.selector;
						}
					}
				}
				opts=opts.push(opt);
			}else{
				events.splice(0,2,'mouseenter','mouseleave');
				me.data('button',[opt]).on(events.join('.button '),opt.selector,function(e){
					var $this=$(this),plugin=$(e.delegateTarget),opts=plugin.data('button'),myOpt=opt=opts[0],opt1=null;
					if(opts.length>1){
						for(var i=0,len=opts.length;i<len;i++){
							if(plugin.find(opts[i].selector).index(this)>-1){
								myOpt=opt=opts[i];
								break;
							}
						}
					}
					opt.btnOpt&&(opt1=opt.btnOpt[$this.attr(opt.id)],myOpt=$.extend(true,{},myOpt,opt1));
					var status=myOpt.status||0,toggle=$.isArray(myOpt.toggleCls)?myOpt.toggleCls[status]:null,enable=!$this.isDisabled()&&!myOpt.isDisabled,hoverCls=null;							
					switch(e.type){
						case 'mouseenter':
						if(enable){
							opt.press&&$$.$doc.off('.button');
							toggle&&$$.is('!emptyStr',toggle.hover)&&$this.addClass(toggle.hover);
							$this.css('cursor',opt.cursor);
						}
						break;
						case 'mouseleave':
						opt.press&&$$.$doc.on('mouseup.button',function(){$$.$doc.off('.button');$this.triggerHandler('mouseup.button!');});
						toggle&&$$.is('!emptyStr',toggle.hover)&&$this.removeClass(toggle.hover);
						opt.keep=='mouseenter'&&opt.timer.stop();
						$this.css('cursor','');
						break;
						case 'mousedown':
						if(enable){
							opt.press=true;
							toggle&&$$.is('!emptyStr',toggle.press)&&$this.addClass(toggle.press);
							$$.is('ie')&&(de=1);
						}
						break;
						case 'mouseup':
						toggle&&$$.is('!emptyStr',toggle.press)&&$this.removeClass(toggle.press);
						opt.keep=='mousedown'&&opt.timer.stop();
						opt.press=false;
						e.isTrigger&&e.stopImmediatePropagation();
						break;
						case 'click':
						if(enable&&$.isArray(myOpt.toggleCls)&&(len=myOpt.toggleCls.length)>1){
							status=(status+1)%len;
							var cls=($$.is('!emptyStr',toggle.cls)?toggle.cls:'')+' '+($$.is('!emptyStr',toggle.hover)?toggle.hover:'')+' '+($$.is('!emptyStr',toggle.press)?toggle.press:'');
							$$.is('!emptyStr',cls)&&$this.removeClass(cls);
							$$.is('!emptyStr',myOpt.toggleCls[status].cls)&&$this.addClass(myOpt.toggleCls[status].cls);
							if(!e.isTrigger&&$$.is('!emptyStr',myOpt.toggleCls[status].hover)){
								$this.addClass(myOpt.toggleCls[status].hover);
								setTimeout(function(){
									!$$.is('contain',[e.pageY,e.pageX],$this.getPos())&&$this.removeClass(myOpt.toggleCls[status].hover);
								},100);
							}
							(opt1||opt).status=status;
						}
						break;
					}
					var fn=myOpt[e.type];
					if(enable&&$.isFunction(fn)){
						var param={event:e,param:myOpt.param,button:$this,plugin:plugin,status:status};
						var res=fn.call(opt.context,param)!==false;
						if(res&&myOpt.keep==e.type&&(e.type=='mouseenter'||e.type=='mousedown')){
							opt.timer.option('param',param).option('action',fn).start();
						}
						return res;
					}
				});
			}
		}
	});
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
	$$.plugin('menu',{
		conf:{
			type:'menu',//contextMenu
			cls:'menu',
			itemCls:'menu-item',
			titleCls:'ellipsis',
			sepCls:'menu-item-sep',
			iconCls:'menu-icon pngfix',
			tipCls:'submenu-tip',
			tipIconCls:'tip-arrow',
			hoverCls:'menu-item-hover',
			width:[180,140],
			pos:null,
			container:window,
			open:{
				before:$$.fn,
				after:$$.fn,
				effect:'default'
			},
			close:{
				before:$$.fn,
				after:$$.fn,
				effect:'default'				
			},
			attach:null,
			data:null,
			callback:$$.fn,
			click:$$.fn
		},
		create:function(opt){
			function _html(json){
				var menu=null,sub=[];
				arguments[1]&&(menu={node:'ul',sub:sub});
				$$.each(json,function(i,n){
					if($$.is('!emptyStr',n.text)){
						var item={node:'li',attr:n.attr,sub:[{node:'span',cls:n.cls||'',text:n.text}]};
						n.sub&&item.sub.push(_html(n.sub,true));
						sub.push(item);
					}else{
						sub.push({node:'li'});
					}
				});
				return menu||sub;
			}
			function _icon(menu){
				menu.find('ul').add(menu).addClass(opt.cls);
				var li=menu.find('li'),item=li.filter(':parent').addClass(opt.itemCls);
				li.filter(':empty').addClass(opt.sepCls);
				item.find('>span').each(function(){
					var $this=$(this);
					var hasSub=!!$this.next().length;
					var cls=opt.tipCls+(hasSub?' '+opt.tipIconCls:'');
					$this.html($this.text()).addClass(opt.iconCls+' '+opt.titleCls).wrap('<span class="'+cls+'"></span>');
					$$.is('ie6')&&$this.removeClass(opt.titleCls).wrapInner('<span class="'+opt.titleCls+'"></span>');
				});
			}
			var before=opt.open.before;
			opt.open.before=function(){
				this.children().each(function(){
					var $this=$(this);
					$this.removeClass(opt.hoverCls);
					if(this.submenu){
						var b=true;
						this.submenu.children().each(function(){
							b=!this.submenu;
						});
						if(b&&$.isFunction(opt.callback)){
							var res=opt.callback.call($this);
							if(res){
								this.submenu.empty();
								if($.isEmptyObject(res)){
									$this.disable();
								}else{
									this.submenu.append($$.toHtml(_html(res)));
									_icon(this.submenu);
									$this.disable(false);
								}
							}
						}
					}
				});
				before.call(this);
			};
			opt.menu=$($$.is('!emptyStr',opt.data)?opt.data:$$.toHtml(_html(opt.data,true))).addClass(opt.cls).width(opt.width[0]);
			_icon(opt.menu);
			var container=$('<div></div>');
			function _sub(menu){
				container.append(menu);
				$.each(menu.find('>*>*:not(span)'),function(i,n){
					var $this=$(n).addClass(opt.cls).width(opt.width[1]);
					$this.parent()[0].submenu=$this;
					_sub($this);
				});				
			}
			_sub(opt.menu);
			var pos=[{mode:'padding',side:'top',container:opt.container,adjustMode:'changeSide,offset'},{mode:'margin',side:'right',container:opt.container,adjustMode:'changeSide,offset',offset:-3}];
			container.css({'position':'relative','zIndex':2000}).appendTo('body').restrain('contextMenu').children().restrain('contextMenu').popup({model:false,overlay:false,repos:true,fixed:false,open:$.extend(opt.open,{auto:false}),close:opt.close,trigger:false})
				.each(function(){
					$(this).children().each(function(){
						if(this.submenu){
							this.submenu.popup('option','pos',[$.extend({},pos[0],{by:this}),$.extend({},pos[1],{by:this})]);
						}
					});
				});
			var pos1=[{by:this,mode:'margin',side:'bottom',container:opt.container,adjustMode:'changeSide,offset'},{by:this,mode:'padding',side:'left',container:opt.container,adjustMode:'changeSide,offset'}];
			if(opt.type=='menu'){
				opt.menu.popup('option','pos',opt.pos||pos1);
				$.isFunction(opt.attach)?opt.attach.call(this,opt):this.button($.extend({cls:''},opt.buttonOpt,{click:function(){opt.menu.popup('open');$$.is('ie')&&opt.menu[0].fireEvent('onmove');}}));
			}else{
				this.restrain('contextMenu').on('mousedown.menu',function(e){
					if(e.which==3){
						pos1[0].by=e.pageY;
						pos1[1].by=e.pageX;
						opt.menu.popup('option','pos',pos1).popup('open');
					}
				});
			}
			container.button({
				cls:'',
				iconCls:'',
				toolbarCls:'',
				toggleCls:[{cls:'',hover:'',press:''}],
				selector:'.'+$$.str2Arr(opt.itemCls)[0],
				mouseenter:function(jsc){
					opt.mousein=true;
					jsc.button.siblings().removeClass(opt.hoverCls).end().addClass(opt.hoverCls).parent().nextAll('ul:visible').popup('close');						
					jsc.button[0].submenu&&jsc.button[0].submenu.popup('open');
					return false;
				},
				mouseleave:function(jsc){
					opt.mousein=false;
					setTimeout(function(){
						!opt.mousein&&jsc.button.removeClass(opt.hoverCls).parent().nextAll('ul:visible').popup('close');
					},100);						
				},
				click:function(jsc){
					if(!jsc.button[0].submenu){
						opt.click.call(jsc.button,jsc);
						$$.$doc.mousedown();
					}
				},
				mousedown:function(){return false;}
			});
			this.data('menu',opt);
		}
	});
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
			opt.draggable&&this.draggable($.extend({},opt.dragOpt,{type:'drag',handle:this.panel('option','header'),trigger:true}));
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
				var $this=$(this),name=$this.attr('jscplugin');
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
	$$.plugin('tree',{
		conf:{
			cls:'tree',
			nodeCls:'tree-node',
			lastItem:'item-last',
			textCls:'tree-title',
			subtreeCls:'subtree',
			hitareaCls:'tree-node-hitarea',
			hitareaHoverCls:'tree-node-hitarea-hover',
			checkedCls:'tree-node-checked',
			harfCheckedCls:'tree-node-checked-part',
			selectedCls:'tree-node-selected',
			expendedCls:'tree-node-expended',
			iconCls:'tree-icon',
			folderCls:'tree-folder',
			leafCls:'tree-leaf',
			hoverCls:'tree-node-hover',
			ajax:{
				url:null,
				type:'get',
				dataType:'json',//'xml'
				data:{'parentId':0},
				loaderMsg:'\u6B63\u5728\u52A0\u8F7D\u2026'
			},
			initOpen:false,
			selectFolder:false,
			closeSilbings:true,
			closeChildren:true,
			radioOrCheckbox:'checkbox',//'radio','checkbox'
			cascade:true,
			data:null,
			prefix:'jsc-tree-',
			key:'id',
			edit:{
				url:null,
				col:1,
				fields:[{lable:'tree_id',name:'id',type:'text',value:'',hiddend:true},
					{lable:'title',name:'text',type:'text'},
					{lable:'parent_id',name:'parentId',type:'select'}
				]
			},
			click:$$.fn
		},
		create:function(opt){
			this.addClass(opt.cls).data('tree',opt);
			var adapter=opt.adapter||$$.fn;
			opt.adapter=function(obj){
				var attr={};
				obj[opt.key]!=undefined&&(attr[opt.prefix+opt.key]=obj[opt.key]);
				adapter(attr,obj);
				return attr;
			};
			function _(data){
				var me=this;
				data&&this.append($$.toHtml((function(arr){
					var json=[],showCB=$$.is('!emptyStr',opt.radioOrCheckbox);
					for(var i=0,len=arr.length;i<len;i++){
						var node=arr[i],item={node:'li',cls:i==len-1?opt.lastItem:'',sub:[]};
						var span={node:'span',cls:opt.nodeCls+(node.isLeaf!==false?' '+opt.leafCls:(opt.initOpen?' '+opt.expendedCls:'')),sub:[{node:'span',cls:opt.hitareaCls}]};
						if(showCB){
							span.sub.push({node:'span',cls:opt.radioOrCheckbox});
							me.prev().hasClass(opt.checkedCls)&&(span.cls+=' '+opt.checkedCls);
						}
						$$.is('!emptyStr',opt.iconCls)&&span.sub.push({node:'span',cls:opt.iconCls+' '+(node.cls||opt.folderCls)});
						span.sub.push({node:'span',cls:opt.textCls,text:node.text,attr:opt.adapter(node)});
						item.sub.push(span);
						if(!node.isLeaf&&$.isArray(node.children)){
							var ul={node:'ul',cls:opt.subtreeCls,css:{display:opt.initOpen?'block':'none'}};
							ul.sub=arguments.callee(node.children);
							item.sub.push(ul);
						}
						json.push(item);
					}
					return json;					
				})($.isArray(data)?data:data.children)));				
				opt.closeSilbings&&!this.hasClass(opt.cls)&&this.parent().siblings().find('.'+opt.expendedCls).removeClass(opt.expendedCls).next().slideUp('fast');
				this.slideDown('fast').prev().addClass(opt.expendedCls);						
			}
			if($$.is('!emptyStr',this.html())){
				this.find('li>span').each(function(){
					var $this=$(this),cdrn=$this.children();
					if(!cdrn.length){
						cdrn=$this.wrap('<span></span>');
						$this=cdrn.parent();
					}
					$this.addClass(opt.nodeCls);
					if($$.is('!emptyStr',opt.iconCls)){
						var cls=cdrn.attr('class'),hasCls=$$.is('!emptyStr',cls);
						$this.prepend('<span class="'+opt.iconCls+' '+(hasCls?cls:opt.folderCls)+'"></span>');
						hasCls&&cdrn.attr('class','');
					}
					cdrn.addClass(opt.textCls);					
					$$.is('!emptyStr',opt.radioOrCheckbox)&&$this.prepend('<span class="'+opt.radioOrCheckbox+'"></span>');
					$this.prepend('<span class="'+opt.hitareaCls+'"></span>');				
				});
				var nds=this.find('li>span');
				nds.filter(':only-child').addClass(opt.leafCls);
				nds.parent(':last-child').addClass(opt.lastItem);
				var sub=nds.next('ul').addClass(opt.subtreeCls);
				sub.css('display',opt.initOpen?'block':'none');
				sub.prev().toggleClass(opt.expendedCls,opt.initOpen);				
			}else if($$.is('!emptyStr',opt.ajax.url)){
				opt.ajax=$$.ajax($.extend({},opt.ajax,{
					show:{loader:false,message:false},
					autoSubmit:true,
					context:this,
					beforeSend:function(){this.prev().children('.'+opt.iconCls).addClass('tree-loader')},
					complate:function(){this.prev().children('.'+opt.iconCls).removeClass('tree-loader');},
					success:function(data){_.call(this,data);}
				}));
			}else{
				_.call(this,opt.data);				
			}
			function _toggle(btn){
				if(btn.hasClass(opt.expendedCls)){
					opt.closeChildren&&btn.next().find('.'+opt.expendedCls).removeClass(opt.expendedCls).next().slideUp('fast');
					btn.removeClass(opt.expendedCls).next().slideUp('fast');
				}else{
					if(!btn.next().length){
						btn.after('<ul class="'+opt.subtreeCls+'" style="display:none;"></ul>');
						var id='',date={};
						for(var p in opt.ajax.option('data')){
							id=p;
							break;
						}
						date[id]=btn.find('>span:parent').attr(opt.prefix+opt.key);
						opt.ajax.load({'context':btn.next(),data:date});
					}else{
						opt.closeSilbings&&btn.parent().siblings().find('.'+opt.expendedCls).removeClass(opt.expendedCls).next().slideUp('fast');
						btn.addClass(opt.expendedCls).next().slideDown('fast');						
					}
				}
			};
			this.button($.extend({
				cls:'',
				toolbarCls:'',
				iconCls:'',
				iconOnly:'',
				cursor:'',
				toggleCls:[{cls:'',hover:'',press:''}],
				selector:'li>span>span',
				mouseenter:function(jsc){
					var btn=jsc.button;
					if(btn.hasClass(opt.hitareaCls)){
						btn.addClass(opt.hitareaHoverCls);
					}else if(btn.hasClass(opt.textCls)){
						btn.parent().addClass(opt.hoverCls);
						btn.css('cursor','pointer');
					}
				},
				mouseleave:function(jsc){
					var btn=jsc.button;
					if(btn.hasClass(opt.hitareaCls)){
						btn.removeClass(opt.hitareaHoverCls);
					}else if(btn.hasClass(opt.textCls)){
						btn.parent().removeClass(opt.hoverCls);
						btn.css('cursor','');
					}
				},
				click:function(jsc){
					var btn=jsc.button,parent=btn.parent();
					if(btn.hasClass(opt.hitareaCls)){
						!parent.hasClass(opt.leafCls)&&_toggle(parent);
					}else if(btn.hasClass(opt.radioOrCheckbox)){
						parent.removeClass(opt.harfCheckedCls).toggleClass(opt.checkedCls);
						if(opt.cascade){
							parent.next().find('li>span').removeClass(opt.harfCheckedCls).toggleClass(opt.checkedCls,parent.hasClass(opt.checkedCls));
							parent.parent().parents('li').each(function(){
								var $this=$(this),c=$this.find('>span'),sib=c.next().find('>li>span'),checked=sib.filter('.'+opt.checkedCls);
								if(checked.length){
									c.removeClass(checked.length==sib.length?opt.harfCheckedCls:opt.checkedCls)
										.addClass(checked.length==sib.length?opt.checkedCls:opt.harfCheckedCls);
								}else{
									c.removeClass(opt.checkedCls).toggleClass(opt.harfCheckedCls,sib.hasClass(opt.harfCheckedCls));
								}
							});
						}
					}else if(btn.hasClass(opt.textCls)){
						function _done(){
							if($$.is('!emptyStr',opt.selectedCls)){
								jsc.plugin.find('.'+opt.selectedCls).removeClass(opt.selectedCls);
								parent.addClass(opt.selectedCls);								
							}
							opt.click.call(this,jsc);
						}
						parent.hasClass(opt.leafCls)?_done():opt.selectFolder?_done():_toggle(parent);
					}
				}
			},opt.buttonOpt));
		}
	});
	var datePicker=new function(){
		var _=$$.arr2Obj,panel=[];
		panel[0]=_([,'datepicker-header',[_([,'spin-month',[_(['span','month']),_(['span','label-month',,'\u6708'])]]),
			_([,'spin-year',[_(['span','year']),_(['span','label-year',,'\u5E74'])]]),_(['a','dropdown-button'])]]);
		var ddc=_([,'panel-dropdown-content',[_(['ul','list-month',(function(){
				for(var res=[],i=1;i<13;i++){res[i-1]=_(['li',,,(i<10?'0':'')+i+'\u6708']);}return res;
			})()]),_(['ul','list-year',(function(){
				for(var res=[],i=0;i<10;i++){res[i]=_(['li']);}return res;
			})()]),_([,'dToolbar yearBtnBar']),_([,'dToolbar ddCtrl'])]]);
		panel[0].sub.push(_([,'panel-dropdown',[_([,'panel-dropdown-background']),ddc],,]));
		panel[1]=_(['ul','panel-week',(function(){
			var res=[];
			$$.each(['\u65E5','\u4E00','\u4E8C','\u4E09','\u56DB','\u4E94','\u516D'],function(i,n){
				res[i]=_(['li',,,n]);
			});
			return res;
		})()]);
		panel[2]=_(['ul','panel-day clearfix',(function(){for(var res=[],i=0;i<42;i++){res[i]=_(['li']);}return res;})()]);
		panel[3]=_([,'panel-time',]);
		panel[4]=_([,'panel-control',[_(['ul','panel-range',[_(['li','start selected',,'\u5F00\u59CB',,{btn:'start'}]),_(['li','end',,'\u7ED3\u675F',,{btn:'end'}])]]),
		_(['div','btn-group',[_([,'button button-ok',,'\u786E\u5B9A',,{btn:'ok'}]),_([,'button button-today',,'\u4ECA\u5929',,{btn:'today'}])]])]]);
		function _sel(obj){obj.addClass('selected').siblings('.selected').removeClass('selected');};
		var target=null,opt=null,date={start:null,end:null,curr:null,old:null},hasTime=false;
		var picker=$($$.toHtml(_([,'datepicker',panel]))).appendTo('body'),spin={},field={},list={},dropdown=picker.find('div.panel-dropdown');
		$$.each([
			{sel:'month',act:function(jsc){
				date.curr.setMonth(this.spin('option','core.value')-1);
				jsc.toggle&&date.curr.setFullYear(date.curr.getFullYear()+jsc.toggle);
				update();
			}},
			{sel:'year',act:function(jsc){
				date.curr.setFullYear(this.spin('option','core.value'));
				update();
			}}		
		],function(i,n){
			spin[n.sel]=picker.find('.spin-'+n.sel).spin({
				cls:'',
				btnCls:'datebtn',
				up:{cls:'prev-'+n.sel,hover:'',press:''},
				down:{cls:'next-'+n.sel,hover:'',press:''},
				wrap:false,
				invert:true,
				rotate:!i,
				timer:{interval:200},
				core:i?{min:1700,max:2999,step:1,value:2012}:{min:1,max:12,step:1,value:1},
				action:n.act
			});
			field[n.sel]=spin[n.sel].find('>span.'+n.sel);
			list[n.sel]=dropdown.find('ul.list-'+n.sel).button({
				cls:'',
				toggleCls:[{cls:'',hover:'hover',press:''}],
				toolbarCls:'',
				selector:'>li',
				cursor:'default',
				click:function(jsc){_sel(jsc.button)}
			});			
		});
		dropdown.find('.yearBtnBar').spin({
			cls:'',
			btnCls:'yearbtn',
			wrapperCls:'btnBox',
			up:{cls:'slide-left',hover:'',press:''},
			down:{cls:'slide-right',hover:'',press:''},
			invert:true,
			rotate:true,
			timer:{interval:200},
			action:function(jsc){
				var f=list.year.children(':first'),y=date.curr.getFullYear(),b=$$.between($$.parseInt(f.html()),[1700,2990],true);
				if(b&&b*jsc.param>0){
					return false;
				}
				list.year.children().each(function(){
					var $t=$(this),val=parseInt($t.html())+10*jsc.param;
					$t.html(val).toggleClass('selected',y==val);
				});
			}			
		});
		dropdown.find('.ddCtrl').button({
			toolbarCls:'',
			node:'div',
			selector:'.button',
			groupCls:'btnBox',
			id:'btn',
			btns:[{group:'ddCtrl',text:'\u786E\u5B9A',opt:{param:1}},{group:'ddCtrl',text:'\u53D6\u6D88',opt:{param:0}}],
			click:function(jsc){
				if(jsc.param){
					var y=$$.parseInt(list.year.children('.selected').text());
					y&&date.curr.setFullYear(y);
					date.curr.setMonth(parseInt(list.month.children('.selected').text())-1);
					update();
				}
				dropdown.css('display','none');
			}
		});
		picker.find('.dropdown-button').button({
			cls:'',
			toggleCls:[{cls:'',hover:'',press:''}],
			click:function(jsc){
				if(!dropdown.is(':visible')){
					var y=date.curr.getFullYear(),diff=(y-1700)%10;
					_sel(list.month.children(':eq('+date.curr.getMonth()+')'));
					list.year.children().each(function(i,n){
						$(this).html(y-diff+i).toggleClass('selected',i==diff);
					});
					dropdown.css('display','block');
					$$.is('ie')&&dropdown.find('vml').next().each(function(){
						this.fireEvent('onmove');
					});					
				}
			}
		});
		var pday=picker.find('ul.panel-day').button({
			cls:'',
			toggleCls:[{cls:'',hover:'hover',press:''}],
			toolbarCls:'',
			selector:'>li',
			click:function(jsc){
				date.curr.setDate(parseInt(jsc.button.text()));				
				date.old=new Date(date.curr.getTime());
				(opt.range||hasTime)?_sel(jsc.button):ok();
			}
		});
		var ptime=picker.find('.panel-time').html('<input type="text" class="spin-hour" value="00" /><span class="label">\u65F6</span><input type="text" class="spin-minute" value="00" /><span class="label">\u5206</span><input type="text" class="spin-second" value="00" /><span class="label">\u79D2</span>');
		var timeArr=['hour','minute','second'];
		$$.each(timeArr,function(i,n){
			spin[n]=ptime.find('input.spin-'+n).spinner({
				rotate:true,
				timer:{interval:200},
				core:{min:0,max:!i?23:59,value:0,step:1},
				callback:function(jsc){
					jsc.value<10&&(jsc.value="0"+jsc.value);
					if(opt.casecade&&jsc.toggle){
						var cls=this.attr('class').split('-')[1],idx=$$.index(cls,timeArr);
						if(!idx){
							date.curr.setDate(date.curr.getDate()+jsc.toggle);
							update();
						}else{
							spin[timeArr[idx-1]].spinner('option','plugin').spin('one',jsc.toggle>0?'up':'down');
						}
					}
				}
			});
		});
		$$.each([
			{sel:'ul.panel-range',click:function(jsc){
				var btn=jsc.button,val=btn.attr('btn');
				if(!btn.hasClass('selected')){
					hasTime&&setTime(spin.hour.spinner('val'),spin.minute.spinner('val'),spin.second.spinner('val'));
					date[val=='start'?'end':'start']=date.curr;
					date.curr=date[val];
					date.old=new Date(date.curr.getTime());
					_sel(btn);
					update();
					if(hasTime){
						spin.hour.spinner('val',date.curr.getHours());
						spin.minute.spinner('val',date.curr.getMinutes());
						spin.second.spinner('val',date.curr.getSeconds());
					}
				}					
			}},
			{sel:'div.btn-group',click:function(jsc){
				if(jsc.button.attr('btn')=='today'){
					var times=new Date().getTime();
					date.curr.setTime(times);
					date.old.setTime(times);
					(opt.range||hasTime)?update():ok();
				}else{
					ok();
				}
			}}
		],function(i,n){
			picker.find(n.sel).button({
				cls:'',
				toggleCls:[{cls:'',hover:'',press:''}],
				toolbarCls:'',
				selector:'>*',
				click:n.click
			});
		});
		picker.popup({open:{auto:false},pos:[{mode:'margin',side:'bottom',center:false,container:$(window),adjustMode:'changeSide,offset,none'},
			{mode:'padding',side:'left'}],repos:true});
		this.open=function(t){
			if(target!=t){
				target=t;
				opt=target.data('datepicker');
				hasTime=opt.pattern.indexOf('H')>-1;
			}
			var val=target.val();
			if($$.is('!emptyStr',val)){
				if(opt.range){
					var dates=val.split(opt.sep);
					date.start=date.curr=$$.parseDate(dates[0],opt.pattern);
					date.end=$$.parseDate(dates[1],opt.pattern);
				}else{
					date.start=date.curr=$$.parseDate(val,opt.pattern);
				}
			}else{
				date.start=date.curr=new Date();
				hasTime&&setTime(0,0,0);
				if(opt.range){
					date.end=new Date();
					if(hasTime){
						date.curr=date.end;
						setTime(23,59,59);
						date.curr=date.start;
					}
				}
			}
			date.old=new Date(date.curr.getTime());
			update();
			var pos=picker.popup('option','pos');
			pos[0].by=pos[1].by=opt.plugin||target;
			dropdown.css('display','none');
			var rp=picker.find('.panel-range');
			_sel(rp.children(':eq(0)'));
			picker.find('.button-ok').css('display',!opt.range&&!hasTime?'none':'block');
			if(hasTime){
				spin.hour.spinner('val',date.curr.getHours());
				spin.minute.spinner('val',date.curr.getMinutes());
				spin.second.spinner('val',date.curr.getSeconds());
			}
			picker.popup('open');
			rp.css('display',opt.range?'block':'none');
			picker.find('.panel-time').css('display',hasTime?'block':'none');
		};
		function update(){
			var y=date.curr.getFullYear(),m=date.curr.getMonth()+1;
			spin.month.spin('option','core.value',m);
			field.month.html(m<10?'0'+m:m);
			spin.year.spin('option','core.value',y);
			field.year.html(y);
			drawDay();
		}
		function drawDay(){
			var y=date.curr.getFullYear(),m=date.curr.getMonth(),d=date.curr.getDate(),days=[31,((y%4===0&&y%100!==0)||y%400=== 0)?29:28,31,30,31,30,31,31,30,31,30,31][m];
			var w=new Date(y,m,1).getDay();
			pday.children().disable(false).show().each(function(i){
				var $t=$(this);
				(i<w||i>days+w-1)?$t.html('&nbsp;')[i>34&&days+w<36?'hide':'disable']():$t.html(i-w+1);
				$t.toggleClass('selected',y==date.old.getFullYear()&&m==date.old.getMonth()&&(d==i-w+1));
			});
		}
		function setTime(h,m,s){
			date.curr.setHours(h);
			date.curr.setMinutes(m);
			date.curr.setSeconds(s);
		}
		function ok(){
			hasTime&&setTime(spin.hour.spinner('val'),spin.minute.spinner('val'),spin.second.spinner('val'));
			if(opt.range){
				if(date.start.getTime()>date.end.getTime()){
					date.curr=date.start;
					date.start=date.end;
					date.end=date.curr;
				}
			}
			var str=date.start.format(opt.pattern);
			opt.range&&(str+=opt.sep+date.end.format(opt.pattern));
			target.val(str);
			$$.$doc.mousedown();
		}
	};
	$$.plugin('datePicker',{
		conf:{
			cls:'date-input',
			icon:'icon-date',
			sep:'/',
			pattern:'yyyy-MM-dd',
			range:false,
			casecade:false
		},
		create:function(opt){
			var me=this.data('datepicker',opt).attr('readonly','readonly');
			if($$.is('!emptyStr',opt.icon)){
				opt.plugin=this.wrap($$.toHtml({node:'span',cls:opt.cls})).parent().addClass(opt.cls).width(this.outerWidth(true)).append('<span class="'+opt.icon+'"></span>');
				this.fitParent({wh:'width',swh:'width'});
			}
			(opt.plugin||this).button({
				cls:'',
				toggleCls:[{cls:'',hover:opt.hover||'',press:opt.press||''}],
				keep:false,
				click:function(jsc){
					datePicker.open(me);
				}
			});
		}
	});
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
	$$.plugin('pager',{
		conf:{
			cls:'pagerbar',
			pagerCls:'pager',
			btnCls:'page-btn',
			messageCls:'page-message',
			firstCls:'page-first',
			prevCls:'page-prev',
			nextCls:'page-next',
			lastCls:'page-last',
			pageNumCls:'page-num',
			pageSizeCls:'page-size',
			currNumCls:'page-num-curr',
			totalCls:'page-total',
			refreshCls:'refresh',
			dotCls:'noborder',
			hoverCls:'hover',
			firstText:'\u9996\u9875',
			prevText:'\u4E0A\u4E00\u9875',
			nextText:'\u4E0B\u4E00\u9875',
			lastText:'\u5C3E\u9875',
			pageSizeLabel:'\u6BCF\u9875\u663E\u793A',
			pageCurrPattern:'\u7B2C{0}\u9875 \u5171{1}\u9875',
			messagePattern:'\u5F53\u524D\u8BB0\u5F55\uFF1A{0}-{1}\u6761\uFF0C\u5171\u6709\u8BB0\u5F55{2}\u6761',
			showPageSize:true,
			showFirstLast:true,
			showPrevNext:true,
			showMessage:true,
			autoHideFirstLast:false,
			autoHidePrevNext:false,
			showCurrTotal:true,
			totalRecord:700,
			currPage:1,
			pageSize:20,
			pageSizeList:[10,20,30,40],
			pageNum:0,
			startNum:0,
			endNum:0,
			action:function(jsc,total,val,size){
				this.pager('update',total,val,size);
			}
		},
		methods:{
			update:function(total,curr,size){
				var opt=this.data('pager');
				opt.totalRecord=total;
				opt.currPage=curr;
				opt.pageSize=size;
				_bulidPager(opt);
			}
		},
		create:function(opt){
			var me=this;
			opt.pager=$('<ul class="'+opt.pagerCls+'"></ul>');
			_bulidPager(opt);
			opt.pager.appendTo(this.addClass(opt.cls).data('pager',opt)).button({
				cls:'',
				toolbarCls:'',
				toggleCls:[{cls:'',hover:'hover',press:''}],
				context:me,
				selector:'>li.'+opt.btnCls,
				click:function(jsc){
					jsc.plugin.find('.'+opt.refreshCls).addClass('refresh-selected');
					var val=jsc.button.val(),size=jsc.plugin.find('.page-size-list').val()||opt.pageSize;
					if(!val){
						val=jsc.plugin.find('input[type=text]').val()||opt.currPage;
					}
					opt.action.call(this,jsc,opt.totalRecord,val,size);
					jsc.plugin.find('.'+opt.btnCls).each(function(){
						var $this=$(this);
						$$.is('contain',[jsc.event.pageY,jsc.event.pageX],$this.getPos())&&$this.mouseenter();
					});
				}
			});
		}
	});
	function _bulidPager(opt){
		var pageNum=Math.ceil(opt.totalRecord/opt.pageSize);
		opt.currPage>pageNum?opt.currPage=pageNum:opt.currPage<1?opt.currPage=1:null;
		var btn=[];
		if(opt.showPageSize){
			var ps={node:'li',cls:opt.pageSizeCls,sub:[{node:'lable',text:opt.pageSizeLabel}]};
			var sel={node:'select',cls:'page-size-list',sub:[]};
			for(var i=0;i<opt.pageSizeList.length;i++){
				var option={node:'option',text:opt.pageSizeList[i]};
				if(opt.pageSize==opt.pageSizeList[i]){
					option.attr={'selected':'selected'};
				}
				sel.sub.push(option);
			}
			ps.sub.push(sel);
			btn.push(ps);			
		}
		$$.each(['first','prev'],function(i,n){
			var isShow,autoHide,cls=opt.btnCls+' '+opt[n+'Cls'],css,val=opt.currPage-1;
			i?(isShow=opt.showPrevNext,autoHide=opt.autoHidePrevNext,val=val>0?val:1):(isShow=opt.showFirstLast,opt.autoHideFirstLast,val=1);
			if(isShow){
				opt.currPage<2&&(autoHide?css={'display':'none'}:cls+=' disabled');
				btn.push({node:'li',cls:cls,attr:{value:val,title:opt[n+'Text']},css:css,text:opt[n+'Text']});				
			}
		});
		if(opt.showCurrTotal){
			btn.push({node:'li',cls:opt.pageNumCls,text:$$.format(opt.pageCurrPattern,['<input type="text" class="text curr-page" value="'+opt.currPage+'">','<span>'+pageNum+'</span>'])});			
		}
		if(opt.startNum>0){
			var end=opt.startNum>pageNum?pageNum:opt.startNum;
			for(var i=0;i<end;i++){
				btn.push({node:'li',cls:opt.btnCls+(opt.currPage==i+1?' selected':''),attr:{value:i+1},text:i+1});
			}
		}
		var end=pageNum-opt.endNum;
		if(opt.pageNum>0){
			var start=opt.startNum>0?opt.startNum:0;
			if(pageNum>opt.pageNum){
				var half=Math.floor(opt.pageNum/2),s=opt.currPage-half;
				s>start&&(start=s);
			}
			if(opt.startNum>0&&start>opt.startNum){
				btn.push({node:'li',cls:opt.dotCls,text:'…'});
			}
			if(start+opt.pageNum>pageNum){
				start=pageNum-opt.pageNum;
				start<opt.startNum&&(start=opt.startNum);
			}
			end=start+opt.pageNum;
			for(var i=start;i<end;i++){
				if(i==pageNum){
					break;
				}
				btn.push({node:'li',cls:opt.btnCls+(opt.currPage==i+1?' selected':''),attr:{value:i+1},text:i+1});				
			}
		}
		if(opt.endNum>0){
			if(end<pageNum-opt.endNum){
				btn.push({node:'li',cls:opt.dotCls,text:'…'});
				end=pageNum-opt.endNum;
			}
			for(var i=end;i<pageNum;i++){
				btn.push({node:'li',cls:opt.btnCls+(opt.currPage==i+1?' selected':''),attr:{value:i+1},text:i+1});				
			}
		}
		$$.each(['next','last'],function(i,n){
			var isShow,autoHide,cls=opt.btnCls+' '+opt[n+'Cls'],css,val=opt.currPage+1;
			!i?(isShow=opt.showPrevNext,autoHide=opt.autoHidePrevNext,val=val>pageNum?pageNum:val):(isShow=opt.showFirstLast,opt.autoHideFirstLast,val=pageNum);
			if(isShow){
				opt.currPage==pageNum&&(autoHide?css={'display':'none'}:cls+=' disabled');
				btn.push({node:'li',cls:cls,attr:{value:val,title:opt[n+'Text']},css:css,text:opt[n+'Text']});				
			}
		});
		opt.showCurrTotal&&btn.push({node:'li',cls:opt.btnCls+' '+opt.refreshCls});
		opt.pager.html($$.toHtml(btn));
		if(opt.showMessage){
			var endRecord=opt.currPage*opt.pageSize;
			opt.pager.append('<span class="'+opt.messageCls+'">'+$$.format(opt.messagePattern,[(opt.currPage-1)*opt.pageSize+1,endRecord>opt.totalRecord?opt.totalRecord:endRecord,opt.totalRecord])+'</span>');
		}
	};
	$$.plugin('comboBox',{
		conf:{
			cls:'comboBox',
			arrowCls:'combo-arrow',
			hoverCls:'combo-arrow-hover',
			iconCls:'',
			titleCls:'combo-title',
			dropdownCls:'combo-dropdown',
			listCls:'combo-list',
			groupCls:'combo-group',
			itemCls:'combo-item',
			itemHoverCls:'combo-item-hover',
			itemSelectedCls:'combo-item-selected',
			width:'auto',
			height:'auto',
			readonly:true,
			name:'',
			multiple:false,
			resize:false,
			data:null
		},
		create:function(opt){
			var node=this[0].nodeName.toLowerCase(),plugin={cls:opt.cls,sub:[{node:'span',cls:opt.arrowCls,sub:[{node:'span',cls:opt.iconCls}]}]},
			dropdown={cls:opt.dropdownCls,sub:{node:'ul'}};
			if(node==='select'){
				opt.multiple=opt.multiple||this.attr('multiple');
				opt.data=[];
				this.children().each(function(){
					var $this=$(this);
					function _(){
						return {text:$.trim(this.text()),cls:this.attr('selected'),value:this.val(),selected:this.attr('selected')};
					}
					if(this.nodeName.toLowerCase()=='optgroup'){
						var group={text:$this.attr('label'),cls:opt.groupCls,isLeaf:false,children:[]};
						$this.children().each(function(){
							group.children.push(_.call($(this)));
						});
						opt.data.push(group);
					}else{
						opt.data.push(_.call($this));
					}
				});
				this.after($$.toHtml([plugin,dropdown])).css('display','none');
				opt.plugin=this.next();
				opt.readonly=true;
			}else if(node==='input'&&this.attr('type')=='text'){
				this.after($$.toHtml(dropdown)).wrap($$.toHtml(plugin));
				opt.plugin=this.parent().parent().parent();
			}else{
				this.addClass(opt.cls).html($$.toHtml(plugin.sub)).after($$.toHtml(dropdown));
				opt.plugin=this;
			}
			opt.plugin.width(this.outerWidth()-opt.plugin.delta('width'));
			opt.plugin.find('>span>span').html('<input type="text" class="combo-text" style="width:0;"/>');
			opt.textField=opt.plugin.find('input[type=text]').fitParent({wh:'width'}).attr('readonly',opt.readonly);
			!$$.is('!emptyStr',opt.name)&&(opt.name=this.attr('name'));
			this.removeAttr('name');
			opt.listCls=='tree'&&(opt.multiple=false);
			!opt.multiple&&$$.is('!emptyStr',opt.name)&&(opt.valueField=$('<input type="hidden",name="'+opt.name+'" />').insertAfter(opt.textField));
			opt.comboPanel=opt.plugin.next();
			opt.comboPanel.width(opt.width=='auto'?opt.plugin.outerWidth()-opt.comboPanel.delta('width'):opt.width).height(opt.height)
				.popup({
					cls:'',
					pos:[
						{by:opt.plugin,mode:'margin',side:'bottom',container:window,adjustMode:'changeSide,offset,resize'},
						{by:opt.plugin,mode:'padding',side:'left'}
					],
					repos:true,
					open:{auto:false}
				});
			var treeOpt={
				cls:opt.listCls,
				radioOrCheckbox:'',
				closeSilbings:false,
				adapter:function(attr,obj){attr.value=obj.value||obj.text;obj.selected&&(attr.selected=obj.selected);},
				data:opt.data,
				click:function(jsc){
					text=jsc.button.text(),value=jsc.button.attr('value'),oldText=opt.textField.val();
					if(text!=oldText){
						opt.textField.val(text);
						if(opt.valueField){
							opt.valueField.val(value);
						}
						$.isFunction(opt.onchange)&&opt.onchange.call(this,value);
					}
					$$.$doc.mousedown();
				}
			};
			if(opt.listCls!='tree'){
				$.extend(treeOpt,{
					nodeCls:opt.itemCls,
					expendedCls:opt.groupCls,
					textCls:opt.titleCls,
					lastItem:'',
					folderCls:'',
					subtreeCls:'',
					hitareaCls:'',
					leafCls:'',
					selectedCls:opt.itemSelectedCls,
					iconCls:opt.iconCls,
					initOpen:true,
					buttonOpt:{
						selector:'li>span',
						mouseenter:function(jsc){
							!jsc.button.hasClass(opt.groupCls)&&jsc.button.addClass(opt.itemHoverCls);
						},
						mouseleave:function(jsc){
							!jsc.button.hasClass(opt.groupCls)&&jsc.button.removeClass(opt.itemHoverCls);
						},
						click:function(jsc){
							if(!jsc.button.hasClass(opt.groupCls)){
								if(opt.multiple){
									jsc.button.toggleClass(opt.itemSelectedCls);
									var text='',values=[],oldText=opt.textField.val();
									jsc.plugin.find('.'+opt.itemSelectedCls).each(function(){
										var title=$(this).find('.'+opt.titleCls);
										text+=title.text()+';';
										values.push(title.attr('value'));
									});
									if(text!=oldText){
										opt.textField.val(text);
										if($$.is('!emptyStr',opt.name)){
											opt.textField.nextAll('input:hidden').remove();
											var valueField=$();
											for(var i=0;i<values.length;i++){
												valueField=valueField.add('<input type="hidden" name="'+opt.name+'" value="'+values[i]+'"/>');
											}
											opt.textField.after(valueField);
										}
										$.isFunction(opt.onchange)&&opt.onchange.call(this,values);
									}									
								}else{
									jsc.plugin.find('.'+opt.itemCls).removeClass(opt.itemSelectedCls);
									jsc.button.addClass(opt.itemSelectedCls);
									var title=jsc.button.find('.'+opt.titleCls),
									text=title.text(),value=title.attr('value'),oldText=opt.textField.val();
									if(text!=oldText){
										opt.textField.val(text);
										$$.is('!emptyStr',opt.iconCls)&&opt.textField.parent().attr('class',title.prev().attr('class'));
										if(opt.valueField){
											opt.valueField.val(value);
										}
										$.isFunction(opt.onchange)&&opt.onchange.call(this,value);
									}
									$$.$doc.mousedown();
								}
							}							
						}
					}
				});
			}
			var tree=opt.comboPanel.find('ul').tree(treeOpt);
			var sel=tree.find('[selected]');
			if(sel.length){
				var onchange=opt.onchange;
				opt.onchange=null;
				sel.click();
				opt.onchange=onchange;
				sel.removeAttr('selected');
			}
			opt.plugin.children().button({cls:'',iconOnly:'',toggleCls:[{cls:'',hover:opt.hoverCls,press:''}],mousedown:function(){opt.isOpen=opt.comboPanel.is(':visible')},click:function(){!opt.isOpen&&opt.comboPanel.popup('open')}});
		}
	});
})(jQuery);
