(function(){
  $(function(){
    var _barClosed;
    var theTag = function(element){
      var o,e,p;
      if(!element) return null;
      e = element.cloneNode();
      o=e.outerHTML;
      if(!o){
        return o;
      } else {
        p={};
        for(var i=0;i<e.attributes.length;i++){
          p[e.attributes.item(i).name]=e.attributes.item(i).value;
        }
        return JSON.stringify(p);
      }
    }
    
    var query = function(selector){
      var ret = null;
      if(document.querySelector){
        ret = document.querySelector(selector);
      } else {
        ret = $(selector)[0]||null;
      }
      return ret;
    }

    var DAMSupport = (function () {
      var supported = false;
      function handler() {
        supported = true;
      }
      document[document.addEventListener?"addEventListener":"attachEvent"]('DOMAttrModified', handler);
      var attr = '__DAMTEST___';
      document.body.setAttribute(attr, 'foo'); // aka $('body').attr(attr, 'foo');
      document[document.addEventListener?"removeEventListener":"detachEvent"]('DOMAttrModified', handler);
      document.body.removeAttribute(attr);
      return supported;
    })();

    _tag.DCSext["IP_LANGS"]=(navigator.languages||[]).join(",");
    
    var send = function(args){
      args["DCS.dcsuri"] = "/Webtrends/Events/IP/";
      args["WT.dl"] = 22;
      var ps = [];
      for(var key in _tag.DCSext){ps.push(key);ps.push(_tag.DCSext[key]);}
      for(var key in args){ps.push(key);ps.push(args[key]);}
      dcsMultiTrack.apply(window,ps);
    }

    var onStart = function(){
    
      _OPEN=true;
      _tag.DCSext["IP_FROM_URL"] = $("#CRBarGo>a").attr("href");
      _tag.DCSext["IP_FROM_NAME"] = $("#CRBarGo>a").text();
      
      var args = {}
      args["DCSext.IP_ACTION"] = "IP_SHOWBAR";
      send(args);
    }
    var onRegionRecommended=function(){
      var args = {};
      args["DCSext.IP_ACTION"] = "IP_GOTOREGION";
      args["DCSext.IP_TRIGGER"] = "CRBAR";
      args["DCSext.IP_GUESSED"] = "1";
      send(args);
    }
    var onRegionSelected=function(){
      var args = {};
      var TRIGGER = $("#CountryRegion .BtnOpen a").hasClass("Current")?"GLOBAL":"CRBAR";
      args["DCSext.IP_ACTION"] = "IP_GOTOREGION";
      args["DCSext.IP_TRIGGER"] = TRIGGER;
      args["DCSext.IP_TO_URL"] = $(this).attr("href");
      args["DCSext.IP_TO_NAME"] = $(this).text(); 
      args["DCSext.IP_GUESSED"] = "0";
      send(args);
    }
    var onRegionSelector = function(){
      var args = {};
      var TRIGGER = $("#CountryRegion #CRBarInner").is(":visible")?"CRBAR":"GLOBAL";
      args["DCSext.IP_ACTION"] = "IP_REGIONLIST";
      args["DCSext.IP_TRIGGER"] = TRIGGER;
      send(args);
    }    
    var onRegionClosed = function(e){
      var TRIGGER = $("#CountryRegion .BtnOpen a").hasClass("Current")?"GLOBAL":e===true?"TIMER":"CRBAR";
      var args = {};
      args["DCSext.IP_ACTION"] = "IP_CLOSEBAR";
      args["DCSext.IP_TRIGGER"] = TRIGGER;
      if(!_barClosed){
        _barClosed = true;
        send(args);
      }
    }

    /**************************************************************************************/
    var OnReady = function(selector,func,scope){
      var self=this;
      var observer,listener,timer;
      var found = query(selector);
      var listento = "DOMNodeInserted";
      this.check = function(){
        found = query(selector);
        if(found){
          if(observer){
            observer.disconnect();
          } else if(listener) {
            document[document.addEventListener?"removeEventListener":"dettachEvent"](listento,self.check);
          } else if(timer) {
            clearInterval(timer);
          }
          func.call(found);
        } else if(!observer && !listener && !timer) {
          timer = setInterval(this.check,50);
        }
      }
      
      if(found){
        func.call(found);
      } else {
        if(typeof MutationObserver!="undefined"){
          var config = {childList: true, subtree:true}
          observer = new MutationObserver(this.check);
          observer.observe(document, config);
        } else if(typeof MutationEvent!="undefined") {
          listener=document.addEventListener?"addEventListener":"attachEvent";
          if(listener){
            document[listener](listento,this.check);
          }
        } else {
          this.check();
        }
      }
    }

    /**************************************************************************************/
    var OnChange = function(selector,func){
      var observer,listener,listento,timer;
      var self = this;
      this.selector = selector;
      this.previous = null;
      this.current = null;
      var mm = selector;
      this.stop = function(){
        if(observer){
          observer.disconnect();
        } else if(listener && listento){
          TARGET[document.addEventListener?"removeEventListener":"dettachEvent"](listento,self.check);
        } else if(timer) {
          clearInterval(timer);
        }
      };
      this.check = function(){
        if(observer){
          func.call(TARGET);
        } else if(listener) {
          func.call(TARGET);
        } else if(timer) {
          if(this.current!=theTag(TARGET)){
            this.previous = this.current;
            this.current = theTag(TARGET);
            func.call(TARGET);
          }
        } else {
          timer = setInterval(this.check,50);
          this.timer=timer;
        }
      };

      var TARGET = query(selector);
      if(!TARGET){
        watch("Ready",selector,function(){watch("Change",selector,func);});
      } else {
        this.current = theTag(TARGET);
        if(typeof MutationObserver!="undefined"){
          var config = {attributes:true}
          observer = new MutationObserver(this.check);
          observer.observe(TARGET, config);
          _tag.DCSext["IP_MONITOR"] = "Observer";
        } else if(DAMSupport && ((typeof MutationEvent!="undefined") || document.onpropertychange!==undefined)) {
          listener=document.addEventListener?"addEventListener":"attachEvent";
          listento=(typeof MutationEvent!="undefined")?"DOMAttrModified":"onpropertychange";
          if(listener){
            TARGET[listener](listento,this.check);
            _tag.DCSext["IP_MONITOR"] = listento;
          } else {
            _tag.DCSext["IP_MONITOR"] = "UNKNOWN";
          }
        } else {
          this.check.call(this);
          _tag.DCSext["IP_MONITOR"] = "Timer";
        }
      }
    }

    /**************************************************************************************/
    // Factory
    var watch = function(event,selector,func){
      var ins;
      if(typeof event=="string"){
        switch(event.toUpperCase()){
          case "READY":
            ins = new OnReady(selector,func);
            break;
          case "CHANGE":
            ins = new OnChange(selector,func);
            break;
        }
      }
      return ins;
    }

    /**************************************************************************************/
    // MAIN
    try{
      var i = 0,barwatcher,areawatcher;
      watch("Ready","#CountryRegionBar",function(){
        try{
          var _BAROPEN,_AREAOPEN;
          barwatcher = watch("Change","#CRBarInner",function(){
            var $target = $("#CRBarInner");
            if((_BAROPEN===undefined) && ($target.is(":visible")==true) && ((parseFloat($target.css("margin-top").replace("px",""))||0)==0.)){
              _BAROPEN = true;
              onStart();
            } else if((_BAROPEN===true) && ($target.is(":visible")==false)){
              barwatcher.stop();
              onRegionClosed(true);
            }
          });
          areawatcher = watch("Change","#CountryRegionArea",function(){
            var $target = $("#CountryRegionArea");
            if((_AREAOPEN!==true) && ($target.is(":visible")==true)){
              _AREAOPEN = true;
              onRegionSelector(true);
            } else if((_AREAOPEN===true) && ($target.is(":visible")==false)){
              _AREAOPEN = false;
            }
          });
          $("#CRBarGo").on("click",onRegionRecommended);
          $("#CRBarClose").on("click",onRegionClosed);
          $("#CountryRegionSet a[href^='http']").on("click",onRegionSelected);
          $("#CountryRegion>.BtnOpen").on("click",onRegionSelector);
          $("#CountryRegion>.BtnOpen").on("click",onRegionClosed);
        } catch(err) {
          console.log(err);
          console.log("AreaWatcheX",areawatcher);
          if(barwatcher){
            if(barwatcher.stop) barwatcher.stop();
            if(barwatcher.timer) clearInterval(barwatcher.timer);
            barwatcher = undefined;
          }
          if(areawatcher){
            if(areawatcher.stop) areawatcher.stop();
            if(areawatcher.timer) clearInterval(areawatcher.timer);
            areawatcher = undefined;
          }
        }
      });
    } catch(err) {
      void(0);
    }
  });
})();