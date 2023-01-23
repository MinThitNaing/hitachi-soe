/* **************************************************

Name: top_wide.js

Description: JS for Hitachi.co.jp top page

Create: 2019.05
LastModify: 2022.10.14

Copyright 2019 Hitachi, Ltd.

***************************************************** */


(function($){

$("html[class!='JS']").addClass("JS");



/* News
=========================================================================================== */

var _newsMax = 3;

$(document).ready(function() {

	$.ajax({
		type: "GET",
		url: "/js/en/r5/news.json",
		dataType: "json",
		cache: false,
		success: function(news) {

	$("#LoadNews").append('<dl class="DateListStyle2"></dl>');

	for(var i in news){
	 var _newsIcon = (news[i].icon) ? '<img src="/image/en/r1/icon/icon_new_hd.gif" width="28" height="13" alt="New" />' : '';
	 $("#LoadNews .DateListStyle2").append('<dt>' + news[i].date + '</dt>' + '<dd><ul class="LinkListStyle1"><li><a href="' + news[i].url + '">' + news[i].description + _newsIcon + '</a></li></ul>' );
	 if(i == _newsMax-1) break;
	}

    }

	});

});



/* Important News
=========================================================================================== */

$(window).on("load resize", function() {
	
	if (_checkRWD(768)) {
		$("#ImportantNews").removeClass("buttonSet");
  } else {
		$("#ImportantNews").addClass("buttonSet");
  
  }

});



/* Rotation Banner
=========================================================================================== */


$(window).on("load resize", function() {

	if (_checkRWD(580)) {
		$(".FatBanner .textSet").height("auto");
  } else {
    var maxHeight = 0;
    $(".FatBanner .textSet").each(function(){
      if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
    });
    $(".FatBanner .textSet").height(maxHeight);
  }

});


var bnrHtml;
var bnrMax;
var showNum = 3;
var startAutoRotation = 0;
var rotationTimerID;
var rotationFlag = 0;
var rotationStop = 0;
var rotationInterval = 6000;

var initTopicsRotationBanner = function() {

  if (!$("#SlideButton")[0]) {
    var sd = '<div id="SlideButton">';
    sd += '<div id="SlideButtonLeft"><a href="javascript:void(0);"><img src="/image/en/r5/top_wide/btn_banner_left.png" alt="Prev" width="34" height="68" /></a></div>';
    sd += '<div id="SlideButtonStop"><a href="javascript:void(0);"><img src="/image/en/r5/top_wide/btn_banner_stop.png" alt="Stop" width="34" height="68" /></a></div>';
    sd += '<div id="SlideButtonRight"><a href="javascript:void(0);"><img src="/image/en/r5/top_wide/btn_banner_right.png" alt="Next" width="34" height="68" /></a></div>';
    sd += '</div>';
    $(sd).appendTo("#TopicsRotationBanner");
  }
	

	if (_checkRWD(768)) {
		$("#TopicsRotationBanner .FatBanner").height("auto");
		$("#TopicsRotationBanner li").show();
		rotationStop = true;
		clearTimeout(rotationTimerID);
		$("#SlideButtonLeft").hide();
		$("#SlideButtonStop").hide();
		$("#SlideButtonRight").hide();
    $(".SlideButtonSet").removeClass("active");
		return false;
	}

	if (bnrMax <= showNum) {
		
		if ($("#SlideButton")[0]) {
			$("#SlideButton").hide();
			$("#TopicsRotationBanner ul").css({left:0}).html(bnrHtml);
			clearTimeout(rotationTimerID);
			startAutoRotation = 0;
			$("#TopicsRotationBanner .FatBanner").removeAttr("style");
		}
		
	} else {
		
    if (!$("#SlideButton")[0]) {
      var sd = '<div id="SlideButton">';
      sd += '<div id="SlideButtonLeft"><a href="javascript:void(0);"><img src="/image/en/r5/top_wide/btn_banner_left.png" alt="Prev" width="34" height="68" /></a></div>';
      sd += '<div id="SlideButtonStop"><a href="javascript:void(0);"><img src="/image/en/r5/top_wide/btn_banner_stop.png" alt="Stop" width="34" height="68" /></a></div>';
      sd += '<div id="SlideButtonRight"><a href="javascript:void(0);"><img src="/image/en/r5/top_wide/btn_banner_right.png" alt="Next" width="34" height="68" /></a></div>';
      sd += '</div>';
      $(sd).appendTo("#TopicsRotationBanner");
    } else {
      $("#SlideButton").show();
    }
		
		if (!startAutoRotation) {
			startAutoRotation = 1;
			if (!rotationStop) autoRotation();
		}

		$("#SlideButtonLeft").show();
		$("#SlideButtonStop").show();
		$("#SlideButtonRight").show();
    $(".SlideButtonSet").addClass("active");
	}
	
	var bnrH = [];
	$("#TopicsRotationBanner li").show().each(function(i) {
		bnrH[i] = $(this).height();
		if (!rotationFlag && i >= showNum) $(this).hide();
	});
	$("#TopicsRotationBanner .FatBanner").height(Math.max.apply(null, bnrH));
	
}

var topicsRotationBanner = function() {

  bnrMax = $("#TopicsRotationBanner li").length;
	
	bnrHtml = $("#TopicsRotationBanner ul").html();
	
	initTopicsRotationBanner();
	
	$("#SlideButtonLeft a, #SlideButtonRight a").on("click", function() {
		if (rotationFlag) return false;
		clearTimeout(rotationTimerID);
		var button = ($(this).parent().attr("id") == "SlideButtonLeft") ? 1 : 0;
		rotation(button);
	});
	
	$("#SlideButtonStop a").on("click", function() {
		var $img = $(this).find("img")
		var src = $img.attr("src");
		var alt = $img.attr("alt");
		if (!rotationStop) {
			rotationStop = 1;
			$img.attr("src", src.replace("_stop.", "_play.")).attr("alt", alt.replace("Stop", "Play"));
			clearTimeout(rotationTimerID);
		} else {
			rotationStop = 0;
			$img.attr("src", src.replace("_play.", "_stop.")).attr("alt", alt.replace("Play", "Stop"));
			autoRotation();
		}
	});
	
}

var autoRotation = function() {
	if (!startAutoRotation) return false;
	rotationTimerID = setTimeout(function() {
		rotation(0);
	}, rotationInterval);
}

var rotation = function(lr) {
	
	var imgW = $("#TopicsRotationBanner li").eq(0).outerWidth(true);

	rotationFlag = 1;
	
	if (lr) {
		$("#TopicsRotationBanner li").show();
		$("#TopicsRotationBanner li:last").insertBefore("#TopicsRotationBanner li:first");
		$("#TopicsRotationBanner ul").css({left:-(imgW)}).animate({left: 0}, 600, "easeInOutCubic", function() {
			rotationFlag = 0;
			$("#TopicsRotationBanner li").each(function(i) {if (i >= showNum) $(this).hide();});
			if (!rotationStop) autoRotation();
		});
	} else {
		$("#TopicsRotationBanner li").show();
		$("#TopicsRotationBanner ul").animate({left:-(imgW)}, 600, "easeInOutCubic", function() {
			$("#TopicsRotationBanner li:first").appendTo(this);
			$(this).css({left: 0});
			rotationFlag = 0;
			$("#TopicsRotationBanner li").each(function(i) {if (i >= showNum) $(this).hide();});
			if (!rotationStop) autoRotation();
		});
	}
	
}


/* Execution
=========================================================================================== */

$(window).on("load", function() {
	
	// Rotation Banner
	if ($("#TopicsRotationBanner")[0]) topicsRotationBanner();

});	

$(window).on("resize", function() {
	
	// Rotation Banner
	
	if ($("#TopicsRotationBanner")[0]) initTopicsRotationBanner();

});	

})(jQuery);


/* highlights (XML)
=========================================================================================== */
$(function(){
    $.ajax({
        url:'/highlights/data/_tags/PICK_UP/rss20.xml',
        type:'GET',
        dataType:'xml',
        timeout:60000,
        error:function() {
        },
        success:function(xml){
			var countNum = 0;
            $(xml).find('item').each(function() {
				var imgSeikei = $(this).find('enclosure').attr('url');
				var titleSeikei = $(this).find('title').text();

				// img url change
				imgSeikei = imgSeikei.replace('https://d1uzk9o9cg136f.cloudfront.net/','/highlights/data/');
				imgSeikei = imgSeikei.replace('?pr=highlights-en','');

				// moji Length [...] (IE hack)
				var ua = navigator.userAgent;
				if(ua.indexOf('msie') != -1 || ua.indexOf('Trident') != -1){
					var textLength = titleSeikei.length;
					var overLength = 70;
					if(textLength > overLength){
						var textTrim = titleSeikei.substr(0,(overLength));
						textTrim = textTrim + "…";
						titleSeikei = textTrim;
					}
				}

				// <br /> add
				titleSeikei = titleSeikei.replace(']',']<br />');

				$('.HighlightsMenu').append('<li><a href="' + $(this).find('link').text() + '" onclick="dcsMultiTrack(\'WT.ti\',\' Highlights:\'+this.href,\'WT.dl\',\'H22\');" target="_blank"><span class="HighlightsImg"><img src="/image/en/r5/top_wide/img_xmlbase.png" style="background-image:url(' + imgSeikei + ')" alt="" /></span><span class="HighlightsText"><span class="HtIn">' + titleSeikei + '</span></span></a></li>');
				countNum = countNum + 1;
				if(countNum == 4){ return false; }
            });

			// height adjust js
			if($('.HighlightsText').length){
				$('.HighlightsText').matchHeight();
			}
        }
    });
});

