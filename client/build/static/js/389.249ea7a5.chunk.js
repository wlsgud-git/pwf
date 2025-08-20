"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[389],{389:(e,i,r)=>{r.r(i),r.d(i,{MyFriendLi:()=>D,MyFriends:()=>F});var t=r(3),n=r(464);const o=n.DU`
  :root {
    --myfriend-width: 350px;

    // support
    --myfriend-support-box-height: 40px;
    --myfriend-support-btn-size: 35px;
    
    // li
    --myfriend-li-height: 45px;
    --myfriend-li-mini-size: 72px;
    --myfriend-profile-img-size: 30px;
    --myfriend-online-circle-size: 10px;
  }
`,a=n.Ay.div`
  height: 100%;
  width: var(--myfriend-width);
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--pwf-light-gray);

  @media (max-width: 725px) {
    width: 100%;
  }
`,s=n.Ay.div`
  width: 100%;
  height: var(--myfriend-support-box-height);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--pwf-light-gray);
  justify-content: flex-end;

  button {
    width: var(--myfriend-support-btn-size);
    height: var(--myfriend-support-btn-size);
    background-color: inherit;
    color: var(--pwf-gray);
    border: none;
    font-size: 16px;
    margin: 0px 2px;

    &:hover {
      color: var(--pwf-white);
    }
  }

  @media (max-width: 725px) {
    display: none;
  }
`,l=n.Ay.button`
  position: relative;
`,d=n.Ay.span`
  position: absolute;
  right: 0;
  bottom: 3px;
  width: 16px;
  height: 16px;
  font-size: 10px;
  border-radius: 50%;
  color: var(--pwf-white);
  display: ${e=>e.count?"flex":"none"};
  align-items: center;
  justify-content: center;
  background-color: var(--pwf-blue);
`,c=n.Ay.button``,p=n.Ay.div`
  width: 100%;
  height: 40px;
  display: ${e=>e.show?"flex":"none"};
  border-bottom: 1px solid var(--pwf-light-gray);
`,h=n.Ay.input`
  flex: 1;
  height: 100%;
  background-color: inherit;
  color: var(--pwf-white);
  padding: 0px 8px;
  border: none;
`,x=n.Ay.button`
  padding: 0px 8px;
  background-color: inherit;
  border: none;
  outline: none;
  color: var(--pwf-gray);

  :hover {
    color: var(--pwf-white);
  }
`,f=n.Ay.ul`
  width: 100%;
  // overflow-y: auto;
  height: calc(100% - var(--myfriend-support-box-height));
  display: flex;
  flex-direction: column;
  position: relative;

  &::-webkit-scrollbar {
    width: var(--scroll-size);
  }

  &::-webkit-scrollbar-track {
    background-color: inherit;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--pwf-gray);
    border-radius: 10px;
  }

  p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--pwf-gray);
    font-size: 15px;
  }

  @media (max-width: 725px) {
    flex-direction: row;
    height: var(--myfriend-li-mini-size);
    border-bottom: 1px solid var(--pwf-light-gray);
    // overflow-x: auto;
  }
`,u=n.Ay.li`
  width: 100%;
  height: var(--myfriend-li-height);
  display: flex;
  align-items: center;
  padding: 0px 8px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: var(--pwf-background-transparent);
  }

  @media (max-width: 725px) {
    flex-direction: column;
    justify-content: center;
    width: var(--myfriend-li-mini-size);
    height: var(--myfriend-li-mini-size);
  }
`,g=n.Ay.div`
  width: var(--myfriend-profile-img-size);
  height: var(--myfriend-profile-img-size);
  position: relative;
  margin-right: 13px;

  @media (max-width: 725px) {
    margin-right: 0px;
  }
`,m=n.Ay.span`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  border: 1px solid var(--pwf-light-gray);
`,w=n.Ay.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`,b=n.Ay.span`
  width: var(--myfriend-online-circle-size);
  height: var(--myfriend-online-circle-size);
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  right: -3px;
  z-index: 161;
  overflow: hidden;
  background-color: green;
`,y=n.Ay.span`
  color: var(--pwf-white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 725px) {
    width: 100%;
  }
`,v=n.Ay.div`
  display: ${e=>e.menu?"flex":"none"};
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 12;
  overflow: hidden;
  box-shadow: 1.5px 1.5px 1.5px 1.5px var(--pwf-background-transparent);
  background-color: var(--pwf-signiture-color);

  button {
    padding: 6px;
    background-color: inherit;
    border: none;
    outline: none;
    color: var(--pwf-white);

    &:hover {
      background-color: var(--pwf-background-transparent-light);
    }
  }
`;var j=r(185),k=r(43),z=r(306),A=r(741),C=r(579);const D=e=>{let{user:i}=e,r=(0,k.useRef)(null),[t,n]=(0,k.useState)(!1);(0,k.useEffect)((()=>{const e=e=>{e.preventDefault()};return document.addEventListener("contextmenu",e),()=>{document.removeEventListener("contextmenu",e)}}),[]);(0,k.useEffect)((()=>{t&&r.current&&r.current.focus()}),[t]);return(0,C.jsxs)(u,{onMouseDown:e=>{e.preventDefault(),r.current&&2==e.button&&n(!0)},children:[(0,C.jsxs)(g,{children:[(0,C.jsx)(m,{children:(0,C.jsx)(w,{src:i.profile_img})}),(0,C.jsx)(b,{})]}),(0,C.jsx)(y,{children:i.nickname}),(0,C.jsx)(v,{ref:r,tabIndex:0,onBlur:()=>n(!1),menu:t,children:(0,C.jsx)("button",{onMouseDown:async()=>{try{await z.A.deleteFriend(i.nickname)}catch(e){let{msg:i}=(0,A.p)(e);alert(i)}},children:"\uce5c\uad6c \uc0ad\uc81c"})})]},i.id)},F=()=>{let e=(0,t.wA)(),i=(0,t.d4)((e=>e.friend.request_friends)),r=(0,t.d4)((e=>e.friend.friends)),[n,u]=(0,k.useState)(!1),[g,m]=(0,k.useState)(""),[w,b]=(0,k.useState)(!1),[y,v]=(0,k.useState)([]);return(0,k.useMemo)((()=>{""!==g&&(async()=>{try{b(!0);const{data:e}=await z.A.searchFriendsByNick(g);v(e),b(!1)}catch(e){console.log(e)}})()}),[g]),(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(o,{}),(0,C.jsxs)(a,{children:[(0,C.jsxs)(s,{children:[(0,C.jsxs)(l,{title:"\uce5c\uad6c\ucd94\uac00",onClick:()=>e((0,j.d)({active:!0,type:"friend"})),children:[(0,C.jsx)("i",{className:"fa-solid fa-user-plus"}),(0,C.jsx)(d,{count:Object.entries(i).length,children:Object.entries(i).length})]}),(0,C.jsx)(c,{onClick:()=>u((e=>!e)),children:n?(0,C.jsx)("i",{className:"fa-solid fa-x"}):(0,C.jsx)("i",{className:"fa-solid fa-magnifying-glass"})})]}),(0,C.jsxs)(p,{show:n,children:[(0,C.jsx)(h,{placeholder:"\uce5c\uad6c \ub2c9\ub124\uc784",value:g,onChange:e=>m(e.target.value)}),(0,C.jsx)(x,{children:(0,C.jsx)("i",{className:"fa-solid fa-magnifying-glass"})})]}),(0,C.jsx)(f,{children:n&&""!==g?w?(0,C.jsx)("p",{children:"\uac80\uc0c9\uc911..."}):y.length?y.map((e=>(0,C.jsx)(D,{user:e}))):(0,C.jsx)("p",{children:"\uc870\uac74\uc5d0 \ub9de\ub294 \uce5c\uad6c\uac00 \uc5c6\uc2b5\ub2c8\ub2e4"}):Object.entries(r).length?Object.entries(r).map((e=>{let[i,r]=e;return(0,C.jsx)(D,{user:r})})):(0,C.jsx)("p",{children:"\uce5c\uad6c\ub97c \ucd94\uac00\ud574 \ubcf4\uc138\uc694"})})]})]})}}}]);
//# sourceMappingURL=389.249ea7a5.chunk.js.map