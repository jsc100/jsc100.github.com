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
})(jQuery);