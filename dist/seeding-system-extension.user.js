// ==UserScript==
// @name Seeding system extension
// @description Seeding system extension
// @version 1.0.0
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

(()=>{"use strict";const e="http://kaitovps:5000",t=({url:e,headers:t,method:o,data:n})=>new Promise(((r,a)=>{GM_xmlhttpRequest({method:o,url:e,data:n,headers:t,onload:function(e){r(e)},onerror:function(e){a(e)}})})),o=async(o,n)=>{o.userId=n.userId,o.userName=n.userName;try{const n=await t({method:"POST",headers:{"Content-type":"application/json"},data:JSON.stringify({userId:o.userId,userName:o.userName}),url:`${e}/api/auth/device`}),r=await n.response;o.token=JSON.parse(r).jsonData.token}catch(e){console.error("Can't get device token"),console.error(e)}},n=function(){const n={};return async()=>{try{const r=(()=>{const e=document.getElementById("tiktok-cookie-banner-config");if(!e)return null;let t=null;try{const o=JSON.parse(e.innerText);t={userId:o.appProps.$user.uid,userName:o.appProps.$user.uniqueId}}catch(e){t=null}return t})();if(!r)return delete n.token,delete n.userId,void delete n.userName;n.token||(console.log("Setting session token..."),await o(n,r));const a=await(async o=>{const n=window.location.href;try{const r=await t({method:"PUT",headers:{"Content-type":"application/json","x-auth-token":o.token,"x-auth-userid":o.userId},data:JSON.stringify({url:n}),url:`${e}/api/device/checkin`}),a=await r.response,s=JSON.parse(a);return s.isValid&&s.jsonData?s.jsonData:{action:!1}}catch(e){return console.error("Can't get command"),console.error(e),{error:!0}}})(n);if(a.error)return void await o(n,r);await(async e=>{if(e.action){if("comment"==e.type){console.log(e);try{document.querySelector('div[data-e2e="comment-input"] div[contenteditable="true"]').innerText=e.content,await new Promise((e=>{setTimeout((()=>{e()}),500)})),document.querySelector('div[data-e2e="comment-post"]').click()}catch(e){console.error(e)}}}else console.log("No action...")})(a)}catch(e){console.error(e)}}}();(()=>{const e=()=>{setTimeout((()=>{n(),e()}),Math.trunc(1e3*Math.random())+1e3)};e()})()})();