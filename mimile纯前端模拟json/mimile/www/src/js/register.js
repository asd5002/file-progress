$(function(){
	var $ans = $(".ans"); //提示
	var $txt = $("#txt");
	var $psw = $("#psw");
	var $psw1 = $("#psw1");
	var $txt1 = $("#txt1");
	var $txt2 = $("#txt2");
	var flag1 = flag2 = flag3 = false;
	//获取验证码
	var str;
	verCode();
	function verCode(){
		str = "";
		var arr = ['a','b','c','d','e','f','g','h','i','g','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
				   'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
				   '0','1','2','3','4','5','6','7','8','9'];
		var i = 0;
		while(i != 4){
			i++;
			str += arr[parseInt(Math.random()*61)];
		}
		$(".judge-code").html(str);
	}
	//15197200954
	//获取已经注册过的信息
	var $msgList = $.cookie("msg") ? JSON.parse($.cookie("msg")) : [];
	//可以注册的信息
	var msgName_tel;
	var msgName_mail;
	var msgPassword;
	//手机号码验证
	$(".judge-code").click(function(){
		verCode();
	});
	$txt.blur(function(){
		var Reg = /^\d{11}$/;
		if(!Reg.test($(this).val())){
			$(".ans").html("手机号码不符合规范");
			flag1 = false;
		}else{
			var self = true;//是否没有被注册
			for(var i=0 ; i<$msgList.length ; i++){
				if($(this).val() == $msgList[i].name){
					self = false;
					break;
				}
			}
			if(self){
				$(".ans").html("");
				msgName_tel = $(this).val();
				flag1 = true;
			}else{
				$(".ans").html("该用户名已被注册");
				flag1 = false;
			}
		}
	});
	$(".login-btn").click(function(){
		var Return = window.location.href.split("#")[1];
		location.href = "login.html#"+Return;
	})
	//邮箱地址验证
	$txt1.blur(function(){
		var Reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(!Reg.test($(this).val())){
			$(".ans").html("邮箱地址不符合规范");
			flag1 = false;
		}else{
			var self = true;//是否没有被注册
			for(var i=0 ; i<$msgList.length ; i++){
				if($(this).val() == $msgList[i].name){
					self = false;
					break;
				}
			}
			if(self){
				$(".ans").html("");
				msgName_mail = $(this).val();
				flag1 = true;
			}else{
				$(".ans").html("该用户名已被注册");
				flag1 = false;
			}
		}
	});
	//密码验证
	$psw.blur(function(){
		password($(this).val());
	});
	function password(Text){
		var Reg = /\s/;
		if(Reg.test(Text)){
			$(".ans").html("密码不能有空格");
			flag2 = false;
		}else if(Text.length < 8){
			$(".ans").html("密码长度不能小于八位");
			flag2 = false;
		}else if(Text.length > 16){
			$(".ans").html("密码长度不能大于十六位");
			flag2 = false;
		}else{
			$(".ans").html("");
			msgPassword = Text;
			flag2 = true;
		}
	}
	//确认密码
	$psw1.blur(function(){
		confirmPassword($(this).val(),$psw);
	});
	function confirmPassword(Text,obj){
		if(obj.val() != Text){
			$(".ans").html("输入密码不一致");
			flag3 = false;
		}else{
			$(".ans").html("");
			flag3 = true;
		}
	}
	//服务条款
	$("input[type='checkbox']").click(function(){
		if($(this).prop("checked")){
			$(this).parent().next().attr("id",null);
		}else{
			$(this).parent().next().attr("id","noclick");
		}
	});
	//注册
	$("form").find("input[type='submit']").click(function(e){
		//阻止默认事件
		e.preventDefault();
		var Reg = new RegExp($("#txt2").val(),"ig");
		if(!Reg.test(str) ){
			alert("验证码错误");
			verCode();
			$("#txt2").val(null);
		}
		else{
			if($(this).attr("id") != "noclick"){ //是否同意了服务条款
				if(flag1 && flag2 && flag3){
					var newMsg = {
						"name_tel": msgName_tel,
						"name_mail": msgName_mail,
						"password": msgPassword
					};
					var loginMsg = {
						"name":msgName_tel
					}
					$msgList.push(newMsg);
					$.cookie("msg",JSON.stringify($msgList),{expires:10, path:"/"});
					$.cookie("login2",JSON.stringify(loginMsg),{expires:null, path:"/"})
					//重新获取一下,更新用户名库
					$msgList = $.cookie("msg") ? JSON.parse($.cookie("msg")) : [];
					//清空信息框
					$("form").find("input[type='text']").val(null);
					$("form").find("input[type='password']").val(null);
					console.log($.cookie("msg"));
					alert("注册成功!");
					var Return = window.location.href.split("#")[1];
					alert(window.location.href);
					if(!Return){
							location.href = "../index.html";
					}else{
						if(Return.indexOf("?")>=0){
							location.href = Return.split("?")[0]+".html?"+Return.split("?")[1];
						}else{
							location.href = Return+".html";
						}
					}
					
				}else{
					alert("有信息不符合规范请重新输入");
				}
			}
		}
	});
});