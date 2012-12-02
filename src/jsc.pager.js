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
})(jQuery);
