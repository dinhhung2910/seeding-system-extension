// ==UserScript==
// @name Seeding system extension
// @description Seeding system extension
// @version 1.0.8
// @author Hung Dinh
// @homepage https://github.com/dinhhung2910/seeding-system-extension#readme
// @supportURL https://github.com/dinhhung2910/seeding-system-extension/pulls
// @match https://tiktok.com/**
// @match https://www.tiktok.com/**
// @connect localhost
// @connect 127.0.0.1
// @grant GM_fetch
// @grant GM_xmlhttpRequest
// @namespace Script
// @updateURL https://github.com/dinhhung2910/seeding-system-extension/raw/master/dist/seeding-system-extension.user.js
// ==/UserScript==

(()=>{"use strict";function e(e){return new Promise((t=>{setTimeout(t,e)}))}const t="http://127.0.0.1:6000",n=({url:e,headers:t,method:n,data:o})=>new Promise(((a,r)=>{GM_xmlhttpRequest({method:n,url:e,data:o,headers:t,onload:function(e){a(e)},onerror:function(e){r(e)}})})),o=async e=>{try{const o=await n({method:"PUT",headers:{"Content-type":"application/json"},url:`${t}/api/event/`,data:JSON.stringify({resultCode:e})}),a=await o.response;return!!JSON.parse(a).isValid}catch(e){return console.error("Can't update status"),console.error(e),!0}},a=function(){let a=0;return async()=>{try{let a=(()=>{const e=document.getElementById("tiktok-cookie-banner-config");if(!e)return null;let t=null;try{const n=JSON.parse(e.innerText);t={userId:n.appProps.$user.uid,userName:n.appProps.$user.uniqueId}}catch(e){t=null}return t})();if(a||(a=(()=>{const e=document.getElementById("SIGI_STATE");if(!e)return null;let t=null;try{const n=JSON.parse(e.innerText);t={userId:n.AppContext.appContext.user.uid,userName:n.AppContext.appContext.user.uniqueId}}catch(e){t=null}return t})()),!a)throw new Error("Unauthenticated user.");console.log("User infor:",a);const r=await(async()=>{const e=window.location.href;try{const o=await n({method:"GET",headers:{"Content-type":"application/json"},url:`${t}/api/event`,data:"{}"}),a=await o.response,r=JSON.parse(a);return r.isValid&&r.jsonData&&r.jsonData.event&&r.jsonData.event.url==e?r.jsonData:{action:!1}}catch(e){return console.error("Can't get command"),console.error(e),{error:!0}}})();if(!r.action)throw console.log(r),new Error("No action.");await e(2e3),await(async o=>{if(console.log(o),!o.action||!o.event)return void console.log("No action...");const a=o.event;if(a.comment){console.log(a.comment);try{let o=document.querySelector('div[data-e2e="comment-input"] div[contenteditable="true"]');o||(o=document.querySelector('div[data-e2e="chat-room"] div[contenteditable="true"]')),await e(500),o.focus(),await e(500),console.log("Tell agent to comment");const r=await n({method:"PUT",headers:{"Content-type":"application/json"},url:`${t}/api/event/comment`,data:JSON.stringify({comment:a.comment})});await r.response,await e(5e4),document.querySelector('div[data-e2e="comment-post"]').click()}catch(e){console.error(e)}}})(r),await o(200),await e(5e3),window.close()}catch(e){console.error(e),a++,a>=5&&(await o(503),window.close())}}}();(()=>{const e=async()=>{await a(),setTimeout((()=>{e()}),Math.trunc(1e3*Math.random())+1e3)};e()})()})();