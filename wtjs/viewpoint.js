_ViewPointItems = {
"Footer":{selector:"div#Footer"},
};

(function(){
  var s = new Object();
  var doc = document.body || document.documentElement;
	var vw = window.innerWidth || document.documentElement.clientWidth;
	var vh = window.innerHeight || document.documentElement.clientHeight;  
	var dh = Math.max(doc.scrollHeight,doc.offsetHeight,doc.clientHeight);
  s.isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
  s.isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);
  s.isFF = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
  s.msie=navigator.appVersion.toLowerCase();
  s.msie=(s.msie.indexOf('msie')>-1)?parseInt(s.msie.replace(/.*msie[ ]/,'').match(/^[0-9]+/)):0;
	s.parameters = [];
	s.items = {};
	s.viewed = {};
	s.timer = null;
	s.send = function(){};
  s.sendData = function(params){
  	params = ["DCSext.ViewPoints",Object.keys(s.viewed).length,"WT.dl","1","DCSext.env","prod"].concat(params);
    var blnSent = false;
    if(s.isFF){
      var _ElementInterval = setInterval(function () {
        if(!blnSent){
	      	s.send.apply(this,params);
          blnSent = true;
        }
        clearInterval(_ElementInterval);
      },0);
    } else {
      if(!blnSent){
        s.send.apply(this,params);
        blnSent = true;
      }
    }
  	return;
  }
	s.handler = (function(e){
		dh = Math.max(dh,doc.scrollHeight,doc.offsetHeight,doc.clientHeight);
  	var elem;
  	for( n in s.items ){  		
  		var elem = s.items[n].element,isbody = (elem.tagName.toLowerCase()=="body"),r,w=0,h=0;x=0,y=0;
  		if( elem.offsetParent==null && !isbody ){
				continue;
  		}
			r = elem.getBoundingClientRect();
			w = Math.ceil(r.width);
			h = Math.ceil(r.height);
			y = Math.ceil(r.top);
			x = Math.ceil(r.left);
			
			var viewed = Math.max(s.viewed[n],Math.min(100,Math.max(0,Math.ceil((vh-r.top)/(isbody?dh:r.height)*100))));
			var t = document.elementFromPoint(Math.max(0,x)+1,Math.max(0,y)+1);
			var ontop = t==elem;
			while(t && !ontop){
				if(t==elem){ontop=true;break;}
				t = t.parentNode;
			}
			if(!ontop) continue;
 			s.viewed[n] = viewed;
  	}
	}).bind(this);
  s.handle = function(e){
 		if( s.timer ) clearTimeout(s.timer);
 		s.timer = setTimeout(s.handler.bind(null,e),50);
  	return;
  }
  s.final = function(){
    var params = s.parameters;
  	var ks=[],vs=[];
  	for(var k in s.viewed){
  		if(s.viewed[k]==null) continue;
  		ks.push(k);
  		vs.push(s.viewed[k]);
  	}
  	params = params.concat(["DCSext.ViewPointKeys",ks.join(";"),"DCSext.ViewPointVals",vs.join(";")]);
    s.sendData(params);
  }

	var init = function(){
		s.send = window.dcsMultiTrack;
		var setattr = function(elm,n,v){
			elm.setAttribute(n,v);
		}
		var register = function(selector,val){
			var o,key,x,xs;
			for( x in (xs=document.querySelectorAll(selector)) ){
				if( (o = xs[x]) instanceof HTMLElement ){				
					setattr(o,"data-viewed",val);
				}
			}
		}

		var vpi;
		if( typeof _ViewPointItems == "object" && _ViewPointItems.constructor == Object ){
			for( n in _ViewPointItems ){
				vpi = _ViewPointItems[n];
				if( vpi.selector && vpi.selector.constructor==String ){
					register(vpi.selector,n);
				}
			}
		}
		register("body","Page");
								
		for( var x in (xs=document.querySelectorAll("[data-viewed]")) ){
			var o = xs[x];
			if( !(o instanceof HTMLElement) ) continue;
			var k = o.getAttribute("data-viewed");
			s.items[k] = {element:o};
			s.viewed[k] = null;
		}
		
	  s.handler();
		listen(window,"scroll",s.handle,false);
		listen(window,"mousewheel",s.handle,false);
   	listen(document,'webkitAnimationEnd',s.handle);
    listen(document,'mozAnimationEnd',s.handle);
    listen(document,'MSAnimationEnd',s.handle);
    listen(document,'oanimationend',s.handle);
    listen(document,'animationend',s.handle);
   	listen(document,'webkitTransitionEnd',s.handle);
    listen(document,'mozTransitionEnd',s.handle);
    listen(document,'MSTransitionEnd',s.handle);
    listen(document,'otransitionend',s.handle);
    listen(document,'transitionend',s.handle);
    listen(window,"beforeunload",s.final);
	}
  
  var listen = function(elm,evt,fnc,cap){
  	if( evt=="load" && (elm==window || elm==document) && document.readyState=="complete"){
  		fnc.call(elm);
  		return;
  	}
		try{ 			elm.addEventListener(evt,fnc,cap); }
		catch(e){		elm.attachEvent("on"+evt,fnc);	}
  }
	listen(window,"load",init);
})();



