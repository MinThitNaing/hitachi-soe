/* **************************************************

Name: common2.js

Description: Common Settings

Create: 2021.08.01

Copyright 2021 Hitachi, Ltd.

***************************************************** */

$.extend({

    // 画面サイズ
    isLG : function(){
        return (window.innerWidth || document.documentElement.clientWidth) >= 995
    },
    isMD : function(){
        return (window.innerWidth || document.documentElement.clientWidth) < 995
    },
    isSM : function(){
        return (window.innerWidth || document.documentElement.clientWidth) < 768
    },
    isXS : function(){
        return (window.innerWidth || document.documentElement.clientWidth) < 580
    },
    isXXS : function(){
        return (window.innerWidth || document.documentElement.clientWidth) < 400
    }

});


// コピーライト
$(function(){
    const year1 = parseInt($("#Copyright span").text());
    const year2 = (new Date()).getFullYear();
    if (isNaN(year1)) return;
    if (year1 == year2) return;
    if (year1 < year2) $("#Copyright span").text(year1 + ", " + year2);
});


// Width Fix
$(function(){
    $("#HeaderArea1, #HeaderArea2, #FooterArea, #HorizontalLocalNaviArea, #Popup #Contents").each(function(){
        if($(this).find(">.ContainerFix.Wide").length) {
            $(this).addClass("FixWide");
            return;
        }
        if($(this).find(">.ContainerFix").length) {
            $(this).addClass("Fix");
            return;
        }
    });
});

// サポートメニュー
$(function(){
    if ($(".SupportNaviIconText").length == 0) {
        return;
    }

    const $search = $("#SupportNaviSearch");
    const alt = $search.find("img").attr("alt");

    $(".SupportNaviIconText>a, .SupportNaviIconText>button").each(function(){
        if (!$(this).is($search)) {
            $(this).find("img").attr("alt", null);
        }
    });

    $(window).on("resize.SupportNavi", function(){
        if ($.isSM()) {
            $search.find("img").attr("alt", alt);
        } else {
            $search.find("img").attr("alt", null);
        }
    }).triggerHandler("resize.SupportNavi");
});


// 検索
$(function(){

    const $form = $("#SearchFormArea");
    const $header = $("#HeaderArea1");
    const $btn = $("button#SupportNaviSearch");

    if ($form.length == 0 || $btn.length == 0) {
        return;
    }

    // 検索を開く
    function open() {
        $("button#SupportNaviLang.is-open").triggerHandler("click");
        $("#SpMenuBtn.is-open").triggerHandler("click");

        if (!$.isSM() || $header.find(".ContainerFix").length) {
            $form.stop(true, true).slideDown({progress:function(){
                $header.css("margin-bottom", $form.outerHeight());
            }});
        } else {
            $("html").css("overflow", "hidden");
            $("body").addClass("spsearch-open");
            $backdrop.appendTo("body").ready(function(){
                $backdrop.addClass("show");
            });
            $form.show().ready(function(){
                $form.addClass("show");
            });
        }

        $btn.addClass("is-open").attr("aria-expanded", "true");
    }

    // 検索を閉じる
    function close() {
        if (!$.isSM() || $header.find(".ContainerFix").length) {
            $form.stop(true, true).slideUp({progress:function(){
                $header.css("margin-bottom", $form.outerHeight());
            }});
        }
        $("html").css("overflow", "");
        $("body").removeClass("spsearch-open");
        $form.removeClass("show");
        $backdrop.removeClass("show");
        $btn.removeClass("is-open").attr("aria-expanded", "false");
    }

    $form.on("transitionend webkitTransitionEnd", function() {
        if (!$form.hasClass("show")) {
            $form.hide();
        }
    });


    // サポートメニューの検索ボタン
    $("button#SupportNaviSearch").on("click", function(){
        if ($(this).hasClass("is-open")) {
            close();
        } else {
            open();           
        }
        return false;
    });

    // 検索エリアの閉じるボタン
    $("#SearchFormArea .BtnClose").on("click", function(){
        $("button#SupportNaviSearch.is-open").triggerHandler("click");
        return false;
    });

    // backdrop
    const $backdrop = $('<div id="SpSearchBackdrop"></div>');
    $backdrop.on("transitionend webkitTransitionEnd", function() {
        if (!$backdrop.hasClass("show")) {
            $backdrop.detach();
        }
    });
    $backdrop.on("click", function(e) {
        close();
    });
    
    $(window).on("resize.SearchFormArea", function(){
        $form.css("top", $header.height());
        
        if ($header.find(".Container").length) {
            if ($.isSM()) {
                $header.css("margin-bottom", "");
                if ($form.is(":visible") && !$form.hasClass("show")) {
                    close();
                }
            } else {
                if ($form.is(":visible")) {
                    if ($form.hasClass("show")) close();
                    $header.css("margin-bottom", $form.outerHeight());
                }
            }
        }
      
        return false;
    }).triggerHandler("resize.SearchFormArea");
});


//  地域 、言語
$(function(){

    const $menu = $("#LangMenu");
    const $btn = $("button#SupportNaviLang");

    if ($btn.length == 0) return;
    if ($menu.length == 0) return;

    // ドロップダウンの位置の調整
    function offset() {
        if (!$btn.is(":visible")) return;
        $menu.offset({
            top: $btn.offset().top + $btn.height(),
            left: $btn.offset().left + $btn.outerWidth() - $menu.width()
        });
    }

    // ドロップダウンを開く
    function open() {
        $("button#SupportNaviSearch.is-open").triggerHandler("click");
        $menu.stop(true, true).slideDown(function(){
            if ($menu.find(">.Inner").height() > $menu.height() ) {
                $menu.css("overflow-y", "scroll");
            } else {
                $menu.css("overflow-y", "hidden");
            }
        });
        $backdrop.appendTo("body");
        $btn.addClass("is-open").attr("aria-expanded", "true");
        $btn.attr("aria-expanded", "true");
        $("#HeaderArea1").addClass("countrymenu-open");
        offset();
    }

    // ドロップダウンを閉じる
    function close() {
        $backdrop.detach();
        $menu.stop(true, true).slideUp();
        $btn.removeClass("is-open").attr("aria-expanded", "false");
        $("#HeaderArea1").removeClass("countrymenu-open");
    }

    // ボタン
    $btn.on("click", function(){
        if ($btn.length) {
            $btn.hasClass("is-open") ? close() : open();
            return false;
        } else {
            return true;
        }
    });

    // blur
    $menu.find("a").on("blur", function(){
        setTimeout(function(){
            if ($menu.find("a").index($(":focus")) == -1) {
                close();
            }
        },50);
    });
 

    // keydown（ボタン）
    $btn.on("keydown", function(e){
        if (e.keyCode == 13 || e.keyCode == 40) {
            open();    
            $menu.find("a:first-child").focus();
            return false;
        }
        return true;
    });

    // keydown（メニュー内）
    $menu.find("a").on("keydown", function(e){
        if (e.keyCode == 38) {
            const $prev = $(this).prev();
            if ($prev.length == 1) {
                $prev.focus();
            } else {
                $menu.find("a:last-child").focus();
            }
            return false;
        }
        if (e.keyCode == 40) {
            const $next = $(this).next();
            if ($next.length == 1) {
                $next.focus();
            } else {
                $menu.find("a:first-child").focus();
            }
            return false;
        }
        if (e.keyCode == 9) {
            return true;
        }
    });

    const $backdrop = $('<div id="LangBackdrop"></div>');
    $backdrop.on("click", close);

    // リサイズ
    $(window).on("resize.LangMenu", function(){
        offset();
        if ($.isSM() && $btn.hasClass("is-open")) {
            close();
        }
    });

});



// ドロップダウンメニュー
$(function(){

    // 開く
    function open($btn) {
        
        // 開いているメニューがあれば閉じる
        $(".DropDownMenu>button.is-open").not($btn).each(function(){
            $(this).removeClass("is-open");
            $(this).next("ul").stop(true, true).slideUp();
        });

        $btn.addClass("is-open").attr("aria-expand", "true");
        $btn.next("ul").stop(true, true).slideDown();
        $backdrop.appendTo("body");
        $("#HeaderArea2").addClass("dropdown-open");
    }


    // 閉じる
    function close($btn) {
        if ($btn == null) {
            $(".DropDownMenu>button.is-open").each(function(){
                $(this).removeClass("is-open");
                $(this).next("ul").stop(true, true).slideUp();
            });
        } else {
            $btn.removeClass("is-open").attr("aria-expand", "false");
            $btn.next("ul").stop(true, true).slideUp();
        }
        $backdrop.detach();

        $("#HeaderArea2").removeClass("dropdown-open");      
    }


    // ドップダウンメニューの位置の調整
    function offset() {
        $(".DropDownMenu>button.is-open").each(function(){
            const $btn = $(this);
            const $menu = $(this).next("ul");
            const $container = $("#HeaderArea2>.Container ,#HeaderArea2>.ContainerFix");

            if ($btn.offset().left + $menu.width() > $container.offset().left + $container.width()) {
                $menu.offset({left: $btn.offset().left - $menu.width() + $btn.outerWidth()});
            } else {
                $menu.offset({left: $btn.offset().left});
            }
        });
    }

    
    // メニューのクリック
    $(".DropDownMenu>button").on("click", function(){
        if ($(this).hasClass("is-open")) {
            close($(this));
        } else {
            open($(this));
            offset();
        }

        return false;
    });

    // keydown（メニュー）
    $(".DropDownMenu>button").on("keydown", function(e){
        if (e.keyCode == 13 || e.keyCode == 40) {
            if ($(this).hasClass("is-open")) {
                close($(this));
            } else {
                open($(this));
                offset();
                $(this).next().find(">li:first-child>*").focus();
            }            
            return false;
        }
        return true;
    });
    
     // サブメニューの開閉
    $(".DropDownMenu>ul button").on("click", function(){

        if ($(this).hasClass("is-open")) {
            $(this).removeClass("is-open").attr("aria-expanded", "false");
            $(this).next("ul").stop(true, true).slideUp();    
        } else {
            $(this).addClass("is-open").attr("aria-expanded", "true");
            $(this).next("ul").stop(true, true).slideDown();
        }
        return false;
    });

    // keydown（メニュー内）
    $(".DropDownMenu>ul a, .DropDownMenu>ul button").on("keydown", function(e){
        if (e.keyCode == 38) {
            const $list = $(this).closest("ul").children();
            var $prev = $(this).parent().prev();
            if ($prev.length == 0) {
                $prev = $list.last();
            }
            $prev.find(">a,>button").focus();
            return false;
        }
        if (e.keyCode == 40) {
            const $list = $(this).closest("ul").children();
            var $next = $(this).parent().next();
            if ($next.length == 0) {
                $next = $list.first();
            }
            $next.find(">a,>button").focus();
            return false;
        }
        if (e.keyCode == 39) {
            const $ul = $(this).next("ul");
            if ($ul.length) {
                $(this).addClass("is-open").attr("aria-expanded", "true");
                $ul.stop(true, true).slideDown();
                $ul.find(">li:first-child>*").focus();
            }
            return false;
        }
        if (e.keyCode == 37) {
            const $ul = $(this).closest("ul");
            $ul.prev("button").focus().removeClass("is-open").attr("aria-expanded", "false");
            $ul.stop(true, true).slideUp();
            return false;
        }
        if (e.keyCode == 9) {
            return true;
        }
        return true;
    });
    
    
    // 選択中のメニューを開いた状態にする
    $(".DropDownMenu>ul li.Current").each(function(){
        $(this).parents("ul:not([id^=GlobalNaviMenu])").each(function(){
            if (!$(this).parent().hasClass("DropDownMenu")) {
                $(this).show();
                $(this).prev("button").addClass("is-open").attr("aria-expanded", "true");
            }
        });
    });

    // フォーカス
    $(".DropDownMenu>ul a, .DropDownMenu>ul button").on("blur", function(e){
        const $menu = $(this).closest(".DropDownMenu").find(">ul");
        setTimeout(function(){
            if ($menu.find("a,button").index($(":focus")) == -1) {
                close();
            }
        },50);
    });

    // ウィンドウリサイズ
    $(window).on("resize.DropDownMenu", function(){

        // ドロップダウンメニューの位置を調整
        offset();

        // SPモードになったらメニューを閉じる
        if ($.isSM()) {
            close();
        }

    });

    // backdrop
    const $backdrop = $('<div id="DropDownBackdrop"></div>');
    $backdrop.on("click", function(){
        close(null);
    });

});



// ヘッダーエリア1固定
$(function(){

    const $body = $("body");
    const $header1 = $("#HeaderArea1");
    var scroll = 0;

    if ($("#Popup").length) return;
    if ($header1.find(">.ContainerFix").length) return;

    // スクロール
    $(window).on("scroll.Header1", function(){

        if (!$.isSM()) return;
        if ($body.hasClass("menu-open")) return;
        if ($body.hasClass("spsearch-open")) return;

        if ($(window).scrollTop() <= 0) {
            $body.removeClass("header1-fix header1-transition header1-show");
            scroll = 0;
            return;
        }

        if ($(window).scrollTop() < $header1.height() ) {
            return;
        }

        // ヘッダーの固定
        if (!$body.hasClass("header1-fix")) {
            $body.addClass("header1-fix").ready(function(){
                $body.addClass("header1-transition");
            });
        }

        // 上スクロール
        if ( $(window).scrollTop() <= scroll) {
            $body.addClass("header1-show");        
        } else {
            $body.removeClass("header1-show");
        }

        // 横位置の調整
        if ($.isSM()) {
            if ($header1.width() > $(window).width()) {
                $header1.css({left:0 - $(window).scrollLeft()});
            } else {
                $header1.css({left:0});
            }
        }

        scroll = $(window).scrollTop()
        
    });

     // リサイズ
     $(window).on("resize.HeaderArea1", function(){
        if (!$.isSM()) {
            $body.removeClass("header1-fix header1-transition header1-show");
        }
    });
});


// ヘッダーエリア2固定
$(function(){

    const $body = $("body");
    const $header1 = $("#HeaderArea1");
    const $header2 = $("#HeaderArea2");
    var scroll = 0;

    if (!$header2.hasClass("Sticky")) return;

    // スクロール
    $(window).on("scroll.Header2", function(){

        if ($.isSM()) {
            if ($header2.find(">.Container").length) return;
        }

        if ($(window).scrollTop() <= $header1.outerHeight(true)) {
            $body.css("padding-top", "");
            $body.removeClass("header2-fix header2-transition header2-show");
            $header2.css({left:0});
            scroll = 0;
            return;
        }
        
        if ($(window).scrollTop() < $header1.outerHeight(true) + $header2.height()) {
            return;
        }
        
        if (!$body.hasClass("header2-fix")) {
            $body.addClass("header2-fix").ready(function(){
                $body.addClass("header2-transition");
            });
            $(".DropDownMenu>button.is-open").triggerHandler("click");
            $("button#SupportNaviLang.is-open").triggerHandler("click");
        }

        if ($(window).scrollTop() <= scroll) {
            $body.addClass("header2-show");
        } else {
            $body.removeClass("header2-show");
            $(".DropDownMenu>button.is-open").triggerHandler("click")
        }

        $body.css("padding-top", $header2.height());

        if ($header2.width() > $(window).width()) {
            $header2.css({left:0 - $(window).scrollLeft()});
        } else {
            $header2.css({left:0});
        }

        scroll = $(window).scrollTop();
    });

     // リサイズ
     $(window).on("resize.HeaderArea2", function(){
        if ($.isSM()) {
            $body.removeClass("header2-fix header2-transition header2-show");
            $body.css("padding-top", "");
            $header2.css({left:0});
        }
    });
});


// スマホメニュー
$(function(){


    const $spMenuBtn = $("#SpMenuBtn");
    const $pcSupNavi = $("#SupportNavi").clone();
    const $pcLangMenu = $("#LangMenu").clone();
    const $pcGlobalMenu = $("#GlobalNaviMenu").clone();
    const $pcMegaMenu = $("#MegaMenu").clone();
    const $pcLocalMenu = $("#HorizontalLocalNavi").clone();
    const $spGlobalMenu = ($pcGlobalMenu.length == 1 ? $pcGlobalMenu : $('<ul id="SpGlobalNavi"></ul>'));
    const $spSupNavi = $('<ul id="SpSupportNavi"></ul>');
    const $spModal = $('<div id="SpMenuModal" tabindex="-1"><div id="SpMenuModalDialog"><div id="SpMenuModalContent"><div id="SpMenuModalBody"></div></div></div></div>');

    if ($("#HeaderArea1>.ContainerFix").length > 0) return;
    if ($spMenuBtn.length == 0) return;

    $spMenuBtn.attr("aria-expanded", "false");
    $spMenuBtn.attr("aria-controls", "SpMenuModalDialog");

    // backdrop
    const $backdrop = $('<div id="SpMenuModalBackdrop"></div>');
    $backdrop.on("transitionend webkitTransitionEnd", function() {
        if (!$backdrop.hasClass("show")) {
            $backdrop.detach();
        }
    });

    // メニューを開く
    function menuOpen() {

        $("button#SupportNaviSearch.is-open").triggerHandler("click");

        $("html").css("overflow", "hidden");
        $("body").addClass("menu-open");        
        $spMenuBtn.addClass("is-open").attr("aria-expanded", "true");
        $backdrop.appendTo("body").ready(function(){
            $backdrop.addClass("show");
        });
        $spModal.show().ready(function(){
            $spModal.addClass("show");
        });
    }

    // メニューを閉じる
    function menuClose() {
        $("body").removeClass("menu-open");
        $("html").css("overflow", "");
        $backdrop.removeClass("show");
        $spModal.removeClass("show");
        $spMenuBtn.removeClass("is-open").attr("aria-expanded", "false");
    }


    // メニューボタンのクリック
    $spMenuBtn.on("click", function(){
        if ($(this).hasClass("is-open")) {
            menuClose();
        } else {
            menuOpen();
        }
        
        return false
    });

    // リサイズ
    $(window).on("resize.SpMenu", function(){
        if (!$.isSM()) {
            menuClose();
        }
    });

    // メニュー項目の開閉
    $(document).on("click", "#SpGlobalNavi button,#SpSupportNavi button", function(){

        if ($(this).hasClass("is-open")) {
            $(this).removeClass("is-open").attr("aria-expanded", "false");
            $(this).next("ul").stop(true, true).slideUp();
        } else {
            $(this).addClass("is-open").attr("aria-expanded", "true");
            $(this).next("ul").stop(true, true).slideDown();
        }

        return false;
    });

    $spModal.on("click", function(e) {
        if (e.target === e.currentTarget) {
            menuClose();
        }
    });

    // メニューの構築
    // グローバルナビ
    if ($spGlobalMenu.length == 1) {
        $spGlobalMenu.attr("id", "SpGlobalNavi");
        $spGlobalMenu.find(".DropDownMenu").removeClass("DropDownMenu");
        $spGlobalMenu.find(".is-open").removeClass("is-open").next("ul").hide();
        $spGlobalMenu.find("button").each(function(){
            const aria = $(this).attr("aria-controls");
            const $ul = $(this).next("ul");
            const id = $ul.attr("id");
            if (aria) {
                $(this).attr("aria-controls", "__SpMenu"+aria);
                $ul.attr("id", "__SpMenu"+$ul.attr("ids"));
            }
            if (id) {
                $(this).attr("aria-controls", "__SpMenu"+aria);
                $ul.attr("id", "__SpMenu"+id);
            }
        });

    }
    
    // 横型ローカルナビ
    $pcLocalMenu.attr("id", "");
    if ($pcLocalMenu.length) {
        $spGlobalMenu.find(">.Current").each(function(){
            $(this).append($pcLocalMenu.clone().css("display", "block"));
        });
    }

    // メガメニュー
    $pcMegaMenu.find(".MMGlobalNaviStyle").each(function(){
        const $li = $("<li></li>");
        if ($(this).hasClass("Current")) {
            $li.addClass("Current");
        }
        $li.append($(this).find("a"));
        $spGlobalMenu.append($li);
    });


    // サポートメニュー
    $pcSupNavi.find(">a:not(#SupportNaviSearch),>button:not(#SupportNaviSearch)").each(function(){
        const $li = $("<li></li>");
        if ($(this).prop("tagName").toLowerCase() == "button" && $(this).attr("id") == "SupportNaviLang") {
            const $ul = $("<ul></ul>");
            const $btn = $("<button><span></span></button>");
            const aria = $(this).attr("aria-controls");
            $pcLangMenu.find("a").each(function(){
                $ul.append($('<li></li>').append($(this)));
            });
            if ($(this).find("img").length) {
                $(this).find("img").attr("alt", null);
                $btn.find(">span").append($("<span class='Icon'></span>").append($(this).find("img")));
            }
            $btn.find(">span").append($(this).find(">span>span"));
            if (aria) {
                $ul.attr("id", "__SpMenu"+aria);
                $btn.attr("aria-controls" , "__SpMenu"+aria);
                $btn.attr("aria-expanded" , "false");
            }
            $li.append($btn).append($ul);
            $spSupNavi.append($li);
        } else if ($(this).prop("tagName").toLowerCase() == "a") {
            const $item = $(this).clone();
            if ($item.find("img").length) {
                $item.find("img").attr("alt", null);
                $item.prepend("<span class='Icon'></span>");
                $item.find("span.Icon").append($item.find("img"));
            }
            $li.append($item);
            $spSupNavi.append($li);
        }
    });
    
    // メニューを追加
    $spModal.find("#SpMenuModalBody").append($spGlobalMenu); 
    $spModal.find("#SpMenuModalBody").append($spSupNavi);
    $("#HeaderArea1").after($spModal);

    $spModal.on("transitionend webkitTransitionEnd", function() {
        if (!$spModal.hasClass("show")) {
            $spModal.hide();
        }
    });
});

// ページトップへ
$(function(){

    $("#FooterPageTop").off("click");
    $("#FooterPageTop").on("click", function(){
        var topID = (ua("safari")) ? "html,body" : "html";
        var link = $(this).attr("href");
        if(link.charAt(0)=="#" && link.charAt(1)!="") {
            setTimeout(function() {
                $(topID).stop().animate({scrollTop: 0}, 800, "easeInOutCubic", function() {
                    location.href = link;
                });
            }, 50);
            return false;
        }
        return false;
    });


    // FatMenuがある場合、位置の調整
    function offset() {
        var $prev = $("#FooterArea").prev();
        var $target = null;
        while(true) {
            if (!($prev.hasClass("FatMenu") || $prev.hasClass("FatMenuWide") || $prev.hasClass("FatBanner"))) {
                break;
            }
            if ($prev.is(":visible")) {
                $target = $prev;
            }
            $prev = $prev.prev();
        }
        if ($target != null) {
            $("#FooterPageTop").offset({top:$target.offset().top - $("#FooterPageTop").height()});
        } else {
            $("#FooterPageTop").css("top", "");
        }
    }

    if ($("#FooterArea").prevAll(".FatMenu,.FatMenuWide,.FatBanner").length > 0) {
        $(window).on("resize.FooterPageTop", offset);
        offset();
    }


});


// レスポンシブテーブル
$(function(){

    $(".ResponsiveTableWindow").remove();
    $(".LinkSet a").off("click");

    var android4 = navigator.userAgent.indexOf("Android 4") !== -1;		// for Android 4.x
    var contents = "#top, #SiteIdentity, #SiteIdentityS, #SiteIdentityL, #GlobalNavi, #TopicPath, #Contents, .Contents, .FatBanner, .FatMenu, .FatMenuWide, #Footer, #PageTopBottom, #HeaderArea1, #HeaderArea2, #FooterArea, #HorizontalLocalNaviArea";
    var topID = (ua("safari")) ? "body" : "html";
    var scrolltop = 0;
    var label = "Close";

    if ($("html").attr("lang") == "ja") label = "閉じる";
    if ($("html").attr("lang") == "zh-cn") label = "\u5173\u95ed";

    $(".ResponsiveTableStyle2, .ResponsiveTableStyle3").each(function() {
        var grid = $(this).parent(".Grid4")[0] ? "Contents965" : "Contents720";
        var tag = '<div class="ResponsiveTableWindow">';
        tag += '<div class="ResponsiveTableHeaderArea">';
        tag += '<div class="ResponsiveTableStatement">' + $("#Statement").html() + '</div>';
        tag += '<button type="button" class="ResponsiveTableCloseBtn" aria-label="' + label + '"></button>';
        tag += '</div>';
        tag += android4 ? '<div class="ResponsiveTableContainer">' : '';	// for Android 4.x
        tag += '<div class="' + grid + '">';
        tag += $(this).find(".TableSet").html();
        tag += '</div>';
        tag += android4 ? '</div>' : ''; // for Android 4.x
        tag += '</div>';
        $("body").append(tag);
    });

    $(".LinkSet a").on("click", function() {
        scrolltop = $(topID).scrollTop();
        var index = $(".LinkSet a").index(this);
        $("html").addClass("ResponsiveTableWindowOpen");
        $(contents + ", #HeaderArea").hide();
        $(".ResponsiveTableWindow").eq(index).show();
        $(topID).scrollTop(0);
    });

    $(".ResponsiveTableCloseBtn").on("click", function() {
        var index = $(".ResponsiveTableCloseBtn").index(this);
        $("html").removeClass("ResponsiveTableWindowOpen");
        $(contents).removeAttr("style");
        $("#HeaderArea").show();
        $(".ResponsiveTableWindow").eq(index).removeAttr("style");
        $(topID).scrollTop(scrolltop);
    });

});

