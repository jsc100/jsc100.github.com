/**
 * jQuery jsc 1.0
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Copyright 2012 caoshujun [ jsc100@qq.com ] 
 * 
 * refer to:
 * DD_roundies, this adds rounded-corner CSS in standard browsers and VML sublayers in IE that accomplish a similar appearance when comparing said browsers.
 * Author: Drew Diller
 * Email: drew.diller@gmail.com
 * URL: http://www.dillerdesign.com/experiment/DD_roundies/
 * Version: 0.0.2a
 * Licensed under the MIT License: http://dillerdesign.com/experiment/DD_roundies/#license

 * PIE: CSS3 rendering for IE
 * Version 1.0.0
 * http://css3pie.com
 * Dual-licensed for use under the Apache License Version 2.0 or the General Public License (GPL) Version 2.
 */
(function($){
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
})(jQuery);
