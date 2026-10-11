/* Vivah Patra — biodata renderer. Renders any of 8 A4 templates from one JSON object. All artwork is original inline SVG/CSS. */
(function(){
'use strict';
var VP=window.VP=window.VP||{};
var PX_W=210*96/25.4; // A4 width in CSS px
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
VP.esc=esc;

/* ---------- template registry ---------- */
VP.TEMPLATES=[
 {slug:'zari-traditional',name:'Zari Traditional',tier:'Free',cat:'Traditional',faith:['Hindu','Sikh'],blurb:'Maroon and gold zari border with rosette corners. The classic family biodata.',theme:{bg:'#FFFBF2',accent:'#681421',gold:'#B4852C',ink:'#2A1517'}},
 {slug:'panna-royal',name:'Panna Royal',tier:'Premium',cat:'Royal',faith:['Hindu','Muslim','Sikh'],blurb:'Deep emerald green with a gold arch frame and lattice. Rich and formal.',theme:{bg:'#0F4D36',accent:'#0F4D36',gold:'#E3B04B',ink:'#F8EBCB'}},
 {slug:'gulab-floral',name:'Gulab Floral',tier:'Free',cat:'Floral',faith:['Hindu'],blurb:'Cream page with soft rose clusters in two corners and a round photo.',theme:{bg:'#FFF9F0',accent:'#8E2A47',gold:'#B4852C',ink:'#3A1F26'}},
 {slug:'kagaz-modern',name:'Kagaz Modern',tier:'Free',cat:'Modern',faith:['Hindu','Muslim','Sikh'],blurb:'Clean white page with a side rail. Easy to read, easy on the printer.',theme:{bg:'#FFFFFF',accent:'#681421',gold:'#B4852C',ink:'#2A1517'}},
 {slug:'suryavanshi-royal',name:'Suryavanshi Royal',tier:'Premium',cat:'Royal',faith:['Hindu'],blurb:'Maroon header with a gold temple skyline and a round photo.',theme:{bg:'#FFF8EC',accent:'#681421',gold:'#D9A93F',ink:'#2A1517'}},
 {slug:'rangoli-floral',name:'Rangoli Floral',tier:'Free',cat:'Floral',faith:['Hindu'],blurb:'Warm cream with pink blossoms, a rangoli ring and an arched photo.',theme:{bg:'#FFF7EE',accent:'#9A3552',gold:'#B4852C',ink:'#3A1F26'}},
 {slug:'varma-traditional',name:'Varma Traditional',tier:'Premium',cat:'Traditional',faith:['Hindu','Sikh'],blurb:'Full maroon panel inside an ornate triple gold frame.',theme:{bg:'#5C0F1C',accent:'#F3D58A',gold:'#E3B04B',ink:'#FBEFD9'}},
 {slug:'aarohi-modern',name:'Aarohi Modern',tier:'Free',cat:'Modern',faith:['Hindu','Muslim','Sikh'],blurb:'Soft beige, a left-aligned name and tidy cards. Calm and contemporary.',theme:{bg:'#F6EFE6',accent:'#681421',gold:'#B4852C',ink:'#2A1517'}}
];
VP.tpl=function(slug){for(var i=0;i<VP.TEMPLATES.length;i++)if(VP.TEMPLATES[i].slug===slug)return VP.TEMPLATES[i];return VP.TEMPLATES[0];};

/* ---------- sample data (fictional) ---------- */
VP.sampleShort={name:'Ananya Sharma',gender:'F',dob:'1998-03-15',tob:'07:45 AM',pob:'Delhi, India',height:'5 ft 4 in',complexion:'Fair',religion:'Hindu',caste:'Brahmin',gotra:'Bharadwaj',rashi:'Karka (Cancer)',nakshatra:'Pushya',manglik:'No',motherTongue:'Hindi',marital:'Never Married',education:'B.Tech in Computer Science',occupation:'Software Engineer',company:'Example Technologies Pvt. Ltd.',location:'Bengaluru, Karnataka',income:'₹ 12,00,000 and above',diet:'Vegetarian',about:'I am a sincere, kind-hearted and ambitious girl who believes in relationships built on respect, understanding and values.',expectations:'Looking for a well-educated, understanding partner from a family that values both tradition and a balanced modern life.',father:'Suresh Sharma',fatherOcc:'Retired Bank Manager',mother:'Neelam Sharma',motherOcc:'Homemaker',siblings:'1 Brother (Younger)',familyType:'Nuclear',familyValues:'Moderate',native:'Jaipur, Rajasthan',phone:'+91 98765 43210',email:'ananya.sharma@example.com',address:'12, Sample Colony, Jaipur, Rajasthan 302001',photo:''};
VP.sampleLong=Object.assign({},VP.sampleShort,{name:'Ananya Sharma',education:'B.Tech in Computer Science and Engineering, M.S. in Data Analytics',occupation:'Senior Software Engineer (Machine Learning)',company:'Example Technologies Private Limited, Bengaluru',income:'₹ 24,00,000 and above',about:'I am a sincere, kind-hearted and ambitious girl who believes in relationships built on respect, understanding and shared values. I enjoy classical music, travelling with family, cooking regional recipes and weekend trekking. I stay close to my family and my roots, and I value honesty, humour and a calm home above everything else. Professionally I like solving difficult problems with a good team, and I hope to keep growing while also keeping time for the people who matter. My friends describe me as warm, dependable and a little bit stubborn about the things that count.',expectations:'Looking for a well-educated, kind and understanding partner, preferably settled in a metro city, from a family that values tradition and also supports the independence of both partners. Someone with a good sense of humour, a respectful way of speaking, and a willingness to build a home together with openness and patience. Vegetarian or eggetarian preferred. Career-minded and supportive of my profession.',father:'Suresh Kumar Sharma',fatherOcc:'Retired Bank Manager, State Bank',mother:'Neelam Sharma',motherOcc:'Homemaker, former school teacher',siblings:'1 Brother (Younger, studying MBA), 1 Sister (Elder, married)',familyType:'Nuclear (close to extended family)',familyValues:'Moderate',native:'Jaipur, Rajasthan',address:'12, Sample Colony, Near Example Park, Vaishali Nagar, Jaipur, Rajasthan 302001'});
VP.sampleOver=Object.assign({},VP.sampleLong,{about:VP.sampleLong.about+' '+VP.sampleLong.about+' '+VP.sampleLong.about,expectations:VP.sampleLong.expectations+' '+VP.sampleLong.expectations+' '+VP.sampleLong.expectations});
VP.sampleMale=Object.assign({},VP.sampleShort,{name:'Aarav Sharma',gender:'M',dob:'1995-05-12',occupation:'Product Designer',education:'B.Des, M.Des',father:'Rajesh Sharma',mother:'Neha Sharma',siblings:'1 Sister (Younger)',about:'I am a calm, curious person who loves design, music and long drives. Family and honesty come first for me.',expectations:'Looking for an understanding and independent partner who values family.',email:'aarav.sharma@example.com',rashi:'Simha (Leo)',nakshatra:'Magha',gotra:'Kashyap'});

/* ---------- artwork: sprite ---------- */
var SPRITE='<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>'+
'<linearGradient id="vp-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D58A"/><stop offset=".45" stop-color="#B4852C"/><stop offset=".75" stop-color="#E8C566"/><stop offset="1" stop-color="#A97A21"/></linearGradient>'+
'<linearGradient id="vp-goldv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D58A"/><stop offset=".5" stop-color="#B4852C"/><stop offset="1" stop-color="#E8C566"/></linearGradient>'+
'<linearGradient id="vp-mar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A1F2B"/><stop offset="1" stop-color="#4A0C16"/></linearGradient>'+
'<linearGradient id="vp-grn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14624A"/><stop offset="1" stop-color="#093525"/></linearGradient>'+
'<pattern id="vp-lattice" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M13 2l11 11-11 11L2 13z" fill="none" stroke="#E3B04B" stroke-width=".7" stroke-opacity=".28"/><circle cx="13" cy="13" r="1.3" fill="#E3B04B" fill-opacity=".3"/></pattern>'+
'<pattern id="vp-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1" fill="#E3B04B" fill-opacity=".25"/></pattern>'+
/* corner flourish */
'<symbol id="vp-corner" viewBox="0 0 120 120"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 118V36Q2 2 36 2h82"/><path d="M11 118V42Q11 11 42 11h76" stroke-width=".7"/>'+
'<g transform="translate(27 27)"><circle r="3" fill="currentColor"/><path d="M0 0q9-3 19 0q-10 3-19 0" transform="rotate(0)"/><path d="M0 0q9-3 19 0q-10 3-19 0" transform="rotate(22)"/><path d="M0 0q9-3 19 0q-10 3-19 0" transform="rotate(45)"/><path d="M0 0q9-3 19 0q-10 3-19 0" transform="rotate(68)"/><path d="M0 0q9-3 19 0q-10 3-19 0" transform="rotate(90)"/></g>'+
'<path d="M52 11c9 0 13 5 13 9s-4 7-8 5"/><path d="M11 52c0 9 5 13 9 13s7-4 5-8"/><path d="M74 11c5 0 7 3 7 5"/><path d="M11 74c0 5 3 7 5 7"/>'+
'<circle cx="92" cy="11" r="1.6" fill="currentColor"/><circle cx="11" cy="92" r="1.6" fill="currentColor"/><circle cx="108" cy="11" r="1.1" fill="currentColor"/><circle cx="11" cy="108" r="1.1" fill="currentColor"/></g></symbol>'+
/* divider */
'<symbol id="vp-div" viewBox="0 0 240 16"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M0 8h92M148 8h92"/><path d="M120 1.5l6.5 6.5-6.5 6.5-6.5-6.5z" fill="currentColor"/><path d="M104 8c-3-5-9-5-9 0s6 5 9 0M136 8c3-5 9-5 9 0s-6 5-9 0"/><circle cx="108" cy="8" r="1" fill="currentColor"/><circle cx="132" cy="8" r="1" fill="currentColor"/></g></symbol>'+
'<symbol id="vp-divlotus" viewBox="0 0 240 24"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M0 14h96M144 14h96"/><path d="M120 3c-5 5-5 11 0 16 5-5 5-11 0-16z" fill="currentColor" fill-opacity=".25"/><path d="M120 19c-9-1-14-6-15-12 7 1 13 5 15 12zM120 19c9-1 14-6 15-12-7 1-13 5-15 12z" fill="currentColor" fill-opacity=".15"/><path d="M120 20c-14 1-22-3-26-9 9-1 20 2 26 9zM120 20c14 1 22-3 26-9-9-1-20 2-26 9z"/></g></symbol>'+
/* lotus */
'<symbol id="vp-lotus" viewBox="0 0 80 48"><g fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M40 4C30 16 30 30 40 42 50 30 50 16 40 4Z"/><path d="M40 42C24 40 12 30 8 14 22 16 34 26 40 42Z"/><path d="M40 42C56 40 68 30 72 14 58 16 46 26 40 42Z"/><path d="M40 43C18 47 6 41 0 29 14 29 30 35 40 43Z"/><path d="M40 43C62 47 74 41 80 29 66 29 50 35 40 43Z"/></g></symbol>'+
/* temple skyline */
'<symbol id="vp-temple" viewBox="0 0 320 120"><g fill="currentColor"><path d="M8 104h304v8H8z"/><path fill-rule="evenodd" d="M128 104V72c0-14 8-22 16-30 7-7 9-14 16-27 7 13 9 20 16 27 8 8 16 16 16 30v32zM152 104V88a8 8 0 0 1 16 0v16z"/><circle cx="160" cy="9" r="3.6"/><path d="M159.2 3h1.6v7h-1.6z"/>'+
'<path fill-rule="evenodd" d="M66 104V80c0-11 8-19 19-25 11 6 19 14 19 25v24zM77 104V90a8 8 0 0 1 16 0v14z"/><path d="M85 34c4 6 6 10 6 14H79c0-4 2-8 6-14z"/><circle cx="85" cy="30" r="2.4"/>'+
'<path fill-rule="evenodd" d="M216 104V80c0-11 8-19 19-25 11 6 19 14 19 25v24zM227 104V90a8 8 0 0 1 16 0v14z"/><path d="M235 34c4 6 6 10 6 14h-12c0-4 2-8 6-14z"/><circle cx="235" cy="30" r="2.4"/>'+
'<path fill-rule="evenodd" d="M22 104V90c0-8 6-13 14-18 8 5 14 10 14 18v14zM30 104V96a6 6 0 0 1 12 0v8z"/><path fill-rule="evenodd" d="M270 104V90c0-8 6-13 14-18 8 5 14 10 14 18v14zM278 104V96a6 6 0 0 1 12 0v8z"/><path d="M36 60c3 4 4 7 4 10H32c0-3 1-6 4-10zM284 60c3 4 4 7 4 10h-8c0-3 1-6 4-10z"/></g></symbol>'+
/* rose, leaf, florals */
'<symbol id="vp-rose" viewBox="0 0 100 100"><g><g style="fill:var(--r3,#E27A92)"><ellipse cx="50" cy="20" rx="19" ry="21"/><ellipse cx="50" cy="20" rx="19" ry="21" transform="rotate(72 50 50)"/><ellipse cx="50" cy="20" rx="19" ry="21" transform="rotate(144 50 50)"/><ellipse cx="50" cy="20" rx="19" ry="21" transform="rotate(216 50 50)"/><ellipse cx="50" cy="20" rx="19" ry="21" transform="rotate(288 50 50)"/></g>'+
'<circle cx="50" cy="50" r="31" style="fill:var(--r2,#EE98AB)"/><circle cx="50" cy="50" r="21" style="fill:var(--r1,#F4B6C2)"/>'+
'<path d="M34 50a16 16 0 0 1 32 0M40 54a10 10 0 0 0 20 0M45 46a5.5 5.5 0 0 1 11 0M38 38a16 16 0 0 1 24-4" fill="none" style="stroke:var(--r4,#B94A66)" stroke-width="1.9" stroke-linecap="round"/>'+
'<path d="M24 36a30 30 0 0 1 20-14M70 82a30 30 0 0 0 14-18" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/></g></symbol>'+
'<symbol id="vp-leaf" viewBox="0 0 40 80"><path d="M20 78C3 56 3 24 20 2c17 22 17 54 0 76Z" style="fill:var(--leaf,#6F8F5E)"/><path d="M20 76V10" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" fill="none"/></symbol>'+
'<symbol id="vp-bud" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" style="fill:var(--r2,#EE98AB)"/><circle cx="15" cy="15" r="7" style="fill:var(--r1,#F4B6C2)"/><circle cx="15" cy="15" r="2.6" style="fill:var(--r4,#B94A66)"/></symbol>'+
'<symbol id="vp-florals" viewBox="0 0 260 260"><g>'+
'<g transform="translate(70 30) rotate(-20)"><use href="#vp-leaf" x="-14" y="0" width="28" height="64"/></g><g transform="translate(120 60) rotate(40)"><use href="#vp-leaf" x="-14" y="0" width="28" height="74"/></g><g transform="translate(30 110) rotate(-70)"><use href="#vp-leaf" x="-14" y="0" width="28" height="64"/></g><g transform="translate(70 120) rotate(-10)"><use href="#vp-leaf" x="-14" y="0" width="28" height="80"/></g><g transform="translate(110 100) rotate(65)"><use href="#vp-leaf" x="-14" y="0" width="28" height="84"/></g>'+
'<use href="#vp-rose" x="-6" y="-6" width="124" height="124"/><use href="#vp-rose" x="100" y="-4" width="84" height="84"/><use href="#vp-rose" x="-4" y="104" width="84" height="84"/><use href="#vp-bud" x="108" y="100" width="40" height="40"/><use href="#vp-bud" x="176" y="30" width="26" height="26"/><use href="#vp-bud" x="30" y="186" width="26" height="26"/><use href="#vp-bud" x="150" y="150" width="22" height="22"/><use href="#vp-bud" x="212" y="6" width="16" height="16"/><use href="#vp-bud" x="6" y="224" width="16" height="16"/></g></symbol>'+
'<symbol id="vp-paisley" viewBox="0 0 40 64"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M20 4c14 6 18 22 12 36S12 62 8 50c-3-9 4-16 11-14 7 2 6 11 0 12"/><circle cx="19" cy="42" r="2" fill="currentColor"/><path d="M20 14c8 4 10 13 7 21"/></g></symbol>'+
'</defs></svg>';
VP.ensureSprite=function(){if(!document.getElementById('vp-sprite-host')){var d=document.createElement('div');d.id='vp-sprite-host';d.setAttribute('aria-hidden','true');d.innerHTML=SPRITE;(document.body.firstChild?document.body.insertBefore(d,document.body.firstChild):document.body.appendChild(d));}};

/* ---------- photo silhouette ---------- */
VP.avatar=function(g){
 var hair=g==='M'?'<path d="M-28 -10c0-26 14-38 28-38s28 12 28 38c-6-10-14-14-28-14s-22 4-28 14z" fill="#5a4640"/>':'<path d="M-32 6c-6-36 8-56 32-56s38 20 32 56c0 20 6 34 10 44h-84c4-10 10-24 10-44z" fill="#5a4640"/>';
 var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFE3D3"/><stop offset="1" stop-color="#D9C4AE"/></linearGradient></defs><rect width="200" height="250" fill="url(#b)"/><g transform="translate(100 112)">'+(g==='M'?'':hair)+'<ellipse cx="0" cy="0" rx="30" ry="36" fill="#C9A68A"/>'+(g==='M'?hair:'')+'</g><path d="M22 250c2-48 30-70 78-70s76 22 78 70z" fill="#8D2F3C"/><path d="M84 178l16 22 16-22" fill="#C9A68A"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
};

/* ---------- decor per template (viewBox 794x1123) ---------- */
var FL=['','translate(794 0) scale(-1 1)','translate(0 1123) scale(1 -1)','translate(794 1123) scale(-1 -1)'];
function deco(inner){return '<svg class="bd-deco" viewBox="0 0 794 1123" preserveAspectRatio="none" aria-hidden="true">'+inner+'</svg>';}
var DECOR={
'zari-traditional':function(){var c='';FL.forEach(function(t){c+='<g transform="'+t+'"><use href="#vp-corner" x="14" y="14" width="104" height="104" style="color:#B4852C"/><use href="#vp-rose" x="25" y="25" width="30" height="30" style="--r1:#D77A86;--r2:#B94A5A;--r3:#8F2638;--r4:#5C0F1C"/></g>';});
 return deco('<rect x="26" y="26" width="742" height="1071" fill="none" stroke="#681421" stroke-width="3.2"/><rect x="34" y="34" width="726" height="1055" fill="none" stroke="url(#vp-gold)" stroke-width="1.4"/>'+c);},
'panna-royal':function(){return deco('<rect width="794" height="1123" fill="url(#vp-grn)"/><rect width="794" height="1123" fill="url(#vp-lattice)"/>'+
 '<path d="M44 1079V300C44 232 200 190 262 140C320 92 397 28 397 28C397 28 474 92 532 140C594 190 750 232 750 300V1079Z" fill="#0A3A28" stroke="url(#vp-gold)" stroke-width="3.2"/>'+
 '<path d="M56 1067V304C56 242 208 200 272 150C330 104 397 48 397 48C397 48 464 104 522 150C586 200 738 242 738 304V1067Z" fill="none" stroke="url(#vp-gold)" stroke-width="1"/>'+
 '<use href="#vp-lotus" x="367" y="2" width="60" height="36" style="color:#E3B04B"/>'+
 '<use href="#vp-div" x="297" y="1048" width="200" height="13" style="color:#E3B04B"/>'+
 '<g style="color:#E3B04B"><use href="#vp-paisley" x="58" y="330" width="22" height="36"/><use href="#vp-paisley" x="714" y="330" width="22" height="36"/></g>');},
'gulab-floral':function(){return deco('<rect x="24" y="24" width="746" height="1075" fill="none" stroke="url(#vp-gold)" stroke-width="1.2"/><rect x="30" y="30" width="734" height="1063" fill="none" stroke="#B4852C" stroke-opacity=".35" stroke-width=".8"/>'+
 '<use href="#vp-florals" x="-6" y="-6" width="270" height="270"/><g transform="translate(794 1123) scale(-1 -1)"><use href="#vp-florals" x="-6" y="-6" width="215" height="215"/></g>'+
 '<use href="#vp-div" x="317" y="1060" width="160" height="11" style="color:#B4852C"/>');},
'kagaz-modern':function(){return deco('<rect width="794" height="1123" fill="#fff"/><rect x="0" y="0" width="246" height="1123" fill="#F6F0E7"/><rect x="246" y="0" width="1.5" height="1123" fill="#E6D8C6"/><rect x="0" y="0" width="794" height="9" fill="#681421"/><rect x="0" y="9" width="794" height="2" fill="url(#vp-gold)"/><use href="#vp-lotus" x="93" y="1038" width="60" height="36" style="color:#B4852C"/>');},
'suryavanshi-royal':function(){return deco('<rect width="794" height="1123" fill="#FFF8EC"/><path d="M0 0H794V236Q765 252 735 236T675 236T615 236T555 236T495 236T435 236T375 236T315 236T255 236T195 236T135 236T75 236T15 236L0 236Z" fill="url(#vp-mar)"/><rect width="794" height="236" fill="url(#vp-dots)"/>'+
 '<path d="M0 236H794" stroke="url(#vp-gold)" stroke-width="3"/>'+
 '<use href="#vp-temple" x="247" y="104" width="300" height="112" style="color:#D9A93F"/>'+
 '<rect x="22" y="262" width="750" height="800" fill="none" stroke="url(#vp-gold)" stroke-width="1.4"/><rect x="0" y="1087" width="794" height="36" fill="url(#vp-mar)"/><rect x="0" y="1084" width="794" height="3" fill="url(#vp-gold)"/>');},
'rangoli-floral':function(){return deco('<rect x="22" y="22" width="750" height="1079" rx="3" fill="none" stroke="#B4852C" stroke-width="1" stroke-dasharray="2 5" stroke-linecap="round"/>'+
 '<use href="#vp-florals" x="-8" y="-8" width="300" height="300" style="--r1:#F7C9D2;--r2:#F2A3B5;--r3:#E8819C;--r4:#C0506E"/><g transform="translate(794 1123) scale(-1 -1)"><use href="#vp-florals" x="-8" y="-8" width="230" height="230" style="--r1:#F7C9D2;--r2:#F2A3B5;--r3:#E8819C;--r4:#C0506E"/></g>'+
 '<g transform="translate(794 0) scale(-1 1)"><use href="#vp-florals" x="-8" y="-8" width="150" height="150" style="--r1:#FADBC8;--r2:#F4B79A;--r3:#EE9877;--r4:#C0603E"/></g><g transform="translate(0 1123) scale(1 -1)"><use href="#vp-florals" x="-8" y="-8" width="150" height="150" style="--r1:#FADBC8;--r2:#F4B79A;--r3:#EE9877;--r4:#C0603E"/></g>');},
'varma-traditional':function(){var c='';FL.forEach(function(t){c+='<g transform="'+t+'"><use href="#vp-corner" x="10" y="10" width="128" height="128" style="color:#E3B04B"/></g>';});
 return deco('<rect width="794" height="1123" fill="url(#vp-mar)"/><rect width="794" height="1123" fill="url(#vp-dots)"/><rect x="22" y="22" width="750" height="1079" fill="none" stroke="url(#vp-gold)" stroke-width="3.4"/><rect x="31" y="31" width="732" height="1061" fill="none" stroke="url(#vp-gold)" stroke-width="1.1"/><rect x="40" y="40" width="714" height="1043" fill="none" stroke="#E3B04B" stroke-opacity=".6" stroke-width="1.6" stroke-dasharray="1 6" stroke-linecap="round"/>'+c+
 '<use href="#vp-lotus" x="367" y="14" width="60" height="36" style="color:#E3B04B"/><g transform="translate(0 1123) scale(1 -1)"><use href="#vp-lotus" x="367" y="14" width="60" height="36" style="color:#E3B04B"/></g>');},
'aarohi-modern':function(){return deco('<rect width="794" height="1123" fill="#F6EFE6"/><circle cx="740" cy="-30" r="200" fill="#EBDDCB" fill-opacity=".7"/><circle cx="740" cy="-30" r="140" fill="#E4D2BC" fill-opacity=".6"/><circle cx="-30" cy="1140" r="170" fill="#EBDDCB" fill-opacity=".7"/><rect x="0" y="0" width="12" height="1123" fill="#681421"/><rect x="12" y="0" width="2" height="1123" fill="url(#vp-goldv)"/>');}
};

/* ---------- renderer ---------- */
function fmtDate(v){if(!v)return '';var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v);if(!m)return v;var M=['January','February','March','April','May','June','July','August','September','October','November','December'];return parseInt(m[3],10)+' '+M[parseInt(m[2],10)-1]+' '+m[1];}
VP.fmtDate=fmtDate;
function rows(list){var h='';list.forEach(function(r){if(r[1]&&String(r[1]).trim())h+='<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>';});return h;}
function sec(cls,title,body){if(!body)return '';return '<section class="bd-sec '+cls+'"><h3 class="bd-h"><span class="bd-hm" aria-hidden="true"></span>'+esc(title)+'</h3>'+body+'</section>';}
function dl(list){var r=rows(list);return r?'<dl class="bd-dl">'+r+'</dl>':'';}
function txt(v){return v&&String(v).trim()?'<p class="bd-p">'+esc(v)+'</p>':'';}
VP.html=function(d,slug,o){
 o=o||{};d=d||{};var g=d.gender==='M'?'M':'F';
 var hi=o.lang==='hi';
 var parents=[d.father,d.mother].filter(Boolean).join(' & ');
 var sub=parents?((g==='M'?'S/o ':'D/o ')+parents):'';
 var photo=d.photo||VP.avatar(g);
 var imgStyle='';if(d.photo){var z=d.photoZoom||1,x=d.photoX==null?50:d.photoX,y=d.photoY==null?42:d.photoY;if(z<=1.001){imgStyle=' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:'+x+'% '+y+'%;display:block"';}else{var left=50-x*z,top=50-y*z;imgStyle=' style="position:absolute;width:'+(z*100)+'%;height:'+(z*100)+'%;max-width:none;left:'+left+'%;top:'+top+'%;object-fit:cover;object-position:center;display:block"';}}
 var personal=dl([['Date of Birth',fmtDate(d.dob)],['Time of Birth',d.tob],['Place of Birth',d.pob],['Height',d.height],['Complexion',d.complexion],['Religion',d.religion],['Caste / Community',d.caste],['Mother Tongue',d.motherTongue],['Marital Status',d.marital],['Diet',d.diet]]);
 var career=dl([['Education',d.education],['Occupation',d.occupation],['Company',d.company],['Location',d.location],['Annual Income',d.income]]);
 var fam=dl([["Father's Name",[d.father,d.fatherOcc].filter(Boolean).join(', ')],["Mother's Name",[d.mother,d.motherOcc].filter(Boolean).join(', ')],['Siblings',d.siblings],['Family Type',d.familyType],['Family Values',d.familyValues],['Native Place',d.native]]);
 var horo=dl([['Gotra',d.gotra],['Rashi',d.rashi],['Nakshatra',d.nakshatra],['Manglik',d.manglik]]);
 var contact=dl([['Phone',d.phone],['Email',d.email],['Address',d.address]]);
 var c1=sec('s-personal','Personal Details',personal)+sec('s-horo','Horoscope',horo);
 var c2=sec('s-career','Education & Career',career)+sec('s-family','Family Details',fam);
 var tx=sec('s-about','About Me',txt(d.about))+sec('s-expect','Partner Expectations',txt(d.expectations));
 var credit=o.credit!==false?'<div class="bd-credit">Made with Vivah Patra · vivahpatra.in</div>':'';
 var headerLine=d.headerLine||'॥ शुभ विवाह ॥';
 var docTitle=d.documentTitle||(hi?'विवाह बायोडाटा':'Marriage Biodata');
 var tagline=d.tagline||'A bond of love, respect and tradition.';
 var blessing=d.blessing||'॥ Wishing you a blessed and joyful journey together ॥';
 return '<div class="bd-page">'+
  '<header class="bd-head"><div class="bd-dev" lang="hi">'+esc(headerLine)+'</div><div class="bd-title" '+(hi?'lang="hi"':'')+'>'+esc(docTitle)+'</div><svg class="bd-orn" viewBox="0 0 240 16" aria-hidden="true"><use href="#vp-div"/></svg><div class="bd-tag">'+esc(tagline)+'</div></header>'+
  '<div class="bd-id"><div class="bd-photo"><img src="'+esc(photo)+'" alt="'+(d.photo?'Photo of '+esc(d.name||'candidate'):'Photo placeholder')+'"'+imgStyle+'></div><div class="bd-who"><div class="bd-name">'+esc(d.name||'Your Name')+'</div>'+(sub?'<div class="bd-sub">'+esc(sub)+'</div>':'')+'</div></div>'+
  '<div class="bd-body"><div class="bd-col c1">'+c1+'</div><div class="bd-col c2">'+c2+'</div></div>'+
  (tx?'<div class="bd-text">'+tx+'</div>':'')+
  (contact?'<div class="bd-contact">'+sec('s-contact','Contact',contact)+'</div>':'')+
  '<footer class="bd-foot"><div class="bd-bless" lang="hi">'+esc(blessing)+'</div>'+credit+'</footer></div>';
};
VP.make=function(d,slug,o){VP.ensureSprite();var el=document.createElement('div');el.className='bd t-'+slug;el.style.setProperty('--d','1');el.innerHTML=(DECOR[slug]?DECOR[slug]():'')+VP.html(d,slug,o);el.dataset.slug=slug;return el;};
VP.MIN_D=0.72;VP.MAX_D=1.1;
VP.fit=function(bd){
 var page=bd.querySelector('.bd-page');if(!page||!page.clientHeight)return {d:1,over:false,state:'unmeasured'};
 var d=VP.MAX_D;bd.style.setProperty('--d',d);
 function over(){return page.scrollHeight>page.clientHeight+1;}
 while(over()&&d>VP.MIN_D){d=Math.round((d-0.02)*100)/100;bd.style.setProperty('--d',d);}
 var ov=over();var st=ov?'over':(d<1?'scaled':'ok');bd.dataset.fit=st;bd.dataset.d=d;return {d:d,over:ov,state:st};
};
/* mount a full-size biodata into a container (no scaling). returns bd */
VP.mount=function(host,d,slug,o){host.innerHTML='';var bd=VP.make(d,slug,o);host.appendChild(bd);VP.fit(bd);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){VP.fit(bd);if(host.__onfit)host.__onfit(bd);});return bd;};
/* scaled thumbnail: host should be a .thumb element */
var ro=window.ResizeObserver?new ResizeObserver(function(es){es.forEach(function(e){var h=e.target;var bd=h.firstElementChild;if(bd&&bd.classList.contains('bd'))bd.style.transform='scale('+(h.clientWidth/PX_W)+')';});}):null;
VP.thumb=function(host,d,slug,o){host.classList.add('thumb');var bd=VP.mount(host,d,slug,o);bd.style.transform='scale('+((host.clientWidth||200)/PX_W)+')';if(ro)ro.observe(host);return bd;};
VP.update=function(host,d,slug,o){var old=host.firstElementChild;var bd=VP.make(d,slug,o);bd.style.transform=old?old.style.transform:'';host.replaceChildren(bd);var r=VP.fit(bd);bd.style.transform='scale('+((host.clientWidth||200)/PX_W)+')';return {bd:bd,fit:r};};

/* ---------- WhatsApp 4:5 card ---------- */
VP.waCard=function(d,slug,o){
 var t=VP.tpl(slug).theme,g=d.gender==='M'?'M':'F';var dark=(slug==='panna-royal'||slug==='varma-traditional');
 var el=document.createElement('div');el.className='wa-pic t-'+slug;
 el.style.cssText='--bg:'+t.bg+';--ac:'+t.accent+';--go:'+t.gold+';--ik:'+t.ink+';';
 var photo=d.photo||VP.avatar(g);
 var line=[d.dob?fmtDate(d.dob):'',d.height].filter(Boolean).join('  ·  ');
 var line2=[d.occupation,(d.location||'').split(',')[0]].filter(Boolean).join('  ·  ');
 el.innerHTML='<div class="wp-in"><div class="wp-dev" lang="hi">॥ शुभ विवाह ॥</div><div class="wp-t">Marriage Biodata</div><svg class="wp-o" viewBox="0 0 240 16"><use href="#vp-div"/></svg><div class="wp-ph"><img src="'+esc(photo)+'" alt=""></div><div class="wp-n">'+esc(d.name||'Your Name')+'</div><div class="wp-l">'+esc(line)+'</div><div class="wp-l">'+esc(line2)+'</div></div><div class="wp-btn">View Full Biodata PDF</div>';
 el.dataset.dark=dark?'1':'';return el;
};

/* ---------- local storage helpers ---------- */
VP.store={
 get:function(k,f){try{var v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch(e){return f;}},
 set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
};
VP.getDraft=function(){return VP.store.get('vp.draft',null);};
VP.getDesigns=function(){return VP.store.get('vp.designs',[]);};
})();
