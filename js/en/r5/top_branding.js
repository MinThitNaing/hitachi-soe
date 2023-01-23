/* **************************************************

Name: top_branding.js

Description: JS for Hitachi.com top page

Create: 2022.05

Copyright 2022 Hitachi, Ltd.

***************************************************** */

$(function(){

	// 背景の切り替え時間(ms)
	const interval = 7000;

	// ボタンの表示
	if ($(".TopBrandingSlide").length <= 1) {
		return;
	} else {
		$(".TopBrandingBtnNext").show();
		$(".TopBrandingBtnPrev").show();
		$(".TopBrandingControl").css('display', 'flex');
		if ($(".TopBrandingSlide").length > 2) {
			$(".TopBrandingControl").addClass("Bottom");
		}
	}

	// ドットの追加
	$(".TopBrandingSlide").each(function(i){
		var $btn = $("<button></button>");
		$btn.attr("type", "button");
		$btn.attr("aria-label", "Slide" + (i+1));
		if (i == 0) {
			$btn.addClass("active");
		}
		$(".TopBrandingDots").append($btn);
	});


	// 次へボタン
	$(".TopBrandingBtnNext").on("click", function() {
		if ($(".TopBrandingSlide:animated").length) {
			return;
		}
		var $slides = $(".TopBrandingSlide");
		var $current = $(".TopBrandingSlide:visible");
		var index= $slides.index($current) + 1;
		if (timer == null) {
			slideChange(index);
		} else {
			slideStop();
			slideChange(index);
			slideStart();
		}
	});

	// 前へボタン
	$(".TopBrandingBtnPrev").on("click", function() {
		if ($(".TopBrandingSlide:animated").length) {
			return;
		}
		var $slides = $(".TopBrandingSlide");
		var $current = $(".TopBrandingSlide:visible");
		var index= $slides.index($current) - 1;
		if (timer == null) {
			slideChange(index);
		} else {
			slideStop();
			slideChange(index);
			slideStart();
		}
	});


	// ドット
	$(".TopBrandingDots button").on("click", function() {
		if ($(".TopBrandingSlide:animated").length) {
			return;
		}
		var index =  $(".TopBrandingDots button").index(this);
		if (timer == null) {
			slideChange(index);
		} else {
			slideStop();
			slideChange(index);
			slideStart();
		}
	});

	// 停止ボタン
	$(".TopBrandingBtnStop").on("click", function() {
		if (timer == null) {
			return;
		}
		slideStop();
	});

  	var timer = null;

	// 再生ボタン
	$(".TopBrandingBtnPlay").on("click", function(){
		if (timer != null) {
			return;
		}
		slideStart();
	}).triggerHandler("click");

	// 停止
	function slideStop() {
		clearInterval(timer);
		timer = null;
		$(".TopBrandingBtnPlay").removeClass("active");
		$(".TopBrandingBtnStop").addClass("active");
	}

	// 再生
	function slideStart() {
		$(".TopBrandingBtnPlay").addClass("active");
		$(".TopBrandingBtnStop").removeClass("active");
		timer = setInterval(function(){
			if ($(".TopBrandingSlide:animated").length) {
				return;
			}
			slideChange();
		}, interval);
	}

	// スライドの変更
	function slideChange(index) {

		var $slides = $(".TopBrandingSlide");
		var $current = $(".TopBrandingSlide:visible");
		var index_current = $slides.index($current);
		var index_next = 0;

		if (index != undefined) {
			index_next = index;
		} else {
			index_next = index_current + 1;
		}
		if(index_next > $slides.length - 1) {
			index_next = 0;
		}
		if(index_next < 0) {
			index_next = $slides.length - 1
		}

		if (index_current == index_next) {
			return;
		}

		var $next = $slides.eq(index_next);
		var $dots = $(".TopBrandingDots button");
		$dots.removeClass("active");
		$dots.eq(index_next).addClass("active");
		$current.fadeOut();
		$next.fadeIn();
	}
	
});