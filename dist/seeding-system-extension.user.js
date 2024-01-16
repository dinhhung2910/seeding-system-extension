// ==UserScript==
// @name Seeding system extension
// @description Seeding system extension
// @version 1.0.2
// @author Hung Dinh
// @homepage https://github.com/dinhhung2910/seeding-system-extension#readme
// @supportURL https://github.com/dinhhung2910/seeding-system-extension/pulls
// @match https://tiktok.com/**
// @match https://www.tiktok.com/**
// @grant GM_fetch
// @grant GM_xmlhttpRequest
// @namespace Script
// @updateURL https://github.com/dinhhung2910/seeding-system-extension/raw/master/dist/seeding-system-extension.user.js
// ==/UserScript==

(()=>{"use strict";const e="http://localhost:5000",t=({url:e,headers:t,method:n,data:o})=>new Promise(((r,a)=>{GM_xmlhttpRequest({method:n,url:e,data:o,headers:t,onload:function(e){r(e)},onerror:function(e){a(e)}})})),n=async(n,o)=>{n.userId=o.userId,n.userName=o.userName;try{const o=await t({method:"POST",headers:{"Content-type":"application/json"},data:JSON.stringify({userId:n.userId,userName:n.userName}),url:`${e}/api/auth/device`}),r=await o.response;console.log(r),n.token=JSON.parse(r).jsonData.token}catch(e){console.error("Can't get device token"),console.error(e)}},o=function(){const o={};return async()=>{try{let r=(()=>{const e=document.getElementById("tiktok-cookie-banner-config");if(!e)return null;let t=null;try{const n=JSON.parse(e.innerText);t={userId:n.appProps.$user.uid,userName:n.appProps.$user.uniqueId}}catch(e){t=null}return t})();if(r||(r=(()=>{const e=document.getElementById("SIGI_STATE");if(!e)return null;let t=null;try{const n=JSON.parse(e.innerText);t={userId:n.AppContext.appContext.user.uid,userName:n.AppContext.appContext.user.uniqueId}}catch(e){t=null}return t})()),!r)return delete o.token,delete o.userId,void delete o.userName;o.token||(console.log(o),console.log("Setting session token..."),await n(o,r));const a=await(async n=>{const o=window.location.href;try{const r=await t({method:"PUT",headers:{"Content-type":"application/json","x-auth-token":n.token,"x-auth-userid":n.userId},data:JSON.stringify({url:o}),url:`${e}/api/device/checkin`}),a=await r.response,s=JSON.parse(a);return s.isValid&&s.jsonData?s.jsonData:{action:!1}}catch(e){return console.error("Can't get command"),console.error(e),{error:!0}}})(o);if(a.error)return void await n(o,r);await(async e=>{if(e.action){if("comment"==e.type){console.log(e);try{document.querySelector('div[data-e2e="comment-input"] div[contenteditable="true"]').innerText=e.content,document.querySelector('div[data-e2e="comment-post"]').click()}catch(e){console.error(e)}}}else console.log("No action...")})(a)}catch(e){console.error(e)}}}();(()=>{const e=()=>{setTimeout((()=>{o(),e()}),Math.trunc(1e3*Math.random())+1e3)};e()})()})();