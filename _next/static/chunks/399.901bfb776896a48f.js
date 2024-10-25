"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[399],{1399:function(e,t,s){s.r(t),s.d(t,{default:function(){return p}});var a=s(7437),l=s(2265),r=s(3247),i=s(4935),o=s(9658),n=s(5135),c=s(6362),d=s(6755);let g={JavaScript:"bg-yellow-400",TypeScript:"bg-blue-400",Python:"bg-green-400",Java:"bg-orange-400","C#":"bg-purple-400",Ruby:"bg-red-400"};function p(){let[e,t]=(0,l.useState)([]),[s,p]=(0,l.useState)([]),[m,u]=(0,l.useState)(""),[x,h]=(0,l.useState)("All"),[f,b]=(0,l.useState)(["All"]);return(0,l.useEffect)(()=>{fetch("https://api.github.com/users/cf-llc/repos").then(e=>e.json()).then(e=>{if(Array.isArray(e)){let s=e.map(e=>({id:e.id,name:e.name,description:e.description,html_url:e.html_url,homepage:e.homepage,language:e.language,topics:Array.isArray(e.topics)?e.topics:[]}));t(s),p(s),b(["All",...Array.from(new Set(s.flatMap(e=>e.topics)))])}}).catch(e=>console.error("Error fetching projects:",e))},[]),(0,l.useEffect)(()=>{p(e.filter(e=>{var t;return(e.name.toLowerCase().includes(m.toLowerCase())||(null===(t=e.description)||void 0===t?void 0:t.toLowerCase().includes(m.toLowerCase())))&&("All"===x||e.topics.includes(x))}))},[m,x,e]),(0,a.jsxs)("section",{className:"bg-white rounded-lg shadow-lg overflow-hidden p-6",children:[(0,a.jsx)("h2",{className:"text-3xl font-semibold text-center mb-8",children:"Explore Our Projects"}),(0,a.jsxs)("div",{className:"mb-6 flex flex-wrap items-center justify-between gap-4",children:[(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)("input",{type:"text",placeholder:"Search projects...",className:"pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500",value:m,onChange:e=>u(e.target.value)}),(0,a.jsx)(r.Z,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",size:20})]}),(0,a.jsx)("div",{className:"flex flex-wrap gap-2",children:f.map(e=>(0,a.jsx)("button",{className:"px-3 py-1 rounded-full text-sm ".concat(x===e?"bg-indigo-600 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"),onClick:()=>h(e),children:e},e))})]}),(0,a.jsx)(d.E.div,{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",layout:!0,children:s.map(e=>(0,a.jsxs)(d.E.div,{layout:!0,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col",children:[(0,a.jsxs)("div",{className:"relative p-4 ".concat(e.language&&g[e.language]?g[e.language]:"bg-gray-300"),children:[(0,a.jsx)("div",{className:"absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1",children:e.language?(0,a.jsx)(i.Z,{className:"w-5 h-5"}):(0,a.jsx)(o.Z,{className:"w-5 h-5"})}),(0,a.jsx)("h3",{className:"text-xl font-bold mb-2 text-white",children:e.name}),(0,a.jsx)("p",{className:"text-sm text-white mb-4 line-clamp-3",children:e.description||"No description available."})]}),(0,a.jsxs)("div",{className:"p-4 flex-grow",children:[(0,a.jsx)("div",{className:"flex flex-wrap gap-2 mb-4",children:e.topics.slice(0,3).map(e=>(0,a.jsx)("span",{className:"px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs",children:e},e))}),(0,a.jsxs)("div",{className:"flex justify-between mt-auto",children:[(0,a.jsxs)("a",{href:e.html_url,target:"_blank",rel:"noopener noreferrer",className:"flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors",children:[(0,a.jsx)(n.Z,{className:"mr-2 h-4 w-4"}),"View on GitHub"]}),e.homepage&&(0,a.jsxs)("a",{href:e.homepage,target:"_blank",rel:"noopener noreferrer",className:"flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors",children:[(0,a.jsx)(c.Z,{className:"mr-2 h-4 w-4"}),"Live Demo"]})]})]})]},e.id))})]})}}}]);