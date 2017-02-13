$(function() {
	var $login = $.cookie("login") ? JSON.parse($.cookie("login")) : [];
	var $login2 = $.cookie("login2") ? JSON.parse($.cookie("login2")) : [];
	var $nearly = $.cookie("nearly") ? JSON.parse($.cookie("nearly")) : [];
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
		console.log($login.name);
		var cartName = "cart_"+$login.name; 
		cartNum(cartName); 
	}else if($login2.length != 0){
		login($login2.name); 
		var cartName = "cart_"+$login2.name; 
		cartNum(cartName); 
	}
	function cartNum(cartName){
		var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
		var goodsNumber = 0;
		for(var i=0 ; i<goodsList.length ; i++){
			goodsNumber += Number(goodsList[i].num);
			console.log(goodsList[i].num)
		}
		$(".shopcar span").first().html(goodsNumber);
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
	
	$.get("../json/detail.json",function(data){
		var id = parseInt(window.location.href.split("?")[1]);
		var nearlyCount = 0;
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
	    		location.href = "list.html?"+ids.join("-");
	    	}else{
	    		location.href = "list.html";
	    	}
	    })
		if(id){
			for(var i=0;i<$nearly.length;i++){
				if($nearly[i].id != id && nearlyCount<=4){
					var oid = $nearly[i].id;
					var obj = data[oid];
					var oDl = $("<dl>");
					$("<dt>").html("<a href='detail.html?"+oid+"'><img src="+obj.zoom[0]+"/></a>").appendTo(oDl);
					$("<dd>").html("<a href='detail.html?"+oid+"'>"+obj.title+"</a><span>"+obj.moreprice+"</span>").appendTo(oDl);
					oDl.appendTo(".nearly-box");
					nearlyCount++;
				}
			}
			for(var i=0;i<$nearly.length;i++){
				if($nearly[i].id == id || i>=5){
					$nearly.splice(i,1);
					i--;
				}
			}
			var nearlylook = {
				"id":id
			}
			$nearly.unshift(nearlylook);
			$.cookie("nearly",JSON.stringify($nearly), {expires:7, path:"/"});
			console.log($nearly);
			var obj = data[id];
			for(var i=0;i<obj.zoom.length;i++){
				var oDiv = $("<div>");
				var img = $("<img />").attr("src",obj.zoom[i]);
				img.appendTo(oDiv);
				oDiv.appendTo($(".tab-box"));
				if(!i){
					oDiv.addClass("choose");
					$(".min-bg").attr("src",obj.zoom[i]);
					$(".max-bg").attr("src",obj.zoom[i]);
				}
			}
			$(".user-btn1").eq(0).attr("href","login.html#detail?"+id);
			$(".user-btn1").eq(1).attr("href","register.html#detail?"+id);
			var x = 0;
			var y = 0;
			$(".min").mousemove(function(e){
				x = e.clientX-$(".min").offset().left-60;
				y = e.clientY+$(window).scrollTop()-$(".min").offset().top-60;
				if(y>=250){
					y=250;
				}
				if(x>250){
					x=250
				}
				if(x<10){
					x=10;
				}
				if(y<=10){
					y=10;
				}
				$(".hover-box").css({
					"left":x,
					"top":y
				})
				$(".max img").css({
					"left":-(x-10)*10/6,
					"top":-(y-10)*10/6
				})
			})
			$(".goods-title").html(obj.title);
			$(".content-title").html(obj.href);
			$(".one-price").html(obj.oneprice);
			$(".more-price").html(obj.moreprice);
			$(".tab-page").eq(0).find("img").attr("src",obj.detail);
			$(".tab-title li").mouseover(function(){
				$(this).addClass("active").siblings().removeClass("active");
				$(".tab-page").eq($(this).index()).addClass("show").siblings().removeClass("show");
			})
			$(".tab-box div").mouseover(function(){
				$(this).addClass("choose").siblings().removeClass("choose");
				$(".max img").attr("src",$(this).find("img")[0].src);
				$(".min img").attr("src",$(this).find("img")[0].src);
			})
			for(var i=0;i<obj.youlike.length;i++){
				var obj1 = data[obj.youlike[i]];
				var oDiv = $("<div>").html(
									"<a href='detail.html?"+obj.youlike[i]+"'><img src="+obj1.zoom[0]+"/></a>"+
									"<a href='detail.html?"+obj.youlike[i]+"'>"+obj1.title+"</a>"+
									"<span>"+obj1.moreprice+"</span>"
				);
				oDiv.addClass("youlike-div");
				if(i==obj.youlike.length-1){
					oDiv.css("border-right","0px");
				}
				oDiv.appendTo($(".youlike-box"));
			}
		}
		$(".buy-cart").click(function(e){
			e.preventDefault();
			var num = $("#goods-num").val();
			var goodsFlag = false;
			if($login.length != 0||$login2.length != 0){
				var cartName = "cart_"+($login.length!=0 ? $login.name : $login2.name);
				var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
				for(var i=0;i<goodsList.length;i++){
					if(goodsList[i].id == id){
						goodsList[i].num = Number(num)+Number(goodsList[i].num);
						goodsFlag = true;
					}
				}
				if(!goodsFlag){
					var goodsObj = {
						"id":id,
						"num":num
					}
					goodsList.unshift(goodsObj);
				}
				$.cookie(cartName, JSON.stringify(goodsList), {expires:7, path:"/"});
				alert("添加成功");
				cartNum(cartName);
			}else{
				alert("请先登录~");
				location.href = "login.html#detail?"+id;
			}
		})
		
	})

})