$(function(){
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
		$("#judge-code").html(str);
	}
	//获取用户名和密码（勾选了自动登录的用户名和密码）
	var $login = $.cookie("login") ? JSON.parse($.cookie("login")) : [];
	if($login.length != 0){
		$("#txt").val($login.name_mail);
		$("#psw").val($login.password);
		$("form input[type='checkbox']").prop("checked",true);
	}
	$("#judge-code").click(function(){
		verCode();
	});
	$("#sign-in").click(function(){
		var Return = window.location.href.split("#")[1];
//		alert(window.location.href.split("#"));
		location.href = "register.html#"+Return;
	})
	var $msgList = $.cookie("msg") ? JSON.parse($.cookie("msg")) : [];
	console.log($msgList);
	$("form input[type='submit']").click(function(e){
		e.preventDefault();
		var pattern = new RegExp($("#txt1").val(),"ig");
		if( !pattern.test(str) ){
			alert("验证码错误");
			verCode();
			$("#txt1").val(null);
		}else{
			var flag = false;
			for(var i=0 ; i<$msgList.length ; i++){
				if(($("#txt").val() == $msgList[i].name_tel || $("#txt").val() == $msgList[i].name_mail) && $("#psw").val() == $msgList[i].password){
					flag = true;
					break;
				}
			}
			if(flag){
				var msg = {
					"name": $("#txt").val()
				};
				if($("form input[type='checkbox']").prop("checked")){
					$.cookie("login",JSON.stringify(msg),{expires:10, path:"/"});
				}else{
					$.cookie("login","",{expires:0, path:"/"});
					$.cookie("login2",JSON.stringify(msg),{expires:null, path:"/"});
				}
				var Return = window.location.href.split("#")[1];
				if(!Return){
						location.href = "../index.html";
				}else{
					if(Return.indexOf("?")>=0){
						location.href = Return.split("?")[0]+".html?"+Return.split("?")[1];
					}else{
						location.href = Return+".html";
					}
//					
				}
					
			}else{
				alert("用户名或密码错误!");
				verCode();
				$("#txt1").val(null);
			}
		}
	});
});