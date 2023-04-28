function fatMenuLevel1() {
var fm='';
fm +='<div class="FatMenuSet">';
fm +='<div class="ClearFix">';
fm +='<h2 class="FMTitleLinkStyle2"><a href="https://www.hitachi.com/index.html">Hitachi Group Global Site</a></h2>';
fm +='</div>';
fm +='<div class="FMColumnMenuArea">';
fm +='<div class="FMGrid1">';
fm +='<div class="FMTopColumnMenu1 FMFirstItem">';
fm +='<h3 class="FMSubHeaderLink"><a href="https://www.hitachi.com/businesses/index.html">Products &amp; Services</a></h3>';
fm +='</div>';
fm +='<div class="FMBottomColumnMenu FMFirstItem">';
fm +='<ul class="FMLinkListStyle">';
fm +='<li><a href="https://social-innovation.hitachi/en/category/sib_case_studies/?WT.ac=fat_case">Case Studies</a></li>';
fm +='</ul>';
fm +='</div>';
fm +='</div>';
fm +='<div class="FMGrid2">';
fm +='<div class="FMTopColumnMenu2 FMFirstItem">';
fm +='<h3 class="FMSubHeaderLink"><a href="https://www.hitachi.com/corporate/index.html">Corporate Information</a></h3>';
fm +='</div>';
fm +='<div class="FMBottomColumnMenu FMFirstItem">';
fm +='<ul class="FMLinkListStyle">';
fm +='<li><a href="https://www.hitachi.com/corporate/about/index.html">About Hitachi Group</a></li>';
fm +='<li><a href="https://www.hitachi.com/New/cnews/index.html">News Releases</a></li>';
fm +='<li><a href="https://www.hitachi.com/IR-e/index.html">Investor Relations</a></li>';
fm +='<li><a href="https://www.hitachi.com/rd/index.html">Research &amp; Development</a></li>';
fm +='</ul>';
fm +='</div>';
fm +='<div class="FMBottomColumnMenu">';
fm +='<ul class="FMLinkListStyle">';
fm +='<li><a href="https://www.hitachi.com/sustainability/index.html">Sustainability</a></li>';
fm +='<li><a href="https://www.hitachi.com/environment/index.html">Environmental Activities</a></li>';
fm +='<li><a href="https://careers.hitachi.com/">Careers</a></li>';
fm +='<li><a href="https://www.hitachi.com/corporate/events/index.html">Exhibition and Event Information</a></li>';
fm +='</ul>';
fm +='</div>';
fm +='</div>';
fm +='<div class="FMGrid1">';
fm +='<div class="FMTopColumnMenu1 FMFirstItem">';
fm +='<h3 class="FMSubHeaderLink"><a href="https://www.hitachi.com/global/index.html">Global Network</a></h3>';
fm +='<h3 class="FMSubHeaderLink"><a href="https://www.hitachi.com/contact/index.html">Contact Information</a></h3>';
fm +='</div>';
fm +='</div>';
fm +='</div>';
fm +='</div>';
var el = document.createElement('div');
el.setAttribute('className','FatMenuWide');
el.setAttribute('class','FatMenuWide');
el.innerHTML = fm;
document.body.appendChild(el);

// scriptタグにclass追加
var myScript = document.currentScript;
myScript.classList.add('FatMenuWide');
myScript.previousElementSibling.classList.add('FatMenuWide');

}