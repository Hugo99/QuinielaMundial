import { useState, useEffect, useCallback, useRef } from "react";

// ─── ASIGNACIONES FIJAS ───────────────────────────────────────────────────────
const FIXED_PARTICIPANTS = [
  "Jaz","Karim","Majo","Juan","Sergio","Ismene y Poncho",
  "Kris","Omar","Lalo","Reyna y Antonio","Bernardo",
  "Roberto","Ale P","Toyos","Ale B","Hugo"
];

const FIXED_ASSIGNMENTS = {
  "Túnez":"Jaz","Corea del Sur":"Jaz","Argentina":"Jaz",
  "Uzbekistán":"Karim","Bosnia":"Karim","España":"Karim",
  "RD Congo":"Majo","Costa de Marfil":"Majo","Alemania":"Majo",
  "Australia":"Juan","Estados Unidos":"Juan","Croacia":"Juan",
  "Irak":"Sergio","Ecuador":"Sergio","Francia":"Sergio",
  "Curazao":"Ismene y Poncho","Canadá":"Ismene y Poncho","Brasil":"Ismene y Poncho",
  "Cabo Verde":"Kris","Senegal":"Kris","Japón":"Kris",
  "Sudáfrica":"Omar","Egipto":"Omar","Países Bajos":"Omar",
  "Haití":"Lalo","Rep. Checa":"Lalo","Noruega":"Lalo",
  "Qatar":"Reyna y Antonio","Paraguay":"Reyna y Antonio","Marruecos":"Reyna y Antonio",
  "Portugal":"Bernardo","Irán":"Bernardo","Suecia":"Bernardo",
  "Nueva Zelanda":"Roberto","Austria":"Roberto","Colombia":"Roberto",
  "Turquía":"Ale P","Panamá":"Ale P","Bélgica":"Ale P",
  "Argelia":"Toyos","Escocia":"Toyos","Uruguay":"Toyos",
  "Ghana":"Ale B","Arabia Saudita":"Ale B","Suiza":"Ale B",
  "Jordania":"Hugo","México":"Hugo","Inglaterra":"Hugo",
};

// Tier medio (top 3 que pueden sorprender)
const TIER_MEDIO_TOP3 = ["México","Canadá","Senegal"];
// Tier bajo (top 3 menos malos)
const TIER_BAJO_TOP3  = ["Panamá","Australia","Ghana"];

const PARTICIPANT_COLORS = {
  "Jaz":"#c2410c","Karim":"#1d4ed8","Majo":"#0f766e","Juan":"#92400e",
  "Sergio":"#6d28d9","Ismene y Poncho":"#0369a1","Kris":"#065f46",
  "Omar":"#7c2d12","Lalo":"#3f6212","Reyna y Antonio":"#9d174d",
  "Bernardo":"#1e3a5f","Roberto":"#4c1d95","Ale P":"#991b1b",
  "Toyos":"#14532d","Ale B":"#78350f","Hugo":"#1e40af",
};

const GROUPS = {
  A:["México","Corea del Sur","Sudáfrica","Rep. Checa"],
  B:["Canadá","Suiza","Qatar","Bosnia"],
  C:["Brasil","Marruecos","Escocia","Haití"],
  D:["Estados Unidos","Paraguay","Australia","Turquía"],
  E:["Alemania","Ecuador","Costa de Marfil","Curazao"],
  F:["Países Bajos","Japón","Túnez","Suecia"],
  G:["Bélgica","Irán","Egipto","Nueva Zelanda"],
  H:["España","Uruguay","Arabia Saudita","Cabo Verde"],
  I:["Francia","Senegal","Noruega","Irak"],
  J:["Argentina","Austria","Argelia","Jordania"],
  K:["Portugal","Colombia","Uzbekistán","RD Congo"],
  L:["Inglaterra","Croacia","Panamá","Ghana"],
};

const FLAGS = {
  "México":"🇲🇽","Corea del Sur":"🇰🇷","Sudáfrica":"🇿🇦","Rep. Checa":"🇨🇿",
  "Canadá":"🇨🇦","Suiza":"🇨🇭","Qatar":"🇶🇦","Bosnia":"🇧🇦",
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Haití":"🇭🇹",
  "Estados Unidos":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turquía":"🇹🇷",
  "Alemania":"🇩🇪","Ecuador":"🇪🇨","Costa de Marfil":"🇨🇮","Curazao":"🇨🇼",
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Túnez":"🇹🇳","Suecia":"🇸🇪",
  "Bélgica":"🇧🇪","Irán":"🇮🇷","Egipto":"🇪🇬","Nueva Zelanda":"🇳🇿",
  "España":"🇪🇸","Uruguay":"🇺🇾","Arabia Saudita":"🇸🇦","Cabo Verde":"🇨🇻",
  "Francia":"🇫🇷","Senegal":"🇸🇳","Noruega":"🇳🇴","Irak":"🇮🇶",
  "Argentina":"🇦🇷","Austria":"🇦🇹","Argelia":"🇩🇿","Jordania":"🇯🇴",
  "Portugal":"🇵🇹","Colombia":"🇨🇴","Uzbekistán":"🇺🇿","RD Congo":"🇨🇩",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Panamá":"🇵🇦","Ghana":"🇬🇭",
};

const ESPN_MAP = {
  "Mexico":"México","South Korea":"Corea del Sur","Korea Republic":"Corea del Sur",
  "South Africa":"Sudáfrica","Czech Republic":"Rep. Checa","Czechia":"Rep. Checa",
  "Canada":"Canadá","Switzerland":"Suiza","Bosnia and Herzegovina":"Bosnia",
  "Brazil":"Brasil","Morocco":"Marruecos","Scotland":"Escocia","Haiti":"Haití",
  "United States":"Estados Unidos","USA":"Estados Unidos","Paraguay":"Paraguay",
  "Australia":"Australia","Turkey":"Turquía","Türkiye":"Turquía",
  "Germany":"Alemania","Ecuador":"Ecuador","Ivory Coast":"Costa de Marfil",
  "Cote d'Ivoire":"Costa de Marfil","Curacao":"Curazao","Netherlands":"Países Bajos",
  "Japan":"Japón","Tunisia":"Túnez","Sweden":"Suecia","Belgium":"Bélgica",
  "Iran":"Irán","Egypt":"Egipto","New Zealand":"Nueva Zelanda","Spain":"España",
  "Uruguay":"Uruguay","Saudi Arabia":"Arabia Saudita","Cape Verde":"Cabo Verde",
  "France":"Francia","Senegal":"Senegal","Norway":"Noruega","Iraq":"Irak",
  "Argentina":"Argentina","Austria":"Austria","Algeria":"Argelia","Jordan":"Jordania",
  "Portugal":"Portugal","Colombia":"Colombia","Uzbekistan":"Uzbekistán",
  "DR Congo":"RD Congo","Congo DR":"RD Congo","Democratic Republic of Congo":"RD Congo",
  "England":"Inglaterra","Croatia":"Croacia","Panama":"Panamá","Ghana":"Ghana",
};

function normName(n) { return ESPN_MAP[n] || n; }

function buildGroupMatches() {
  const ms = []; let id = 1;
  const dates = {
    A:["11 Jun","18 Jun","24 Jun"],B:["12 Jun","19 Jun","25 Jun"],
    C:["13 Jun","19 Jun","25 Jun"],D:["12 Jun","20 Jun","26 Jun"],
    E:["13 Jun","20 Jun","26 Jun"],F:["14 Jun","21 Jun","27 Jun"],
    G:["14 Jun","21 Jun","27 Jun"],H:["15 Jun","22 Jun","26 Jun"],
    I:["15 Jun","22 Jun","27 Jun"],J:["16 Jun","23 Jun","27 Jun"],
    K:["17 Jun","23 Jun","27 Jun"],L:["16 Jun","24 Jun","27 Jun"],
  };
  Object.entries(GROUPS).forEach(([g,t]) => {
    const d = dates[g];
    [[t[0],t[1],d[0]],[t[2],t[3],d[0]],[t[0],t[2],d[1]],[t[1],t[3],d[1]],[t[0],t[3],d[2]],[t[1],t[2],d[2]]].forEach(([h,a,dt])=>{
      ms.push({id:id++,phase:"Grupos",group:g,date:dt,home:h,away:a,homeScore:null,awayScore:null,live:false});
    });
  });
  return ms;
}

const PLAYOFF_SKELETON = [
  ...Array.from({length:16},(_,i)=>({id:73+i,phase:"16avos",date:["29 Jun","30 Jun","1 Jul","2 Jul"][Math.floor(i/4)],home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true})),
  ...Array.from({length:8},(_,i)=>({id:89+i,phase:"8avos",date:["4 Jul","5 Jul"][Math.floor(i/4)],home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true})),
  ...Array.from({length:4},(_,i)=>({id:97+i,phase:"Cuartos",date:["8 Jul","9 Jul"][Math.floor(i/2)],home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true})),
  {id:101,phase:"Semifinales",date:"14 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
  {id:102,phase:"Semifinales",date:"15 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
  {id:103,phase:"3er Lugar",date:"18 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
  {id:104,phase:"Final",date:"19 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
];

const ALL_TEAMS = Object.values(GROUPS).flat();
const PHASE_COLORS = {"Grupos":"#4b5563","16avos":"#6b7280","8avos":"#78716c","Cuartos":"#92400e","Semifinales":"#7f1d1d","3er Lugar":"#374151","Final":"#78350f"};

// ─── ESPN ─────────────────────────────────────────────────────────────────────
const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/FIFA.WORLD/scoreboard";
async function fetchLiveScores() {
  try { const r=await fetch(ESPN_URL); if(!r.ok) throw new Error(); return (await r.json()).events||[]; }
  catch { return []; }
}
function parseESPN(events) {
  return events.map(ev=>{
    const comp=ev.competitions?.[0]; if(!comp) return null;
    const teams=comp.competitors||[];
    const home=teams.find(t=>t.homeAway==="home"), away=teams.find(t=>t.homeAway==="away");
    if(!home||!away) return null;
    const status=ev.status?.type?.name||"";
    const live=status==="STATUS_IN_PROGRESS", finished=status==="STATUS_FINAL";
    const homeName=normName(home.team?.displayName||home.team?.name||"");
    const awayName=normName(away.team?.displayName||away.team?.name||"");
    const homeScore=(live||finished)?parseInt(home.score):null;
    const awayScore=(live||finished)?parseInt(away.score):null;
    return {home:homeName,away:awayName,homeScore,awayScore,live,finished};
  }).filter(Boolean);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function computeStandings(matches, group) {
  const teams=GROUPS[group];
  const tbl=Object.fromEntries(teams.map(t=>[t,{pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0}]));
  matches.filter(m=>m.group===group&&m.homeScore!==null).forEach(m=>{
    const h=tbl[m.home],a=tbl[m.away]; if(!h||!a) return;
    h.pj++;a.pj++;h.gf+=m.homeScore;h.gc+=m.awayScore;a.gf+=m.awayScore;a.gc+=m.homeScore;
    if(m.homeScore>m.awayScore){h.g++;h.pts+=3;a.p++;}
    else if(m.homeScore<m.awayScore){a.g++;a.pts+=3;h.p++;}
    else{h.e++;a.e++;h.pts++;a.pts++;}
  });
  return teams.map(t=>({team:t,...tbl[t],dif:tbl[t].gf-tbl[t].gc})).sort((a,b)=>b.pts-a.pts||b.dif-a.dif||b.gf-a.gf);
}

function computeLeaderboard(matches) {
  const pts=Object.fromEntries(FIXED_PARTICIPANTS.map(p=>[p,0]));
  matches.forEach(m=>{
    if(m.homeScore===null) return;
    [m.home,m.away].forEach(team=>{
      const owner=FIXED_ASSIGNMENTS[team]; if(!owner) return;
      const isHome=team===m.home, hw=m.homeScore>m.awayScore, aw=m.awayScore>m.homeScore;
      if(isHome&&hw) pts[owner]+=3; else if(!isHome&&aw) pts[owner]+=3; else if(m.homeScore===m.awayScore) pts[owner]+=1;
    });
  });
  return FIXED_PARTICIPANTS.map(p=>({name:p,pts:pts[p]})).sort((a,b)=>b.pts-a.pts);
}

function teamPoints(team, matches) {
  let pts=0;
  matches.filter(m=>(m.home===team||m.away===team)&&m.homeScore!==null).forEach(m=>{
    const isHome=m.home===team, hw=m.homeScore>m.awayScore, aw=m.awayScore>m.homeScore;
    if(isHome&&hw) pts+=3; else if(!isHome&&aw) pts+=3; else if(m.homeScore===m.awayScore) pts+=1;
  });
  return pts;
}

// ─── PALETTE (flat, no neon) ──────────────────────────────────────────────────
const C = {
  bg:       "#f5f5f4",   // stone-100
  card:     "#ffffff",
  border:   "#e7e5e4",   // stone-200
  border2:  "#d6d3d1",   // stone-300
  text:     "#1c1917",   // stone-900
  textMid:  "#57534e",   // stone-600
  textSub:  "#a8a29e",   // stone-400
  accent:   "#292524",   // stone-800
  green:    "#166534",
  greenBg:  "#dcfce7",
  red:      "#991b1b",
  redBg:    "#fee2e2",
  amber:    "#92400e",
  amberBg:  "#fef3c7",
  blue:     "#1e3a8a",
  blueBg:   "#dbeafe",
  headerBg: "#292524",
  headerText:"#fafaf9",
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("tabla");
  const [matches, setMatches] = useState(()=>[...buildGroupMatches(),...PLAYOFF_SKELETON]);
  const [filterGroup, setFilterGroup] = useState("all");
  const [syncState, setSyncState] = useState("idle");
  const [lastSync, setLastSync] = useState(null);
  const [liveCount, setLiveCount] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const syncRef = useRef(null);

  const applyLiveData = useCallback((espnScores)=>{
    setMatches(prev=>prev.map(m=>{
      const hit=espnScores.find(e=>(e.home===m.home&&e.away===m.away)||(e.home===m.away&&e.away===m.home));
      if(!hit) return m;
      const fl=hit.away===m.home;
      return {...m,homeScore:hit.homeScore!==null?(fl?hit.awayScore:hit.homeScore):m.homeScore,awayScore:hit.awayScore!==null?(fl?hit.homeScore:hit.awayScore):m.awayScore,live:hit.live,home:m.tbd&&hit.home?hit.home:m.home,away:m.tbd&&hit.away?hit.away:m.away};
    }));
  },[]);

  const sync = useCallback(async()=>{
    setSyncState("syncing");
    const events=await fetchLiveScores();
    if(!events.length){setSyncState("error");return;}
    const parsed=parseESPN(events);
    applyLiveData(parsed);
    setLiveCount(parsed.filter(e=>e.live).length);
    setLastSync(new Date());
    setSyncState("ok");
  },[applyLiveData]);

  useEffect(()=>{
    sync();
    const schedule=()=>{ syncRef.current=setTimeout(async()=>{await sync();schedule();},liveCount>0?30000:60000); };
    schedule();
    return()=>clearTimeout(syncRef.current);
  },[sync,liveCount]);

  const groupMatches=matches.filter(m=>m.phase==="Grupos");
  const playoffMatches=matches.filter(m=>m.phase!=="Grupos");
  const leaderboard=computeLeaderboard(matches);
  const played=matches.filter(m=>m.homeScore!==null).length;
  const groupsToShow=filterGroup==="all"?Object.keys(GROUPS):[filterGroup];

  const syncLabel = syncState==="syncing"?"Actualizando...":lastSync?`${lastSync.getHours()}:${String(lastSync.getMinutes()).padStart(2,"0")}`:"ESPN";
  const syncDot   = syncState==="syncing"?"⟳":syncState==="ok"?"●":syncState==="error"?"✗":"●";
  const syncClr   = syncState==="ok"?"#16a34a":syncState==="error"?"#dc2626":syncState==="syncing"?"#ca8a04":"#a8a29e";

  // --- shared sub-components ---
  const OwnerTag = ({team,small})=>{
    const owner=FIXED_ASSIGNMENTS[team]; if(!owner) return null;
    const bg=PARTICIPANT_COLORS[owner]||"#374151";
    return <span style={{fontSize:small?8:9,background:bg,color:"#fff",borderRadius:3,padding:small?"1px 4px":"2px 5px",fontWeight:600,whiteSpace:"nowrap",letterSpacing:.2}}>{owner}</span>;
  };

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>

      {/* ── HEADER ── */}
      <div style={{background:C.headerBg,padding:"14px 20px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:22}}>⚽</span>
          <div style={{flex:1}}>
            <h1 style={{margin:0,fontSize:17,fontWeight:700,color:C.headerText,letterSpacing:"-.2px"}}>Quiniela Mundial 2026</h1>
            <p style={{margin:0,fontSize:10,color:"#a8a29e"}}>EE.UU. · México · Canadá  ·  11 Jun – 19 Jul</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            {liveCount>0&&<span style={{background:"#7f1d1d",color:"#fca5a5",borderRadius:4,padding:"3px 9px",fontSize:10,fontWeight:600}}>🔴 {liveCount} en vivo</span>}
            <button onClick={sync} style={{background:"#3c3a38",border:"none",borderRadius:4,color:"#d6d3d1",padding:"4px 10px",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              <span style={{color:syncClr,display:"inline-block",animation:syncState==="syncing"?"spin .8s linear infinite":"none"}}>{syncDot}</span>{syncLabel}
            </button>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"6px auto 0",display:"flex",gap:10}}>
          <span style={{fontSize:10,color:"#78716c"}}>Jugados: <b style={{color:"#d6d3d1"}}>{played}/104</b></span>
          <span style={{fontSize:10,color:"#78716c"}}>Participantes: <b style={{color:"#d6d3d1"}}>{FIXED_PARTICIPANTS.length}</b></span>
          <button onClick={sync} style={{marginLeft:"auto",background:"none",border:"none",color:"#78716c",cursor:"pointer",fontSize:10,padding:0}}>Actualizar ahora</button>
        </div>
      </div>

      {/* ── NAV ── */}
      <div style={{background:"#fff",borderBottom:`1px solid ${C.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {[{key:"tabla",label:"Tabla"},{key:"sorpresas",label:"Sorpresas 👀"},{key:"grupos",label:"Grupos"},{key:"playoffs",label:"Eliminatorias"},{key:"selecciones",label:"Selecciones"}].map(n=>(
            <button key={n.key} onClick={()=>setTab(n.key)} style={{background:"none",border:"none",cursor:"pointer",padding:"12px 14px",fontSize:12,fontWeight:tab===n.key?700:400,color:tab===n.key?C.text:C.textSub,borderBottom:tab===n.key?`2px solid ${C.text}`:"2px solid transparent",transition:"all .12s",whiteSpace:"nowrap"}}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 18px"}}>

        {/* ══ TABLA ══ */}
        {tab==="tabla"&&(
          <div>
            <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
              <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"baseline",gap:10}}>
                <h2 style={{margin:0,fontSize:15,fontWeight:700,color:C.text}}>Tabla general</h2>
                <span style={{fontSize:10,color:C.textSub,marginLeft:"auto"}}>3 pts victoria · 1 pt empate</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:C.bg}}>
                  <th style={{padding:"8px 16px",textAlign:"left",fontSize:10,color:C.textSub,fontWeight:500}}>#</th>
                  <th style={{padding:"8px 16px",textAlign:"left",fontSize:10,color:C.textSub,fontWeight:500}}>Participante</th>
                  <th style={{padding:"8px 16px",textAlign:"center",fontSize:10,color:C.textSub,fontWeight:500}}>Selecciones</th>
                  <th style={{padding:"8px 16px",textAlign:"center",fontSize:10,color:C.textSub,fontWeight:500}}>PTS</th>
                </tr></thead>
                <tbody>
                  {leaderboard.map((row,i)=>{
                    const myTeams=ALL_TEAMS.filter(t=>FIXED_ASSIGNMENTS[t]===row.name);
                    const bg=PARTICIPANT_COLORS[row.name]||"#374151";
                    return(
                      <tr key={row.name} onClick={()=>setSelectedPlayer(selectedPlayer===row.name?null:row.name)}
                        style={{borderTop:`1px solid ${C.border}`,background:selectedPlayer===row.name?"#f0f9ff":"transparent",cursor:"pointer"}}>
                        <td style={{padding:"11px 16px",width:36}}>
                          {i===0?<span style={{fontSize:16}}>🥇</span>:i===1?<span style={{fontSize:16}}>🥈</span>:i===2?<span style={{fontSize:16}}>🥉</span>:<span style={{fontSize:12,color:C.textSub,fontWeight:600}}>{i+1}</span>}
                        </td>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <span style={{width:8,height:8,borderRadius:"50%",background:bg,display:"inline-block",flexShrink:0}}/>
                            <span style={{fontWeight:600,fontSize:13,color:C.text}}>{row.name}</span>
                            {i===0&&row.pts>0&&<span style={{fontSize:9,background:C.greenBg,color:C.green,borderRadius:3,padding:"1px 5px",fontWeight:600}}>líder</span>}
                          </div>
                        </td>
                        <td style={{padding:"11px 16px",textAlign:"center"}}>
                          <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center"}}>
                            {myTeams.map(t=><span key={t} title={t} style={{fontSize:17}}>{FLAGS[t]}</span>)}
                          </div>
                        </td>
                        <td style={{padding:"11px 16px",textAlign:"center",fontWeight:700,fontSize:20,color:i===0&&row.pts>0?C.green:C.text}}>{row.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Detalle jugador */}
            {selectedPlayer&&(()=>{
              const playerTeams=ALL_TEAMS.filter(t=>FIXED_ASSIGNMENTS[t]===selectedPlayer);
              const bg=PARTICIPANT_COLORS[selectedPlayer]||"#374151";
              return(
                <div style={{background:C.card,borderRadius:10,border:`2px solid ${bg}`,padding:16,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <span style={{width:10,height:10,borderRadius:"50%",background:bg,flexShrink:0}}/>
                    <span style={{fontWeight:700,fontSize:14,color:C.text}}>{selectedPlayer}</span>
                    <button onClick={()=>setSelectedPlayer(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.textSub,fontSize:16,lineHeight:1}}>✕</button>
                  </div>
                  <div style={{display:"grid",gap:10,gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))"}}>
                    {playerTeams.map(team=>{
                      const grp=Object.entries(GROUPS).find(([,ts])=>ts.includes(team))?.[0];
                      const tm=groupMatches.filter(m=>m.home===team||m.away===team);
                      const pts=teamPoints(team,groupMatches);
                      return(
                        <div key={team} style={{background:C.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                            <span style={{fontSize:26}}>{FLAGS[team]}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:12,fontWeight:600,color:C.text}}>{team}</div>
                              <div style={{fontSize:10,color:C.textSub}}>Grupo {grp}</div>
                            </div>
                            <div style={{textAlign:"center"}}>
                              <div style={{fontSize:18,fontWeight:700,color:C.text}}>{pts}</div>
                              <div style={{fontSize:9,color:C.textSub}}>pts</div>
                            </div>
                          </div>
                          {tm.map(m=>{
                            const isHome=m.home===team, opp=isHome?m.away:m.home;
                            const score=m.homeScore!==null?(isHome?`${m.homeScore}–${m.awayScore}`:`${m.awayScore}–${m.homeScore}`):"–";
                            return(
                              <div key={m.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,padding:"3px 0",borderTop:`1px solid ${C.border}`}}>
                                <span style={{color:C.textSub,minWidth:34}}>{m.date}</span>
                                <span style={{color:C.textMid,flex:1}}>{FLAGS[opp]} {opp}</span>
                                <span style={{fontWeight:600,color:m.live?"#ca8a04":C.text,background:m.homeScore!==null?C.border:"transparent",borderRadius:3,padding:"1px 5px"}}>{score}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Mini tablas grupos */}
            <p style={{fontSize:11,color:C.textSub,marginBottom:10}}>Posiciones por grupo</p>
            <div style={{display:"grid",gap:10,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
              {Object.keys(GROUPS).map(grp=>{
                const standing=computeStandings(groupMatches,grp);
                return(
                  <div key={grp} style={{background:C.card,borderRadius:8,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                    <div style={{background:C.bg,padding:"5px 12px",fontSize:11,fontWeight:600,color:C.textMid,borderBottom:`1px solid ${C.border}`}}>Grupo {grp}</div>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <tbody>
                        {standing.map((row,i)=>(
                          <tr key={row.team} style={{borderTop:i>0?`1px solid ${C.border}`:"none"}}>
                            <td style={{padding:"5px 12px",color:i<2?C.green:C.textSub,fontWeight:600,fontSize:11,width:16}}>{i+1}</td>
                            <td style={{padding:"5px 3px",fontSize:14,width:20}}>{FLAGS[row.team]}</td>
                            <td style={{padding:"5px 4px",fontSize:11,color:C.text}}>{row.team}</td>
                            <td style={{padding:"5px 4px"}}><OwnerTag team={row.team} small/></td>
                            <td style={{padding:"5px 12px",fontWeight:700,color:C.text,textAlign:"right",fontSize:12}}>{row.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SORPRESAS ══ */}
        {tab==="sorpresas"&&(()=>{
          const tierMedioData = TIER_MEDIO_TOP3.map(team=>({
            team, pts:teamPoints(team,groupMatches), owner:FIXED_ASSIGNMENTS[team]
          }));
          const tierBajoData = TIER_BAJO_TOP3.map(team=>({
            team, pts:teamPoints(team,groupMatches), owner:FIXED_ASSIGNMENTS[team]
          }));
          const Block=({rank,team,pts,owner,accent})=>{
            const medals=["🥇","🥈","🥉"];
            const ownerColor=owner?PARTICIPANT_COLORS[owner]:"#6b7280";
            return(
              <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
                <span style={{fontSize:28,flexShrink:0}}>{medals[rank]}</span>
                <span style={{fontSize:38,flexShrink:0}}>{FLAGS[team]}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,color:C.text}}>{team}</div>
                  {owner&&<div style={{marginTop:4}}>
                    <span style={{fontSize:10,background:ownerColor,color:"#fff",borderRadius:3,padding:"2px 7px",fontWeight:600}}>{owner}</span>
                  </div>}
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:26,fontWeight:700,color:C.text}}>{pts}</div>
                  <div style={{fontSize:9,color:C.textSub}}>pts</div>
                </div>
              </div>
            );
          };
          return(
            <div>
              <div style={{display:"grid",gap:24,gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))"}}>
                {/* TIER MEDIO */}
                <div>
                  <div style={{marginBottom:12}}>
                    <h2 style={{margin:"0 0 2px",fontSize:15,fontWeight:700,color:C.text}}>Top 3 — Más o menos</h2>
                    <p style={{margin:0,fontSize:11,color:C.textSub}}>Selecciones regulares que pueden dar sorpresas</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {tierMedioData.map((d,i)=><Block key={d.team} rank={i} {...d} accent={C.amberBg}/>)}
                  </div>
                  <div style={{marginTop:12,background:C.amberBg,borderRadius:8,padding:"10px 14px",border:`1px solid #fcd34d`}}>
                    <p style={{margin:0,fontSize:11,color:C.amber}}>
                      🟡 Estos equipos están en el tier medio — no son candidatos al título pero pueden pasar de grupos y sorprender en eliminatorias.
                    </p>
                  </div>
                </div>

                {/* TIER BAJO */}
                <div>
                  <div style={{marginBottom:12}}>
                    <h2 style={{margin:"0 0 2px",fontSize:15,fontWeight:700,color:C.text}}>Top 3 — Menos malos</h2>
                    <p style={{margin:0,fontSize:11,color:C.textSub}}>De los equipos débiles, los que más pueden aguantar</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {tierBajoData.map((d,i)=><Block key={d.team} rank={i} {...d} accent={C.redBg}/>)}
                  </div>
                  <div style={{marginTop:12,background:"#fef2f2",borderRadius:8,padding:"10px 14px",border:`1px solid #fca5a5`}}>
                    <p style={{margin:0,fontSize:11,color:C.red}}>
                      🔴 Estos equipos están en el tier bajo — van a sufrir, pero dentro de lo que cabe son los más competitivos de su grupo.
                    </p>
                  </div>
                </div>
              </div>

              {/* sus dueños */}
              <div style={{marginTop:24,background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px 18px",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
                <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:C.text}}>¿A quién le tocan estas selecciones?</h3>
                <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))"}}>
                  {[...TIER_MEDIO_TOP3,...TIER_BAJO_TOP3].map(team=>{
                    const owner=FIXED_ASSIGNMENTS[team];
                    const ownerColor=owner?PARTICIPANT_COLORS[owner]:"#6b7280";
                    const isMedio=TIER_MEDIO_TOP3.includes(team);
                    return(
                      <div key={team} style={{background:C.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:26}}>{FLAGS[team]}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{team}</div>
                          <div style={{fontSize:9,marginTop:2,display:"flex",gap:4,alignItems:"center"}}>
                            <span style={{background:isMedio?C.amberBg:C.redBg,color:isMedio?C.amber:C.red,borderRadius:2,padding:"1px 4px",fontWeight:600}}>{isMedio?"medio":"bajo"}</span>
                            {owner&&<span style={{background:ownerColor,color:"#fff",borderRadius:2,padding:"1px 5px",fontWeight:600}}>{owner}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ GRUPOS ══ */}
        {tab==="grupos"&&(
          <div>
            <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:10,color:C.textSub}}>Grupo:</span>
              {["all",...Object.keys(GROUPS)].map(g=>(
                <button key={g} onClick={()=>setFilterGroup(g)} style={{padding:"3px 9px",borderRadius:4,border:`1px solid ${filterGroup===g?C.text:C.border}`,background:filterGroup===g?C.text:"transparent",color:filterGroup===g?"#fff":C.textMid,fontSize:11,cursor:"pointer",fontWeight:filterGroup===g?600:400}}>
                  {g==="all"?"Todos":g}
                </button>
              ))}
            </div>
            <div style={{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))"}}>
              {groupsToShow.map(grp=>{
                const gMs=groupMatches.filter(m=>m.group===grp);
                const standing=computeStandings(groupMatches,grp);
                const hasLive=gMs.some(m=>m.live);
                return(
                  <div key={grp} style={{background:C.card,borderRadius:10,border:`1px solid ${hasLive?"#dc2626":C.border}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
                    <div style={{background:C.bg,padding:"8px 13px",display:"flex",alignItems:"center",gap:7,borderBottom:`1px solid ${C.border}`}}>
                      <span style={{fontWeight:700,fontSize:13,color:C.text}}>Grupo {grp}</span>
                      {hasLive&&<span style={{fontSize:9,background:C.redBg,color:C.red,borderRadius:3,padding:"1px 5px",fontWeight:600}}>EN VIVO</span>}
                      <div style={{marginLeft:"auto",display:"flex",gap:3}}>{GROUPS[grp].map(t=><span key={t} style={{fontSize:14}} title={t}>{FLAGS[t]}</span>)}</div>
                    </div>
                    {/* posiciones */}
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead><tr style={{background:C.bg}}>
                        <th style={{padding:"5px 12px",textAlign:"left",color:C.textSub,fontWeight:500,width:16}}>#</th>
                        <th style={{padding:"5px 4px",textAlign:"left",color:C.textSub,fontWeight:500}} colSpan={3}>Selección</th>
                        <th style={{padding:"5px 4px",textAlign:"center",color:C.textSub,fontWeight:500}}>PJ</th>
                        <th style={{padding:"5px 4px",textAlign:"center",color:C.textSub,fontWeight:500}}>DIF</th>
                        <th style={{padding:"5px 12px",textAlign:"center",color:C.textMid,fontWeight:600}}>PTS</th>
                      </tr></thead>
                      <tbody>
                        {standing.map((row,i)=>(
                          <tr key={row.team} style={{borderTop:`1px solid ${C.border}`}}>
                            <td style={{padding:"5px 12px",color:i<2?C.green:C.textSub,fontWeight:600}}>{i+1}</td>
                            <td style={{padding:"5px 3px",fontSize:15}}>{FLAGS[row.team]}</td>
                            <td style={{padding:"5px 4px",color:C.text,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.team}</td>
                            <td style={{padding:"5px 4px"}}><OwnerTag team={row.team} small/></td>
                            <td style={{padding:"5px 4px",textAlign:"center",color:C.textSub}}>{row.pj}</td>
                            <td style={{padding:"5px 4px",textAlign:"center",color:row.dif>0?C.green:row.dif<0?C.red:C.textSub}}>{row.dif>0?"+":""}{row.dif}</td>
                            <td style={{padding:"5px 12px",textAlign:"center",fontWeight:700,color:C.text}}>{row.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* partidos */}
                    <div style={{padding:"6px 13px 10px"}}>
                      {gMs.map(m=>(
                        <div key={m.id} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 0",borderTop:`1px solid ${C.border}`}}>
                          <span style={{fontSize:9,color:C.textSub,minWidth:34}}>{m.date}</span>
                          <div style={{flex:1,textAlign:"right",minWidth:0,overflow:"hidden"}}>
                            <span style={{fontSize:11,color:C.textMid,whiteSpace:"nowrap"}}>{FLAGS[m.home]} {m.home}</span>
                          </div>
                          <div style={{minWidth:50,textAlign:"center",flexShrink:0}}>
                            {m.homeScore!==null?(
                              <span style={{fontWeight:700,fontSize:12,color:m.live?"#ca8a04":C.text,background:m.live?C.amberBg:C.bg,borderRadius:4,padding:"2px 6px",border:`1px solid ${C.border}`,display:"inline-block"}}>
                                {m.homeScore}–{m.awayScore}
                                {m.live&&<span style={{fontSize:8,display:"block",color:"#ca8a04",lineHeight:1}}>live</span>}
                              </span>
                            ):<span style={{color:C.textSub,fontSize:11}}>vs</span>}
                          </div>
                          <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
                            <span style={{fontSize:11,color:C.textMid,whiteSpace:"nowrap"}}>{FLAGS[m.away]} {m.away}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ PLAYOFFS ══ */}
        {tab==="playoffs"&&(
          <div>
            {["16avos","8avos","Cuartos","Semifinales","3er Lugar","Final"].map(phase=>{
              const pMs=playoffMatches.filter(m=>m.phase===phase);
              return(
                <div key={phase} style={{marginBottom:22}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:PHASE_COLORS[phase]||C.text,display:"inline-block"}}/>
                    <h2 style={{margin:0,fontSize:13,fontWeight:700,color:C.text}}>{phase==="Final"?"🏆 Final":phase}</h2>
                    <div style={{flex:1,height:1,background:C.border}}/>
                  </div>
                  <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))"}}>
                    {pMs.map(m=>{
                      const hOwner=FIXED_ASSIGNMENTS[m.home], aOwner=FIXED_ASSIGNMENTS[m.away];
                      return(
                        <div key={m.id} style={{background:C.card,borderRadius:8,border:`1px solid ${m.live?"#dc2626":phase==="Final"?"#92400e":C.border}`,padding:"10px 13px",display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:10,color:C.textSub,minWidth:36,flexShrink:0}}>{m.date}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3,fontSize:12,color:C.text}}>
                              {FLAGS[m.home]&&<span>{FLAGS[m.home]}</span>}
                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{m.home}</span>
                              {hOwner&&<span style={{fontSize:8,background:PARTICIPANT_COLORS[hOwner]||"#374151",color:"#fff",borderRadius:2,padding:"1px 4px",fontWeight:600,flexShrink:0}}>{hOwner}</span>}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:C.text}}>
                              {FLAGS[m.away]&&<span>{FLAGS[m.away]}</span>}
                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{m.away}</span>
                              {aOwner&&<span style={{fontSize:8,background:PARTICIPANT_COLORS[aOwner]||"#374151",color:"#fff",borderRadius:2,padding:"1px 4px",fontWeight:600,flexShrink:0}}>{aOwner}</span>}
                            </div>
                          </div>
                          {m.homeScore!==null?(
                            <div style={{textAlign:"center",flexShrink:0}}>
                              <span style={{fontWeight:700,fontSize:14,color:m.live?"#ca8a04":C.text,background:m.live?C.amberBg:C.bg,borderRadius:5,padding:"4px 9px",border:`1px solid ${C.border}`,display:"block",letterSpacing:1}}>
                                {m.homeScore}–{m.awayScore}
                              </span>
                              {m.live&&<span style={{fontSize:8,color:"#ca8a04",display:"block",textAlign:"center",marginTop:2}}>en vivo</span>}
                            </div>
                          ):<span style={{color:C.textSub,fontSize:11,minWidth:36,textAlign:"center"}}>–</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SELECCIONES ══ */}
        {tab==="selecciones"&&(
          <div>
            <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,marginBottom:18,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <h2 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:C.text}}>Participantes</h2>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {FIXED_PARTICIPANTS.map((p,i)=>{
                  const myTeams=ALL_TEAMS.filter(t=>FIXED_ASSIGNMENTS[t]===p);
                  const bg=PARTICIPANT_COLORS[p]||"#374151";
                  return(
                    <div key={p} onClick={()=>setSelectedPlayer(selectedPlayer===p?null:p)}
                      style={{background:bg,borderRadius:6,padding:"5px 10px",display:"flex",alignItems:"center",gap:6,cursor:"pointer",opacity:selectedPlayer&&selectedPlayer!==p?.45:1,transition:"opacity .15s",outline:selectedPlayer===p?`2px solid ${C.text}`:"2px solid transparent"}}>
                      <span style={{fontWeight:600,fontSize:12,color:"#fff"}}>{p}</span>
                      <span style={{fontSize:13}}>{myTeams.map(t=>FLAGS[t]).join("")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {Object.entries(GROUPS).map(([grp,teams])=>(
              <div key={grp} style={{marginBottom:14}}>
                <p style={{fontSize:11,color:C.textSub,fontWeight:600,margin:"0 0 6px"}}>GRUPO {grp}</p>
                <div style={{display:"grid",gap:7,gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))"}}>
                  {teams.map(team=>{
                    const owner=FIXED_ASSIGNMENTS[team];
                    const ownerColor=owner?PARTICIPANT_COLORS[owner]:"#6b7280";
                    const isHighlit=selectedPlayer&&owner===selectedPlayer;
                    return(
                      <div key={team} style={{background:C.card,borderRadius:8,border:`1px solid ${isHighlit?ownerColor:C.border}`,padding:"9px 12px",display:"flex",alignItems:"center",gap:9,opacity:selectedPlayer&&!isHighlit?.35:1,transition:"all .15s",boxShadow:"0 1px 2px rgba(0,0,0,.04)"}}>
                        <span style={{fontSize:24}}>{FLAGS[team]}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{team}</div>
                          {owner
                            ?<span style={{fontSize:9,background:ownerColor,color:"#fff",borderRadius:3,padding:"1px 5px",fontWeight:600,display:"inline-block",marginTop:2}}>{owner}</span>
                            :<span style={{fontSize:10,color:C.textSub}}>–</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <p style={{fontSize:10,color:C.textSub,textAlign:"center",marginTop:6}}>🔒 Asignaciones fijas</p>
          </div>
        )}

      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
