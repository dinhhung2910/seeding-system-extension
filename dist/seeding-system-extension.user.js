// ==UserScript==
// @name Seeding system extension
// @description Seeding system extension
// @version 1.0.7
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

(()=>{"use strict";const e=e=>new Promise((t=>{setTimeout((()=>{t()}),e)})),t="http://127.0.0.1:6000",n=({url:e,headers:t,method:n,data:o})=>new Promise(((r,a)=>{GM_xmlhttpRequest({method:n,url:e,data:o,headers:t,onload:function(e){r(e)},onerror:function(e){a(e)}})})),o=async e=>{try{const o=await n({method:"PUT",headers:{"Content-type":"application/json"},url:`${t}/api/event/`,data:JSON.stringify({resultCode:e})}),r=await o.response;return!!JSON.parse(r).isValid}catch(e){return console.error("Can't update status"),console.error(e),!0}},r=function(){let r=0;return async()=>{try{let r=(()=>{const e=document.getElementById("tiktok-cookie-banner-config");if(!e)return null;let t=null;try{const n=JSON.parse(e.innerText);t={userId:n.appProps.$user.uid,userName:n.appProps.$user.uniqueId}}catch(e){t=null}return t})();if(r||(r=(()=>{const e=document.getElementById("SIGI_STATE");if(!e)return null;let t=null;try{const n=JSON.parse(e.innerText);t={userId:n.AppContext.appContext.user.uid,userName:n.AppContext.appContext.user.uniqueId}}catch(e){t=null}return t})()),!r)throw new Error("Unauthenticated user.");console.log("User infor:",r);const a=await(async()=>{const e=window.location.href;try{const o=await n({method:"GET",headers:{"Content-type":"application/json"},url:`${t}/api/event`,data:"{}"}),r=await o.response,a=JSON.parse(r);return a.isValid&&a.jsonData&&a.jsonData.event&&a.jsonData.event.url==e?a.jsonData:{action:!1}}catch(e){return console.error("Can't get command"),console.error(e),{error:!0}}})();if(!a.action)throw console.log(a),new Error("No action.");await e(2e3),await(async e=>{if(console.log(e),!e.action||!e.event)return void console.log("No action...");const t=e.event;if(t.comment){console.log(t.comment);try{let e=document.querySelector('div[data-e2e="comment-input"] div[contenteditable="true"]');e||(e=document.querySelector('div[data-e2e="chat-room"] div[contenteditable="true"]')),e.innerText=t.comment,document.querySelector('div[data-e2e="comment-post"]').click()}catch(e){console.error(e)}}})(a),await o(200),await e(5e3),window.close()}catch(e){console.error(e),r++,r>=5&&(await o(503),window.close())}}}();(()=>{const e=()=>{setTimeout((()=>{r(),e()}),Math.trunc(1e3*Math.random())+1e3)};e()})()})();