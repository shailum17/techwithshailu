'use client';

import { useMemo } from 'react';

const W=1600,CX=800;
const LM='#A8E63D',PU='#9B7FE8',CY='#22D3EE',AM='#F59E0B',RD='#F87171';
const PH=48,TH=38,IH=32,TG=14,IG=12,SG=80,LX=CX-540,RX=CX+540;

interface N{id:string;x:number;y:number;w:number;h:number;t:'root'|'phase'|'topic'|'item';c:string;l:string;}
const nd=(id:string,x:number,y:number,w:number,h:number,t:N['t'],c:string,l:string):N=>({id,x,y,w,h,t,c,l});

function buildChart(){
  const nodes:N[]=[],edges:[string,string][]=[];
  let Y=24;
  const a=(n:N)=>{nodes.push(n);return n;};
  const e=(f:string,t:string)=>edges.push([f,t]);
  const fan=(f:string,...ts:string[])=>ts.forEach(t=>e(f,t));
  const sec=(h:number,g=SG)=>{const y=Y;Y+=h+g;return y;};
  const stk=(ids:string[],x:number,y0:number,w:number,h:number,t:N['t'],c:string,ls:string[],g:number)=>{
    ids.forEach((id,i)=>nodes.push(nd(id,x,y0+i*(h+g),w,h,t,c,ls[i])));
    return y0+ids.length*(h+g);
  };
  const row=(ids:string[],cx:number,y:number,w:number,h:number,t:N['t'],c:string,ls:string[],g=12)=>{
    const tot=ids.length*(w+g)-g;
    ids.forEach((id,i)=>nodes.push(nd(id,cx-tot/2+i*(w+g)+w/2,y,w,h,t,c,ls[i])));
  };

  /* ROOT */
  a(nd('root',CX,sec(54),340,54,'root',LM,'Data Structures & Algorithms'));

  /* P1 — Getting Started */
  {const phY=sec(PH,36);a(nd('p1',CX,phY,300,PH,'phase',CY,'Phase 1 · Getting Started'));e('root','p1');
  const r1Y=phY+PH+36,r2Y=r1Y+TH+TG,lw=92,lg=10,lx=CX-420;
  row(['l-js','l-java','l-go','l-cs'],lx,r1Y,lw,TH,'topic',CY,['JavaScript','Java','Go','C#'],lg);
  row(['l-cpp','l-py','l-rs','l-rb'], lx,r2Y,lw,TH,'topic',CY,['C++','Python','Rust','Ruby'],lg);
  const plX=CX+160,plY=r1Y+8;
  a(nd('pl',plX,plY,220,PH,'phase',CY,'Pick a Language'));
  ['l-js','l-java','l-go','l-cs','l-cpp','l-py','l-rs','l-rb'].forEach(id=>e(id,'pl'));e('p1','pl');
  const pfY=plY+PH+TG+24;
  a(nd('pf',plX,pfY,240,PH,'phase',CY,'Programming Fundamentals'));e('pl','pf');
  const pfL=['Language Syntax','Control Structures','Functions','OOP Basics','Pseudo Code'];
  stk(pfL.map((_,i)=>`pf-${i}`),RX,pfY,200,IH,'item',CY,pfL,IG);
  pfL.forEach((_,i)=>e('pf',`pf-${i}`));
  Y=Math.max(Y,r2Y+TH+SG,pfY+PH+pfL.length*(IH+IG)+SG);}

  /* P2 — DS Intro */
  {const phY=sec(PH,32);a(nd('p2',CX,phY,340,PH,'phase',LM,'Phase 2 · Data Structures Intro'));e('p1','p2');
  const qY=phY+PH+32;
  a(nd('wds',CX,qY,300,TH,'topic',LM,'What are Data Structures?'));
  a(nd('wdsw',CX,qY+TH+TG,320,TH,'topic',LM,'Why are Data Structures Important?'));
  fan('p2','wds','wdsw');
  const bY=qY+TH+TG+TH+TG+28;
  a(nd('bds',CX,bY,260,PH,'phase',LM,'Basic Data Structures'));e('wdsw','bds');
  const bL=['Array','Linked Lists','Queues','Stacks','Hash Tables'];
  row(bL.map((_,i)=>`bds-${i}`),CX,bY+PH+24,148,TH,'topic',LM,bL,12);
  bL.forEach((_,i)=>e('bds',`bds-${i}`));
  Y=Math.max(Y,bY+PH+24+TH+SG);}

  /* P3 — Complexity */
  {const phY=sec(PH,32);a(nd('p3',CX,phY,300,PH,'phase',PU,'Phase 3 · Algorithmic Complexity'));e('p2','p3');
  const base=phY+PH+32;
  const lItems=[{id:'ac-ts',w:220,h:TH,t:'topic' as N['t'],l:'Time vs Space Complexity'},
    {id:'ac-how',w:240,h:TH,t:'topic' as N['t'],l:'How to Calculate Complexity?'},
    {id:'ac-asym',w:200,h:TH,t:'topic' as N['t'],l:'Asymptotic Notation'},
    {id:'ac-bigo',w:185,h:IH,t:'item' as N['t'],l:'Big-O Notation'},
    {id:'ac-bigt',w:185,h:IH,t:'item' as N['t'],l:'Big-θ Notation'},
    {id:'ac-bigw',w:185,h:IH,t:'item' as N['t'],l:'Big-Ω Notation'}];
  let ly=base;
  lItems.forEach(({id,w,h,t,l},i)=>{if(i>0)ly+=lItems[i-1].h+(i===3?6:TG);a(nd(id,LX,ly,w,h,t,PU,l));e('p3',id);});
  e('ac-asym','ac-bigo');e('ac-asym','ac-bigt');e('ac-asym','ac-bigw');
  a(nd('ac-rt',RX,base,180,TH,'topic',PU,'Common Runtimes'));e('p3','ac-rt');
  ['Constant','Logarithmic','Linear','Polynomial','Exponential','Factorial'].forEach((l,i)=>{
    const n=nd(`ac-rt${i}`,RX,base+TH+TG+i*(IH+IG),175,IH,'item',PU,l);a(n);e('ac-rt',n.id);});
  Y=Math.max(Y,base+TH+TG+6*(IH+IG)+SG);}

  /* P4 — Sorting & Searching */
  {const phY=sec(PH,32);a(nd('p4',CX,phY,320,PH,'phase',LM,'Phase 4 · Sorting & Searching'));e('p3','p4');
  const base=phY+PH+32;
  a(nd('sort',LX,base,220,PH,'phase',LM,'Sorting Algorithms'));e('p4','sort');
  const sL=['Bubble Sort','Insertion Sort','Selection Sort','Merge Sort','Quick Sort','Heap Sort'];
  stk(sL.map((_,i)=>`s-${i}`),LX,base+PH+20,200,TH,'topic',LM,sL,TG);
  sL.forEach((_,i)=>e('sort',`s-${i}`));
  a(nd('srch',RX,base,220,PH,'phase',LM,'Search Algorithms'));e('p4','srch');
  const srL=['Linear Search','Binary Search'];
  stk(srL.map((_,i)=>`sr-${i}`),RX,base+PH+20,200,TH,'topic',LM,srL,TG);
  srL.forEach((_,i)=>e('srch',`sr-${i}`));
  Y=Math.max(Y,base+PH+20+sL.length*(TH+TG)+SG,base+PH+20+srL.length*(TH+TG)+SG);}

  /* P5 — Trees & Graphs */
  {const phY=sec(PH,32);a(nd('p5',CX,phY,340,PH,'phase',PU,'Phase 5 · Trees & Graphs'));e('p4','p5');
  const base=phY+PH+32;
  const TX=CX+300,TVX=CX+560,GX=CX-300,GX2=CX-560;

  // Trees
  a(nd('tree',TX,base,220,PH,'phase',PU,'Tree Data Structures'));e('p5','tree');
  const trL=['Binary Trees','Binary Search Trees','AVL Trees','B-Trees','Heap'];
  stk(trL.map((_,i)=>`tr-${i}`),TX,base+PH+20,210,TH,'topic',PU,trL,TG);
  trL.forEach((_,i)=>e('tree',`tr-${i}`));
  // Tree traversal
  a(nd('trav',TVX,base,190,TH,'topic',PU,'Tree Traversal'));e('tree','trav');
  const tvL=['Breadth First Search','Depth First Search','In-Order Traversal','Pre-Order Traversal','Post-Order Traversal'];
  stk(tvL.map((_,i)=>`tv-${i}`),TVX,base+TH+TG,185,IH,'item',PU,tvL,IG);
  tvL.forEach((_,i)=>e('trav',`tv-${i}`));
  // Tree search
  const tsB=base+TH+TG+tvL.length*(IH+IG)+TG+20;
  a(nd('tsrch',TVX,tsB,190,TH,'topic',PU,'Search Algorithms'));e('tree','tsrch');
  ['Breadth First Search','Depth First Search'].forEach((l,i)=>{
    const n=nd(`ts-${i}`,TVX,tsB+TH+TG+i*(IH+IG),185,IH,'item',PU,l);a(n);e('tsrch',n.id);});

  // Graphs
  a(nd('graph',GX,base,220,PH,'phase',PU,'Graph Data Structures'));e('p5','graph');
  ['Directed Graph','Undirected Graph'].forEach((l,i)=>{
    const n=nd(`gr-${i}`,GX,base+PH+20+i*(TH+TG),200,TH,'topic',PU,l);a(n);e('graph',n.id);});
  // Graph search
  a(nd('gsrch',GX2,base,195,TH,'topic',PU,'Search Algorithms'));e('graph','gsrch');
  ['Breadth First Search','Depth First Search'].forEach((l,i)=>{
    const n=nd(`gs-${i}`,GX2,base+TH+TG+i*(IH+IG),190,IH,'item',PU,l);a(n);e('gsrch',n.id);});
  // Shortest path
  const spB=base+TH+TG+2*(IH+IG)+TG+24;
  a(nd('sp',GX2,spB,210,TH,'topic',PU,'Shortest Path Algorithms'));e('graph','sp');
  const spL=["Dijkstra's Algorithm",'Bellman-Ford Algorithm','A* Algorithm'];
  stk(spL.map((_,i)=>`sp-${i}`),GX2,spB+TH+TG,205,IH,'item',PU,spL,IG);
  spL.forEach((_,i)=>e('sp',`sp-${i}`));
  // MST
  const mstB=spB+TH+TG+spL.length*(IH+IG)+TG+24;
  a(nd('mst',GX2,mstB,210,TH,'topic',PU,'Minimum Spanning Tree'));e('graph','mst');
  ["Prim's Algorithm","Kruskal's Algorithm"].forEach((l,i)=>{
    const n=nd(`mst-${i}`,GX2,mstB+TH+TG+i*(IH+IG),205,IH,'item',PU,l);a(n);e('mst',n.id);});

  Y=Math.max(Y,
    tsB+TH+TG+2*(IH+IG)+SG,
    mstB+TH+TG+2*(IH+IG)+SG,
    base+PH+20+trL.length*(TH+TG)+SG);}

  /* P6 — Advanced DS */
  {const phY=sec(PH,32);a(nd('p6',CX,phY,320,PH,'phase',AM,'Phase 6 · Advanced Data Structures'));e('p5','p6');
  const adL=['Trie','Segment Trees','Fenwick Trees','Disjoint Set (Union-Find)','Suffix Trees and Arrays'];
  stk(adL.map((_,i)=>`ad-${i}`),CX,phY+PH+28,280,TH,'topic',AM,adL,TG);
  adL.forEach((_,i)=>e('p6',`ad-${i}`));
  Y=Math.max(Y,phY+PH+28+adL.length*(TH+TG)+SG);}

  /* P7 — Complex DS */
  {const phY=sec(PH,32);a(nd('p7',CX,phY,320,PH,'phase',RD,'Phase 7 · Complex Data Structures'));e('p6','p7');
  const base=phY+PH+32;
  const cxL=['2-3 Trees','B/B+ Trees','Skip List','ISAM'];
  stk(cxL.map((_,i)=>`cx-${i}`),LX,base,185,TH,'topic',RD,cxL,TG);
  cxL.forEach((_,i)=>e('p7',`cx-${i}`));
  a(nd('idx',RX,base,160,PH,'phase',RD,'Indexing'));e('p7','idx');
  ['Linear','Tree-Based'].forEach((l,i)=>{
    const n=nd(`idx-${i}`,RX,base+PH+20+i*(TH+TG),150,TH,'topic',RD,l);a(n);e('idx',n.id);});
  Y=Math.max(Y,base+cxL.length*(TH+TG)+SG,base+PH+20+2*(TH+TG)+SG);}

  /* P8 — Problem Solving */
  {const phY=sec(PH,32);a(nd('p8',CX,phY,360,PH,'phase',LM,'Phase 8 · Problem Solving Techniques'));e('p7','p8');
  const base=phY+PH+32;
  const coreL=['Brute Force','Backtracking','Greedy Algorithms','Randomised Algorithms',
               'Divide and Conquer','Recursion','Dynamic Programming','Two Pointer Technique',
               'Sliding Window Technique'];
  coreL.forEach((l,i)=>{
    const n=nd(`ps-c${i}`,CX-110+(i%2)*240,base+Math.floor(i/2)*(TH+TG),225,TH,'topic',LM,l);
    a(n);e('p8',n.id);});
  const advL=['Fast and Slow Pointers','Cyclic Sort','Merge Intervals','Two Heaps',
              'Kth Element','Multi-threaded','Island traversal','Heap','A* Algorithm'];
  stk(advL.map((_,i)=>`ps-a${i}`),RX,base,205,IH,'item',LM,advL,IG+4);
  advL.forEach((_,i)=>e('p8',`ps-a${i}`));
  Y=Math.max(Y,
    base+Math.ceil(coreL.length/2)*(TH+TG)+SG,
    base+advL.length*(IH+IG+4)+SG);}

  /* P9 — Platforms */
  {const phY=sec(PH,28);a(nd('p9',CX,phY,280,PH,'phase',CY,'Platforms to Practice'));e('p8','p9');
  const tot=2*(160+40)-40;
  ['Leetcode','Edabit'].forEach((l,i)=>{
    const n=nd(`pt-${i}`,CX-tot/2+i*(160+40)+80,phY+PH+28,160,TH,'topic',CY,l);
    a(n);e('p9',n.id);});
  Y=Math.max(Y,phY+PH+28+TH+60);}

  return {nodes,edges,H:Y+60};
}

/* ── computed once at module load ──────────────────────────── */
const CHART=buildChart();

/* ── path builder ──────────────────────────────────────────── */
function mkPath(a:N,b:N):string{
  const x1=a.x,y1=a.y+a.h,x2=b.x,y2=b.y;
  if(Math.abs(x1-x2)<6)return `M${x1} ${y1}L${x2} ${y2}`;
  const mY=(y1+y2)/2;
  return `M${x1} ${y1}C${x1} ${mY},${x2} ${mY},${x2} ${y2}`;
}

/* ── component ─────────────────────────────────────────────── */
export default function DSAFlowchart(){
  const {nodes,edges,H}=CHART;
  const nMap=useMemo(()=>{
    const m:Record<string,N>={};
    nodes.forEach(n=>(m[n.id]=n));
    return m;
  },[nodes]);

  return(
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{display:'block',minWidth:W}}
      aria-label="Data Structures & Algorithms Roadmap">

      <line x1={CX} y1={78} x2={CX} y2={H-70}
        stroke="#2A2A2A" strokeWidth={1} strokeDasharray="5 10"/>

      {edges.map(([f,t],i)=>{
        const a=nMap[f],b=nMap[t];
        if(!a||!b)return null;
        const spine=(a.t==='root'||a.t==='phase')&&(b.t==='phase'||b.t==='root');
        return <path key={i} d={mkPath(a,b)} stroke={a.c}
          strokeWidth={spine?2:1.5} strokeOpacity={spine?0.8:0.45}
          fill="none" strokeLinecap="round"/>;
      })}

      {nodes.map(n=>{
        const lx=n.x-n.w/2;
        if(n.t==='root')return(
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={14} fill={LM}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill="#000" fontSize={18} fontWeight="800" fontFamily="system-ui,sans-serif">{n.l}</text>
          </g>
        );
        if(n.t==='phase')return(
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={9} fill={n.c}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill="#000" fontSize={12} fontWeight="700" fontFamily="system-ui,sans-serif">{n.l}</text>
          </g>
        );
        if(n.t==='topic')return(
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={7}
              fill="#111" stroke={n.c} strokeWidth={1.5}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill={n.c} fontSize={11} fontWeight="600" fontFamily="system-ui,sans-serif">{n.l}</text>
          </g>
        );
        if(n.t==='item')return(
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={5}
              fill="#111" stroke="#2A2A2A" strokeWidth={0.8}/>
            <rect x={lx} y={n.y} width={4} height={n.h} rx={2} fill={n.c}/>
            <text x={lx+14} y={n.y+n.h/2} dominantBaseline="central"
              fill="#B0B0B0" fontSize={10.5} fontFamily="system-ui,sans-serif">{n.l}</text>
          </g>
        );
        return null;
      })}
    </svg>
  );
}
