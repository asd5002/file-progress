particlesJS('content-bg', {
	particles: {
		color: '#fff',
		shape: 'circle', // "circle", "edge" or "triangle"
		opacity: 1,
		size: 4,
		size_random: true,
		nb: 200,
		line_linked: {
			enable_auto: true,
			distance: 120,
			color: '#f00',
			opacity: 1,
			width: 1,
			condensed_mode: {
				enable: true,
				rotateX: 400,
				rotateY: 700
			}
		},
		anim: {
			enable: true,
			speed: 2
		}
	},
	interactivity: {
		enable: true,
		mouse: {
			distance: 150
		},
		detect_on: 'canvas', // "canvas" or "window"
		mode: 'grab',
		line_linked: {
			opacity: .5
		},
		events: {
			onclick: {
				enable: true,
				mode: 'push', // "push" or "remove"
				nb: 1
			}
		}
	},
	/* Retina Display Support */
	retina_detect: true
});

lcScroll();
//滚动字幕
function lcScroll() {
	var speed = 50;
	var scroll_begin = document.getElementById("lcScrollBegin");
	var scroll_end = document.getElementById("lcScrollEnd");
	var scroll_div = document.getElementById("lcScrollDiv");
	scroll_end.innerHTML = scroll_begin.innerHTML;

	function Marquee() {
//		console.log(scroll_end.offsetWidth);
//		console.log(scroll_div.scrollLeft);
//		console.log(scroll_begin.offsetWidth);
		if(scroll_end.offsetWidth - scroll_div.scrollLeft <= 0)
			scroll_div.scrollLeft -= scroll_begin.offsetWidth;
		else
			scroll_div.scrollLeft++;
	}
	var MyMar = setInterval(Marquee, speed);
	scroll_div.onmouseover = function() {
		clearInterval(MyMar);
	}
	scroll_div.onmouseout = function() {
		MyMar = setInterval(Marquee, speed);
	}
}
$(function(){
	$(".iphone").fadeIn(2000).animate({"left":"202px"},2000,function(){
		$(".iphone-detail").fadeIn(2000);
	});
})
$(window).scroll(function(){
//	console.log($(this).scrollTop());
	if($(this).scrollTop()>=1200){
		$(".iphone-color").eq(4).animate({"left":"34px"},2000);
		$(".iphone-color").eq(3).animate({"left":"277px"},2000);
		$(".iphone-color").eq(1).animate({"left":"771px"},2000);
		$(".iphone-color").eq(0).animate({"left":"1020px"},2000,function(){
			$(".iphone-link").fadeIn(1000);
		});
	}
})
