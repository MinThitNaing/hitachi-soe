/* **************************************************

Name: common_option.js

Description: JavaScript for Additional Common Modules

Create: 2017.01.31
Update: 2019.03.01
Update: 2020.02.17
Update: 2020.11.10
Update: 2021.08.31

Copyright 2019 Hitachi, Ltd.

***************************************************** */

$("html[class!='JS']").addClass("JS");
if (_checkRWD == undefined) var _checkRWD = function() {return false};

(function($) {

/* MegaMenu
=========================================================================================== */

var _megaMenuEnabled = false;
var _megaMenuActiveId = "MMSetMenu0";

var initMegaMenu = function() {
	
	if ($("#MegaMenu .MMGlobalNaviStyle").eq(0).css("float") == "none") {
		
		if (_megaMenuEnabled) {
			
			$("#MegaMenu .MMSetArea").off();
			$("#MegaMenu .MMGlobalNaviStyle a").off();
			$("#MegaMenu .MMSet").find("a:last").off();
			
			_megaMenuEnabled = false;
			
		}
		
		return;
		
	} else if (_megaMenuEnabled) {
		
		return;
		
	}
	
	_megaMenuEnabled = true;
	
	
	// mouse
	
	$("#MegaMenu .MMSetArea").on("mouseenter", function() {
		
		$("#" + _megaMenuActiveId).stop();
		
		var top = $("#GlobalNavi").height();
		var thisId = $(this).children(".MMSet").attr("id");
		var thisH = $("#" + thisId).css({height: "auto"}).height();
		var currentH = (thisId == _megaMenuActiveId) ? 0 : $("#" + _megaMenuActiveId).height();
		
		$("#" + _megaMenuActiveId).hide().css({height: 0});
		$("#" + thisId).css({top: top, height: currentH}).show().animate({height: thisH}, 300, "easeOutQuart");
		$(this).find(".MMGlobalNaviStyle a").addClass("Active");
		
		_megaMenuActiveId = thisId;
		
	}).on("mouseleave", function() {
		
		$(this).find(".MMGlobalNaviStyle a").removeClass("Active");
		$(this).children(".MMSet").animate({height: 0}, 200, "easeOutQuad", function() {
			$(this).hide();
		});
		
	});
	
	
	// tab key
	
	$("#MegaMenu .MMGlobalNaviStyle a").on("focus", function() {
		
		if ($(this).hasClass("Active")) {
			return;
		}
		
		$("#" + _megaMenuActiveId).stop();
		
		var top = $("#GlobalNavi").height();
		var thisId = $(this).parents(".MMSetArea").children(".MMSet").attr("id");
		var thisH = $("#" + thisId).css({height: "auto"}).height();
		var currentH = (thisId == _megaMenuActiveId) ? 0 : $("#" + _megaMenuActiveId).height();
		
		$("#" + _megaMenuActiveId).hide().css({height: 0});
		$("#" + thisId).css({top: top, height: currentH}).show().animate({height: thisH}, 300, "easeOutQuart");
		$(this).addClass("Active");
		
		_megaMenuActiveId = thisId;
		
	}).on("keydown", function(e) {
		
		if (e.shiftKey && e.keyCode == 9) {
			$(this).removeClass("Active");
			$("#" + _megaMenuActiveId).animate({height: 0}, 200, "easeOutQuad", function() {
				$(this).hide();
			});
		}
		
	});
	
	$("#MegaMenu .MMSet").each(function() {
		
		$(this).find("a:last").on("keydown", function(e) {
			
			if (!e.shiftKey && e.keyCode == 9) {
				$(this).parents(".MMSetArea").find(".MMGlobalNaviStyle a").removeClass("Active");
				$("#" + _megaMenuActiveId).animate({height: 0}, 200, "easeOutQuad", function() {
					$(this).hide();
				});
			}
			
		});
		
	});
	
}

var megaMenu = function() {
	
	if ($("#MegaMenu")[0]) {
		var gn = '';
		$(".MMGlobalNaviStyle").each(function() {
			gn += '<li' + ($(this).hasClass("Current") ? ' class="Current"' : '') + '>' + $(this).html() + '</li>';
		});
		gn = '<ul id="GlobalNaviTopSP">' + gn + '</ul>';
		$(document).ready(function() {$("#GlobalNaviSP").prepend(gn);});
	}
	
	$("#MegaMenu .MMGlobalNaviStyle a strong").parent().addClass("Strong");
	
	if (ua("sp")) return false;
	
	var id = 0;
	
	var innerHTML = $("#MegaMenu").html();
	$("#MegaMenu").replaceWith('<div id="MegaMenu">' + innerHTML + '</div>');
	
	$("#MegaMenu .MMGlobalNaviStyle").each(function() {
		
		var set = $(this).next(".MMSet");
		
		if (set[0]) {
			
			$(this).addClass("MMSetMenu");
			
			set.attr({id: "MMSetMenu" + id});
			id++;
			
			$(this).add(set).wrapAll('<dl class="MMSetArea" />');
			
		} else {
			
			var innerHTML = $(this).html();
			var current = $(this).hasClass("Current") ? " Current" : "";
			$(this).replaceWith('<dl><dt class="MMGlobalNaviStyle' + current + '">' + innerHTML + '</dt></dl>');
			
		}
		
	});
	
	if (id > 0) {
		
		$(window).on("resize", function() {
			initMegaMenu();
		});
		
		initMegaMenu();
		
	}
	
	if ($("#MegaMenu")[0]) {
		$("#SiteIdentity").addClass("WithMMGlobalNaviStyle");
	}
	
}



/* Floating Grid
=========================================================================================== */

var floatingGridTop = 0;
var floatingGridBottom = 0;
var floatingGridMarginTop = 15;
var floatingGridStatus = 0;

var floatingGrid = function() {
	
	$(window).on("scroll resize", fixFloatingGrid);
	fixFloatingGrid();
	
}

var initFloatingGrid = function() {
	
	floatingGridTop = $(".Grid3").offset().top - floatingGridMarginTop;
	var navH = $("#FloatingGridSet .Grid1").height();
	var bodyH = $(".Grid3").height();
	floatingGridBottom = floatingGridTop + bodyH - navH;
	
}

var fixFloatingGrid = function() {
	
	if (_checkRWD(768)) return false;
	
	initFloatingGrid();
	
	var scrollTop = $(window).scrollTop();
	
	if (scrollTop <= floatingGridTop && floatingGridStatus != 0) {
		$("#FloatingGridSet").removeClass("Fixed Bottom");
		floatingGridStatus = 0;
	} else if ((scrollTop > floatingGridTop && scrollTop <= floatingGridBottom) && floatingGridStatus != 1) {
		$("#FloatingGridSet").css({top: floatingGridMarginTop}).addClass("Fixed").removeClass("Bottom");
		floatingGridStatus = 1;
	} else if (scrollTop > floatingGridBottom && floatingGridStatus != 2) {
		$("#FloatingGridSet").css({top: floatingGridBottom + floatingGridMarginTop}).addClass("Bottom").removeClass("Fixed");
		floatingGridStatus = 2;
	}
	
}



/* Rotation Banner
=========================================================================================== */

var bnrHtml;
var bnrMax;
var showNum;
var startAutoRotation = 0;
var rotationTimerID;
var rotationFlag = 0;
var rotationStop = 0;
var rotationInterval = 5000;

var initRotationBanner = function() {
	
	showNum = _checkRWD(580) ? 2 : (_checkRWD(768) ? 3 : 4);
	
	if (bnrMax <= showNum) {
		
		if ($("#SlideButton")[0]) {
			$("#SlideButton").hide();
			$("#RotationBanner ul").css({left:0}).html(bnrHtml);
			clearTimeout(rotationTimerID);
			startAutoRotation = 0;
			$("#RotationBanner .FatBanner").removeAttr("style");
		}
		
	} else {
		
		if (!$("#SlideButton")[0]) {
			var sd = '<div id="SlideButton">';
			sd += '<div id="SlideButtonLeft"><a href="javascript:void(0);"><img src="/image/en/r1/icon/btn_banner_left.gif" alt="Prev" width="25" height="50" /></a></div>';
			sd += '<div id="SlideButtonStop"><a href="javascript:void(0);"><img src="/image/en/r1/icon/btn_banner_stop.gif" alt="Stop" width="25" height="50" /></a></div>';
			sd += '<div id="SlideButtonRight"><a href="javascript:void(0);"><img src="/image/en/r1/icon/btn_banner_right.gif" alt="Next" width="25" height="50" /></a></div>';
			sd += '</div>';
			$(sd).appendTo("#RotationBanner");
		} else {
			$("#SlideButton").show();
		}
		
		if (!startAutoRotation) {
			startAutoRotation = 1;
			if (!rotationStop) autoRotation();
		}
	}
	
	var bnrH = [];
	$("#RotationBanner li").show().each(function(i) {
		bnrH[i] = $(this).height();
		if (!rotationFlag && i >= showNum) $(this).hide();
	});
	$("#RotationBanner .FatBanner").height(Math.max.apply(null, bnrH));
	
}

var rotationBanner = function() {
	
	bnrMax = $("#RotationBanner li").length;
	
	$("#RotationBanner li.FirstItem").removeClass("FirstItem");
	bnrHtml = $("#RotationBanner ul").html();
	
	initRotationBanner();
	
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
	
	var imgW = $("#RotationBanner li").eq(0).outerWidth(true);

	rotationFlag = 1;
	
	if (lr) {
		$("#RotationBanner li").show();
		$("#RotationBanner li:last").insertBefore("#RotationBanner li:first");
		$("#RotationBanner ul").css({left:-(imgW)}).animate({left: 0}, 600, "easeInOutCubic", function() {
			rotationFlag = 0;
			$("#RotationBanner li").each(function(i) {if (i >= showNum) $(this).hide();});
			if (!rotationStop) autoRotation();
		});
	} else {
		$("#RotationBanner li").show();
		$("#RotationBanner ul").animate({left:-(imgW)}, 600, "easeInOutCubic", function() {
			$("#RotationBanner li:first").appendTo(this);
			$(this).css({left: 0});
			rotationFlag = 0;
			$("#RotationBanner li").each(function(i) {if (i >= showNum) $(this).hide();});
			if (!rotationStop) autoRotation();
		});
	}
	
}



/* Share Buttons
=========================================================================================== */

var shareButtons = function() {
	
	var html;
	var url = location.href;
	
	
	// Facebook
	
	html = '<li class="SbFacebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href=' + encodeURIComponent(url) + '&amp;send=false&amp;layout=button_count&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;width=80&amp;height=20" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:20px;" allowTransparency="true"></iframe></li>';
	
	
	// LinkedIn
	
	html += '<li class="SbLinkedIn"><script src="//platform.linkedin.com/in.js" type="text/javascript"></script><script type="IN/Share" data-url="' + url + '" data-counter="right"></script></li>';
	
	
	// Twitter

	if (!ua("ie") && (!ua("mac") || !ua("safari") || navigator.userAgent.indexOf("Version/5.0") == -1) && navigator.userAgent.indexOf("Android 2") == -1 && (!ua("ios") || navigator.userAgent.indexOf("OS 4") == -1)) {
		
		html += '<li class="SbTwitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url + '">Tweet</a></li>';
		
		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
		
	}
	
	

	
	$(".ShareButtonSet").each(function() {$(this).append(html)});
	
}



/* Social Account Button
=========================================================================================== */

var socialAccount = function() {
	
	if ($("#SocialAccountTop")[0]) {
		var sa = '';
		$("#SocialAccountTop li").each(function() {
			sa += '<li>' + $(this).html() + '</li>';
		});
		sa = '<ul id="SocialAccountTopSP">' + sa + '</ul>';
		$(document).ready(function() {$("#GlobalNaviSP").append(sa);});
	}


}



/* Modal Window for YouTube
=========================================================================================== */

var modalYouTube = function() {
	
	var movieWidth = 853, movieHeight = 480, movieTitle = "";
	
//	var isAndroid = ua("android");
	var isAndroid = false;
	
	var html = '<div id="ModalYouTubeCover"></div>';
	html += '<div id="ModalYouTube">';
	html += '<div class="Inner">';
	html += '<div class="Movie"></div>';
	html += '<div class="Title"><p></p></div>';
	html += '<p class="BtnClose"><a href="javascript:void(0);">Close</a></p>';
	html += '</div>';
	html += '</div>';
	
	$("body").append(html);
	
	
	$("#ModalYouTubeCover, #ModalYouTube").on("click", function() {
		
		$("#ModalYouTube").hide();
		$("#ModalYouTube .Movie").empty();
		
		if (isAndroid) {
			$("body > div:not('#ModalYouTubeCover, #ModalYouTube')").css({visibility: "visible"});
		}
		
		$("#ModalYouTubeCover").stop().animate({opacity: 0}, 300, function() {
			
			$(this).hide();
			$(window).off("resize.lightbox");
			
		});
		
		return false;
		
	});
	
	
	$("#ModalYouTube .Movie, #ModalYouTube .Title").on("click", function(event) {
		
		event.stopPropagation();
		
	});
	
	
	$(".ModalYouTubeLink").on("click", function() {
		
		var bodyHeight = $("body").height();
		$("#ModalYouTubeCover").css({height: bodyHeight, opacity: 0}).show().animate({opacity: 0.8}, 300);
		
		movieTitle = $(this).attr("title") || $(this).text() || $(this).find("img").attr("alt");
		
		var url = $(this).attr("href");
	//	var id = /[0-9A-Za-z_-]{11}/.exec(url);
	//	var rel = url.indexOf("rel=0") !== -1 ? 0 : 1;
	//	var autoplay = url.indexOf("autoplay=1") !== -1 ? 1 : 0;
	//	$("#ModalYouTube .Movie").html('<iframe width="' + movieWidth + '" height="' + movieHeight + '" src="https://www.youtube.com/embed/' + id + '?autoplay=' + autoplay + '&rel=' + rel + '&wmode=transparent" frameborder="0" allowfullscreen></iframe>');
		$("#ModalYouTube .Movie").html('<iframe width="' + movieWidth + '" height="' + movieHeight + '" src="' + url + '" frameborder="0" allowfullscreen></iframe>');
		
		fixSize(true);
		
		return false;
		
	});
	
	
	var openMovie = function(screenTop) {
		
		$("#ModalYouTube .Title p").text(movieTitle);
		
		if (isAndroid) {
			$("body > div:not('#ModalYouTubeCover, #ModalYouTube')").css({visibility: "hidden"});
		}
		
		$("#ModalYouTube").show();
		$(window).one("scroll", function() { $(window).scrollTop(screenTop); } );
		$("#ModalYouTube .BtnClose a").focus();
		$(window).on("resize.lightbox", function() { fixSize(false); });
		
	}
	
	
	var fixSize = function(open) {
		
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		var screenTop = $(window).scrollTop();
		
		var boxPaddingLR = parseInt($("#ModalYouTube").css("paddingLeft"));
		var boxPaddingTB = 50;
		var bottomHeight = 50;
		
		if (movieWidth + boxPaddingLR * 2 > screenWidth) {
			var ratio = movieWidth / (screenWidth - boxPaddingLR * 2);
			var boxWidth = movieWidth / ratio;
			var boxHeight = movieHeight / ratio + bottomHeight;
		} else {
			var boxWidth = movieWidth;
			var boxHeight = movieHeight + bottomHeight;
		}
		
		if (boxHeight + boxPaddingTB * 2 > screenHeight) {
			var top = screenTop;
		} else {
			var top = (screenHeight - boxHeight) / 2 - boxPaddingTB + screenTop;
		}
		
		$("#ModalYouTube").css({
			width: boxWidth,
			height: boxHeight,
			top: top,
			left: (screenWidth - boxWidth) / 2 - boxPaddingLR
		});
		
		$("#ModalYouTube iframe").css({
			height: boxHeight - bottomHeight
		});
		
		var coverHeight = Math.max($("body").height(), screenTop + boxHeight + boxPaddingTB * 2);
		$("#ModalYouTubeCover").height(coverHeight);
		
		if (open) {
			openMovie(screenTop);
		}
		
	}
	
}



/* Modal Window for Images
=========================================================================================== */

var modalImage = function() {
	
	var imageObj = $("<img>"), imageSrc = "";
	var imageWidth = 0, imageHeight = 0, imageTitle = "";
	
//	var isAndroid = ua("android");
	var isAndroid = false;
	
	var html = '<div id="ModalImageCover"></div>';
	html += '<div id="ModalImageLoader"><img src="/image/en/r1/icon/icon_loader.gif" width="32" height="32" alt="Loading" /></div>';
	html += '<div id="ModalImage">';
	html += '<div class="Inner">';
	html += '<div class="Image"></div>';
	html += '<div class="Title"><p></p></div>';
	html += '<p class="BtnClose"><a href="javascript:void(0);">Close</a></p>';
	html += '</div>';
	html += '</div>';
	
	$("body").append(html);
	
	
	$("#ModalImageCover, #ModalImage").on("click", function() {
		
		$("#ModalImage").hide();
		$("#ModalImage .Image").empty();
		
		if (isAndroid) {
			$("body > div:not('#ModalImageCover, #ModalImage')").css({visibility: "visible"});
		}
		
		$("#ModalImageCover").stop().animate({opacity: 0}, 300, function() {
			
			$(this).hide();
			$("#ModalImageLoader").hide();
			
			imageObj.off("load");
			$(window).off("resize.lightbox");
			
		});
		
		return false;
		
	});
	
	
	$("#ModalImage .Image, #ModalImage .Title").on("click", function(event) {
		
		event.stopPropagation();
		
	});
	
	
	$(".ModalImageLink").on("click", function() {
		
		var bodyHeight = $("body").height();
		$("#ModalImageCover").css({height: bodyHeight, opacity: 0}).show().animate({opacity: 0.8}, 300);
		
		var screenHeight = $(window).height();
		var screenTop = $(window).scrollTop();
		$("#ModalImageLoader").css({top: screenTop + screenHeight / 2 - 16}).show();
		
		imageTitle = $(this).attr("title") || $(this).text() || $(this).find("img").attr("alt");
		
		var src = $(this).attr("href");
		if (src == imageSrc) {
			
			imageObj.appendTo("#ModalImage .Image");
			fixSize(true);
			
		} else {
			
			imageSrc = src;
			
			imageObj.on("load", function() {
				
				var tmpImage = new Image();
				tmpImage.src = imageSrc;
				imageWidth = tmpImage.width;
				imageHeight = tmpImage.height;
				
				$(this).appendTo("#ModalImage .Image");
				fixSize(true);
				
			}).attr("src", imageSrc).attr("alt", imageTitle);
			
		}
		
		return false;
		
	});
	
	
	var openImage = function(screenTop) {
		
		$("#ModalImageLoader").hide();
		
		$("#ModalImage .Title p").text(imageTitle);
		
		if (isAndroid) {
			$("body > div:not('#ModalImageCover, #ModalImage')").css({visibility: "hidden"});
		}
		
		$("#ModalImage").show();
		$(window).one("scroll", function() { $(window).scrollTop(screenTop); } );
		$("#ModalImage .BtnClose a").focus();
		$(window).on("resize.lightbox", function() { fixSize(false); });
		
	}
	
	
	var fixSize = function(open) {
		
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		var screenTop = $(window).scrollTop();
		
		var boxPaddingLR = parseInt($("#ModalImage").css("paddingLeft"));
		var boxPaddingTB = 50;
		var bottomHeight = 50;
		
		if (imageWidth + boxPaddingLR * 2 > screenWidth) {
			var ratio = imageWidth / (screenWidth - boxPaddingLR * 2);
			var boxWidth = imageWidth / ratio;
			var boxHeight = imageHeight / ratio + bottomHeight;
		} else {
			var boxWidth = imageWidth;
			var boxHeight = imageHeight + bottomHeight;
		}
		
		if (boxHeight + boxPaddingTB * 2 > screenHeight) {
			var top = screenTop;
		} else {
			var top = (screenHeight - boxHeight) / 2 - boxPaddingTB + screenTop;
		}
		
		$("#ModalImage").css({
			width: boxWidth,
			height: boxHeight,
			top: top,
			left: (screenWidth - boxWidth) / 2 - boxPaddingLR
		});
		
		var coverHeight = Math.max($("body").height(), screenTop + boxHeight + boxPaddingTB * 2);
		$("#ModalImageCover").height(coverHeight);
		
		if (open) {
			openImage(screenTop);
		}
		
	}
	
}



/* Branding Image Rotation
=========================================================================================== */

var brandingImage = function() {
	
	// Initialization
	
	var
		slideID = ['BrandingImgStyle', 'BrandingImgStyle1', 'BrandingImgStyle2'],	// Slide image
		showControl = true,				// Controller visible (true:visible / false:hidden)
		controlImagePath = '/image/en/r1/icon/',	// Controller image path
		interval = 3,					// interval(sec)
		duration = 0.5;					// duration(sec)
	
	
	// Configuration file
	
	var
		CONTROL_IMAGE_FILE = 'btn_branding_indicator',
		CONTROL_IMAGE_FILE_PLAY = 'btn_branding_play',
		CONTROL_IMAGE_FILE_STOP = 'btn_branding_stop',
		CONTROL_IMAGE_EXT = '.png',
		CONTROL_IMAGE_WIDTH = 20,
		CONTROL_IMAGE_HEIGHT = 20;
	
	var
		CLASS_IMAGE_BOX = 'branding-image',
		CLASS_SLIDE = 'slide',
		CLASS_SLIDE_LIST = 'slide-list',
		CLASS_CONTROLLER = 'controller',
		CLASS_ACTIVE = 'active',
		CLASS_FOCUS = 'focus',
		CLASS_PAUSE = 'pause';
	
	var
		TEXT_PAUSE = 'Stop',
		TEXT_PLAY = 'Play';
	
	var
		DATA_INDEX = 'index';
	
	var
		activeIndex = 0,
		playing = true,
		intervalID;
	
	for (var i in slideID) {
		if ($('#' + slideID[i])[0]) {
			var $slideID = $('#' + slideID[i]).addClass(CLASS_IMAGE_BOX);
			break;
		}
	}
	
	function sendTraking(index) {
		var trackingData = slides[index - 1].traking;
		if ((trackingData != undefined) && (typeof dcsMultiTrack == 'function')) {
			dcsMultiTrack(
				'DCS.dcsuri', trackingData.uri,
				'WT.ti', trackingData.ti,
				'WT.dl', trackingData.dl,
				'WT.BannerID', trackingData.id
			);
		}
	}
	
	if (slides.length > 1) {
		
		var $controlList = $slideID
			.append(format('<div class="{0}"><ul></ul></div>', CLASS_CONTROLLER))
			.find('ul:last-child');
		
		function hoverIn() {
			var $this = $(this);
			$controlList.removeClass(CLASS_FOCUS);
			$this.addClass(CLASS_FOCUS);
			
			if ($this.data(DATA_INDEX)) {
				stopTimer();
				showPage($this.data(DATA_INDEX), true);
			};
		}
		
		function hoverOut() {
			var $this = $(this);
			$this.removeClass(CLASS_FOCUS);
			if (playing) {
				startTimer();
			}
		}
		
		$(format('<li><a href="javascrpit:void(0);"><img src="{0}" alt="{1}" /></a></li>',
							getImageFileName(0), TEXT_PAUSE))
			.appendTo($controlList)
			.find('a:last-child')
			.data(DATA_INDEX, 0)
			.on('focusin mouseover', hoverIn)
			.on('focusout mouseout', hoverOut)
			.on('click', function(){
				var $this = $(this);
				$this.toggleClass(CLASS_PAUSE);
				playing = !$this.hasClass(CLASS_PAUSE);
				$this.find('img').attr({
					'src':getImageFileName(0, CLASS_FOCUS),
					'alt':playing ? TEXT_PAUSE : TEXT_PLAY
				});
				if (playing) {
					startTimer();
				} else {
					stopTimer();
				}
				return false;
			});
		
		if (showControl) {
			
			var alt = [];
			
			$.each(slides, function(index, value) {
				
				if (value.text == undefined) value.text = '';
				if (value.imageText == undefined) value.imageText = '';
				if (value.responsiveText == undefined) value.responsiveText = '';
				if (value.responsiveButton == undefined) value.responsiveButton = '';
				
				alt[index] = value.text !== '' ? value.text : value.responsiveText
						.split('<p class="TextStyle1">').join(' ')
						.split('<p class="TextStyle2">').join(' ')
						.split('<p class="TextStyle1 TopBorderSet">').join(' ')
						.split('<p class="TextStyle2 TopBorderSet">').join(' ')
						.split('<p class="TopBorderSet TextStyle1">').join(' ')
						.split('<p class="TopBorderSet TextStyle2">').join(' ')
						.split('</p>').join(' ')
						.split('<br />').join(' ')
						.split('<em>').join('')
						.split('</em>').join('')
						.split('<strong>').join('')
						.split('</strong>').join('')
						.replace(/^\s/, '')
						.replace(/\s$/, '');
				if (value.responsiveButton != '') alt[index] += ' ' + value.responsiveButton;
				
				$(format('<li><a href="{0}"><img src="{1}" alt="{2}" /></a></li>',
						value.link, getImageFileName(index + 1), (value.text != '' && value.responsiveText != '') ? alt[index] + ' ' + value.text : alt[index]))
					.appendTo($controlList)
					.find('a:last-child')
					.data(DATA_INDEX, index + 1)
					.on('focusin mouseover', hoverIn)
					.on('focusout mouseout', hoverOut)
					.on('click', function(){
						if (ua("sp")) return false;
						sendTraking($(this).data(DATA_INDEX));
					})
			});
			
			$controlList = $slideID.find('.' + CLASS_CONTROLLER + ' a');
			
		}
		
	}
	
	function getImageFileName(index, status) {
		var fileName = controlImagePath;
		if (index) {
			fileName += CONTROL_IMAGE_FILE;
		} else {
			if (playing) {
				fileName += CONTROL_IMAGE_FILE_STOP;
			} else {
				fileName += CONTROL_IMAGE_FILE_PLAY;
			}
		}
		fileName += CONTROL_IMAGE_EXT;
		return fileName;
	}
	
	var $slideList = $slideID
		.append(format('<div class="{0}"></div>', CLASS_SLIDE))
		.find('div:last-child');
		
	$.each(slides, function(index, value) {
		
		var html = ['', '', '', '', '', '', ''];
		
		html[0] = format('<div class="{0}"><a href="{1}"><img class="Img" src="{2}" alt="{3}" />',
			CLASS_SLIDE_LIST, value.link, value.image, alt[index]);
		
		if (value.imageText != '') {
			html[1] = format('<img class="ImgText" src="{0}" alt="" /></a>',
				value.imageText);
		} else {
			html[1] = '</a>';
		}
		if (value.responsiveText != '') {
			html[2] = format('<div class="ResponsiveTextSet"><div class="ResponsiveText">{0}</div>',
				value.responsiveText);
			html[4] = '</div>'
		}
		if (value.responsiveButton != '') {
			html[3] = format('<div class="ResponsiveButton"><p class="ButtonStyle1"><a href="{0}">{1}</a></p></div>',
				value.link,value.responsiveButton);
		}
		html[5] = '</div>';
		
		$(html[0] + html[1] + html[2] + html[3] + html[4] + html[5])
			.appendTo($slideList)
			.data(DATA_INDEX, index + 1)
			.on('click', function(){
				sendTraking($(this).data(DATA_INDEX));
				location.href = value.link;
			})
	});
	
	$slideList = $slideID.find('.' + CLASS_SLIDE + ' .' + CLASS_SLIDE_LIST);
	
	function showPage(index, animation) {
		if (index == activeIndex) return;
		
		if (showControl && $controlList) {
			$controlList
				.removeClass(CLASS_ACTIVE)
				.eq(index)
				.addClass(CLASS_ACTIVE);
		}
		
		$slideList
			.css({zIndex:1}).hide();
		
		$slideListPrev = $slideList.eq(activeIndex - 1);
		$slideListPrev
			.css({position: "absolute", zIndex:2, display: "block"});
		activeIndex = index;
		$slideList
			.eq(index - 1)
			.css({position: "relative", zIndex:3, display: "block"})
			.find("img")
			.css({opacity:0})
			.stop(true,true)
			.animate({opacity:1}, duration * (animation ? 1000 : 0), function() {$slideListPrev.hide();});
	}
	
	function startTimer() {
		if (playing) {
			clearInterval(intervalID);
			intervalID = setInterval(function(){
				var index = activeIndex + 1;
				if (index > slides.length) {
					index = 1;
			}
				showPage(index, true);
			}, (interval + duration) * 1000);
		}
	}
	
	function stopTimer() {
		clearInterval(intervalID);
	}
	
	function format(fmt, arg) {
		var fn = undefined;
		if ($.isPlainObject(arg)) {
			fn = function(str, part) { return arg[part]; }
		} else {
			var args = arguments;
			fn = function(str, part) { return args[parseInt(part)+1] }
		}
		return fmt.replace(/\{(\w+)\}/g, fn);
	}
	
	$("." + CLASS_IMAGE_BOX + " ." + CLASS_CONTROLLER + " ul").hide();
	
	$("." + CLASS_IMAGE_BOX + " ." + CLASS_CONTROLLER + " ul").removeAttr("style");
	$("." + CLASS_IMAGE_BOX + " ." + CLASS_SLIDE).css({height:"auto"});
	showPage(1, false);
	startTimer();

	$(window).on("resize.brandingImage", function() {
		if ($(".ResponsiveText")[0] && $("#U580").css("display") !== "block") return false;
		var i = 0;
		var textH = [];
		var buttonH = [];
		$slideList.show();
		$(".branding-image .ResponsiveTextSet").each(function(i) {
			textH[i] = $(this).find(".ResponsiveText").height();
			buttonH[i] = $(this).find(".ResponsiveButton").height();
		});
		var maxTextH = Math.max.apply(null, textH);
		var maxButtonH = Math.max.apply(null, buttonH);
		$(".branding-image .ResponsiveTextSet").each(function() {
			$(this).height(maxTextH + maxButtonH).find(".ResponsiveButton").css({top:maxTextH + 15});
		});
		$slideList.hide().each(function() {
			if ($(this).css("z-index") == "3") $(this).show();
		});
	}).triggerHandler("resize.brandingImage");
}


/* Branding Image + Text
=========================================================================================== */

var $branding;

var initBrandingImageText = function() {
	
	if ($("#BrandingImgStyle3")[0]) {
		$branding = $("#BrandingImgStyle3");
	} else if ($("#BrandingImgStyle4")[0]) {
		$branding = $("#BrandingImgStyle4");
	} else {
		return false;
	}
	
	if ($branding.find("a")[0]) {
		$branding.addClass("hover").on("click", function() {
			location.href = $(this).find("a").attr("href");
		});
	}
	
	var $img = $branding.find(".Img");
	var html = $img.html();
	$img.replaceWith('<p class="Img"><span>' + html + '</span></p>');
	
}

var brandingImageText = function() {

	if ($branding == null || !_checkRWD(995) || _checkRWD(580)) return false;
	
	var $img = $branding.find("span");
	$img.removeAttr("style");
	var boxH = $branding.height();
	var imgW = $img.width();
	var imgH = $img.height();
	
	if (boxH > imgH) {
		imgW = imgW * (boxH / imgH);
		var imgM = ($branding.find(".Img").width() - imgW) / 2;
		$img.width(imgW).css({marginLeft:imgM});
	}
	
}




/* YouTube Box
=========================================================================================== */

var youTubeBox =function() {
	
	$(".YouTubeBox .Movie").each(function() {
		
		var url = $(this).children("a").attr("href");
	//	var id = /[0-9A-Za-z_-]{11}/.exec(url);
		
		var w = $(this).find("img").attr("width");
		var h = $(this).find("img").attr("height");
		
	//	var html = '<iframe width="' + w + '" height="' + h + '" src="https://www.youtube.com/embed/' + id + '?rel=0&wmode=transparent" frameborder="0" allowfullscreen></iframe>';
		var html = '<iframe width="' + w + '" height="' + h + '" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
		
		$(this).html(html);
		
	});
	
}



/* Execution
=========================================================================================== */

$(window).on("load", function() {
	
	// for RWD	
	if($("#GlobalNaviTopButtonSP")[0]) $("html").addClass("OptionRWD");
	if($("#HeaderArea1>.Container").length) $("html").addClass("OptionRWD");
	
	// Mega Menu
	
	megaMenu();
	
	
	// Floationg Grid
	
	if ($("#FloatingGridSet")[0] && !ua("sp")) {
		
		$(".BtnOpen a, .BtnClose a").on("click", function() {
			setTimeout(floatingGrid, 1000);
		});
		floatingGrid();
		
	}
	
	
	// Social Account Button
	
	socialAccount();
	
	
	// Modal Window
	
	if ($(".ModalYouTubeLink")[0]) modalYouTube();
	if ($(".ModalImageLink")[0]) modalImage();
	
	
	// Branding Image Rotation
	
	if (typeof slides != 'undefined') brandingImage();
	
	
	// Branding Image + Text
	
	initBrandingImageText();
	
	
	// YouTube Box
	
	if ($(".YouTubeBox")[0]) youTubeBox();
	
});


$(window).on("load", function() {
	
	// Rotation Banner
	
	if ($("#RotationBanner")[0]) rotationBanner();
	
	
	// Share Buttons
	
	if ($(".ShareButtonSet")[0]) shareButtons();
	
	
	// Branding Image + Text
	
	if ($("#BrandingImgStyle3")[0] || $("#BrandingImgStyle4")[0]) brandingImageText();
	
});

$(window).on("resize", function() {
	
	// Rotation Banner
	
	if ($("#RotationBanner")[0]) initRotationBanner();
	
	
	// Branding Image + Text
	
	if ($("#BrandingImgStyle3")[0] || $("#BrandingImgStyle4")[0]) brandingImageText();
	
});

})(jQuery);
