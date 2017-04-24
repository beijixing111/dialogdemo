;(function($){
	var Dialog = function(config){
		var _this_ = this;
		//默认参数配置
		this.config = {
			
			//对话框的宽
			width:"auto",
			height:"auto",
			//对话框提示信息
			message:null,
			type:"waiting",
			//按钮配置
			buttons:null,
			//弹出框多久关闭
			delay:null,
			//延时关闭回调函数
			delayCallback:null,
			//遮罩层透明度
			maskOpacity:null,
			//点击遮罩层是否关闭
			maskClose: null,
			effect: null
		};

		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		}else{
			this.isConfig = true;
		}
		//创建基本的DOM
		this.body = $("body");
		//创建遮罩层
		this.mask =$('<div class="g-dialog-contianer"></div>');
		//创建弹出框
		this.win = $('<div class="dialog-window"></div>');
		//创建弹出框头部
		this.winHeader = $('<div class="dialog-header"></div>');
		//创建提示信息
		this.winContent = $('<div class="dialog-content"></div>');
		//创建弹出框按钮组
		this.winFooter = $('<div class="dialog-footer"></div>');

		//渲染DOM
		this.creat();
	};
	//设置遮罩层级
	Dialog.zIndex = 10000;

	Dialog.prototype = {
		//添加动画函数
		animate:function(){
			var _this_ = this;
			this.win.css("-webkit-transform","scale(0)");
			window.setTimeout(function(){
				_this_.win.css("-webkit-transform","scale(1)");
			},100);
		},
		//创建弹出框
		creat:function(){
			var _this_ = this,
				config = this.config,
				mask = this.mask,
				win = this.win,
				header = this.winHeader,
				content = this.winContent,
				footer = this.winFooter,
				body = this.body;

			//增加弹框的层级
			Dialog.zIndex++;
			this.mask.css("zIndex",Dialog.zIndex);

			//如果没有传递任何参数，就弹出一个等待的图标
			if(this.isConfig){
				win.append(header.addClass('waiting'));
				if(config.effect){
					this.animate();
				}
				mask.append(win);
				body.append(mask);
			}else{
				//如果设置参数，根据设置获取
				header.addClass(config.type);
				win.append(header);
				//如果传递了信息文本
				if(config.message){
					win.append(content.html(config.message));
				}
				//如果传递了按钮组
				if(config.buttons){
					this.creatButtons(footer,config.buttons);
					win.append(footer);
				}
				//插入到页面
				mask.append(win);
				body.append(mask);

				//设置对话框的宽高
				if(config.width !="auto"){
					win.width(config.width);
				}
				if(config.height != "auto"){
					win.height(config.height);
				}
				//如果设置透明度
				if(config.maskOpacity){
					win.css("backgroundColor","rgba(0,0,0,"+config.maskOpacity+")");
				}
				//如果设置关闭时间
				if(config.delay && config.delay !=0 ){
					window.setTimeout(function(){
						_this_.close();
						//执行延时回调函数
						config.delayCallback && config.delayCallback();

					},config.delay);
				}
				if(config.effect){
					this.animate();
				}
				//点击遮罩层是否关闭
				if(config.maskClose){
					// mask.tap(function(){
					// 	_this_.close();
					// });
					mask.click(function(){
						_this_.close();
					});
				}

			}	

		},
		//根据传递按钮个数，创建按钮个数
		creatButtons:function(footer,buttons){
			var _this_ = this;
			// alert(this);
			$(buttons).each(function(){
				//获取的样式，回调和文本
				var type = this.type?' class="'+this.type+'"':"";
				var btnText = this.text?this.text:"按钮"+(++i);
				var callback = this.callback?this.callback:null;
				var button = $('<button'+type+'>'+btnText+'</button>');
				if(callback){
					// button.tap(function(e){
					// 	var isClose = callback();
					// 	//阻止时间冒泡
					// 	e.stopPropagation();
					// 	if(isClose != false){
					// 		_this_.close();
					// 	}
					// });
					button.click(function(e){
						var isClose = callback();
						//阻止时间冒泡
						e.stopPropagation();
						if(isClose != false){
							_this_.close();
						}
					});
				}else{
					// button.tap(function(e){
					// 	e.stopPropagation();
					// 	_this_.close();
					// });
					button.click(function(e){
						e.stopPropagation();
						_this_.close();
					});
				}
				footer.append(button);
			});
		},
		close:function(){
			this.mask.remove();
		}
	};
	window.Dialog = Dialog;
	$.dialog = function(config){
		return new Dialog(config);
	};
})(Zepto);