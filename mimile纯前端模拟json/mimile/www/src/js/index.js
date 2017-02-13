$(function() {
	var $login = $.cookie("login") ? JSON.parse($.cookie("login")) : [];//自动登录的用户名或刚刚登录并勾选了自动登录的用户名
	var $login2 = $.cookie("login2") ? JSON.parse($.cookie("login2")) : [];
	String.prototype.isLike = function(exp, i) {
        var str = this;
        i = i == null ? false : i;
        if (exp.constructor == String) {
            var s = exp.replace(/_/g, function(m, i) {
                if (i == 0 || i == exp.length - 1) {
                    return ".";
                }
                else {
                    if (exp.charAt(i - 1) == "[" && exp.charAt(i + 1) == "]") {
                        return m;
                    }
                    return ".";
                }
            });
            s = s.replace(/%/g, function(m, i) {
                if (i == 0 || i == s.length - 1) {
                    return ".*";
                }
                else {
                    if (s.charAt(i - 1) == "[" && s.charAt(i + 1) == "]") {
                        return m;
                    }
                    return ".*";
                }
            });
            s = s.replace(/\[_\]/g, "_").replace(/\[%\]/g, "%");
            var regex = new RegExp(s, i ? "" : "i");
            return regex.test(this);
            
        }
        return false;
    };
	Array.prototype.selectLike = function(exp, fun) {
        var arr = [];
        if (fun && fun.constructor == Function) {
            for (var i = 0; i < this.length; i++) {
                if (fun(this[i], exp)) {
                    arr.push(i+1);
                }
            }
        }
        else {
            for (var i = 0; i < this.length; i++) {
                if (this[i].isLike(exp, false)) {
                    arr.push(i+1);
                }
            }
        }
        return arr;
    };
	if($login.length != 0){
		login($login.name); 
//		console.log($login.name);
		var cartName = "cart_"+$login.name; 
		cartNum(cartName); 
	}else if($login2.length != 0){
		login($login2.name);
//		console.log($login2.name);
		var cartName = "cart_"+$login2.name; 
		cartNum(cartName); 
	}else{
		$(".shopcar span").hide();
	}
	function cartNum(cartName){
		var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
		var Number = 0;
		for(var i=0 ; i<goodsList.length ; i++){
			Number += goodsList[i].num;
		}
		$(".shopcar span").html(Number);
	}
	function login(name){
		$(".user-btn1").hide();//登录了就不需要登录和注册了
		$(".user-btn2").show();
		$(".title-left span").html(name);
		//退出当前账号
		$(".user-btn2").click(function(){
			//删除cookie
			$.cookie("login2","",{expires:0, path:"/"});
			$.cookie("login","",{expires:0, path:"/"});
			//刷新页面
			location.reload();
		});
	}
	$.get("json/index.json",function(data){
		var $slidebox = data.slidebox;
		for(var i=0;i<$slidebox.length;i++){
			var obj = $slidebox[i];
			if(!i){
				$("<img/>").attr("src",obj.img).addClass("slidebox-first").appendTo($(".shop-img-box"));
				$("<li>").addClass("hover").appendTo($(".shop-list"));
			}else{
				$("<img/>").attr("src",obj.img).appendTo($(".shop-img-box"));
				$("<li>").appendTo($(".shop-list"));
			}
		}
		var timer = null; //定时器
		var $nowindex = 0; //当前图序号
		var $nextindex = 0; //下张图序号或者要点击的序号
	
		//鼠标移进移出
		$(".shop-list li").mousemove(function() {
			clearInterval(timer);
			$nextindex = $(this).index();
			imgMove();
			$nowindex = $nextindex;
		}).mouseout(function() {
			Moving();
		});
	
	
		
		$(".select").eq($nextindex).addClass("hover"); //起始时nextindex为0表示第一个图，所以我们给第一个强制添加背景
	
		Moving();
		//滑动的动作
		function imgMove() {
			//siblings() 获得匹配集合中每个元素的同胞，通过选择器进行筛选是可选的。
			$(".shop-list li").eq($nextindex).addClass("hover").siblings().removeClass("hover");
			if ($nextindex > $nowindex) {
				$(".shop-img-box img").eq($nowindex).stop(true, true).animate({
					"left": "-50%"
				}); //.eq()选择器选择带有指定index值的元素
				$(".shop-img-box img").eq($nextindex).css("left", "50%").stop(true, true).animate({
					"left": "0"
				});
			} else if ($nowindex > $nextindex) {
				$(".shop-img-box img").eq($nowindex).stop(true, true).animate({
					"left": "50%"
				});
				$(".shop-img-box img").eq($nextindex).css("left", "-50%").stop(true, true).animate({
					"left": "0"
				});
			}
		}
	
		//动起来
		function Moving() {
			timer = setInterval(function() {
				$nextindex++;
				if ($nextindex > 4) {
					$nextindex = 0;
				}
				imgMove();
				$nowindex = $nextindex;
			}, 5000);
		}
		
		var $tabChange = data.tabChange;
		for(var i=0;i<$tabChange.length;i++){
			var obj = $tabChange[i];
			var tabPage = $("<div>").addClass("tab-pages");
			if(!i){
				tabPage.addClass("show");
			}
			for(var j=0;j<obj.length;j++){
				var obj1 = obj[j];
				var oDiv = $("<div>");
				var oA = $("<a>").attr("href","html/detail.html?"+obj1.id);
				$("<img />").attr("src",obj1.img).appendTo(oA);
				oA.appendTo(oDiv);
				$("<a>").html(obj1.describe).attr("href","html/detail.html?"+obj1.id).appendTo(oDiv);
				$("<span>").html(obj1.price).appendTo(oDiv);
				oDiv.appendTo(tabPage);
			}
			tabPage.appendTo(".tab-box");
		}
		$(".tab-title").mouseover(function(){
			$(this).addClass("tab-hot").siblings().removeClass("tab-hot");
			$(".tab-pages").eq($(this).index()).addClass("show").siblings().removeClass("show");
		})
		var $contentPages = data.content_page;
		for(var i=0;i<$contentPages.length;i++){
			var oDiv = $("<div>").addClass("content-page");
			var obj = $contentPages[i];
			
			for(var j=0;j<obj.length;j++){
				var obj1 = obj[j];
//				console.log(obj1);
				var oA = $("<a>").attr({"href":"html/detail.html?"+obj1.id,"style":"background:url("+obj1.img+")"});
				if(!j){
					oA.addClass("content-page-first");
				}else{
					if(j<=2){
						oA.addClass("content-page-other-top");
					}
					oA.addClass("content-page-other");
				}
				var oSpan = $("<span>").addClass("page-message");
				$("<p>").html(obj1.detail1).appendTo(oSpan);
				$("<p>").html(obj1.detail2).appendTo(oSpan);
				$("<span>").html(obj1.detail3).appendTo(oSpan);
				$("<p>").html(obj1.detail4).appendTo(oSpan);
				oSpan.appendTo(oA);
				oA.appendTo(oDiv);
			}
			oDiv.appendTo($(".content-page-box").eq(i));
		}
	});
	$.get("json/detail.json",function(data){
		var availableTags = [];
		for(var i in data){
			availableTags.push(data[i].title);
		}
		$( "#txt" ).autocomplete({
	      	source: availableTags
	    });
	    $("#submit-btn").click(function(e){
	    	e.preventDefault()
	    	console.log($("#txt").val());
	    	var ids = availableTags.selectLike($("#txt").val());
	    	if(ids){
	    		console.log(ids);
//	    		alert(ids.join("-"));
	    		location.href = "html/list.html?"+ids.join("-");
	    	}else{
	    		location.href = "html/list.html";
	    	}
	    })
	});
});

