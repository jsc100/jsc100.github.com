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
})(jQuery);