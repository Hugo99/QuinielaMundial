import { useState, useEffect, useCallback, useRef } from "react";

const FIXED_PARTICIPANTS = [
  "Ale B","Ale P","Bernardo","Hugo","Ismene y Poncho",
  "Jaz","Juan","Karim","Kris","Lalo",
  "Majo","Omar","Reyna y Antonio","Roberto","Sergio","Toyos"
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

const TIER_MEDIO_TOP3 = ["México","Canadá","Senegal"];
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
  B:["Canadá","Bosnia","Qatar","Suiza"],
  C:["Brasil","Marruecos","Haití","Escocia"],
  D:["Estados Unidos","Paraguay","Australia","Turquía"],
  E:["Alemania","Curazao","Costa de Marfil","Ecuador"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H:["España","Cabo Verde","Arabia Saudita","Uruguay"],
  I:["Francia","Senegal","Irak","Noruega"],
  J:["Argentina","Argelia","Austria","Jordania"],
  K:["Portugal","RD Congo","Uzbekistán","Colombia"],
  L:["Inglaterra","Croacia","Ghana","Panamá"],
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

// Calendario REAL fase de grupos — fuente: Al Jazeera / FIFA oficial
const GROUP_MATCHES = [
  // ── Jornada 1 ──
  {id:1, group:"A",date:"11 Jun",home:"México",          away:"Sudáfrica"},
  {id:2, group:"A",date:"11 Jun",home:"Corea del Sur",   away:"Rep. Checa"},
  {id:3, group:"B",date:"12 Jun",home:"Canadá",          away:"Bosnia"},
  {id:4, group:"D",date:"12 Jun",home:"Estados Unidos",  away:"Paraguay"},
  {id:5, group:"B",date:"13 Jun",home:"Qatar",           away:"Suiza"},
  {id:6, group:"C",date:"13 Jun",home:"Brasil",          away:"Marruecos"},
  {id:7, group:"C",date:"13 Jun",home:"Haití",           away:"Escocia"},
  {id:8, group:"D",date:"13 Jun",home:"Australia",       away:"Turquía"},
  {id:9, group:"E",date:"14 Jun",home:"Alemania",        away:"Curazao"},
  {id:10,group:"F",date:"14 Jun",home:"Países Bajos",    away:"Japón"},
  {id:11,group:"E",date:"14 Jun",home:"Costa de Marfil", away:"Ecuador"},
  {id:12,group:"F",date:"14 Jun",home:"Suecia",          away:"Túnez"},
  {id:13,group:"H",date:"15 Jun",home:"España",          away:"Cabo Verde"},
  {id:14,group:"G",date:"15 Jun",home:"Bélgica",         away:"Egipto"},
  {id:15,group:"H",date:"15 Jun",home:"Arabia Saudita",  away:"Uruguay"},
  {id:16,group:"G",date:"15 Jun",home:"Irán",            away:"Nueva Zelanda"},
  {id:17,group:"I",date:"16 Jun",home:"Francia",         away:"Senegal"},
  {id:18,group:"I",date:"16 Jun",home:"Irak",            away:"Noruega"},
  {id:19,group:"J",date:"16 Jun",home:"Argentina",       away:"Argelia"},
  {id:20,group:"J",date:"16 Jun",home:"Austria",         away:"Jordania"},
  {id:21,group:"K",date:"17 Jun",home:"Portugal",        away:"RD Congo"},
  {id:22,group:"L",date:"17 Jun",home:"Inglaterra",      away:"Croacia"},
  {id:23,group:"L",date:"17 Jun",home:"Ghana",           away:"Panamá"},
  {id:24,group:"K",date:"17 Jun",home:"Uzbekistán",      away:"Colombia"},
  // ── Jornada 2 ──
  {id:25,group:"A",date:"18 Jun",home:"Rep. Checa",      away:"Sudáfrica"},
  {id:26,group:"B",date:"18 Jun",home:"Suiza",           away:"Bosnia"},
  {id:27,group:"B",date:"18 Jun",home:"Canadá",          away:"Qatar"},
  {id:28,group:"A",date:"18 Jun",home:"México",          away:"Corea del Sur"},
  {id:29,group:"C",date:"19 Jun",home:"Escocia",         away:"Marruecos"},
  {id:30,group:"D",date:"19 Jun",home:"Estados Unidos",  away:"Australia"},
  {id:31,group:"C",date:"19 Jun",home:"Brasil",          away:"Haití"},
  {id:32,group:"D",date:"19 Jun",home:"Turquía",         away:"Paraguay"},
  {id:33,group:"F",date:"20 Jun",home:"Países Bajos",    away:"Suecia"},
  {id:34,group:"E",date:"20 Jun",home:"Alemania",        away:"Costa de Marfil"},
  {id:35,group:"E",date:"20 Jun",home:"Ecuador",         away:"Curazao"},
  {id:36,group:"F",date:"20 Jun",home:"Túnez",           away:"Japón"},
  {id:37,group:"H",date:"21 Jun",home:"España",          away:"Arabia Saudita"},
  {id:38,group:"G",date:"21 Jun",home:"Bélgica",         away:"Irán"},
  {id:39,group:"H",date:"21 Jun",home:"Uruguay",         away:"Cabo Verde"},
  {id:40,group:"G",date:"21 Jun",home:"Nueva Zelanda",   away:"Egipto"},
  {id:41,group:"J",date:"22 Jun",home:"Argentina",       away:"Austria"},
  {id:42,group:"I",date:"22 Jun",home:"Francia",         away:"Irak"},
  {id:43,group:"I",date:"22 Jun",home:"Noruega",         away:"Senegal"},
  {id:44,group:"J",date:"22 Jun",home:"Jordania",        away:"Argelia"},
  {id:45,group:"K",date:"23 Jun",home:"Portugal",        away:"Uzbekistán"},
  {id:46,group:"L",date:"23 Jun",home:"Inglaterra",      away:"Ghana"},
  {id:47,group:"L",date:"23 Jun",home:"Panamá",          away:"Croacia"},
  {id:48,group:"K",date:"23 Jun",home:"Colombia",        away:"RD Congo"},
  // ── Jornada 3 (simultáneos) ──
  {id:49,group:"B",date:"24 Jun",home:"Suiza",           away:"Canadá"},
  {id:50,group:"B",date:"24 Jun",home:"Bosnia",          away:"Qatar"},
  {id:51,group:"C",date:"24 Jun",home:"Escocia",         away:"Brasil"},
  {id:52,group:"C",date:"24 Jun",home:"Marruecos",       away:"Haití"},
  {id:53,group:"A",date:"24 Jun",home:"Rep. Checa",      away:"México"},
  {id:54,group:"A",date:"24 Jun",home:"Sudáfrica",       away:"Corea del Sur"},
  {id:55,group:"E",date:"25 Jun",home:"Ecuador",         away:"Alemania"},
  {id:56,group:"E",date:"25 Jun",home:"Curazao",         away:"Costa de Marfil"},
  {id:57,group:"F",date:"25 Jun",home:"Japón",           away:"Suecia"},
  {id:58,group:"F",date:"25 Jun",home:"Túnez",           away:"Países Bajos"},
  {id:59,group:"D",date:"25 Jun",home:"Turquía",         away:"Estados Unidos"},
  {id:60,group:"D",date:"25 Jun",home:"Paraguay",        away:"Australia"},
  {id:61,group:"I",date:"26 Jun",home:"Noruega",         away:"Francia"},
  {id:62,group:"I",date:"26 Jun",home:"Senegal",         away:"Irak"},
  {id:63,group:"H",date:"26 Jun",home:"Cabo Verde",      away:"Arabia Saudita"},
  {id:64,group:"H",date:"26 Jun",home:"Uruguay",         away:"España"},
  {id:65,group:"G",date:"26 Jun",home:"Egipto",          away:"Irán"},
  {id:66,group:"G",date:"26 Jun",home:"Nueva Zelanda",   away:"Bélgica"},
  {id:67,group:"L",date:"27 Jun",home:"Panamá",          away:"Inglaterra"},
  {id:68,group:"L",date:"27 Jun",home:"Croacia",         away:"Ghana"},
  {id:69,group:"K",date:"27 Jun",home:"Colombia",        away:"Portugal"},
  {id:70,group:"K",date:"27 Jun",home:"RD Congo",        away:"Uzbekistán"},
  {id:71,group:"J",date:"27 Jun",home:"Argelia",         away:"Austria"},
  {id:72,group:"J",date:"27 Jun",home:"Jordania",        away:"Argentina"},
].map(m=>({...m,phase:"Grupos",homeScore:null,awayScore:null,live:false}));

const PLAYOFF_SKELETON = [
  ...Array.from({length:16},(_,i)=>({id:73+i,phase:"32avos",date:["28 Jun","29 Jun","30 Jun","1 Jul","2 Jul","3 Jul"][Math.floor(i/3)],home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true})),
  ...Array.from({length:8},(_,i)=>({id:89+i,phase:"16avos",date:["4 Jul","5 Jul","6 Jul","7 Jul"][Math.floor(i/2)],home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true})),
  ...Array.from({length:4},(_,i)=>({id:97+i,phase:"Cuartos",date:["9 Jul","10 Jul","11 Jul"][Math.floor(i/2)],home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true})),
  {id:101,phase:"Semifinales",date:"14 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
  {id:102,phase:"Semifinales",date:"15 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
  {id:103,phase:"3er Lugar",date:"18 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
  {id:104,phase:"Final",date:"19 Jul",home:"?",away:"?",homeScore:null,awayScore:null,live:false,tbd:true},
];

const ALL_TEAMS = Object.values(GROUPS).flat();
const PHASE_COLORS = {"Grupos":"#4b5563","32avos":"#6b7280","16avos":"#78716c","Cuartos":"#92400e","Semifinales":"#7f1d1d","3er Lugar":"#374151","Final":"#78350f"};

const ESPN_MAP = {
  "Mexico":"México","South Korea":"Corea del Sur","Korea Republic":"Corea del Sur",
  "South Africa":"Sudáfrica","Czech Republic":"Rep. Checa","Czechia":"Rep. Checa",
  "Canada":"Canadá","Switzerland":"Suiza","Bosnia and Herzegovina":"Bosnia","Bosnia":"Bosnia",
  "Brazil":"Brasil","Morocco":"Marruecos","Scotland":"Escocia","Haiti":"Haití",
  "United States":"Estados Unidos","USA":"Estados Unidos","Paraguay":"Paraguay",
  "Australia":"Australia","Turkey":"Turquía","Türkiye":"Turquía",
  "Germany":"Alemania","Ecuador":"Ecuador","Ivory Coast":"Costa de Marfil",
  "Cote d'Ivoire":"Costa de Marfil","Curacao":"Curazao","Curaçao":"Curazao",
  "Netherlands":"Países Bajos","Japan":"Japón","Tunisia":"Túnez","Sweden":"Suecia",
  "Belgium":"Bélgica","Iran":"Irán","Egypt":"Egipto","New Zealand":"Nueva Zelanda",
  "Spain":"España","Uruguay":"Uruguay","Saudi Arabia":"Arabia Saudita","Cape Verde":"Cabo Verde",
  "France":"Francia","Senegal":"Senegal","Norway":"Noruega","Iraq":"Irak",
  "Argentina":"Argentina","Austria":"Austria","Algeria":"Argelia","Jordan":"Jordania",
  "Portugal":"Portugal","Colombia":"Colombia","Uzbekistan":"Uzbekistán",
  "DR Congo":"RD Congo","Congo DR":"RD Congo","Democratic Republic of Congo":"RD Congo","DRC":"RD Congo",
  "England":"Inglaterra","Croatia":"Croacia","Panama":"Panamá","Ghana":"Ghana",
};
function normName(n){ return ESPN_MAP[n]||n; }

async function fetchLiveScores(){
  try{
    const espnUrl = "https://site.api.espn.com/apis/site/v2/sports/soccer/FIFA.WORLD/scoreboard";
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(espnUrl)}`;
    const r = await fetch(proxy, {cache:"no-store"});
    if(!r.ok) throw new Error();
    const data = JSON.parse((await r.json()).contents);
    return data.events || [];
  }catch(e){ console.warn("ESPN:",e); return []; }
}

function parseESPN(events){
  return events.map(ev=>{
    const comp=ev.competitions?.[0]; if(!comp) return null;
    const teams=comp.competitors||[];
    const home=teams.find(t=>t.homeAway==="home");
    const away=teams.find(t=>t.homeAway==="away");
    if(!home||!away) return null;
    const status=ev.status?.type?.name||"";
    const live=status==="STATUS_IN_PROGRESS";
    const finished=status==="STATUS_FINAL";
    const homeName=normName(home.team?.displayName||home.team?.name||"");
    const awayName=normName(away.team?.displayName||away.team?.name||"");
    const homeScore=(live||finished)&&home.score!=null?parseInt(home.score):null;
    const awayScore=(live||finished)&&away.score!=null?parseInt(away.score):null;
    return{home:homeName,away:awayName,homeScore,awayScore,live,finished};
  }).filter(Boolean);
}

function computeStandings(matches,group){
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

function computeLeaderboard(matches){
  const pts=Object.fromEntries(FIXED_PARTICIPANTS.map(p=>[p,0]));
  matches.forEach(m=>{
    if(m.homeScore===null) return;
    [m.home,m.away].forEach(team=>{
      const owner=FIXED_ASSIGNMENTS[team]; if(!owner) return;
      const isHome=team===m.home,hw=m.homeScore>m.awayScore,aw=m.awayScore>m.homeScore;
      if(isHome&&hw)pts[owner]+=3; else if(!isHome&&aw)pts[owner]+=3; else if(m.homeScore===m.awayScore)pts[owner]+=1;
    });
  });
  return FIXED_PARTICIPANTS.map(p=>({name:p,pts:pts[p]})).sort((a,b)=>b.pts-a.pts);
}

function teamPoints(team,matches){
  let pts=0;
  matches.filter(m=>(m.home===team||m.away===team)&&m.homeScore!==null).forEach(m=>{
    const isHome=m.home===team,hw=m.homeScore>m.awayScore,aw=m.awayScore>m.homeScore;
    if(isHome&&hw)pts+=3; else if(!isHome&&aw)pts+=3; else if(m.homeScore===m.awayScore)pts+=1;
  });
  return pts;
}

const C={
  bg:"#f5f5f4",card:"#ffffff",border:"#e7e5e4",
  text:"#1c1917",textMid:"#57534e",textSub:"#a8a29e",
  green:"#166534",greenBg:"#dcfce7",red:"#991b1b",redBg:"#fee2e2",
  amber:"#92400e",amberBg:"#fef3c7",headerBg:"#292524",headerText:"#fafaf9",
};

export default function App(){
  const [tab,setTab]=useState("tabla");
  const [matches,setMatches]=useState(()=>[...GROUP_MATCHES,...PLAYOFF_SKELETON]);
  const [filterGroup,setFilterGroup]=useState("all");
  const [syncState,setSyncState]=useState("idle");
  const [lastSync,setLastSync]=useState(null);
  const [liveCount,setLiveCount]=useState(0);
  const [selectedPlayer,setSelectedPlayer]=useState(null);
  const syncRef=useRef(null);

  const applyLiveData=useCallback((espnScores)=>{
    setMatches(prev=>prev.map(m=>{
      const hit=espnScores.find(e=>
        (e.home===m.home&&e.away===m.away)||(e.home===m.away&&e.away===m.home)
      );
      if(!hit) return m;
      const fl=hit.away===m.home;
      return{
        ...m,
        homeScore:hit.homeScore!==null?(fl?hit.awayScore:hit.homeScore):m.homeScore,
        awayScore:hit.awayScore!==null?(fl?hit.homeScore:hit.awayScore):m.awayScore,
        live:hit.live,
        home:m.tbd&&hit.home&&hit.home!=="?"?hit.home:m.home,
        away:m.tbd&&hit.away&&hit.away!=="?"?hit.away:m.away,
      };
    }));
  },[]);

  const sync=useCallback(async()=>{
    setSyncState("syncing");
    const events=await fetchLiveScores();
    if(!events.length){setSyncState("error");return;}
    const parsed=parseESPN(events);
    applyLiveData(parsed);
    const live=parsed.filter(e=>e.live).length;
    setLiveCount(live);
    setLastSync(new Date());
    setSyncState("ok");
  },[applyLiveData]);

  useEffect(()=>{
    sync();
    const schedule=()=>{
      syncRef.current=setTimeout(async()=>{await sync();schedule();},liveCount>0?20000:45000);
    };
    schedule();
    return()=>clearTimeout(syncRef.current);
  },[sync,liveCount]);

  const groupMatches=matches.filter(m=>m.phase==="Grupos");
  const playoffMatches=matches.filter(m=>m.phase!=="Grupos");
  const leaderboard=computeLeaderboard(matches);
  const played=matches.filter(m=>m.homeScore!==null).length;
  const groupsToShow=filterGroup==="all"?Object.keys(GROUPS):[filterGroup];

  const syncClr=syncState==="ok"?"#16a34a":syncState==="error"?"#dc2626":syncState==="syncing"?"#ca8a04":"#a8a29e";
  const syncDot=syncState==="syncing"?"⟳":"●";
  const syncLabel=syncState==="syncing"?"Actualizando...":lastSync?`${lastSync.getHours()}:${String(lastSync.getMinutes()).padStart(2,"0")}`:"ESPN";

  const OwnerTag=({team,small})=>{
    const owner=FIXED_ASSIGNMENTS[team]; if(!owner) return null;
    return <span style={{fontSize:small?8:9,background:PARTICIPANT_COLORS[owner]||"#374151",color:"#fff",borderRadius:3,padding:small?"1px 4px":"2px 5px",fontWeight:600,whiteSpace:"nowrap"}}>{owner}</span>;
  };

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>

      <div style={{background:C.headerBg,padding:"14px 20px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:22}}>⚽</span>
          <div style={{flex:1}}>
            <h1 style={{margin:0,fontSize:17,fontWeight:700,color:C.headerText}}>Quiniela Mundial 2026</h1>
            <p style={{margin:0,fontSize:10,color:"#a8a29e"}}>EE.UU. · México · Canadá · 11 Jun – 19 Jul</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {liveCount>0&&<span style={{background:"#7f1d1d",color:"#fca5a5",borderRadius:4,padding:"3px 9px",fontSize:10,fontWeight:600}}>🔴 {liveCount} en vivo</span>}
            <button onClick={sync} style={{background:"#3c3a38",border:"none",borderRadius:4,color:"#d6d3d1",padding:"4px 10px",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              <span style={{color:syncClr,display:"inline-block",animation:syncState==="syncing"?"spin .8s linear infinite":"none"}}>{syncDot}</span>{syncLabel}
            </button>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"6px auto 0",display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:10,color:"#78716c"}}>Jugados: <b style={{color:"#d6d3d1"}}>{played}/104</b></span>
          <span style={{fontSize:10,color:"#78716c"}}>·</span>
          <span style={{fontSize:10,color:"#78716c"}}>{syncState==="ok"?"✓ ESPN conectado":syncState==="error"?"✗ Sin conexión ESPN":"…"}</span>
          <button onClick={sync} style={{marginLeft:"auto",background:"none",border:"none",color:"#60a5fa",cursor:"pointer",fontSize:10,padding:0}}>↻ Actualizar</button>
        </div>
      </div>

      <div style={{background:"#fff",borderBottom:`1px solid ${C.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {[{key:"tabla",label:"Tabla"},{key:"sorpresas",label:"Sorpresas 👀"},{key:"grupos",label:"Grupos"},{key:"playoffs",label:"Eliminatorias"},{key:"selecciones",label:"Selecciones"}].map(n=>(
            <button key={n.key} onClick={()=>setTab(n.key)} style={{background:"none",border:"none",cursor:"pointer",padding:"12px 14px",fontSize:12,fontWeight:tab===n.key?700:400,color:tab===n.key?C.text:C.textSub,borderBottom:tab===n.key?`2px solid ${C.text}`:"2px solid transparent",whiteSpace:"nowrap"}}>
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
                <h2 style={{margin:0,fontSize:15,fontWeight:700}}>Tabla general</h2>
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
                            <span style={{fontWeight:600,fontSize:13}}>{row.name}</span>
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

            {selectedPlayer&&(()=>{
              const playerTeams=ALL_TEAMS.filter(t=>FIXED_ASSIGNMENTS[t]===selectedPlayer);
              const bg=PARTICIPANT_COLORS[selectedPlayer]||"#374151";
              return(
                <div style={{background:C.card,borderRadius:10,border:`2px solid ${bg}`,padding:16,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <span style={{width:10,height:10,borderRadius:"50%",background:bg,flexShrink:0}}/>
                    <span style={{fontWeight:700,fontSize:14}}>{selectedPlayer}</span>
                    <button onClick={()=>setSelectedPlayer(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.textSub,fontSize:18,lineHeight:1}}>✕</button>
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
                              <div style={{fontSize:12,fontWeight:600}}>{team}</div>
                              <div style={{fontSize:10,color:C.textSub}}>Grupo {grp}</div>
                            </div>
                            <div style={{textAlign:"center"}}>
                              <div style={{fontSize:18,fontWeight:700}}>{pts}</div>
                              <div style={{fontSize:9,color:C.textSub}}>pts</div>
                            </div>
                          </div>
                          {tm.map(m=>{
                            const isHome=m.home===team,opp=isHome?m.away:m.home;
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
                            <td style={{padding:"5px 4px",fontSize:11}}>{row.team}</td>
                            <td style={{padding:"5px 4px"}}><OwnerTag team={row.team} small/></td>
                            <td style={{padding:"5px 12px",fontWeight:700,textAlign:"right",fontSize:12}}>{row.pts}</td>
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
          const tierMedioData=TIER_MEDIO_TOP3.map(team=>({team,pts:teamPoints(team,groupMatches),owner:FIXED_ASSIGNMENTS[team]}));
          const tierBajoData=TIER_BAJO_TOP3.map(team=>({team,pts:teamPoints(team,groupMatches),owner:FIXED_ASSIGNMENTS[team]}));
          const Block=({rank,team,pts,owner})=>{
            const medals=["🥇","🥈","🥉"];
            return(
              <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
                <span style={{fontSize:28,flexShrink:0}}>{medals[rank]}</span>
                <span style={{fontSize:38,flexShrink:0}}>{FLAGS[team]}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700}}>{team}</div>
                  {owner&&<span style={{fontSize:10,background:PARTICIPANT_COLORS[owner]||"#6b7280",color:"#fff",borderRadius:3,padding:"2px 7px",fontWeight:600,display:"inline-block",marginTop:4}}>{owner}</span>}
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:26,fontWeight:700}}>{pts}</div>
                  <div style={{fontSize:9,color:C.textSub}}>pts</div>
                </div>
              </div>
            );
          };
          return(
            <div>
              <div style={{display:"grid",gap:24,gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))"}}>
                <div>
                  <h2 style={{margin:"0 0 2px",fontSize:15,fontWeight:700}}>Top 3 — Más o menos</h2>
                  <p style={{margin:"0 0 12px",fontSize:11,color:C.textSub}}>Selecciones que pueden dar sorpresas</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {tierMedioData.map((d,i)=><Block key={d.team} rank={i} {...d}/>)}
                  </div>
                  <div style={{marginTop:12,background:C.amberBg,borderRadius:8,padding:"10px 14px",border:"1px solid #fcd34d"}}>
                    <p style={{margin:0,fontSize:11,color:C.amber}}>🟡 No son candidatos al título pero pueden pasar de grupos y sorprender en eliminatorias.</p>
                  </div>
                </div>
                <div>
                  <h2 style={{margin:"0 0 2px",fontSize:15,fontWeight:700}}>Top 3 — Menos malos</h2>
                  <p style={{margin:"0 0 12px",fontSize:11,color:C.textSub}}>De los débiles, los que más pueden aguantar</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {tierBajoData.map((d,i)=><Block key={d.team} rank={i} {...d}/>)}
                  </div>
                  <div style={{marginTop:12,background:"#fef2f2",borderRadius:8,padding:"10px 14px",border:"1px solid #fca5a5"}}>
                    <p style={{margin:0,fontSize:11,color:C.red}}>🔴 Van a sufrir, pero son los más competitivos del tier bajo.</p>
                  </div>
                </div>
              </div>
              <div style={{marginTop:24,background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px 18px"}}>
                <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700}}>¿A quién le tocan?</h3>
                <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))"}}>
                  {[...TIER_MEDIO_TOP3,...TIER_BAJO_TOP3].map(team=>{
                    const owner=FIXED_ASSIGNMENTS[team];
                    const isMedio=TIER_MEDIO_TOP3.includes(team);
                    return(
                      <div key={team} style={{background:C.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:26}}>{FLAGS[team]}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{team}</div>
                          <div style={{fontSize:9,marginTop:2,display:"flex",gap:4,alignItems:"center"}}>
                            <span style={{background:isMedio?C.amberBg:"#fef2f2",color:isMedio?C.amber:C.red,borderRadius:2,padding:"1px 4px",fontWeight:600}}>{isMedio?"medio":"bajo"}</span>
                            {owner&&<span style={{background:PARTICIPANT_COLORS[owner]||"#6b7280",color:"#fff",borderRadius:2,padding:"1px 5px",fontWeight:600}}>{owner}</span>}
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
                      <span style={{fontWeight:700,fontSize:13}}>Grupo {grp}</span>
                      {hasLive&&<span style={{fontSize:9,background:C.redBg,color:C.red,borderRadius:3,padding:"1px 5px",fontWeight:600}}>EN VIVO</span>}
                      <div style={{marginLeft:"auto",display:"flex",gap:3}}>{GROUPS[grp].map(t=><span key={t} style={{fontSize:14}} title={t}>{FLAGS[t]}</span>)}</div>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead><tr style={{background:C.bg}}>
                        <th style={{padding:"5px 12px",textAlign:"left",color:C.textSub,fontWeight:500,width:16}}>#</th>
                        <th style={{padding:"5px 4px",color:C.textSub,fontWeight:500}} colSpan={3}>Selección</th>
                        <th style={{padding:"5px 4px",textAlign:"center",color:C.textSub,fontWeight:500}}>PJ</th>
                        <th style={{padding:"5px 4px",textAlign:"center",color:C.textSub,fontWeight:500}}>DIF</th>
                        <th style={{padding:"5px 12px",textAlign:"center",color:C.textMid,fontWeight:600}}>PTS</th>
                      </tr></thead>
                      <tbody>
                        {standing.map((row,i)=>(
                          <tr key={row.team} style={{borderTop:`1px solid ${C.border}`}}>
                            <td style={{padding:"5px 12px",color:i<2?C.green:C.textSub,fontWeight:600}}>{i+1}</td>
                            <td style={{padding:"5px 3px",fontSize:15}}>{FLAGS[row.team]}</td>
                            <td style={{padding:"5px 4px",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.team}</td>
                            <td style={{padding:"5px 4px"}}><OwnerTag team={row.team} small/></td>
                            <td style={{padding:"5px 4px",textAlign:"center",color:C.textSub}}>{row.pj}</td>
                            <td style={{padding:"5px 4px",textAlign:"center",color:row.dif>0?C.green:row.dif<0?C.red:C.textSub}}>{row.dif>0?"+":""}{row.dif}</td>
                            <td style={{padding:"5px 12px",textAlign:"center",fontWeight:700}}>{row.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            {["32avos","16avos","Cuartos","Semifinales","3er Lugar","Final"].map(phase=>{
              const pMs=playoffMatches.filter(m=>m.phase===phase);
              return(
                <div key={phase} style={{marginBottom:22}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:PHASE_COLORS[phase]||C.text,display:"inline-block"}}/>
                    <h2 style={{margin:0,fontSize:13,fontWeight:700}}>{phase==="Final"?"🏆 Final":phase}</h2>
                    <div style={{flex:1,height:1,background:C.border}}/>
                  </div>
                  <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))"}}>
                    {pMs.map(m=>{
                      const hOwner=FIXED_ASSIGNMENTS[m.home],aOwner=FIXED_ASSIGNMENTS[m.away];
                      return(
                        <div key={m.id} style={{background:C.card,borderRadius:8,border:`1px solid ${m.live?"#dc2626":phase==="Final"?"#92400e":C.border}`,padding:"10px 13px",display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:10,color:C.textSub,minWidth:36,flexShrink:0}}>{m.date}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3,fontSize:12}}>
                              {FLAGS[m.home]&&<span>{FLAGS[m.home]}</span>}
                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{m.home}</span>
                              {hOwner&&<span style={{fontSize:8,background:PARTICIPANT_COLORS[hOwner]||"#374151",color:"#fff",borderRadius:2,padding:"1px 4px",fontWeight:600,flexShrink:0}}>{hOwner}</span>}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12}}>
                              {FLAGS[m.away]&&<span>{FLAGS[m.away]}</span>}
                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{m.away}</span>
                              {aOwner&&<span style={{fontSize:8,background:PARTICIPANT_COLORS[aOwner]||"#374151",color:"#fff",borderRadius:2,padding:"1px 4px",fontWeight:600,flexShrink:0}}>{aOwner}</span>}
                            </div>
                          </div>
                          {m.homeScore!==null?(
                            <span style={{fontWeight:700,fontSize:14,color:m.live?"#ca8a04":C.text,background:m.live?C.amberBg:C.bg,borderRadius:5,padding:"4px 9px",border:`1px solid ${C.border}`,letterSpacing:1,flexShrink:0}}>
                              {m.homeScore}–{m.awayScore}
                            </span>
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
            <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,marginBottom:18}}>
              <h2 style={{margin:"0 0 12px",fontSize:13,fontWeight:700}}>Participantes</h2>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {FIXED_PARTICIPANTS.map(p=>{
                  const myTeams=ALL_TEAMS.filter(t=>FIXED_ASSIGNMENTS[t]===p);
                  const bg=PARTICIPANT_COLORS[p]||"#374151";
                  return(
                    <div key={p} onClick={()=>setSelectedPlayer(selectedPlayer===p?null:p)}
                      style={{background:bg,borderRadius:6,padding:"5px 10px",display:"flex",alignItems:"center",gap:6,cursor:"pointer",opacity:selectedPlayer&&selectedPlayer!==p?.45:1,outline:selectedPlayer===p?`2px solid ${C.text}`:"2px solid transparent"}}>
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
                      <div key={team} style={{background:C.card,borderRadius:8,border:`1px solid ${isHighlit?ownerColor:C.border}`,padding:"9px 12px",display:"flex",alignItems:"center",gap:9,opacity:selectedPlayer&&!isHighlit?.35:1,transition:"all .15s"}}>
                        <span style={{fontSize:24}}>{FLAGS[team]}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{team}</div>
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
