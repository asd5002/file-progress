$(function() {
	var $login = $.cookie("login") ? JSON.parse($.cookie("login")) : [];//自动登录的用户名或刚刚登录并勾选了自动登录的用户名
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
		var cartName = "cart_"+$login.name; 
		cartNum(cartName); 
	}else if($login2.length != 0){
		login($login2.name); 
		var cartName = "cart_"+$login2.name; 
		cartNum(cartName); 
	}
	function cartNum(cartName){
		var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
		var Number = 0;
		for(var i=0 ; i<goodsList.length ; i++){
			Number += goodsList[i].num;
		}
		$(".shopcar span").first().html(Number);
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
		var str = window.location.href.split("?")[1];
		if(!str){
			for(var i in data){
				createlist(i,i,data);
			}
			$(".user-btn1").eq(0).attr("href","login.html#list");
			$(".user-btn1").eq(1).attr("href","register.html#list");
		}else{
			var arr = str.split("-");
			for(var i=0;i<arr.length;i++){
				var id = parseInt(arr[i]);
				createlist(i,id,data);
			}
			$(".user-btn1").eq(0).attr("href","login.html#list?"+str);
			$(".user-btn1").eq(1).attr("href","register.html#list?"+str);
		}
		$(".tab-turn-box div").mouseover(function(){
			$(this).addClass("choose").siblings().removeClass("choose");
			$(this).parent().parent().parent().parent().find(".show-img").attr("src",$(this).find("img")[0].src);
		})
		$(".list-box").hover(function(){
			$(this).addClass("cover");
			$(this).find(".list-box-content").css("height",400);
			$(this).find(".list-move").stop().animate({"top":"-55px"},400);	
		},function(){
			$(this).removeClass("cover");
			$(this).find(".list-move").stop().animate({"top":"0px"},400);
		})
		for(var i=0;i<$nearly.length;i++){
			if(i<=4){
				var id = $nearly[i].id;
				var obj = data[id];
				var oDl = $("<dl>");
				$("<dt>").html("<a href='detail.html?"+id+"'><img src="+obj.zoom[0]+"/></a>").appendTo(oDl);
				$("<dd>").html("<a href='detail.html?"+id+"'>"+obj.title+"</a><span>"+obj.moreprice+"</span>").appendTo(oDl);
				oDl.appendTo(".nearly-box");
			}
		}
		
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
	    		location.href = "list.html?"+ids.join("-");
	    	}else{
	    		location.href = "list.html";
	    	}
	    })
		
	})
	function createlist(i,id,data){
		var obj = data[id];
		var $listBox = $("<div>").addClass("list-box");
		var $listBoxContent = $("<div>").addClass("list-box-content").html(
			"<a href='detail.html?"+id+"'><img src="+obj.zoom[0]+" class='show-img'/></a>"
		);
		var $listMove = $("<div>").addClass("list-move");
		var $tabTurn = $("<div>").addClass("tab-turn");
		var $tabTurnBox = $("<div>").addClass("tab-turn-box");
		var $priceBox = $("<div>").addClass("price-box").html(
			"<a href='detail.html?"+id+"'>"+obj.title+"</a>"+
			"<span class='more-price'>"+obj.moreprice+"</span>"+
			"<span class='one-price'>"+obj.oneprice+"</span>"
		);
		for(var j=0;j<obj.zoom.length;j++){
			var oDiv = $("<div>");
			if(!j){
				oDiv.addClass("choose");
			}
			var oImg = $("<img />").attr("src",obj.zoom[j]);
			oImg.appendTo(oDiv);
			oDiv.appendTo($tabTurnBox);
		}
		var $bottomLink = $("<a>").addClass("bottom-link").html("<img src='../img/list/botton.png' class='bottom-img'/>").attr("href","detail.html?"+id);
		if(i%4==3){
			$listBox.css("margin-right",0);
		}
		$tabTurnBox.appendTo($tabTurn);
		$priceBox.appendTo($tabTurn);
		$tabTurn.appendTo($listMove);
		$bottomLink.appendTo($listMove);
		$listMove.appendTo($listBoxContent);
		$listBoxContent.appendTo($listBox);
		$listBox.appendTo($(".list-content"));
	}
})