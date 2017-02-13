$(function(){
	var $login = $.cookie("login") ? JSON.parse($.cookie("login")) : [];
	var $login2 = $.cookie("login2") ? JSON.parse($.cookie("login2")) : [];
	if($login.length != 0){
		login($login.name); 
		console.log($login.name);
		var cartName = "cart_"+$login.name; 
		cartNum(cartName); 
	}else if($login2.length != 0){
		login($login2.name); 
		var cartName = "cart_"+$login2.name; 
		cartNum(cartName); 
	}else{
		$(".cover-box").css("visibility","visible");
		$(".cover-box").html(
			"亲，请先登录，不然看不到购物车的哦~"
			+"<a href='login.html'>点此登录</a>"
		)
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
	function updateAllCounts(){
		var allMoney = 0;
//		console.log(goodsList);
		for(var i=0;i<goodsList.length;i++){
//			console.log($("input[type=checkbox]").eq(i+1)[0].checked)
			if($("input[type=checkbox]").eq(i+1)[0].checked){
				allMoney+= Number($("input[type=checkbox]").eq(i+1).parent().find(".list-count").html().split("￥")[1]);
				console.log($("input[type=checkbox]").eq(i+1).parent().find(".list-count").html());
			}
		}
		$(".cart-all-count p span").html(Math.floor(allMoney*100)/100);
		
	}
	function updateGoodsList(num,id,data,cartName){
		for(var i=0;i<data.length;i++){
			if(data[i].id == id){
				data[i].num = num;
				break;
			}
		}
		$.cookie(cartName,JSON.stringify(data),{expires:7, path:"/"});
		goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
	}
	if($login2.length != 0||$login.length != 0){
		var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
//		console.log(goodsList);
		if(goodsList.length){
			$.get("../json/detail.json",function(data){
				var allMoney = 0;
				for(var i=0;i<goodsList.length;i++){
					var obj = data[goodsList[i].id];
					var id = goodsList[i].id;
					console.log(obj);
					var oDiv = $("<div>").addClass("cart-list").html(
						"<input type='checkbox' checked='checked' class='list-check' />"+
						"<a href='detail.html?"+id+"'><img src="+obj.zoom[0]+"/></a>"
					);
					$("<p>").addClass("list-title").html(
						"<a href='detail.html?"+id+"'>"+obj.title+"</a>"
					).appendTo(oDiv);
					$("<p>").addClass("list-price").html(obj.moreprice).appendTo(oDiv);
					$("<div>").addClass("list-number").html(
						"<input type='button' class='reduce-btn' value='-' />"+
						"<input type='text' class='number' id="+id+" value="+goodsList[i].num+" />"+
						"<input type='button' class='add-btn' value='+' />"
					).appendTo(oDiv);
					money = obj.moreprice.split("￥")[1];
					$("<p>").addClass("list-count").html("￥"+Math.floor(money*goodsList[i].num*100)/100).appendTo(oDiv);
					allMoney+=money*goodsList[i].num;
					$("<div>").addClass("list-act").html(
						"<a href='#'>收藏</a><br />"+
						"<a href='#' class='delete'>删除</a>"
					).appendTo(oDiv);
					oDiv.insertBefore($(".cart-all-count"));
				}
				$(".cart-all-count p span").html(Math.floor(allMoney*100)/100);
				$("#all-checked").click(function(){
	//				console.log($("#all-checked")[0].checked)
					if($("#all-checked")[0].checked){
						$("input[type=checkbox]").attr("checked","checked");
						$("input[type=checkbox]").prop("checked","checked");
					}else{
						$("input[type=checkbox]").attr("checked",false);
						
					}
				});
				$(".add-btn").click(function(){
					var newNum = $(this).parent().find(".number").val();
					newNum++;
					var id = $(this).parent().find(".number")[0].id;
					updateGoodsList(newNum,id,goodsList,cartName);
					$(this).parent().parent().find(".list-count").html("￥"+Math.floor(data[id].moreprice.split("￥")[1]*newNum*100)/100)
					$(this).parent().find(".number").val(newNum);
					cartNum(cartName);
					updateAllCounts();
				})
				$(".reduce-btn").click(function(){
					if($(this).parent().find(".number").val()>1){
						var newNum = $(this).parent().find(".number").val();
						newNum--;
						var id = $(this).parent().find(".number")[0].id;
						updateGoodsList(newNum,id,goodsList,cartName);
						$(this).parent().parent().find(".list-count").html("￥"+Math.floor(data[id].moreprice.split("￥")[1]*newNum*100)/100)
						$(this).parent().find(".number").val(newNum);
						cartNum(cartName);
						updateAllCounts();
					}
				})
				$(".delete").bind("click",function(){
					$(this).parent().parent().remove();
					var id = $(this).parent().parent().find(".number")[0].id;
					for(var i=0;i<goodsList.length;i++){
						if(goodsList[i].id == id){
							break;
						}
					}
					goodsList.splice(i,1);
					updateAllCounts();
					$.cookie(cartName,JSON.stringify(goodsList),{expires:7, path:"/"});
					goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
					cartNum(cartName);
					if(!goodsList.length){
						$(".cover-box").css("visibility","visible");
					}
				})
				$("input[type=checkbox]").click(function(){
					updateAllCounts();
				})
			})
		}else{
			console.log(1)
			$(".cover-box").css("visibility","visible");
		}
			
	}
		
})