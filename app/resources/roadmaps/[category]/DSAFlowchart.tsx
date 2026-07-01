'use client';

/* ─── Canvas & Layout ─────────────────────────────────────────── */
const W = 1000, CX = 500;
// Alternating lime / purple — matches website brand palette
const PC = ['#A8E63D','#9B7FE8','#A8E63D','#9B7FE8','#A8E63D','#9B7FE8'];
const cx3 = [165, CX, 835];
const cx4 = [128, 373, 627, 872];
const PY = [90, 460, 830, 1210, 1580, 1990];
const TY = PY.map(y => y + 68);
const IY = TY.map(y => y + 58);
const IG = 36;
const H  = 2340;

/* ─── Node Builders ───────────────────────────────────────────── */
const mP  = (i:number, l:string) => ({id:`p${i}`,x:CX,y:PY[i-1],w:232,h:40,t:'phase',c:PC[i-1],l});
const mT3 = (pi:number,s:string,k:number,l:string) => ({id:`p${pi}-${s}`,x:cx3[k],y:TY[pi-1],w:158,h:32,t:'topic',c:PC[pi-1],l});
const mT4 = (pi:number,s:string,k:number,l:string) => ({id:`p${pi}-${s}`,x:cx4[k],y:TY[pi-1],w:142,h:32,t:'topic',c:PC[pi-1],l});
const mI3 = (pi:number,s:string,k:number,ls:string[]) => ls.map((l,i)=>({id:`p${pi}-${s}${i}`,x:cx3[k],y:IY[pi-1]+i*IG,w:150,h:28,t:'item',c:PC[pi-1],l}));
const mI4 = (pi:number,s:string,k:number,ls:string[]) => ls.map((l,i)=>({id:`p${pi}-${s}${i}`,x:cx4[k],y:IY[pi-1]+i*IG,w:134,h:28,t:'item',c:PC[pi-1],l}));
const te  = (pi:number,ss:string[]) => ss.map(s=>[`p${pi}`,`p${pi}-${s}`]);
const ie  = (pi:number,s:string,n:number) => Array.from({length:n},(_,i)=>[`p${pi}-${s}`,`p${pi}-${s}${i}`]);

/* ─── All Nodes ───────────────────────────────────────────────── */
const NODES = [
  {id:'root',x:CX,y:12,w:256,h:50,t:'root',c:'#818cf8',l:'DSA Roadmap'},
  mP(1,'Phase 1 · Foundation'),
  mT3(1,'cx',0,'Complexity Analysis'), mT3(1,'ar',1,'Arrays'), mT3(1,'st',2,'Strings'),
  ...mI3(1,'cx',0,['Big O / Ω / Θ Notation','Best / Avg / Worst Case','Space Complexity','Amortized Analysis']),
  ...mI3(1,'ar',1,['Two Pointers','Sliding Window','Prefix Sum',"Kadane's Algorithm"]),
  ...mI3(1,'st',2,['Palindrome Check','Anagram Detection','KMP Algorithm','Rabin-Karp Hashing']),
  mP(2,'Phase 2 · Linear DS'),
  mT3(2,'ll',0,'Linked List'), mT3(2,'sq',1,'Stack & Queue'), mT3(2,'ha',2,'Hashing'),
  ...mI3(2,'ll',0,['Singly & Doubly LL',"Floyd's Cycle Detection",'Slow & Fast Pointers','Merge & Reverse']),
  ...mI3(2,'sq',1,['Stack (LIFO)','Queue (FIFO)','Monotonic Stack','Deque & Circular Q']),
  ...mI3(2,'ha',2,['Hash Tables','Collision Handling','Open Addressing','Chaining Method']),
  mP(3,'Phase 3 · Trees & Graphs'),
  mT4(3,'bt',0,'Binary Trees'), mT4(3,'bst',1,'BST'), mT4(3,'hp',2,'Heaps & PQ'), mT4(3,'gr',3,'Graphs'),
  ...mI4(3,'bt',0,['DFS (In/Pre/Post)','BFS Level Order','Height & Diameter','LCA']),
  ...mI4(3,'bst',1,['Insert/Delete/Search','Inorder = Sorted','Validate BST','Balanced / AVL']),
  ...mI4(3,'hp',2,['Min / Max Heap','Heapify O(n)','Top-K Pattern','K-Way Merge']),
  ...mI4(3,'gr',3,['BFS & DFS','Adj List / Matrix','Topological Sort','Cycle Detection']),
  mP(4,'Phase 4 · Algorithms'),
  mT3(4,'so',0,'Sorting'), mT3(4,'bs',1,'Binary Search'), mT3(4,'bk',2,'Backtracking'),
  ...mI3(4,'so',0,['Merge Sort O(n log n)','Quick Sort','Counting / Radix Sort','Heap Sort']),
  ...mI3(4,'bs',1,['Standard Binary Search','Answer Space BS','Rotated Array BS','Lower / Upper Bound']),
  ...mI3(4,'bk',2,['Recursion Tree','Backtrack Template','Permutations / Subsets','State Space Pruning']),
  mP(5,'Phase 5 · Dynamic Prog.'),
  mT3(5,'1d',0,'1D DP'), mT3(5,'td',1,'2D DP'), mT3(5,'pa',2,'DP Patterns'),
  ...mI3(5,'1d',0,['Memoization (Top-Down)','Tabulation (Bottom-Up)','Fibonacci Pattern','House Robber','Longest Incr. Subseq.']),
  ...mI3(5,'td',1,['Grid DP (Unique Paths)','0/1 Knapsack','LCS','Edit Distance','Matrix Chain DP']),
  ...mI3(5,'pa',2,['Interval DP','Palindrome DP','Stock Problems','Greedy + DP','Partition DP']),
  mP(6,'Phase 6 · Advanced'),
  mT4(6,'ag',0,'Adv. Graphs'), mT4(6,'tr',1,'Tries'), mT4(6,'du',2,'Union Find'), mT4(6,'sg',3,'Segment Tree'),
  ...mI4(6,'ag',0,["Dijkstra's Algorithm",'Bellman-Ford','Floyd-Warshall',"Kruskal's / Prim's MST"]),
  ...mI4(6,'tr',1,['Insert / Search / Prefix','Autocomplete System','XOR Trie','Word Dictionary']),
  ...mI4(6,'du',2,['Path Compression','Union by Rank','Connected Comp.','Cycle Detection']),
  ...mI4(6,'sg',3,['Build / Query / Update','Lazy Propagation','Fenwick Tree (BIT)','Range Min/Max/Sum']),
];

const EDGES: string[][] = [
  ['root','p1'],['p1','p2'],['p2','p3'],['p3','p4'],['p4','p5'],['p5','p6'],
  ...te(1,['cx','ar','st']), ...ie(1,'cx',4), ...ie(1,'ar',4), ...ie(1,'st',4),
  ...te(2,['ll','sq','ha']), ...ie(2,'ll',4), ...ie(2,'sq',4), ...ie(2,'ha',4),
  ...te(3,['bt','bst','hp','gr']), ...ie(3,'bt',4), ...ie(3,'bst',4), ...ie(3,'hp',4), ...ie(3,'gr',4),
  ...te(4,['so','bs','bk']), ...ie(4,'so',4), ...ie(4,'bs',4), ...ie(4,'bk',4),
  ...te(5,['1d','td','pa']), ...ie(5,'1d',5), ...ie(5,'td',5), ...ie(5,'pa',5),
  ...te(6,['ag','tr','du','sg']), ...ie(6,'ag',4), ...ie(6,'tr',4), ...ie(6,'du',4), ...ie(6,'sg',4),
];

interface Node { id:string; x:number; y:number; w:number; h:number; t:string; c:string; l:string }

export default function DSAFlowchart() {
  const nMap: Record<string, Node> = {};
  (NODES as Node[]).forEach(n => (nMap[n.id] = n));

  const mkPath = (fId: string, tId: string) => {
    const a = nMap[fId], b = nMap[tId];
    if (!a || !b) return null;
    const x1 = a.x, y1 = a.y + a.h, x2 = b.x, y2 = b.y;
    if (Math.abs(x1 - x2) < 6) return `M${x1} ${y1}L${x2} ${y2}`;
    const mY = (y1 + y2) / 2;
    return `M${x1} ${y1}C${x1} ${mY},${x2} ${mY},${x2} ${y2}`;
  };

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', minWidth: W }}
    >
      {/* No background — transparent */}

      {/* Spine */}
      <line x1={CX} y1={62} x2={CX} y2={H - 90} stroke="#2A2A2A" strokeWidth={1} strokeDasharray="4 8"/>

      {/* Edges */}
      {EDGES.map(([f, t], i) => {
        const d = mkPath(f, t);
        if (!d) return null;
        const a = nMap[f];
        const spine = (a?.t === 'root' || a?.t === 'phase') && (nMap[t]?.t === 'root' || nMap[t]?.t === 'phase');
        return (
          <path key={i} d={d} stroke={a?.c || '#A8E63D'}
            strokeWidth={spine ? 2 : 1.5}
            strokeOpacity={spine ? 0.7 : 0.4}
            fill="none" strokeLinecap="round"/>
        );
      })}

      {/* Nodes */}
      {(NODES as Node[]).map(n => {
        const lx = n.x - n.w / 2;

        if (n.t === 'root') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={14} fill="#A8E63D"/>
            <text x={n.x} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
              fill="#000000" fontSize={17} fontWeight="800">{n.l}</text>
          </g>
        );

        if (n.t === 'phase') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={7} fill={n.c}/>
            <text x={n.x} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
              fill="#000000" fontSize={12} fontWeight="700">{n.l}</text>
          </g>
        );

        if (n.t === 'topic') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={6}
              fill="#111111" stroke={n.c} strokeWidth={1.5}/>
            <text x={n.x} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="central"
              fill={n.c} fontSize={11} fontWeight="600">{n.l}</text>
          </g>
        );

        if (n.t === 'item') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={4}
              fill="#111111" stroke="#2A2A2A" strokeWidth={0.8}/>
            <rect x={lx} y={n.y} width={3} height={n.h} rx={1.5} fill={n.c}/>
            <text x={lx + 11} y={n.y + n.h / 2} dominantBaseline="central"
              fill="#A0A0A0" fontSize={10.5}>{n.l}</text>
          </g>
        );

        return null;
      })}
    </svg>
  );
}
