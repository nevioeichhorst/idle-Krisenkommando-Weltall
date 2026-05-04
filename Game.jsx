import { useState, useEffect, useRef, useCallback } from "react";
import { TECHS, PLANET_INFO, ORBITS, P_SIZES, EVENTS, INFO, STARS,
         CHALLENGE_POOL, KHAOS_WAVES, ACHIEVEMENTS, ACHIEVEMENTS_NORMAL,
         PLANET_FACTS, XP_PER_LEVEL, LEVEL_TITLES, XP_REWARDS,
         LB_KEY, PLAYER_KEY, SAVE_KEY, SAVE_VERSION, VERSION_KEY, MAX_SLOTS,
         MAP_ORBITS, MAP_SIZES, getDailyChallenges, getDaySeed,
         getLeaderboard, upsertLeaderboard, getPlayerName, setPlayerName,
         getSaves, writeSave, deleteSave, getLevelTitle, getXpForLevel,
         fmt, fmtPop } from "./GameData.jsx";


function SolarMap({unlocked,stations,onBack,onTap}){
  const cvs=useRef(null);
  const anim=useRef();
  const Tref=useRef(0);
  const view=useRef({zoom:0.6,panX:0,panY:0,pinchDist:null,lastX:0,lastY:0,dragging:false,moved:false});

  useEffect(()=>{
    const canvas=cvs.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const SX=W/2,SY=H/2;

    const worldPos=(id,T)=>{
      const o=MAP_ORBITS[id];if(!o)return{x:0,y:0};
      if(o.parent){
        const pp=worldPos(o.parent,T);
        return{x:pp.x+o.r*Math.cos(T*o.speed),y:pp.y+o.r*Math.sin(T*o.speed)};
      }
      return{x:o.r*Math.cos(T*o.speed),y:o.r*Math.sin(T*o.speed)};
    };
    const toScr=(wx,wy)=>{
      const v=view.current;
      return{sx:SX+wx*v.zoom+v.panX, sy:SY+wy*v.zoom+v.panY};
    };

    const draw=(ts)=>{
      const T=ts/1000; Tref.current=T;
      const v=view.current;
      ctx.fillStyle="#000814";ctx.fillRect(0,0,W,H);

      STARS.forEach(s=>{
        ctx.fillStyle="rgba(180,210,255,.2)";
        ctx.beginPath();ctx.arc(s.x*W/100,s.y*H/100,s.s*.5,0,Math.PI*2);ctx.fill();
      });

      const neb=ctx.createRadialGradient(W*.88,H*.12,0,W*.88,H*.12,60);
      neb.addColorStop(0,"rgba(255,60,10,.05)");neb.addColorStop(1,"transparent");
      ctx.fillStyle=neb;ctx.fillRect(0,0,W,H);

      const {sx:sunX,sy:sunY}=toScr(0,0);
      const sunR=Math.max(6,14*v.zoom);
      const sc=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,sunR*3.5);
      sc.addColorStop(0,"rgba(255,220,60,.3)");sc.addColorStop(1,"transparent");
      ctx.fillStyle=sc;ctx.beginPath();ctx.arc(sunX,sunY,sunR*3.5,0,Math.PI*2);ctx.fill();
      const sb=ctx.createRadialGradient(sunX-sunR*.25,sunY-sunR*.25,0,sunX,sunY,sunR);
      sb.addColorStop(0,"#fff");sb.addColorStop(.3,"#ffe060");sb.addColorStop(.7,"#ff8820");sb.addColorStop(1,"#cc4400");
      ctx.fillStyle=sb;ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fill();
      if(v.zoom>0.4){
        ctx.fillStyle="rgba(255,220,80,.8)";ctx.font=`bold ${Math.max(7,9*v.zoom)}px sans-serif`;
        ctx.textAlign="center";ctx.fillText("☀ Sonne",sunX,sunY+sunR+10);
      }

      Object.entries(MAP_ORBITS).forEach(([id,o])=>{
        if(o.parent)return;
        const isUnl=unlocked.includes(id)||id==="erde";
        const {sx:ox,sy:oy}=toScr(0,0);
        ctx.beginPath();ctx.arc(ox,oy,o.r*v.zoom,0,Math.PI*2);
        ctx.strokeStyle=isUnl?"rgba(60,120,255,.16)":"rgba(20,40,80,.05)";
        ctx.setLineDash([2,6]);ctx.lineWidth=.6;ctx.stroke();ctx.setLineDash([]);
      });

      Object.entries(MAP_ORBITS).forEach(([id,o])=>{
        const isUnl=unlocked.includes(id)||id==="erde";
        const wp=worldPos(id,T);
        const {sx,sy}=toScr(wp.x,wp.y);
        const sz=Math.max(1.5,(MAP_SIZES[id]||8)*Math.min(2,v.zoom));

        if(sx<-50||sx>W+50||sy<-50||sy>H+50) return;

        ctx.globalAlpha=isUnl?1:.12;

        if(isUnl&&sz>3){
          const gl=ctx.createRadialGradient(sx,sy,0,sx,sy,sz*3);
          gl.addColorStop(0,o.col+"28");gl.addColorStop(1,"transparent");
          ctx.fillStyle=gl;ctx.beginPath();ctx.arc(sx,sy,sz*3,0,Math.PI*2);ctx.fill();
        }

        if(id==="erde"&&isUnl){
          ctx.font=`${Math.max(8,sz*2.2)}px serif`;
          ctx.textAlign="center";ctx.textBaseline="middle";
          ctx.fillText("🌍",sx,sy);
          ctx.textBaseline="alphabetic";
        } else if(id==="saturn"&&isUnl){
          ctx.save();ctx.translate(sx,sy);ctx.scale(1,.32);
          ctx.strokeStyle="rgba(200,160,60,.45)";ctx.lineWidth=sz*.55;
          ctx.beginPath();ctx.arc(0,0,sz*1.85,0,Math.PI*2);ctx.stroke();
          ctx.lineWidth=sz*.28;ctx.strokeStyle="rgba(180,140,50,.28)";
          ctx.beginPath();ctx.arc(0,0,sz*2.3,0,Math.PI*2);ctx.stroke();
          ctx.restore();
          const pd=ctx.createRadialGradient(sx-sz*.3,sy-sz*.3,0,sx,sy,sz);
          pd.addColorStop(0,"#f5d080");pd.addColorStop(.5,"#d4902a");pd.addColorStop(1,"#6a3808");
          ctx.fillStyle=pd;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();
        } else if(id==="jupiter"&&isUnl&&sz>6){
          const jg=ctx.createRadialGradient(sx-sz*.3,sy-sz*.3,0,sx,sy,sz);
          jg.addColorStop(0,"#f5d080");jg.addColorStop(.35,"#d4902a");jg.addColorStop(1,"#6a3808");
          ctx.fillStyle=jg;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();
          ctx.save();ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.clip();
          [-.6,-.3,0,.3,.6].forEach((dy,i)=>{
            ctx.fillStyle=i%2===0?"rgba(160,90,30,.45)":"rgba(240,195,110,.3)";
            ctx.fillRect(sx-sz*2,sy+dy*sz,sz*4,sz*.18);
          });
          ctx.restore();
        } else if(id==="khaos"&&isUnl){
          const tg=ctx.createRadialGradient(sx-sz*.2,sy-sz*.2,0,sx,sy,sz);
          tg.addColorStop(0,"#ff9860");tg.addColorStop(.4,"#d05018");tg.addColorStop(1,"#3a0800");
          ctx.fillStyle=tg;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();
          const tgl=ctx.createRadialGradient(sx,sy,sz*.6,sx,sy,sz*2.5);
          tgl.addColorStop(0,"rgba(255,100,20,.2)");tgl.addColorStop(1,"transparent");
          ctx.fillStyle=tgl;ctx.beginPath();ctx.arc(sx,sy,sz*2.5,0,Math.PI*2);ctx.fill();
        } else {
          const pd=ctx.createRadialGradient(sx-sz*.3,sy-sz*.3,0,sx,sy,sz);
          pd.addColorStop(0,o.col+"ff");pd.addColorStop(.6,o.col+"bb");pd.addColorStop(1,o.col+"44");
          ctx.fillStyle=pd;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();

          const shd=ctx.createRadialGradient(sx+sz*.4,sy+sz*.1,0,sx+sz*.3,sy,sz);
          shd.addColorStop(0,"transparent");shd.addColorStop(.65,"transparent");shd.addColorStop(1,"rgba(0,0,5,.55)");
          ctx.fillStyle=shd;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();
        }

        if(isUnl&&stations[id]>0){
          ctx.strokeStyle=o.col+"80";ctx.lineWidth=1;
          ctx.beginPath();ctx.arc(sx,sy,sz+4,0,Math.PI*2);ctx.stroke();
        }

        ctx.globalAlpha=1;

        if(isUnl&&sz>3.5&&v.zoom>0.3){
          ctx.fillStyle=o.col+"ee";
          const fs=Math.max(7,Math.min(10,sz*.85));
          ctx.font=`bold ${fs}px sans-serif`;ctx.textAlign="center";
          ctx.fillText(PLANET_INFO[id]?.name||id,sx,sy+sz+9);
        } else if(!isUnl&&sz>5){
          ctx.fillStyle="rgba(50,70,100,.5)";ctx.font="8px sans-serif";
          ctx.textAlign="center";ctx.fillText("🔒",sx,sy+sz+9);
        }
      });

      ctx.textAlign="left";ctx.textBaseline="alphabetic";

      ctx.fillStyle="rgba(50,90,150,.45)";ctx.font="9px sans-serif";ctx.textAlign="center";
      ctx.fillText("🤏 Pinch: Zoom  ·  Ziehen: Bewegen  ·  Tippen: Planet auswählen",W/2,H-5);
      anim.current=requestAnimationFrame(draw);
    };
    anim.current=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(anim.current);
  },[unlocked,stations]);

  const onTS=(e)=>{
    const v=view.current;
    if(e.touches.length===2){
      v.pinchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      v.dragging=false;
    } else {
      v.lastX=e.touches[0].clientX;v.lastY=e.touches[0].clientY;
      v.dragging=true;v.moved=false;v.pinchDist=null;
    }
  };
  const onTM=(e)=>{
    e.preventDefault();
    const v=view.current;
    if(e.touches.length===2&&v.pinchDist!==null){
      const nd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      v.zoom=Math.min(10,Math.max(0.12,v.zoom*(nd/v.pinchDist)));
      v.pinchDist=nd;v.moved=true;
    } else if(v.dragging&&e.touches.length===1){
      const dx=e.touches[0].clientX-v.lastX,dy=e.touches[0].clientY-v.lastY;
      v.panX+=dx;v.panY+=dy;
      v.lastX=e.touches[0].clientX;v.lastY=e.touches[0].clientY;
      if(Math.abs(dx)+Math.abs(dy)>3) v.moved=true;
    }
  };
  const onTE=(e)=>{
    const v=view.current;
    if(v.moved){v.moved=false;v.dragging=false;return;}
    handleTap(e);
  };
  const onWheel=(e)=>{e.preventDefault();const v=view.current;v.zoom=Math.min(10,Math.max(0.12,v.zoom*(e.deltaY>0?.85:1.18)));};
  const onMD=(e)=>{const v=view.current;v.dragging=true;v.moved=false;v.lastX=e.clientX;v.lastY=e.clientY;};
  const onMM=(e)=>{const v=view.current;if(!v.dragging)return;v.panX+=e.movementX;v.panY+=e.movementY;if(Math.abs(e.movementX)+Math.abs(e.movementY)>1)v.moved=true;};
  const onMU=(e)=>{const v=view.current;if(!v.moved)handleTap(e);v.dragging=false;v.moved=false;};

  const handleTap=(e)=>{
    const rect=cvs.current.getBoundingClientRect();
    const scX=cvs.current.width/rect.width,scY=cvs.current.height/rect.height;
    const src=e.changedTouches?e.changedTouches[0]:e;
    const mx=(src.clientX-rect.left)*scX,my=(src.clientY-rect.top)*scY;
    const W=cvs.current.width,H=cvs.current.height,SX=W/2,SY=H/2;
    const v=view.current;const T=Tref.current;
    for(const [id,o] of Object.entries(MAP_ORBITS)){
      if(!unlocked.includes(id)&&id!=="erde")continue;
      let wx=0,wy=0;
      if(o.parent){
        const po=MAP_ORBITS[o.parent];
        wx=po.r*Math.cos(T*po.speed)+o.r*Math.cos(T*o.speed);
        wy=po.r*Math.sin(T*po.speed)+o.r*Math.sin(T*o.speed);
      } else {
        wx=o.r*Math.cos(T*o.speed);wy=o.r*Math.sin(T*o.speed);
      }
      const sx=SX+wx*v.zoom+v.panX,sy=SY+wy*v.zoom+v.panY;
      const sz=Math.max(3,(MAP_SIZES[id]||8)*Math.min(2,v.zoom));
      if(Math.hypot(mx-sx,my-sy)<sz+18){onTap(id);break;}
    }
  };

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#000814"}}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(0,60,150,.3)",display:"flex",alignItems:"center",gap:12,background:"rgba(0,6,20,.97)",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(0,20,50,.7)",border:"1px solid rgba(0,80,180,.4)",borderRadius:10,color:"#4080c0",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
        <span style={{color:"#4090e0",fontSize:15,fontWeight:"bold"}}>☀️ Sonnensystem</span>
        <button onClick={()=>{view.current.zoom=0.6;view.current.panX=0;view.current.panY=0;}} style={{marginLeft:"auto",background:"rgba(0,20,50,.7)",border:"1px solid rgba(0,80,180,.3)",borderRadius:8,color:"#4080c0",fontSize:11,padding:"6px 12px",cursor:"pointer"}}>⌂ Reset</button>
      </div>
      <canvas ref={cvs} width={420} height={520}
        style={{width:"100%",flex:1,touchAction:"none",cursor:"grab"}}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onWheel={onWheel}/>
    </div>
  );
}

function TechSheet({tech,countRef,credits,mult,discount,onBuy,onClose}){
  const [localCount,setLocalCount]=useState(countRef.current);
  const [floaties,setFloaties]=useState([]);
  const fid=useRef(0);

  useEffect(()=>{ setLocalCount(countRef.current); },[countRef.current]);

  const rawCost=Math.floor(tech.baseCost*Math.pow(1.15,localCount));
  const cost=Math.max(1,Math.floor(rawCost*(1-(discount||0))));
  const isOnce=tech.type==="multiplier"||tech.type==="unlock";
  const done=localCount>0&&isOnce;
  const can=credits>=cost&&!done;
  const typeColor=tech.type==="random"?"#ffa030":tech.type==="multiplier"?"#b030f0":tech.type==="unlock"?"#30e080":"#2880c0";
  const typeName=tech.type==="random"?"🎲 ZUFALL":tech.type==="multiplier"?"✨ MULTIPLIKATOR":tech.type==="unlock"?"🔓 FREISCHALTEN":"📈 DAUERHAFT";

  const handleBuy=()=>{
    if(!can)return;
    const result=onBuy();
    if(isOnce){onClose();return;}
    setLocalCount(c=>c+1);
    const id=++fid.current;
    let label, col;
    if(result&&result.amount!=null){
      label=result.good?`🎉 +${fmt(result.amount)} ${result.sci?"Wiss.":"Kr."}`:`+${fmt(result.amount)} ${result.sci?"Wiss.":"Kr."}`;
      col=result.good?"#40ff80":"#90c8f0";
    } else {
      label=`✅ Stufe ${localCount+1}`;
      col="#70b0ff";
    }
    setFloaties(f=>[...f,{id,label,col}]);
    setTimeout(()=>setFloaties(f=>f.filter(x=>x.id!==id)),1800);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"linear-gradient(180deg,#001020,#000810)",border:"1px solid rgba(40,100,200,.4)",borderRadius:"22px 22px 0 0",padding:"24px 20px 44px",maxWidth:500,width:"100%",boxShadow:"0 -8px 30px rgba(0,0,0,.6)",position:"relative",overflow:"visible"}}>
        {/* In-sheet floaties */}
        <div style={{position:"absolute",top:-10,left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",pointerEvents:"none",gap:4,zIndex:20}}>
          {floaties.map(f=>(<div key={f.id} style={{fontSize:17,fontWeight:"bold",color:f.col,animation:"sheetFloat 1.8s ease forwards",background:"rgba(0,10,30,.9)",borderRadius:10,padding:"5px 14px",border:`1px solid ${f.col}66`}}>{f.label}</div>))}
        </div>
        <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <span style={{fontSize:40}}>{tech.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:"bold",color:"#90c8f0"}}>{tech.name}</div>
            <div style={{fontSize:10,color:typeColor,letterSpacing:1,marginTop:3}}>{typeName}</div>
          </div>
          {localCount>0&&!isOnce&&<div style={{background:"rgba(0,60,120,.5)",borderRadius:10,padding:"4px 12px",fontSize:13,color:"#4080c0",fontWeight:"bold"}}>Stufe {localCount}</div>}
        </div>
        <div style={{fontSize:13,color:"#506080",lineHeight:1.65,marginBottom:14}}>{tech.desc}</div>
        <div style={{background:"rgba(0,20,50,.6)",borderRadius:14,padding:"12px",marginBottom:14}}>
          <div style={{fontSize:10,color:"#6080a0",marginBottom:8,letterSpacing:1}}>EFFEKTE</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {tech.type==="random"&&<span style={{fontSize:12,background:"rgba(200,100,0,.2)",borderRadius:8,padding:"4px 12px",color:"#c08030"}}>{tech.bonus}</span>}
            {(tech.cr||0)>0&&<span style={{fontSize:12,background:"rgba(0,120,50,.2)",borderRadius:8,padding:"4px 12px",color:"#30c060"}}>+{fmt((tech.cr||0)*mult)}/s</span>}
            {(tech.def||0)>0&&<span style={{fontSize:12,background:"rgba(0,120,90,.2)",borderRadius:8,padding:"4px 12px",color:"#30c090"}}>+{tech.def} Verteidigung</span>}
            {(tech.en||0)>0&&<span style={{fontSize:12,background:"rgba(180,90,0,.2)",borderRadius:8,padding:"4px 12px",color:"#d09020"}}>+{tech.en} Energie</span>}
            {tech.type==="multiplier"&&<span style={{fontSize:12,background:"rgba(150,0,230,.2)",borderRadius:8,padding:"4px 12px",color:"#c020f0"}}>×{tech.mult} auf alles</span>}
            {tech.type==="unlock"&&<span style={{fontSize:12,background:"rgba(0,180,70,.2)",borderRadius:8,padding:"4px 12px",color:"#20e070"}}>{tech.bonus}</span>}
          </div>
        </div>
        {!done&&(
          <div style={{background:"rgba(0,20,50,.6)",borderRadius:14,padding:"12px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:"#6080a0",marginBottom:4}}>KOSTEN JETZT</div>
              <div style={{fontSize:22,fontWeight:"bold",color:can?"#28aa50":"#c03020"}}>💰 {fmt(cost)} Kr.</div>
              {discount>0&&<div style={{fontSize:9,color:"#30c080",marginTop:2}}>🔬 −{Math.round(discount*100)}% Wiss.-Rabatt</div>}
            </div>
            {!isOnce&&localCount>0&&(
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:"#6080a0",marginBottom:4}}>NÄCHSTE STUFE</div>
                <div style={{fontSize:14,color:"#4060a0"}}>-> {fmt(Math.floor(tech.baseCost*Math.pow(1.15,localCount+1)))}</div>
              </div>
            )}
          </div>
        )}
        <div style={{display:"flex",gap:12}}>
          <button onClick={onClose} style={{flex:1,padding:"18px",borderRadius:16,background:"rgba(10,10,20,.8)",border:"1px solid rgba(40,60,100,.4)",color:"#404060",fontSize:15,cursor:"pointer",fontWeight:"bold"}}>Zurück</button>
          {done
            ?<div style={{flex:2,padding:"18px",textAlign:"center",color:"#28a848",fontSize:15,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center"}}>✓ Bereits aktiv</div>
            :<button onClick={handleBuy} disabled={!can} style={{flex:2,padding:"18px",borderRadius:16,background:can?"linear-gradient(135deg,#0a3060,#1a50a0)":"rgba(10,10,10,.5)",border:`1px solid ${can?"rgba(40,120,255,.5)":"rgba(30,30,30,.3)"}`,color:can?"#70b0ff":"#404040",fontSize:15,cursor:can?"pointer":"default",fontWeight:"bold"}}>
              {can?"💰 Kaufen":"Zu wenig Kredite"}
            </button>
          }
        </div>
      </div>
    </div>
  );
}

function EventPopup({event,credits,onAccept,onDecline}){
  const can=credits>=event.cost;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onDecline();}}>
      <div style={{background:"linear-gradient(180deg,#001428,#000c1e)",border:"1px solid rgba(200,130,0,.45)",borderRadius:"22px 22px 0 0",padding:"24px 20px 44px",maxWidth:500,width:"100%",boxShadow:"0 -8px 30px rgba(0,0,0,.6)"}}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{fontSize:44,textAlign:"center",marginBottom:10}}>{event.emoji}</div>
        <div style={{fontSize:20,fontWeight:"bold",color:"#ffa030",textAlign:"center",marginBottom:8}}>{event.title}</div>
        <div style={{fontSize:13,color:"#5070a0",textAlign:"center",lineHeight:1.6,marginBottom:14}}>{event.desc}</div>
        <div style={{background:"rgba(0,20,40,.7)",borderRadius:14,padding:"14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:11,color:"#6080a0"}}>INVESTITION</span>
            <span style={{fontSize:16,color:can?"#ff8020":"#c03020",fontWeight:"bold"}}>💰 {fmt(event.cost)} Kr.</span>
          </div>
          <div style={{fontSize:11,color:"#30c060",paddingTop:6,borderTop:"1px solid rgba(255,255,255,.06)"}}>
            {event.returnCr>0&&`+${fmt(event.returnCr)} Kr.`}{event.returnSci>0&&` + ${fmt(event.returnSci)} Wiss.`} über {event.secs}s
          </div>
          <div style={{fontSize:10,color:"#6080a0",marginTop:3}}>Ertrag kommt schrittweise zurück ✓</div>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={onDecline} style={{flex:1,padding:"18px",borderRadius:16,background:"rgba(20,8,8,.8)",border:"1px solid rgba(80,30,30,.5)",color:"#703030",fontSize:15,cursor:"pointer",fontWeight:"bold"}}>✕ Nein</button>
          <button onClick={can?onAccept:undefined} disabled={!can} style={{flex:2,padding:"18px",borderRadius:16,background:can?"linear-gradient(135deg,#0a3a18,#1a6030)":"rgba(10,10,10,.5)",border:`1px solid ${can?"rgba(0,180,60,.5)":"rgba(30,30,30,.3)"}`,color:can?"#30d060":"#303030",fontSize:15,cursor:can?"pointer":"default",fontWeight:"bold"}}>
            {can?"✓ Investieren":"Zu wenig Kredite"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DefAlert({event,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,0,0,.85)",zIndex:1800,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"linear-gradient(160deg,#200000,#300808)",border:"2px solid #ff3030",borderRadius:20,padding:"28px 24px",maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 0 40px #ff303060"}}>
        <div style={{fontSize:52,marginBottom:10}}>{event.emoji}</div>
        <div style={{fontSize:18,fontWeight:"bold",color:"#ff4040",marginBottom:10}}>{event.title}</div>
        <div style={{fontSize:13,color:"#a05050",lineHeight:1.6,marginBottom:20}}>{event.msg}</div>
        <div style={{background:"rgba(255,30,30,.12)",borderRadius:12,padding:"12px",marginBottom:20}}>
          <div style={{fontSize:22,color:"#ff5050",fontWeight:"bold"}}>−{fmt(event.defDrop)} Verteidigung</div>
        </div>
        <button onClick={onClose} style={{padding:"16px",background:"linear-gradient(135deg,#3a0808,#600010)",border:"2px solid rgba(255,60,60,.4)",borderRadius:14,color:"#ff6060",fontSize:15,fontWeight:"bold",cursor:"pointer",width:"100%"}}>Verstanden!</button>
      </div>
    </div>
  );
}

function ResultOverlay({result,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,2600);return()=>clearTimeout(t);},[onClose]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1800,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:result.good?"rgba(0,28,10,.97)":"rgba(20,10,0,.97)",border:`3px solid ${result.good?"#40ff80":"#ff8020"}`,borderRadius:28,padding:"36px 44px",textAlign:"center",boxShadow:`0 0 60px ${result.good?"#40ff8055":"#ff802055"}`}}>
        <div style={{fontSize:52,marginBottom:12}}>{result.good?"🎉":"😐"}</div>
        <div style={{fontSize:24,fontWeight:"bold",color:result.good?"#40ff80":"#ff8040",marginBottom:8}}>{result.good?"DURCHBRUCH!":"Mäßig"}</div>
        <div style={{fontSize:30,color:result.good?"#80ffb0":"#ffb080",fontWeight:"bold"}}>+{fmt(result.amount)}</div>
        <div style={{fontSize:13,color:"#406050",marginTop:6}}>{result.sci?"Wissenschaft":"Kredite"}</div>
      </div>
    </div>
  );
}

function PlanetMini({id,size=56,animated=true}){
  const cvs=useRef(null);
  const anim=useRef();
  useEffect(()=>{
    const canvas=cvs.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const S=size*2; // retina
    canvas.width=S;canvas.height=S;
    const cx=S/2,cy=S/2,sz=S*.42;
    let frame=0;

    const draw=(ts)=>{
      const T=ts/1000;
      ctx.clearRect(0,0,S,S);

      const drawPlanet=()=>{
        if(id==="erde"){

          ctx.font=`${sz*1.8}px serif`;
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.fillText("🌍",cx,cy+sz*.05);

          const atm=ctx.createRadialGradient(cx,cy,sz*.85,cx,cy,sz*1.2);
          atm.addColorStop(0,"rgba(80,170,255,.18)");atm.addColorStop(1,"transparent");
          ctx.fillStyle=atm;ctx.beginPath();ctx.arc(cx,cy,sz*1.2,0,Math.PI*2);ctx.fill();
        }
        else if(id==="mond"){
          const mg=ctx.createRadialGradient(cx-sz*.35,cy-sz*.4,0,cx,cy,sz);
          mg.addColorStop(0,"#e8e8f0");mg.addColorStop(.35,"#b8b8c4");mg.addColorStop(.7,"#888896");mg.addColorStop(1,"#444450");
          ctx.fillStyle=mg;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
          ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();

          [[-.15,-.25,sz*.32,sz*.22,.1],[.25,.1,sz*.28,sz*.18,-.2],[-.3,.3,sz*.2,sz*.15,.3]].forEach(([dx,dy,rw,rh,rot])=>{
            ctx.fillStyle="rgba(60,60,75,.5)";ctx.beginPath();ctx.ellipse(cx+dx*sz,cy+dy*sz,rw,rh,rot,0,Math.PI*2);ctx.fill();
          });

          [[-.3,-.2,.24],[.2,.3,.2],[-.1,.4,.15],[.4,-.3,.18],[.05,-.1,.12]].forEach(([dx,dy,r])=>{
            const cr=ctx.createRadialGradient(cx+dx*sz+r*sz*.2,cy+dy*sz-r*sz*.2,0,cx+dx*sz,cy+dy*sz,r*sz);
            cr.addColorStop(0,"rgba(200,200,210,.25)");cr.addColorStop(.8,"rgba(50,50,65,.3)");cr.addColorStop(1,"transparent");
            ctx.fillStyle=cr;ctx.beginPath();ctx.arc(cx+dx*sz,cy+dy*sz,r*sz,0,Math.PI*2);ctx.fill();
          });
          ctx.restore();

          const shd=ctx.createRadialGradient(cx+sz*.6,cy,sz*.2,cx+sz*.5,cy,sz);
          shd.addColorStop(0,"transparent");shd.addColorStop(.65,"transparent");shd.addColorStop(1,"rgba(0,0,8,.7)");
          ctx.fillStyle=shd;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
        }
        else if(id==="mars"){
          const mr=ctx.createRadialGradient(cx-sz*.3,cy-sz*.35,0,cx,cy,sz);
          mr.addColorStop(0,"#c8704a");mr.addColorStop(.3,"#a84e2c");mr.addColorStop(.7,"#8a3818");mr.addColorStop(1,"#5a2008");
          ctx.fillStyle=mr;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
          ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();

          [[-.2,-.15,sz*.38,sz*.2,.1],[.3,.1,sz*.28,sz*.18,-.15]].forEach(([dx,dy,rw,rh,rot])=>{
            ctx.fillStyle="rgba(190,130,80,.45)";ctx.beginPath();ctx.ellipse(cx+dx*sz,cy+dy*sz,rw,rh,rot,0,Math.PI*2);ctx.fill();
          });

          ctx.strokeStyle="rgba(70,25,8,.7)";ctx.lineWidth=sz*.08;ctx.lineCap="round";
          ctx.beginPath();ctx.moveTo(cx-sz*.4,cy+sz*.1);ctx.bezierCurveTo(cx-sz*.1,cy+sz*.05,cx+sz*.1,cy+sz*.08,cx+sz*.42,cy+sz*.12);ctx.stroke();

          const vm=ctx.createRadialGradient(cx-sz*.25,cy-sz*.2,0,cx-sz*.25,cy-sz*.2,sz*.22);
          vm.addColorStop(0,"rgba(210,160,100,.65)");vm.addColorStop(1,"transparent");
          ctx.fillStyle=vm;ctx.beginPath();ctx.arc(cx-sz*.25,cy-sz*.2,sz*.22,0,Math.PI*2);ctx.fill();

          const ni=ctx.createRadialGradient(cx,cy-sz*.82,0,cx,cy-sz*.82,sz*.38);
          ni.addColorStop(0,"rgba(240,245,255,.85)");ni.addColorStop(.5,"rgba(210,225,240,.5)");ni.addColorStop(1,"transparent");
          ctx.fillStyle=ni;ctx.fillRect(cx-S,cy-S,S*2,sz*.38);

          ctx.fillStyle=`rgba(200,150,90,${0.1+0.05*Math.sin(T*.3)})`;
          ctx.beginPath();ctx.ellipse(cx+sz*.1,cy+sz*.35,sz*.45,sz*.08,.15,0,Math.PI*2);ctx.fill();
          ctx.restore();

          const atm=ctx.createRadialGradient(cx,cy,sz*.9,cx,cy,sz*1.1);
          atm.addColorStop(0,"rgba(200,100,50,.06)");atm.addColorStop(1,"transparent");
          ctx.fillStyle=atm;ctx.beginPath();ctx.arc(cx,cy,sz*1.1,0,Math.PI*2);ctx.fill();

          const shd=ctx.createRadialGradient(cx+sz*.55,cy+sz*.1,0,cx+sz*.4,cy,sz);
          shd.addColorStop(0,"transparent");shd.addColorStop(.6,"transparent");shd.addColorStop(1,"rgba(0,0,5,.65)");
          ctx.fillStyle=shd;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
        }
        else if(id==="asteroid"){
          ctx.save();ctx.translate(cx,cy);ctx.rotate(T*.08);
          const ag=ctx.createRadialGradient(-sz*.15,-sz*.2,0,0,0,sz);
          ag.addColorStop(0,"#c8b878");ag.addColorStop(.4,"#988848");ag.addColorStop(.8,"#685820");ag.addColorStop(1,"#382e08");
          ctx.fillStyle=ag;
          ctx.beginPath();
          for(let i=0;i<12;i++){
            const a=i/12*Math.PI*2;
            const r2=sz*(0.65+0.22*Math.sin(i*2.1)+0.13*Math.sin(i*3.7));
            i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
          }
          ctx.closePath();ctx.fill();
          ctx.strokeStyle="rgba(50,38,10,.45)";ctx.lineWidth=.8;
          [[-.2,-.1,.18],[.2,.2,.14],[-.15,.3,.1]].forEach(([dx,dy,r])=>{
            ctx.beginPath();ctx.arc(dx*sz,dy*sz,r*sz,0,Math.PI*2);ctx.stroke();
          });
          const sp=ctx.createRadialGradient(-sz*.2,-sz*.25,0,-sz*.2,-sz*.25,sz*.35);
          sp.addColorStop(0,"rgba(255,240,180,.22)");sp.addColorStop(1,"transparent");
          ctx.fillStyle=sp;ctx.beginPath();ctx.arc(0,0,sz,0,Math.PI*2);ctx.fill();
          ctx.restore();
        }
        else if(id==="jupiter"){
          const jg=ctx.createRadialGradient(cx-sz*.3,cy-sz*.35,0,cx,cy,sz);
          jg.addColorStop(0,"#f5d080");jg.addColorStop(.35,"#d4902a");jg.addColorStop(.7,"#a86018");jg.addColorStop(1,"#6a3808");
          ctx.fillStyle=jg;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
          ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();

          const bands=[[-sz*.82,sz*.14,"rgba(200,130,60,.4)"],[-.68,sz*.13,"rgba(245,210,140,.35)"],[-.55,sz*.12,"rgba(160,90,30,.45)"],[-.43,sz*.12,"rgba(240,195,110,.3)"],[-.31,sz*.13,"rgba(180,110,40,.4)"],[-.18,sz*.12,"rgba(250,215,140,.3)"],[-.06,sz*.13,"rgba(155,85,25,.45)"],];
          bands.forEach(([dy,h,col])=>{ctx.fillStyle=col;ctx.fillRect(cx-S,cy+(typeof dy==="number"&&dy>-1?dy:dy),S*2,h);});
          [[-sz*.82,sz*.14,"rgba(200,130,60,.4)"],[-sz*.68,sz*.13,"rgba(245,210,140,.35)"],[-sz*.55,sz*.12,"rgba(160,90,30,.45)"],[-sz*.43,sz*.12,"rgba(240,195,110,.3)"],[-sz*.31,sz*.13,"rgba(180,110,40,.4)"],[-sz*.18,sz*.12,"rgba(250,215,140,.3)"],[-sz*.06,sz*.13,"rgba(155,85,25,.45)"],[sz*.07,sz*.12,"rgba(235,185,100,.35)"],[sz*.19,sz*.12,"rgba(175,105,35,.4)"],[sz*.31,sz*.11,"rgba(245,205,120,.3)"],[sz*.42,sz*.13,"rgba(165,95,28,.4)"],[sz*.55,sz*.12,"rgba(235,180,95,.3)"],[sz*.67,sz*.14,"rgba(160,88,22,.4)"]].forEach(([dy,h,col])=>{ctx.fillStyle=col;ctx.fillRect(cx-S,cy+dy,S*2,h);});

          const rsx=cx-sz*.15,rsy=cy+sz*.12;
          const rs=ctx.createRadialGradient(rsx,rsy,0,rsx,rsy,sz*.28);
          rs.addColorStop(0,"rgba(160,40,15,.85)");rs.addColorStop(.3,"rgba(200,60,20,.7)");rs.addColorStop(.6,"rgba(220,100,40,.5)");rs.addColorStop(1,"transparent");
          ctx.fillStyle=rs;ctx.beginPath();ctx.ellipse(rsx,rsy,sz*.28,sz*.16,T*.006,0,Math.PI*2);ctx.fill();
          ctx.restore();

          const ld=ctx.createRadialGradient(cx,cy,sz*.55,cx,cy,sz);
          ld.addColorStop(0,"transparent");ld.addColorStop(.7,"transparent");ld.addColorStop(1,"rgba(0,0,5,.5)");
          ctx.fillStyle=ld;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
        }
        else if(id==="khaos"){
          const chaos=Math.sin(T*.25)*.15;
          const tg=ctx.createRadialGradient(cx-sz*.2,cy-sz*.25,0,cx,cy,sz);
          tg.addColorStop(0,"#ff9860");tg.addColorStop(.25,"#d05018");tg.addColorStop(.6,"#901808");tg.addColorStop(1,"#3a0800");
          ctx.fillStyle=tg;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
          ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
          [[-.3,.2,sz*.4,sz*.08,.1],[.15,-.3,sz*.35,sz*.06,-.15],[-.1,.45,sz*.3,sz*.07,.2],[.4,.1,sz*.25,sz*.05,-.1]].forEach(([dx,dy,rw,rh,rot],i)=>{
            ctx.fillStyle=`rgba(255,${150+Math.sin(T*.4+i)*30},0,${0.3+0.15*Math.sin(T*.5+i)})`;
            ctx.beginPath();ctx.ellipse(cx+dx*sz+chaos*8,cy+dy*sz,rw,rh,rot+chaos*.3,0,Math.PI*2);ctx.fill();
          });
          for(let i=0;i<4;i++){
            const a=i/4*Math.PI*2+T*.04;
            ctx.strokeStyle=`rgba(255,200,50,${0.12+0.08*Math.sin(T*.6+i*1.3)})`;ctx.lineWidth=sz*.04;
            ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*sz*.9,cy+Math.sin(a)*sz*.9);ctx.stroke();
          }
          ctx.restore();
          const tglow=ctx.createRadialGradient(cx,cy,sz*.7,cx,cy,sz*1.8);
          tglow.addColorStop(0,`rgba(255,100,20,${0.22+chaos*.08})`);tglow.addColorStop(1,"transparent");
          ctx.fillStyle=tglow;ctx.beginPath();ctx.arc(cx,cy,sz*1.8,0,Math.PI*2);ctx.fill();
        }
        else if(id==="eigene_welt"){

          const T2=Date.now()/3000;
          const eg=ctx.createRadialGradient(cx-sz*.2,cy-sz*.25,0,cx,cy,sz);
          eg.addColorStop(0,"#e080ff");eg.addColorStop(.3,"#8020c0");eg.addColorStop(.7,"#400080");eg.addColorStop(1,"#100020");
          ctx.fillStyle=eg;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
          ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();

          for(let i=0;i<5;i++){
            const a=i/5*Math.PI*2+T2;
            const pulse=0.15+0.08*Math.sin(T2*2+i);
            ctx.strokeStyle=`rgba(220,120,255,${pulse})`;ctx.lineWidth=sz*.06;
            ctx.beginPath();ctx.moveTo(cx,cy);
            ctx.lineTo(cx+Math.cos(a)*sz*.9,cy+Math.sin(a)*sz*.9);ctx.stroke();
          }

          const core=ctx.createRadialGradient(cx,cy,0,cx,cy,sz*.35);
          core.addColorStop(0,"rgba(255,200,255,.6)");core.addColorStop(1,"transparent");
          ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,sz*.35,0,Math.PI*2);ctx.fill();
          ctx.restore();

          const glow=ctx.createRadialGradient(cx,cy,sz*.8,cx,cy,sz*2);
          glow.addColorStop(0,"rgba(180,0,255,.25)");glow.addColorStop(1,"transparent");
          ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,sz*2,0,Math.PI*2);ctx.fill();
        }
        else {

          const info=PLANET_INFO[id];
          const col=info?.color||"#607080";
          const pd=ctx.createRadialGradient(cx-sz*.3,cy-sz*.35,0,cx,cy,sz);
          pd.addColorStop(0,col+"ff");pd.addColorStop(.5,col+"cc");pd.addColorStop(1,col+"44");
          ctx.fillStyle=pd;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();

          if(id==="venus"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            [[-.2,-.1,sz*.5,sz*.1],[.1,.2,sz*.45,sz*.09],[-.1,.35,sz*.4,sz*.08]].forEach(([dx,dy,rw,rh])=>{
              ctx.fillStyle="rgba(255,200,80,.3)";ctx.beginPath();ctx.ellipse(cx+dx*sz,cy+dy*sz,rw,rh,0,0,Math.PI*2);ctx.fill();
            });
            ctx.restore();
          } else if(id==="io"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            [[-.2,.1,.15],[.3,-.2,.12],[0,.35,.1]].forEach(([dx,dy,r])=>{
              ctx.fillStyle="rgba(255,80,0,.5)";ctx.beginPath();ctx.arc(cx+dx*sz,cy+dy*sz,r*sz,0,Math.PI*2);ctx.fill();
            });
            ctx.restore();
          } else if(id==="europa"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            ctx.strokeStyle="rgba(100,160,220,.5)";ctx.lineWidth=sz*.06;
            [[-0.3,-.1,.4,.6],[.1,-.3,.6,.2],[-.1,.2,.5,-.1]].forEach(([x1,y1,x2,y2])=>{
              ctx.beginPath();ctx.moveTo(cx+x1*sz,cy+y1*sz);ctx.lineTo(cx+x2*sz,cy+y2*sz);ctx.stroke();
            });
            ctx.restore();
          } else if(id==="titan"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            ctx.fillStyle="rgba(200,120,20,.4)";ctx.beginPath();ctx.arc(cx,cy,sz*.9,0,Math.PI*2);ctx.fill();
            ctx.restore();
          } else if(id==="enceladus"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            ctx.fillStyle="rgba(200,230,255,.5)";ctx.beginPath();ctx.arc(cx,cy,sz*.85,0,Math.PI*2);ctx.fill();
            ctx.restore();

            ctx.strokeStyle="rgba(180,220,255,.6)";ctx.lineWidth=sz*.05;
            ctx.beginPath();ctx.moveTo(cx,cy-sz);ctx.lineTo(cx,cy-sz*1.6);ctx.stroke();
          } else if(id==="uranus"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            [-.2,.1,.35].forEach((dy,i)=>{
              ctx.fillStyle=i%2===0?"rgba(80,200,200,.3)":"rgba(60,160,180,.2)";
              ctx.fillRect(cx-sz,cy+dy*sz,sz*2,sz*.2);
            });
            ctx.restore();
          } else if(id==="neptun"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            ctx.fillStyle="rgba(40,80,200,.35)";ctx.beginPath();ctx.ellipse(cx+sz*.2,cy+sz*.1,sz*.3,sz*.2,0,0,Math.PI*2);ctx.fill();
            ctx.restore();
          } else if(id==="triton"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            ctx.fillStyle="rgba(220,180,200,.4)";ctx.beginPath();ctx.ellipse(cx,cy-sz*.3,sz*.6,sz*.3,0,0,Math.PI*2);ctx.fill();
            ctx.restore();
          } else if(id==="ganymed"){

            ctx.save();ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.clip();
            ctx.fillStyle="rgba(100,120,140,.4)";ctx.beginPath();ctx.ellipse(cx-.2*sz,cy+.1*sz,sz*.4,sz*.35,.3,0,Math.PI*2);ctx.fill();
            ctx.restore();
          }

          const shd=ctx.createRadialGradient(cx+sz*.45,cy+sz*.1,0,cx+sz*.3,cy,sz);
          shd.addColorStop(0,"transparent");shd.addColorStop(.6,"transparent");shd.addColorStop(1,"rgba(0,0,5,.6)");
          ctx.fillStyle=shd;ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.fill();
        }
      };

      drawPlanet();
      if(animated) anim.current=requestAnimationFrame(draw);
    };

    if(animated) anim.current=requestAnimationFrame(draw);
    else draw(0);
    return()=>{if(anim.current)cancelAnimationFrame(anim.current);};
  },[id,size,animated]);

  return(
    <canvas ref={cvs} width={size*2} height={size*2}
      style={{width:size,height:size,borderRadius:"50%",flexShrink:0,
        boxShadow: animated?`0 0 12px ${PLANET_INFO[id]?.color}60`:"none"}}/>
  );
}

const XP_PER_LEVEL = (lvl) => Math.floor(100 * Math.pow(1.4, lvl - 1));

const LEVEL_TITLES = [
  "Neuling","Entdecker","Pionier","Forscher","Ingenieur",
  "Raumfahrer","Mondfahrer","Mars-Kolonist","Asteroiden-Jäger",
  "Jupiter-Kommandant","Saturn-Admiral","Uranus-Forscher",
  "Neptun-Bezwinger","Khaos-Jäger","Galaxis-Retter",
  "Sternen-König","Dimensionsreisender","Universumsherrscher",
  "Welterschaffer","Schöpfer aller Welten"
];

function getLevelTitle(lvl){
  return LEVEL_TITLES[Math.min(lvl-1, LEVEL_TITLES.length-1)] || "Unsterblicher";
}

function getXpForLevel(lvl){
  return XP_PER_LEVEL(lvl);
}

const XP_REWARDS = {
  click:        0.1,
  tech:         15,
  unlock:       100,
  event:        20,
  spin:         10,
  achievement:  50,
  dailyDone:    30,
  khaosDefeat:  80,
  earnMillion:  5,   // per million earned
};

const LB_KEY = "krisenkommando_leaderboard";

function getLeaderboard(){
  try{ return JSON.parse(localStorage.getItem(LB_KEY)||"[]"); }
  catch{ return []; }
}

function upsertLeaderboard(entry){
  const lb = getLeaderboard();
  const idx = lb.findIndex(e=>e.playerId===entry.playerId);
  if(idx>=0) lb[idx]={...lb[idx],...entry,updatedAt:Date.now()};
  else lb.push({...entry,updatedAt:Date.now()});
  lb.sort((a,b)=>b.level-a.level||b.xp-a.xp);
  localStorage.setItem(LB_KEY, JSON.stringify(lb.slice(0,100)));
}

const PLAYER_KEY = "krisenkommando_player";
function getPlayerName(){ return localStorage.getItem(PLAYER_KEY)||""; }
function setPlayerName(n){ localStorage.setItem(PLAYER_KEY,n); }

// ─── SAVE VERSION – change to wipe all saves on next load ───
const SAVE_VERSION = "v1.0-launch";
const VERSION_KEY  = "krisenkommando_version";
if(typeof localStorage!=="undefined" && localStorage.getItem(VERSION_KEY)!==SAVE_VERSION){
  ["dreikörper_saves","krisenkommando_leaderboard","krisenkommando_player",
   "krisenkommando_desc","krisenkommando_avatar","krisenkommando_version"]
    .forEach(k=>localStorage.removeItem(k));
  localStorage.setItem(VERSION_KEY, SAVE_VERSION);
}

const SAVE_KEY = "dreikörper_saves";
const MAX_SLOTS = 3;

function getSaves(){
  try{ return JSON.parse(localStorage.getItem(SAVE_KEY)||"{}"); }
  catch{ return {}; }
}
function writeSave(slot,data){
  const saves=getSaves();
  saves[slot]=data;
  localStorage.setItem(SAVE_KEY,JSON.stringify(saves));
}
function deleteSave(slot){
  const saves=getSaves();
  delete saves[slot];
  localStorage.setItem(SAVE_KEY,JSON.stringify(saves));
}

function SaveScreen({onLoad}){
  const [saves,setSaves]=useState(getSaves());
  const [naming,setNaming]=useState(null);
  const [nameVal,setNameVal]=useState("");
  const [confirmDel,setConfirmDel]=useState(null);
  const [showFAQ,setShowFAQ]=useState(false);
  const [showLB,setShowLB]=useState(false);
  const [playerName,setPN]=useState(getPlayerName());
  const [enteringName,setEnteringName]=useState(!getPlayerName());
  const [playerNameInput,setPlayerNameInput]=useState("");
  const [showProfile,setShowProfile]=useState(false);
  const [editingName,setEditingName]=useState(false);
  const [editingDesc,setEditingDesc]=useState(false);
  const [nameEdit,setNameEdit]=useState("");
  const [descEdit,setDescEdit]=useState("");
  const [playerDesc,setPlayerDescState]=useState(localStorage.getItem("krisenkommando_desc")||"");
  const [playerAvatar,setPlayerAvatarState]=useState(localStorage.getItem("krisenkommando_avatar")||"🚀");
  const [pickingAvatar,setPickingAvatar]=useState(false);

  const refresh=()=>setSaves(getSaves());

  const startNew=(slot)=>{
    setNaming(slot);
    setNameVal("");
  };

  const confirmNew=()=>{
    if(!nameVal.trim()) return;
    const newGame={
      slot:naming, name:nameVal.trim(),
      createdAt:Date.now(), savedAt:Date.now(),
      credits:100, science:0, energy:0, defence:2000,
      population:8e9, mult:1, xdef:2000,
      unlocked:["erde"], invested:{}, stations:{},
      lastSpin:0, clickLevel:0, log:["🌍 2024 – Das fremdes Signal wurde entschlüsselt!"],
    };
    writeSave(naming, newGame);
    refresh();
    setNaming(null);
    onLoad(newGame);
  };

  const slots=[1,2,3];

  return(
    <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 50% 40%,#020d22 0%,#000005 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,zIndex:9999}}>
      {/* Stars */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        {Array.from({length:80},(_,i)=>(
          <circle key={i} cx={`${(i*137.5)%100}%`} cy={`${(i*97.3)%100}%`} r={Math.random()*1.4+.3} fill="white" opacity={.15+Math.random()*.3}/>
        ))}
      </svg>

      {/* Player name entry – shown first time */}
      {enteringName&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.95)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
          <div style={{fontSize:52,marginBottom:12}}>🚀</div>
          <div style={{fontSize:22,fontWeight:"900",color:"white",letterSpacing:2,textAlign:"center",textShadow:"0 0 20px rgba(100,160,255,.8)"}}>WILLKOMMEN!</div>
          <div style={{fontSize:13,color:"rgba(150,190,255,.6)",marginTop:8,marginBottom:24,textAlign:"center",lineHeight:1.6}}>
            Gib deinen Spielernamen ein.<br/>Er erscheint in der globalen Rangliste!
          </div>
          <input
            autoFocus
            value={playerNameInput}
            onChange={e=>setPlayerNameInput(e.target.value.slice(0,20))}
            onKeyDown={e=>{if(e.key==="Enter"&&playerNameInput.trim()){setPlayerName(playerNameInput.trim());setPN(playerNameInput.trim());setEnteringName(false);}}}
            maxLength={20}
            placeholder="Dein Spielername..."
            style={{width:"100%",maxWidth:320,padding:"16px",background:"rgba(0,20,60,.6)",border:"1px solid rgba(60,120,255,.4)",borderRadius:14,color:"#c0d8ff",fontSize:16,outline:"none",textAlign:"center",boxSizing:"border-box",marginBottom:16,fontWeight:"bold"}}
          />
          <button
            onClick={()=>{if(playerNameInput.trim()){setPlayerName(playerNameInput.trim());setPN(playerNameInput.trim());setEnteringName(false);}}}
            disabled={!playerNameInput.trim()}
            style={{width:"100%",maxWidth:320,padding:"16px",background:playerNameInput.trim()?"linear-gradient(135deg,#0a2878,#1848c8)":"rgba(10,10,10,.4)",border:"2px solid rgba(60,120,255,.5)",borderRadius:14,color:playerNameInput.trim()?"#c0d8ff":"#404040",fontSize:15,fontWeight:"bold",cursor:playerNameInput.trim()?"pointer":"default",letterSpacing:1}}>
            ▶ Spielen
          </button>
          <div style={{fontSize:10,color:"rgba(80,100,140,.5)",marginTop:12}}>Max. 20 Zeichen · Kann später geändert werden</div>
        </div>
      )}

      {/* Logo area */}
      <div style={{textAlign:"center",marginBottom:36,zIndex:1}}>
        {playerName&&<div style={{fontSize:11,color:"rgba(100,160,255,.5)",marginBottom:6}}>👤 {playerName}</div>}
        <div style={{fontSize:52,marginBottom:8}}>🌍</div>
        <div style={{fontSize:22,fontWeight:"900",color:"white",letterSpacing:3,
          textShadow:"0 0 20px rgba(100,160,255,.8)"}}>KRISENKOMMANDO</div>
        <div style={{fontSize:11,color:"rgba(120,180,255,.6)",letterSpacing:6,marginTop:4}}>WELTALL</div>
      </div>

      {/* Save slots */}
      <div style={{width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:12,zIndex:1}}>
        {slots.map(slot=>{
          const save=saves[slot];
          const planets=save?save.unlocked?.length||1:0;
          const age=save?Math.floor((Date.now()-save.savedAt)/60000):0;
          const ageStr=age<60?`vor ${age} Min.`:age<1440?`vor ${Math.floor(age/60)} Std.`:`vor ${Math.floor(age/1440)} Tagen`;

          return(
            <div key={slot}>
              {save?(
                <div style={{background:"linear-gradient(135deg,rgba(0,20,50,.9),rgba(0,10,30,.95))",border:"1.5px solid rgba(60,120,220,.4)",borderRadius:16,padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{fontSize:32,flexShrink:0}}>
                    {planets>=6?"☀️":planets>=4?"🟠":planets>=3?"🔴":planets>=2?"🌕":"🌍"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:16,fontWeight:"bold",color:"#c0d8ff",marginBottom:2}}>{save.name}</div>
                    <div style={{fontSize:10,color:"rgba(100,160,220,.7)"}}>
                      {planets} Planet{planets!==1?"en":"e"} · {fmt(save.credits||0)} Kr. · {ageStr}
                    </div>
                    <div style={{display:"flex",gap:4,marginTop:6}}>
                      {(save.unlocked||["erde"]).map(p=>(
                        <span key={p} style={{fontSize:14}}>{PLANET_INFO[p]?.emoji||"🌍"}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    <button onClick={()=>onLoad(save)} style={{padding:"8px 16px",background:"linear-gradient(135deg,#0a3060,#1a50a0)",border:"1px solid rgba(60,120,255,.5)",borderRadius:10,color:"#70b0ff",fontSize:13,fontWeight:"bold",cursor:"pointer"}}>
                      ▶ Spielen
                    </button>
                    <button onClick={()=>setConfirmDel(slot)} style={{padding:"6px 12px",background:"rgba(60,10,10,.6)",border:"1px solid rgba(150,40,40,.4)",borderRadius:10,color:"#a05050",fontSize:11,cursor:"pointer"}}>
                      🗑 Löschen
                    </button>
                  </div>
                </div>
              ):(
                <button onClick={()=>startNew(slot)} style={{width:"100%",background:"rgba(0,15,40,.5)",border:"1.5px dashed rgba(40,80,160,.4)",borderRadius:16,padding:"20px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,cursor:"pointer",color:"rgba(80,140,220,.6)"}}>
                  <span style={{fontSize:24}}>+</span>
                  <span style={{fontSize:14,fontWeight:"bold"}}>Neuer Spielstand</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Button */}
      <div style={{display:"flex",gap:10,zIndex:1,marginTop:16}}>
        <button onClick={()=>setShowFAQ(true)} style={{background:"rgba(0,15,40,.5)",border:"1px solid rgba(40,80,160,.3)",borderRadius:12,padding:"12px 20px",color:"rgba(100,150,220,.7)",fontSize:12,cursor:"pointer"}}>
          ❓ FAQ
        </button>
        <button onClick={()=>setShowLB(true)} style={{background:"rgba(20,10,0,.5)",border:"1px solid rgba(200,150,0,.3)",borderRadius:12,padding:"12px 20px",color:"rgba(220,180,80,.7)",fontSize:12,cursor:"pointer"}}>
          🏅 Rangliste
        </button>
      </div>

      {/* Profile card */}
      {playerName&&(
        <button onClick={()=>setShowProfile(true)} style={{marginTop:12,zIndex:1,background:"rgba(0,12,35,.7)",border:"1px solid rgba(40,80,160,.25)",borderRadius:14,padding:"10px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",maxWidth:340,width:"100%",textAlign:"left"}}>
          <div style={{fontSize:32,flexShrink:0,width:48,height:48,borderRadius:24,background:"linear-gradient(135deg,#0a2878,#1848c8)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(60,120,255,.3)"}}>{playerAvatar}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:"bold",color:"#90c0f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{playerName}</div>
            <div style={{fontSize:10,color:"rgba(100,140,200,.5)",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{playerDesc||"Tippe um Profil zu bearbeiten"}</div>
          </div>
          <span style={{fontSize:14,color:"rgba(80,120,180,.4)",flexShrink:0}}>✏️</span>
        </button>
      )}
      <div style={{fontSize:9,color:"rgba(60,80,120,.5)",marginTop:8,zIndex:1}}>v1.0 · von Nevio Eichhorst</div>

      {/* Profile Modal */}
      {showProfile&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget){setShowProfile(false);setEditingName(false);setEditingDesc(false);setPickingAvatar(false);}}}>
          <div style={{background:"linear-gradient(180deg,#001428 0%,#000810 100%)",border:"1px solid rgba(60,120,255,.35)",borderRadius:"22px 22px 0 0",padding:"24px 20px 48px",width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <div style={{fontSize:11,color:"rgba(100,150,220,.5)",letterSpacing:2,marginBottom:16,textAlign:"center"}}>MEIN PROFIL</div>

            {/* Avatar picker */}
            {pickingAvatar?(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"rgba(100,150,220,.5)",letterSpacing:1,marginBottom:10,textAlign:"center"}}>PROFILBILD WÄHLEN</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:14}}>
                  {["🚀","🌍","🚀","🚀","🛸","⭐","🌌","🔭","🛡️","⚔️","🤖","👾","🦊","🐉","🦁","🐺","🦅","🐬","🌙","☀️","🌠","💫","⚡","🔥","💎","🏆","👑","🎯","🧬","🔮"].map(em=>(
                    <button key={em} onClick={()=>{localStorage.setItem("krisenkommando_avatar",em);setPlayerAvatarState(em);setPickingAvatar(false);}} style={{width:48,height:48,fontSize:26,background:playerAvatar===em?"rgba(0,60,180,.6)":"rgba(0,15,40,.6)",border:`2px solid ${playerAvatar===em?"rgba(60,140,255,.6)":"rgba(0,40,100,.3)"}`,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {em}
                    </button>
                  ))}
                </div>
                <button onClick={()=>setPickingAvatar(false)} style={{width:"100%",padding:"12px",borderRadius:12,background:"rgba(0,20,50,.5)",border:"1px solid rgba(40,80,160,.3)",color:"#6080c0",fontSize:13,cursor:"pointer"}}>
                  Abbrechen
                </button>
              </div>
            ):(
              <>
                {/* Avatar + Name */}
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                  <button onClick={()=>setPickingAvatar(true)} style={{width:64,height:64,borderRadius:32,background:"linear-gradient(135deg,#0a2878,#1848c8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,border:"2px solid rgba(60,120,255,.4)",flexShrink:0,cursor:"pointer",position:"relative"}}>
                    {playerAvatar}
                    <div style={{position:"absolute",bottom:-4,right:-4,background:"rgba(0,40,120,.9)",borderRadius:8,padding:"2px 5px",fontSize:9,color:"#60a0ff",border:"1px solid rgba(60,120,255,.4)"}}>✏️</div>
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    {editingName?(
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <input autoFocus value={nameEdit} onChange={e=>setNameEdit(e.target.value.slice(0,20))} onKeyDown={e=>{if(e.key==="Enter"&&nameEdit.trim()){setPlayerName(nameEdit.trim());setPN(nameEdit.trim());setEditingName(false);}}} maxLength={20} style={{flex:1,padding:"8px 12px",background:"rgba(0,20,60,.6)",border:"1px solid rgba(60,120,255,.4)",borderRadius:10,color:"#c0d8ff",fontSize:14,outline:"none"}}/>
                        <button onClick={()=>{if(nameEdit.trim()){setPlayerName(nameEdit.trim());setPN(nameEdit.trim());setEditingName(false);}}} style={{padding:"8px 14px",background:"rgba(0,60,180,.5)",border:"1px solid rgba(60,120,255,.4)",borderRadius:10,color:"#80b0ff",fontSize:12,cursor:"pointer",flexShrink:0}}>✓</button>
                        <button onClick={()=>setEditingName(false)} style={{padding:"8px 10px",background:"rgba(20,10,10,.5)",border:"1px solid rgba(80,40,40,.3)",borderRadius:10,color:"#806060",fontSize:12,cursor:"pointer",flexShrink:0}}>✕</button>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:17,fontWeight:"bold",color:"#c0d8ff"}}>{playerName}</span>
                        <button onClick={()=>{setNameEdit(playerName);setEditingName(true);}} style={{background:"rgba(0,20,60,.5)",border:"1px solid rgba(40,80,160,.3)",borderRadius:8,padding:"4px 10px",color:"rgba(100,150,220,.7)",fontSize:11,cursor:"pointer"}}>✏️</button>
                      </div>
                    )}
                    <div style={{fontSize:10,color:"rgba(80,120,180,.5)",marginTop:3}}>Tippe auf den Avatar um ihn zu ändern</div>
                  </div>
                </div>

                {/* Description */}
                <div style={{background:"rgba(0,15,40,.5)",borderRadius:14,padding:"14px",marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:10,color:"rgba(100,150,220,.5)",letterSpacing:1}}>📝 BESCHREIBUNG</span>
                    {!editingDesc&&<button onClick={()=>{setDescEdit(playerDesc);setEditingDesc(true);}} style={{background:"rgba(0,20,60,.5)",border:"1px solid rgba(40,80,160,.3)",borderRadius:8,padding:"4px 10px",color:"rgba(100,150,220,.7)",fontSize:11,cursor:"pointer"}}>✏️ Bearbeiten</button>}
                  </div>
                  {editingDesc?(
                    <>
                      <textarea value={descEdit} onChange={e=>setDescEdit(e.target.value.slice(0,80))} rows={3} maxLength={80} placeholder="Erzähl was über dich als Spieler..." style={{width:"100%",padding:"10px",background:"rgba(0,20,60,.6)",border:"1px solid rgba(60,120,255,.4)",borderRadius:10,color:"#c0d8ff",fontSize:13,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:8}}/>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                        <span style={{fontSize:9,color:"rgba(80,120,180,.4)",alignSelf:"center"}}>{descEdit.length}/80</span>
                        <button onClick={()=>setEditingDesc(false)} style={{padding:"8px 14px",background:"rgba(20,10,10,.5)",border:"1px solid rgba(80,40,40,.3)",borderRadius:10,color:"#806060",fontSize:12,cursor:"pointer"}}>✕</button>
                        <button onClick={()=>{localStorage.setItem("krisenkommando_desc",descEdit);setPlayerDescState(descEdit);setEditingDesc(false);}} style={{padding:"8px 16px",background:"rgba(0,60,180,.5)",border:"1px solid rgba(60,120,255,.4)",borderRadius:10,color:"#80b0ff",fontSize:12,fontWeight:"bold",cursor:"pointer"}}>✓ Speichern</button>
                      </div>
                    </>
                  ):(
                    <div style={{fontSize:13,color:playerDesc?"rgba(180,210,255,.7)":"rgba(80,120,180,.35)",fontStyle:playerDesc?"normal":"italic",lineHeight:1.6,minHeight:40}}>
                      {playerDesc||"Noch keine Beschreibung. Tippe auf Bearbeiten!"}
                    </div>
                  )}
                </div>

                <button onClick={()=>{setShowProfile(false);setEditingName(false);setEditingDesc(false);}} style={{width:"100%",padding:"16px",borderRadius:14,background:"linear-gradient(135deg,#0a2060,#1a40a0)",border:"1px solid rgba(60,120,255,.4)",color:"#70b0ff",fontSize:14,fontWeight:"bold",cursor:"pointer"}}>
                  Fertig ✓
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {showLB&&(()=>{
        const lb=getLeaderboard();
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:200,overflowY:"auto"}}>
            <div style={{maxWidth:480,margin:"0 auto",padding:"24px 20px 60px"}}>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{fontSize:40,marginBottom:8}}>🏅</div>
                <div style={{fontSize:22,fontWeight:"900",color:"#ffd040",letterSpacing:2}}>RANGLISTE</div>
                <div style={{fontSize:11,color:"rgba(180,160,80,.5)",marginTop:4}}>Top Spieler nach Level & XP</div>
              </div>
              {lb.length===0?(
                <div style={{textAlign:"center",padding:40,color:"rgba(100,140,180,.5)"}}>
                  <div style={{fontSize:32,marginBottom:12}}>👾</div>
                  <div>Noch keine Einträge. Spiel und level auf!</div>
                </div>
              ):lb.map((e,i)=>(
                <div key={e.playerId} style={{background:i===0?"linear-gradient(135deg,rgba(40,30,0,.9),rgba(60,40,0,.95))":i===1?"rgba(20,20,20,.8)":i===2?"rgba(20,10,0,.8)":"rgba(0,10,25,.7)",border:`1.5px solid ${i===0?"rgba(255,200,0,.5)":i===1?"rgba(180,180,180,.3)":i===2?"rgba(180,100,40,.3)":"rgba(0,40,100,.2)"}`,borderRadius:14,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:22,flexShrink:0,minWidth:32,textAlign:"center"}}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:"bold",color:i===0?"#ffd040":"#90c0f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.playerName}</div>
                    <div style={{fontSize:10,color:"rgba(120,160,200,.6)",marginTop:2}}>{getLevelTitle(e.level)} · {fmt(e.planets||0)} Planeten</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:15,fontWeight:"bold",color:i===0?"#ffd040":"#80a0c0"}}>Lvl {e.level}</div>
                    <div style={{fontSize:9,color:"rgba(100,140,180,.5)"}}>{fmt(e.xp||0)} XP</div>
                  </div>
                </div>
              ))}
              <button onClick={()=>setShowLB(false)} style={{width:"100%",padding:"16px",borderRadius:14,background:"linear-gradient(135deg,#0a2060,#1a40a0)",border:"1px solid rgba(60,120,255,.4)",color:"#70b0ff",fontSize:15,fontWeight:"bold",cursor:"pointer",marginTop:16}}>
                <- Zurueck
              </button>
            </div>
          </div>
        );
      })()}

      {/* FAQ Modal */}
      {showFAQ&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:200,overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget)setShowFAQ(false);}}>
          <div style={{maxWidth:480,margin:"0 auto",padding:"24px 20px 60px"}}>
            {/* Header */}
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{fontSize:44,marginBottom:8}}>🌌</div>
              <div style={{fontSize:22,fontWeight:"900",color:"white",letterSpacing:2,textShadow:"0 0 20px rgba(100,160,255,.8)"}}>KRISENKOMMANDO: WELTALL</div>
              <div style={{fontSize:11,color:"rgba(120,180,255,.5)",letterSpacing:4,marginTop:4}}>FAQ & SPIELINFORMATIONEN</div>
            </div>

            {/* Developer */}
            <div style={{background:"linear-gradient(135deg,rgba(0,30,80,.8),rgba(0,15,50,.9))",border:"1px solid rgba(60,120,255,.3)",borderRadius:16,padding:"18px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(100,150,220,.6)",letterSpacing:2,marginBottom:10}}>👨💻 ENTWICKLER</div>
              <div style={{fontSize:16,fontWeight:"bold",color:"#c0d8ff",marginBottom:6}}>Nevio Eichhorst</div>
              <div style={{fontSize:12,color:"rgba(150,180,220,.7)",lineHeight:1.7}}>
                Krisenkommando: Weltall ist ein unabhängiges Idle-Strategie-Spiel, das von Nevio Eichhorst entwickelt wurde. Das Spiel entstand aus der Leidenschaft für Weltraumforschung, Sci-Fi und das Genre der Aufbau-Spiele. Alle Inhalte, Mechaniken und das Design wurden eigenständig konzipiert und umgesetzt.
              </div>
            </div>

            {/* About */}
            <div style={{background:"rgba(0,15,40,.7)",border:"1px solid rgba(40,80,160,.3)",borderRadius:16,padding:"18px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(100,150,220,.6)",letterSpacing:2,marginBottom:10}}>🚀 WORUM GEHT ES?</div>
              <div style={{fontSize:12,color:"rgba(180,210,255,.8)",lineHeight:1.8}}>
                Im Jahr 2024 empfängt die Menschheit ein unbekanntes Signal aus den Tiefen des Alls – eine fremde Zivilisation namens <span style={{color:"#c0a0ff",fontWeight:"bold"}}>Die Fremden</span> ist auf dem Weg zur Erde. Du übernimmst die Kontrolle über das <span style={{color:"#80c0ff",fontWeight:"bold"}}>Krisenkommando</span> – die geheime Behörde, die die Menschheit retten soll.
                {"\n\n"}Deine Mission: Besiedle das gesamte Sonnensystem, forsche, baue Militär auf und bereite die Erde auf die Ankunft der Fremden vor. Von der Erde über den Mond, Mars, Jupiter bis hin zu Neptun und schließlich jenseits des Sonnensystems – in deine <span style={{color:"#c040ff",fontWeight:"bold"}}>Eigene Welt</span>.
              </div>
            </div>

            {/* How to play */}
            <div style={{background:"rgba(0,15,40,.7)",border:"1px solid rgba(40,80,160,.3)",borderRadius:16,padding:"18px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(100,150,220,.6)",letterSpacing:2,marginBottom:10}}>🎮 WIE SPIELT MAN?</div>
              {[
                ["🌍 Klicken","Tippe auf die Erde oben links um Kredite zu verdienen. Nach je 50 Klicks steigt dein Bonus um 3 – bis zu 300 pro Klick möglich!"],
                ["💰 Technologien","Investiere Kredite in Technologien auf jedem Planeten. Manche bringen dauerhaft Einnahmen, andere einmalige Boni."],
                ["🔬 Wissenschaft","Forsche! Wissenschaft macht alle Käufe günstiger (bis 40% Rabatt) und lässt Ereignisse häufiger auftreten."],
                ["🛡️ Verteidigung","Halte deine Verteidigung oben. Die Fremden greifen an – bei 0 verlierst du Ressourcen. Investiere regelmäßig ins Militär."],
                ["🎰 Glücksrad","Alle 5 Minuten kannst du das Rad drehen – immer ein Gewinn, skaliert mit deinem aktuellen Vermögen!"],
                ["⚡ Ereignisse","Zufällige Investitionschancen – immer profitabel. Mit mehr Wissenschaft tauchen sie häufiger auf."],
                ["🌌 Eigene Welt","Das ultimative Ziel nach 20 Milliarden Krediten. Benenne deinen Planeten und baue ihn zur stärksten Zivilisation des Universums aus."],
              ].map(([t,d])=>(
                <div key={t} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:"bold",color:"#90c0ff",marginBottom:3}}>{t}</div>
                  <div style={{fontSize:11,color:"rgba(160,190,220,.75)",lineHeight:1.65}}>{d}</div>
                </div>
              ))}
            </div>

            {/* Planets */}
            <div style={{background:"rgba(0,15,40,.7)",border:"1px solid rgba(40,80,160,.3)",borderRadius:16,padding:"18px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(100,150,220,.6)",letterSpacing:2,marginBottom:10}}>🪐 DIE PLANETEN</div>
              <div style={{fontSize:12,color:"rgba(180,210,255,.8)",lineHeight:1.8,marginBottom:10}}>
                Das Spiel enthält alle Planeten unseres echten Sonnensystems sowie ihre wichtigsten Monde – insgesamt <span style={{color:"#80c0ff",fontWeight:"bold"}}>20 bespielbare Himmelskörper</span>:
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["🌍 Erde","🌕 Mond","🌕 Venus","🔴 Mars","🪨 Phobos","🪨 Deimos","⚪ Ceres","🪨 Vesta","🟠 Jupiter","🌋 Io","🌊 Europa","🌑 Ganymed","🪐 Saturn","🟡 Titan","❄️ Enceladus","🔵 Uranus","🌀 Neptun","❄️ Triton","☀️ Khaos","🌌 Eigene Welt"].map(p=>(
                  <span key={p} style={{fontSize:10,background:"rgba(0,30,80,.6)",borderRadius:8,padding:"3px 8px",color:"rgba(150,190,230,.8)"}}>{p}</span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{background:"rgba(0,15,40,.7)",border:"1px solid rgba(40,80,160,.3)",borderRadius:16,padding:"18px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(100,150,220,.6)",letterSpacing:2,marginBottom:10}}>💡 PROFI-TIPPS</div>
              {[
                "Investiere früh in Computertechnik und Quantencomputer – die Multiplikatoren machen langfristig den größten Unterschied.",
                "Wissenschaft lohnt sich doppelt: günstigere Käufe UND häufigere Ereignisse. Nie vernachlässigen!",
                "Nach jedem neuen Planeten sofort ins Militär investieren – der Verteidigungs-Drain steigt mit jedem Standort.",
                "Das Glücksrad alle 5 Minuten drehen nicht vergessen – über Zeit summieren sich die Boni enorm.",
                "Die Dyson-Sphäre auf deiner Eigenen Welt ist das stärkste Investment im gesamten Spiel. Spare dafür.",
                "Ereignisse immer annehmen – der Ertrag ist fast immer das 3–5-fache des Einsatzes.",
                "Der Klick-Multiplikator steigt nie – er lohnt sich besonders am Anfang wo passive Einnahmen noch gering sind.",
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                  <span style={{color:"#4080ff",fontSize:11,flexShrink:0,marginTop:1}}>▸</span>
                  <span style={{fontSize:11,color:"rgba(160,190,220,.75)",lineHeight:1.6}}>{t}</span>
                </div>
              ))}
            </div>

            {/* Version info */}
            <div style={{background:"rgba(0,10,30,.6)",border:"1px solid rgba(30,60,120,.3)",borderRadius:16,padding:"18px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(100,150,220,.6)",letterSpacing:2,marginBottom:10}}>ℹ️ SPIELINFO</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  ["Version","1.0"],
                  ["Entwickler","Nevio Eichhorst"],
                  ["Genre","Idle / Strategie"],
                  ["Plattform","Web / Android"],
                  ["Planeten","20 Himmelskörper"],
                  ["Technologien","100+ Upgrades"],
                  ["Speicherstände","3 Slots"],
                  ["Sprache","Deutsch"],
                ].map(([k,v])=>(
                  <div key={k}>
                    <div style={{fontSize:9,color:"rgba(80,120,180,.6)"}}>{k}</div>
                    <div style={{fontSize:12,color:"rgba(180,210,255,.85)",fontWeight:"bold"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div style={{textAlign:"center",padding:"16px",color:"rgba(60,90,140,.5)",fontSize:10,lineHeight:1.8}}>
              © 2025 Nevio Eichhorst · Krisenkommando: Weltall{"\n"}
              Alle Planeten und Monde basieren auf realen wissenschaftlichen Daten der NASA.{"\n"}
              Dieses Spiel ist ein unabhängiges Werk ohne Verbindung zu Drittparteien.
            </div>

            <button onClick={()=>setShowFAQ(false)} style={{width:"100%",padding:"16px",borderRadius:14,background:"linear-gradient(135deg,#0a2060,#1a40a0)",border:"1px solid rgba(60,120,255,.4)",color:"#70b0ff",fontSize:15,fontWeight:"bold",cursor:"pointer",letterSpacing:1}}>
              <- Zurueck zum Menü
            </button>
          </div>
        </div>
      )}
      {naming!==null&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"linear-gradient(160deg,#001428,#000c1e)",border:"1px solid rgba(60,120,255,.4)",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:340,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:12}}>🌍</div>
            <div style={{fontSize:18,fontWeight:"bold",color:"#c0d8ff",marginBottom:6}}>Spielstand benennen</div>
            <div style={{fontSize:12,color:"rgba(100,160,200,.6)",marginBottom:20}}>Gib deiner Welt einen Namen</div>
            <input
              autoFocus
              value={nameVal}
              onChange={e=>setNameVal(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&confirmNew()}
              maxLength={20}
              placeholder="z.B. Meine Galaxis..."
              style={{width:"100%",padding:"14px",background:"rgba(0,20,60,.6)",border:"1px solid rgba(60,120,255,.4)",borderRadius:12,color:"#c0d8ff",fontSize:15,outline:"none",marginBottom:16,textAlign:"center",boxSizing:"border-box"}}
            />
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setNaming(null)} style={{flex:1,padding:"14px",background:"rgba(20,10,10,.6)",border:"1px solid rgba(80,40,40,.4)",borderRadius:12,color:"#806060",fontSize:14,cursor:"pointer"}}>Abbrechen</button>
              <button onClick={confirmNew} disabled={!nameVal.trim()} style={{flex:2,padding:"14px",background:nameVal.trim()?"linear-gradient(135deg,#0a3060,#1a50a0)":"rgba(10,10,10,.4)",border:"1px solid rgba(60,120,255,.4)",borderRadius:12,color:nameVal.trim()?"#70b0ff":"#404040",fontSize:14,fontWeight:"bold",cursor:nameVal.trim()?"pointer":"default"}}>
                🚀 Spiel starten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDel!==null&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"linear-gradient(160deg,#140008,#0a0005)",border:"1px solid rgba(200,40,40,.4)",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:320,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:17,fontWeight:"bold",color:"#ff8080",marginBottom:8}}>Spielstand löschen?</div>
            <div style={{fontSize:12,color:"rgba(200,100,100,.7)",marginBottom:20}}>„{saves[confirmDel]?.name}" wird unwiderruflich gelöscht.</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfirmDel(null)} style={{flex:1,padding:"14px",background:"rgba(0,20,50,.6)",border:"1px solid rgba(40,80,160,.4)",borderRadius:12,color:"#6080c0",fontSize:14,cursor:"pointer"}}>Abbrechen</button>
              <button onClick={()=>{deleteSave(confirmDel);refresh();setConfirmDel(null);}} style={{flex:1,padding:"14px",background:"rgba(60,10,10,.6)",border:"1px solid rgba(180,40,40,.4)",borderRadius:12,color:"#ff6060",fontSize:14,fontWeight:"bold",cursor:"pointer"}}>Löschen ✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [saveSlot,setSaveSlot]=useState(null); // null = show save screen
  const [saveName,setSaveName]=useState("");

  const initState=(save)=>({
    credits:    save?.credits    ?? 100,
    science:    save?.science    ?? 0,
    energy:     save?.energy     ?? 0,
    defence:    save?.defence    ?? 2000,
    population: save?.population ?? 8e9,
    mult:       save?.mult       ?? 1,
    xdef:       save?.xdef       ?? 2000,
    unlocked:   save?.unlocked   ?? ["erde"],
    invested:   save?.invested   ?? {},
    stations:   save?.stations   ?? {},
    lastSpin:   save?.lastSpin   ?? 0,
    clickLevel: save?.clickLevel ?? 0,
    log:        save?.log        ?? ["🌍 2024 – Das fremdes Signal wurde entschlüsselt!"],
  });

  const [credits,setCr]    =useState(100);
  const [science,setSci]   =useState(0);
  const [energy,setEn]     =useState(0);
  const [defence,setDef]   =useState(2000);
  const [population,setPop]=useState(8e9);
  const [mult,setMult]     =useState(1);
  const [xdef,setXdef]     =useState(2000);
  const [unlocked,setUnlocked]=useState(["erde"]);
  const [invested,setInvested]=useState({});
  const [stations,setStations]=useState({});
  const [lastSpin,setLastSpin]=useState(0);

  const [selP,setSelP]        =useState("erde");
  const [screen,setScreen]    =useState("home");
  const [log,setLog]          =useState(["🌍 2024 – Das fremdes Signal wurde entschlüsselt!"]);
  const [events,setEvents]    =useState([]);
  const [activeEv,setActiveEv]=useState(null);
  const [slowInvests,setSlowInvests]=useState([]);
  const [floaties,setFloat]   =useState([]);
  const [randRes,setRandRes]  =useState(null);
  const [showSpin,setShowSpin]=useState(false);
  const [defAlert,setDefAlert]=useState(null);
  const [techDetail,setTechDetail]=useState(null);
  const [toasts,setToasts]    =useState([]);
  const [infoSheet,setInfo]   =useState(null);
  const [planetDetails,setPlanetDetails]=useState(null);
  const [eigeneWeltName,setEigeneWeltName]=useState("Eigene Welt");
  const [namingWelt,setNamingWelt]=useState(false);
  const [weltNameInput,setWeltNameInput]=useState("");
  const [achievements,setAchievements]=useState([]);   // unlocked achievement ids
  const [achToast,setAchToast]=useState(null);          // currently showing ach toast
  const [achQueue,setAchQueue]=useState([]);            // queue of ach toasts
  const [totalClicks,setTotalClicks]=useState(0);
  const [totalEarned,setTotalEarned]=useState(0);
  const [totalSpins,setTotalSpins]=useState(0);
  const [totalEvents,setTotalEvents]=useState(0);
  const [survivedDefZero,setSurvivedDefZero]=useState(false);

  const [dailyProgress,setDailyProgress]=useState({});
  const [dailyClaimed,setDailyClaimed]=useState({});
  const [lastDailySeed,setLastDailySeed]=useState(0);
  const [dailyTechs,setDailyTechs]=useState(0);
  const [dailyUnlocks,setDailyUnlocks]=useState(0);

  const [totalPlaytime,setTotalPlaytime]=useState(0);
  const [gameYear,setGameYear]=useState(2024); // starts in 2024
  const lastYearRef=useRef(2024);
  const [peakCredits,setPeakCredits]=useState(0);
  const [peakMult,setPeakMult]=useState(1);
  const [totalTechsBought,setTotalTechsBought]=useState(0);

  const [khaosWave,setKhaosWave]=useState(null);
  const [khaosCountdown,setKhaosCountdown]=useState(0);
  const [nextKhaosIn,setNextKhaosIn]=useState(0);
  const [khaosWarning,setKhaosWarning]=useState(false);
  const [selPlayer,setSelPlayer]=useState(null); // leaderboard player detail // big 2-sec warning overlay

  const [xp,setXp]=useState(0);
  const [level,setLevel]=useState(1);
  const [xpToNext,setXpToNext]=useState(getXpForLevel(1));
  const [levelUpMsg,setLevelUpMsg]=useState(null);
  const playerNameRef=useRef(getPlayerName());

  const st       =useRef({});
  const toastIdR =useRef(0);
  const investedRef=useRef(invested);
  useEffect(()=>{investedRef.current=invested;},[invested]);

  st.current={credits,science,energy,defence,mult,xdef,invested,unlocked,slowInvests};

  const loadGame=useCallback((save)=>{
    const inv=save.invested??{};
    const recalcUnlocked=()=>{
      const ul=new Set(["erde"]);
      Object.values(TECHS).flat().forEach(t=>{
        if(t.type==="unlock"&&inv[t.id]) ul.add(t.unlocks);
      });
      (save.unlocked??["erde"]).forEach(id=>ul.add(id));
      return Array.from(ul);
    };
    setCr(save.credits??100);
    setSci(save.science??0);
    setEn(save.energy??0);
    setDef(save.defence??2000);
    setPop(save.population??8e9);
    setMult(save.mult??1);
    setXdef(save.xdef??2000);
    setUnlocked(recalcUnlocked());
    setInvested(inv);
    setStations(save.stations??{});
    setLastSpin(save.lastSpin??0);
    setLog(save.log??[`🌍 ${save.gameYear||2024} – Das fremde Signal wurde entschlüsselt!`]);

    const cl=save.clickLevel??0;
    clickLevelRef.current=cl;
    setClickCombo(3+cl*3);

    setEigeneWeltName(save.eigeneWeltName??"Eigene Welt");

    setAchievements(save.achievements??[]);
    setTotalClicks(save.totalClicks??0);
    setTotalEarned(save.totalEarned??0);
    setTotalSpins(save.totalSpins??0);
    setTotalEvents(save.totalEvents??0);
    setSurvivedDefZero(save.survivedDefZero??false);
    if(save.survivedDefZero??false) setSurvivedDefZero(save.survivedDefZero);
    if(save.peakCredits)     setPeakCredits(save.peakCredits);
    if(save.peakMult)        setPeakMult(save.peakMult);
    if(save.totalTechsBought)setTotalTechsBought(save.totalTechsBought);
    if(save.totalPlaytime)   setTotalPlaytime(save.totalPlaytime);
    if(save.gameYear)        { setGameYear(save.gameYear); lastYearRef.current=save.gameYear; }
    if(save.dailyClaimed)    setDailyClaimed(save.dailyClaimed);
    if(save.lastDailySeed)   setLastDailySeed(save.lastDailySeed);
    if(save.xp)              setXp(save.xp);
    if(save.level){          setLevel(save.level); setXpToNext(getXpForLevel(save.level)); }

    const pn=getPlayerName();
    playerNameRef.current=pn;
    if(pn) upsertLeaderboard({
      playerId: pn.toLowerCase().replace(/\s/g,"_"),
      playerName: pn,
      level: save.level||1,
      xp: save.xp||0,
      planets: (save.unlocked||["erde"]).length,
      gameYear: save.gameYear||2024,
      totalClicks: save.totalClicks||0,
      science: save.science||0,
      achievements: (save.achievements||[]).length,
      totalSpins: save.totalSpins||0,
      totalTechsBought: save.totalTechsBought||0,
      avatar: localStorage.getItem("krisenkommando_avatar")||"🚀",
    });
    setAchToast(null);
    setAchQueue([]);
    setSaveSlot(save.slot);
    setSaveName(save.name);

    const offlineSecs=Math.min(600, Math.floor((Date.now()-(save.savedAt||Date.now()))/1000));
    if(offlineSecs>=60){
      const inv=save.invested??{};
      const m=save.mult??1;
      let crRate=0.5;
      Object.values(TECHS).flat().forEach(t=>{
        const c=inv[t.id]||0;if(!c)return;
        crRate+=(t.cr||0)*m*c;
      });
      const offlineCr=Math.floor(crRate*offlineSecs*0.5); // 50% efficiency offline
      const offlineSci=Math.floor(offlineSecs*0.2);
      if(offlineCr>0){
        setCr(c=>c+offlineCr);
        setSci(sc=>sc+offlineSci);
        setOfflineEarnings({cr:offlineCr, sci:offlineSci, minutes:Math.floor(offlineSecs/60)});
      }
    }
  },[]);

  useEffect(()=>{
    if(!saveSlot) return;
    const iv=setInterval(()=>{
      const s=st.current;
      writeSave(saveSlot,{
        slot:saveSlot, name:saveName, savedAt:Date.now(),
        credits:s.credits, science, energy, defence:s.xdef,
        population, mult:s.mult, xdef:s.xdef,
        unlocked:s.unlocked, invested:s.invested, stations,
        lastSpin, clickLevel:clickLevelRef.current, log, eigeneWeltName, achievements, totalClicks, totalEarned, totalSpins, totalEvents, survivedDefZero, peakCredits, peakMult, totalTechsBought, totalPlaytime, gameYear, dailyClaimed, lastDailySeed, xp, level,
      });
    },30000);
    return()=>clearInterval(iv);
  },[saveSlot,saveName,science,energy,population,stations,lastSpin,log]);

  const addLog=useCallback(m=>setLog(l=>[`${new Date().toLocaleTimeString("de")} – ${m}`,...l].slice(0,60)),[]);

  const addToast=useCallback((msg,{icon="",color="#90c8f0",bg="rgba(0,20,50,.97)",border="rgba(60,140,255,.5)",duration=2800}={})=>{
    const id=++toastIdR.current;
    setToasts(t=>[...t,{id,msg,icon,color,bg,border}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),duration);
  },[]);

  const addXP=useCallback((amount)=>{
    setXp(prev=>{
      setLevel(lvl=>{
        let newXp=prev+amount;
        let newLvl=lvl;
        let newToNext=getXpForLevel(newLvl);

        while(newXp>=newToNext){
          newXp-=newToNext;
          newLvl++;
          newToNext=getXpForLevel(newLvl);
          setLevelUpMsg({level:newLvl,title:getLevelTitle(newLvl)});
          setTimeout(()=>setLevelUpMsg(null),4000);
        }
        setXpToNext(newToNext);

        const pn=playerNameRef.current||getPlayerName();
        if(pn) upsertLeaderboard({
          playerId: pn.toLowerCase().replace(/\s/g,"_"),
          playerName: pn,
          level: newLvl, xp: newXp,
          planets: st.current.unlocked?.length||1,
          gameYear: lastYearRef.current||2024,
          totalClicks: 0, // updated by save
          science: st.current.science||0,
          avatar: localStorage.getItem("krisenkommando_avatar")||"🚀",
        });
        return newLvl;
      });
      return prev+amount; // will be corrected by level loop above
    });
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      const s=st.current;
      const checkState={
        unlocked:s.unlocked, invested:s.invested,
        science, mult:s.mult, defence,
        population, totalClicks, totalEarned, totalSpins,
        totalEvents, survivedDefZero,
        energy, clickLevel:clickLevelRef.current,
      };
      setAchievements(prev=>{
        const normalDone=ACHIEVEMENTS.filter(a=>a.id!=="final_all").every(a=>prev.includes(a.id));
        const newOnes=ACHIEVEMENTS.filter(a=>{
          if(prev.includes(a.id)) return false;
          if(a.id==="final_all") return normalDone;
          return a.check(checkState);
        });
        if(!newOnes.length) return prev;
        newOnes.forEach(a=>{
          if(a.reward.cr)   setCr(c=>c+a.reward.cr);
          if(a.reward.sci)  setSci(sc=>sc+a.reward.sci);
          if(a.reward.mult) setMult(m=>m*a.reward.mult);
          addXP(XP_REWARDS.achievement);
          if(a.reward.unlock==="eigene_welt"||a.reward.unlockWorld){
            setUnlocked(u=>u.includes("eigene_welt")?u:[...u,"eigene_welt"]);
            setStations(st2=>({...st2,eigene_welt:1}));
            setNamingWelt(true);setWeltNameInput("");
            addLog("🌌 ALLE HERAUSFORDERUNGEN GEMEISTERT! Eigene Welt freigeschaltet!");
            addToast("🌌 ALLE ERFOLGE! Eigene Welt als Belohnung freigeschaltet!",{color:"#c040ff",bg:"rgba(20,0,40,.97)",border:"rgba(200,60,255,.7)",duration:8000});
          }
        });
        setAchQueue(q=>[...q,...newOnes]);
        return [...prev,...newOnes.map(a=>a.id)];
      });
    },2000);
    return()=>clearInterval(iv);
  },[science,mult,defence,population,totalClicks,totalEarned,totalSpins,totalEvents,survivedDefZero,energy]);

  useEffect(()=>{
    if(achToast) return; // wait for current to finish
    if(!achQueue.length) return;
    const t=setTimeout(()=>{
      setAchToast(achQueue[0]);
      setAchQueue(q=>q.slice(1));
    },300); // small gap between toasts
    return()=>clearTimeout(t);
  },[achToast,achQueue]);

  useEffect(()=>{
    if(xdef<0&&!survivedDefZero) setSurvivedDefZero(true);
  },[xdef,survivedDefZero]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setTotalPlaytime(t=>t+1);
    },1000);
    return()=>clearInterval(iv);
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setGameYear(y=>{
        const next=y+1;
        addXP(2);
        if(next%10===0) addLog(`📅 Jahr ${next} – Die Menschheit expandiert weiter!`);
        lastYearRef.current=next;
        return next;
      });
    },300000); // 5 real minutes = 1 game year
    return()=>clearInterval(iv);
  },[addXP,addLog]);

  useEffect(()=>{
    if(credits>peakCredits) setPeakCredits(credits);
  },[credits,peakCredits]);

  useEffect(()=>{
    if(mult>peakMult) setPeakMult(mult);
  },[mult,peakMult]);

  useEffect(()=>{
    const seed=getDaySeed();
    if(seed!==lastDailySeed){
      setLastDailySeed(seed);
      setDailyProgress({});
      setDailyClaimed({});
      setDailyTechs(0);
      setDailyUnlocks(0);
    }
  },[lastDailySeed]);

  useEffect(()=>{
    const seed=getDaySeed();
    const challenges=getDailyChallenges(seed);
    const newProg={};
    challenges.forEach(c=>{
      let val=0;
      if(c.type==="clicks")  val=totalClicks;
      if(c.type==="earn")    val=totalEarned;
      if(c.type==="spins")   val=totalSpins;
      if(c.type==="events")  val=totalEvents;
      if(c.type==="techs")   val=dailyTechs;
      if(c.type==="defence") val=defence;
      if(c.type==="science") val=science;
      if(c.type==="unlock")  val=dailyUnlocks;
      newProg[c.id]=Math.min(c.target,val);
    });
    setDailyProgress(newProg);
  },[totalClicks,totalEarned,totalSpins,totalEvents,dailyTechs,defence,science,population,dailyUnlocks]);

  const khaosPreRef=useRef(null); // stores incoming wave during pre-warning
  useEffect(()=>{
    const iv=setInterval(()=>{
      const s=st.current;
      const planetCount=s.unlocked.length;
      if(planetCount<2) return;
      setNextKhaosIn(n=>{
        if(n>0) return n-1;
        if(khaosWave) return 0;

        if(!khaosPreRef.current){
          const eligible=KHAOS_WAVES.filter(w=>w.minPlanets<=planetCount);
          if(!eligible.length) return 120;
          const wave=eligible[Math.floor(Math.random()*eligible.length)];
          khaosPreRef.current=wave;
          addToast(`⚠️ Khaos-Angriff in 60s: ${wave.name} – rüste auf!`,{color:"#ff8040",bg:"rgba(30,5,0,.97)",border:"rgba(255,80,20,.5)",duration:6000});
          addLog(`⚠️ Khaos-Angriff in 60s: ${wave.name}`);
          return 60;
        }

        const wave=khaosPreRef.current;
        khaosPreRef.current=null;
        setKhaosWave(wave);
        setKhaosCountdown(wave.duration);
        setKhaosWarning(true);
        setTimeout(()=>setKhaosWarning(false),2500);
        addToast(`🚨 ANGRIFF GESTARTET: ${wave.name}!`,{color:"#ff2020",bg:"rgba(40,0,0,.97)",border:"rgba(255,20,20,.6)",duration:4000});
        addLog(`⚔️ Khaos-Angriff: ${wave.name}`);
        return 0;
      });
    },1000);
    return()=>clearInterval(iv);
  },[khaosWave,addToast,addLog]);

  useEffect(()=>{
    if(!khaosWave) return;
    const iv=setInterval(()=>{
      setKhaosCountdown(n=>{
        if(n<=1){
          setXdef(d=>Math.max(-100,d-khaosWave.defDrain));
          addToast(`💥 ${khaosWave.name} vorbei! -${fmt(khaosWave.defDrain)} Vert.`,{color:"#ff6060",bg:"rgba(30,0,0,.97)",border:"rgba(255,50,50,.5)",duration:4000});
          setKhaosWave(null);

          setNextKhaosIn(180+Math.floor(Math.random()*180));
          return 0;
        }
        return n-1;
      });
    },1000);
    return()=>clearInterval(iv);
  },[khaosWave,addToast,addLog]);

  const getSciDiscount=useCallback((sci)=>{
    return Math.min(0.40, Math.floor(sci/1000)*0.005);
  },[]);

  const getRates=useCallback((inv,m)=>{
    let cr=0.5,en=0,pop=8e9;
    Object.values(TECHS).flat().forEach(t=>{
      const c=inv[t.id]||0;if(!c)return;
      cr+=(t.cr||0)*m*c;
      en+=(t.en||0)*c;
      pop+=(t.pop||0)*c;
    });

    const popBonus=Math.floor(pop/1e9)*0.5;
    cr+=popBonus*m;
    return{cr,en,pop};
  },[]);

  const getDefCap=useCallback((inv)=>{
    let cap=0;
    Object.values(TECHS).flat().forEach(t=>{
      const c=inv[t.id]||0;if(!c)return;
      cap+=(t.def||0)*c;
    });
    return cap;
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      const s=st.current;
      const r=getRates(s.invested,s.mult);
      setCr(c=>{const next=c+r.cr/5;setTotalEarned(t=>t+r.cr/5);return next;});
      setEn(e=>e+r.en/5);
      setPop(r.pop);

      const planetCount=s.unlocked.length;

      const drainPerTick=(1+planetCount*0.8)/5;

      setXdef(d=>{
        const cap=getDefCap(s.invested);
        if(d<cap){

          return Math.min(cap, d+1.5);
        }

        return Math.max(-300, d-drainPerTick);
      });

      setDef(Math.max(0, s.xdef));

      if(s.xdef<0){
        const planetCount=s.unlocked.length;

        const depthFactor=Math.min(1,Math.abs(s.xdef)/200);
        const progressFactor=Math.min(1,(planetCount-1)/10);
        const sev=depthFactor*progressFactor*0.4; // max 40% of old severity

        if(Math.random()<0.33){
          if(sev>0.05) setCr(c=>Math.max(0, c-Math.max(0.1, c*0.0003*sev)));
          if(sev>0.1)  setSci(sc=>Math.max(0, sc-Math.max(0.05, sc*0.0001*sev)));
          if(sev>0.2)  setPop(p=>Math.max(1e6, p-Math.max(1e4, p*0.00005*sev)));
        }
      }

      setSlowInvests(si=>{
        if(!si.length)return si;
        si.forEach(inv=>{
          if(inv.ticksLeft>0){setCr(c=>c+inv.crPerTick);setSci(s2=>s2+inv.sciPerTick);}
        });
        return si.map(inv=>({...inv,ticksLeft:inv.ticksLeft-1})).filter(inv=>inv.ticksLeft>0);
      });
    },200);
    return()=>clearInterval(iv);
  },[getRates,getDefCap]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      const s=st.current;
      if(!s.unlocked.includes("mond"))return;
      if(Math.random()<0.04){
        const ev=DEF_EVENTS[Math.floor(Math.random()*DEF_EVENTS.length)];
        setXdef(d=>Math.max(0,d-ev.defDrop));
        setDefAlert(ev);
        addLog(`⚠️ ${ev.title}`);
      }
    },15000);
    return()=>clearInterval(iv);
  },[addLog]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      const s=st.current;
      const techCount=Object.values(s.invested).filter(c=>c>0).length;
      if(!s.unlocked.includes("mond")||techCount<3)return;

      const sciBonus=Math.min(3.0, 1.0 + s.science/5000);
      const baseChance=0.012*sciBonus;
      setEvents(ev=>{
        if(ev.length>=2)return ev;
        const pool=EVENTS.filter(e=>s.unlocked.includes(e.planet)&&!ev.find(x=>x.id===e.id));
        const sp=pool.filter(()=>Math.random()<baseChance);
        if(!sp.length)return ev;
        const pick=sp[0];
        addLog(`⚡ Ereignis: ${pick.title}`);
        return[...ev,pick];
      });
    },5000);
    return()=>clearInterval(iv);
  },[addLog]);

  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default"){
      setTimeout(()=>Notification.requestPermission(),5000);
    }
  },[]);

  const sendNotification=(title,body)=>{
    if("Notification" in window && Notification.permission==="granted"){
      new Notification(title,{body,icon:"/favicon.svg"});
    }
  };

  useEffect(()=>{
    if(lastSpin===0)return;
    const remaining=300000-(Date.now()-lastSpin);
    if(remaining<=0)return;
    const t=setTimeout(()=>{
      addToast("🎰 Dein Dreh ist wieder bereit!",{color:"#a040f0",bg:"rgba(20,0,40,.97)",border:"rgba(160,60,255,.5)",duration:6000});
      sendNotification("🎰 Krisenkommando: Weltall","Dein Glücksrad ist wieder bereit – dreh jetzt!");
    },remaining);
    return()=>clearTimeout(t);
  },[lastSpin,addToast]);

  const defWarnRef=useRef(false);
  useEffect(()=>{
    if(xdef<0&&!defWarnRef.current){
      defWarnRef.current=true;
      addLog("💀 Verteidigung unter null! Aliens plündern Ressourcen!");
      addToast("💀 Verteidigung zu schwach! Ressourcen schwinden – investiere ins Militär!",{color:"#ff3030",bg:"rgba(40,0,0,.97)",border:"rgba(255,30,30,.6)",duration:5000});
    }
    if(xdef>50) defWarnRef.current=false;
  },[xdef,addLog,addToast]);

  const getCost=useCallback(t=>{
    const s=st.current;
    const discount=getSciDiscount(s.science);
    const base=Math.floor(t.baseCost*Math.pow(1.15,s.invested[t.id]||0));
    return Math.max(1,Math.floor(base*(1-discount)));
  },[getSciDiscount]);

  const doInvest=useCallback((pid,tech)=>{
    const s=st.current;
    const discount=getSciDiscount(s.science);
    const base=Math.floor(tech.baseCost*Math.pow(1.15,s.invested[tech.id]||0));
    const cost=Math.max(1,Math.floor(base*(1-discount)));
    if(s.credits<cost)return null;
    const isOnce=tech.type==="multiplier"||tech.type==="unlock";
    if(isOnce&&s.invested[tech.id])return null;
    setCr(c=>c-cost);

    if(tech.type==="random"){
      const amt=Math.floor(Math.random()*(tech.maxR-tech.minR)+tech.minR);
      const good=amt>tech.baseCost*.4;
      setRandRes({amount:amt,good,sci:tech.sci});
      if(tech.sci)setSci(s2=>s2+amt);else setCr(c=>c+amt);
      setInvested(inv=>({...inv,[tech.id]:(inv[tech.id]||0)+1}));
      addLog(`🎲 ${tech.name}: ${good?"DURCHBRUCH":"Mäßig"} -> +${fmt(amt)}`);
      addToast(good?`🎉 Durchbruch! +${fmt(amt)} ${tech.sci?"Wiss.":"Kr."}`:`+${fmt(amt)} ${tech.sci?"Wiss.":"Kr."}`,
        {color:good?"#40ff80":"#90c8f0",bg:good?"rgba(0,30,10,.97)":"rgba(0,20,50,.97)",border:good?"rgba(0,200,80,.5)":"rgba(60,140,255,.4)"});
      return {amount:amt,good,sci:tech.sci};
    }
    if(tech.type==="multiplier"){
      setMult(m=>m*tech.mult);setInvested(inv=>({...inv,[tech.id]:1}));
      addLog(`✨ ${tech.name} ×${tech.mult}`);
      addToast(`✨ Alle Erträge ×${tech.mult}!`,{color:"#c040ff",bg:"rgba(20,0,40,.97)",border:"rgba(160,60,255,.5)"});
      return null;
    }
    if(tech.type==="unlock"){
      setUnlocked(u=>[...u,tech.unlocks]);setInvested(inv=>({...inv,[tech.id]:1}));
      setStations(st2=>({...st2,[tech.unlocks]:1}));
      setDailyUnlocks(n=>n+1);
      addXP(XP_REWARDS.unlock);

      const pn2=playerNameRef.current||getPlayerName();
      if(pn2) setTimeout(()=>upsertLeaderboard({
        playerId:pn2.toLowerCase().replace(/\s/g,"_"),
        playerName:pn2, level, xp,
        planets:(unlocked.length+1),
      }),100);
      addLog(`🚀 ${gameYear} – ${PLANET_INFO[tech.unlocks]?.name} freigeschaltet!`);
      if(tech.unlocks==="eigene_welt"){

        setNamingWelt(true);setWeltNameInput("");
        addToast("🌌 Deine eigene Welt erschaffen! Gib ihr einen Namen!",{color:"#c040ff",bg:"rgba(20,0,40,.97)",border:"rgba(200,60,255,.6)",duration:6000});
      } else {
        addToast(`🚀 ${PLANET_INFO[tech.unlocks]?.name} freigeschaltet!`,{color:"#40ff90",bg:"rgba(0,30,10,.97)",border:"rgba(0,200,80,.5)",duration:4000});
      }
      return null;
    }
    const nc=(s.invested[tech.id]||0)+1;
    setInvested(inv=>({...inv,[tech.id]:nc}));
    setStations(st2=>({...st2,[pid]:Math.min(2,(st2[pid]||0)+1)}));
    setDailyTechs(n=>n+1);
    setTotalTechsBought(n=>n+1);
    addXP(XP_REWARDS.tech);
    addLog(`✅ ${tech.name} Stufe ${nc}`);
    addToast(`✅ ${tech.name} – Stufe ${nc}`,{color:"#70b0ff"});
    return {level:nc};
  },[addLog,addToast]);

  const acceptEv=(ev)=>{
    const s=st.current;if(s.credits<ev.cost)return;
    setCr(c=>c-ev.cost);
    const totalTicks=ev.secs*5;
    setSlowInvests(si=>[...si,{id:ev.id+Date.now(),ticksLeft:totalTicks,crPerTick:(ev.returnCr||0)/totalTicks,sciPerTick:(ev.returnSci||0)/totalTicks}]);
    setEvents(e=>e.filter(x=>x.id!==ev.id));setActiveEv(null);
    addLog(`💰 ${ev.title} – Investiert!`);
    setTotalEvents(e=>e+1);
    addXP(XP_REWARDS.event);
    addToast(`💰 ${ev.title} – Ertrag läuft!`,{icon:"💰",color:"#ffa030",bg:"rgba(20,10,0,.97)",border:"rgba(200,130,0,.5)",duration:3500});
  };

  const clickCountRef=useRef(0);
  const clickLevelRef=useRef(0);
  const [clickCombo,setClickCombo]=useState(3);

  const [adLoading,setAdLoading]=useState(false);
  const [multBoost,setMultBoost]=useState(null);
  const [offlineEarnings,setOfflineEarnings]=useState(null); // {cr, sci, minutes} to show modal // {until: timestamp} wenn aktiv
  const [adSpinBonus,setAdSpinBonus]=useState(false); // extra spin nach werbung

  const showRewardedAd=(onRewarded)=>{

    setAdLoading(true);
    setTimeout(()=>{
      setAdLoading(false);
      onRewarded();
    },3000);
  };

  const canSpin=Date.now()-lastSpin>300000||lastSpin===0;
  const multBoostActive=multBoost&&Date.now()<multBoost.until;
  const multBoostRemaining=multBoostActive?Math.ceil((multBoost.until-Date.now())/60000):0;
  const rates=getRates(invested,mult);
  const pInfo=PLANET_INFO[selP];
  const techs=TECHS[selP]||[];
  const isUnl=unlocked.includes(selP);

  if(!saveSlot) return <SaveScreen onLoad={loadGame}/>;

  const makeCountRef=(techId)=>({ current: invested[techId]||0 });

  const StickyBar=()=>(
    <div style={{background:"rgba(0,6,22,.98)",borderBottom:"1px solid rgba(0,60,150,.3)",padding:"8px 12px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
      {/* Big tap button */}
      <div style={{position:"relative",flexShrink:0}}>
        <button
          onClick={()=>{
            clickCountRef.current+=1;
            if(clickCountRef.current>=100){
              clickCountRef.current=0;
              clickLevelRef.current+=1;
              const newVal=3+clickLevelRef.current*3;
              setClickCombo(newVal);
              addToast(`🖱️ Klick-Bonus: jetzt ${newVal} pro Klick!`,{color:"#40ff80",bg:"rgba(0,30,10,.97)",border:"rgba(0,200,80,.5)",duration:2500});
            }
            const gain=3+clickLevelRef.current*3;
            setCr(c=>c+gain);
            setTotalClicks(c=>c+1);
            setTotalEarned(c=>c+gain);
            addXP(XP_REWARDS.click);
            const id=Date.now()+Math.random();
            setFloat(f=>[...f,{id,v:`+${gain}`}]);
            setTimeout(()=>setFloat(f=>f.filter(fl=>fl.id!==id)),900);
          }}
          style={{
            width:80,height:80,borderRadius:40,
            background:"radial-gradient(circle at 35% 35%,#0d2880,#020818)",
            border:`2.5px solid ${clickCombo>3?"rgba(0,220,120,.8)":"rgba(0,120,255,.7)"}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:38,cursor:"pointer",userSelect:"none",
            touchAction:"manipulation",WebkitAppearance:"none",
            boxShadow:`0 0 22px ${clickCombo>3?"rgba(0,220,100,.6)":"rgba(0,100,255,.5)"}`,
            padding:0,flexShrink:0,
          }}>🌍</button>
        <div style={{position:"absolute",top:-6,right:-6,background:clickCombo>3?"#28d058":"#1a6030",borderRadius:12,fontSize:11,fontWeight:"bold",color:clickCombo>3?"#000":"#40ff80",padding:"2px 7px",minWidth:22,textAlign:"center",border:"1px solid rgba(0,255,100,.4)",pointerEvents:"none"}}>
          {clickCombo}
        </div>
        {floaties.map(f=>(<div key={f.id} style={{position:"absolute",left:"50%",top:"-8px",transform:"translate(-50%,-100%)",color:"#40ff80",fontSize:14,fontWeight:"bold",pointerEvents:"none",animation:"floatUp .9s ease forwards",zIndex:30,whiteSpace:"nowrap"}}>{f.v}</div>))}
      </div>

      {/* Credits + Year */}
      <button onClick={()=>setInfo(INFO.kredite)} style={{flexShrink:0,minWidth:72,background:"none",border:"none",textAlign:"left",cursor:"pointer",padding:0}}>
        <div style={{fontSize:8,color:"#4a6a8a",letterSpacing:1}}>💰 KREDITE ℹ</div>
        <div style={{fontSize:15,color:"#28aa50",fontWeight:"bold",lineHeight:1.1}}>{fmt(credits)}</div>
        <div style={{fontSize:8,color:"#3a5870"}}>+{fmt(rates.cr)}/s</div>
      </button>

      {/* Game year */}
      <div style={{flexShrink:0,textAlign:"center",minWidth:44}}>
        <div style={{fontSize:7,color:"#4a6080",letterSpacing:1}}>📅 JAHR</div>
        <div style={{fontSize:13,color:"#60a0d0",fontWeight:"bold",lineHeight:1.1}}>{gameYear}</div>
        <div style={{fontSize:7,color:"#304060"}}>+1/5Min.</div>
      </div>

      {/* Compact defence bar */}
      <button onClick={()=>setInfo(INFO.verteidigung)} style={{flex:1,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:8,color:"#6080a0",letterSpacing:1}}>🛡️ VERT.</span>
          <span style={{fontSize:9,color:(()=>{const p=Math.min(1,Math.max(0,defence/2000));return p<0.25?"#ff3030":p<0.55?"#ffaa00":"#00dd70";})(),fontWeight:"bold"}}>{fmt(defence)}</span>
        </div>
        <div style={{position:"relative",height:8,borderRadius:4,background:"linear-gradient(90deg,#cc1010 0%,#ff9900 45%,#00cc60 100%)"}}>
          <div style={{
            position:"absolute",top:"50%",
            left:`${Math.min(100,Math.max(0,defence/2000*100))}%`,
            transform:"translate(-50%,-50%)",
            width:13,height:13,borderRadius:7,
            background:(()=>{const p=Math.min(1,Math.max(0,defence/2000));return p<0.25?"#ff3030":p<0.55?"#ffaa00":"#00dd70";})(),
            border:"2px solid rgba(255,255,255,.75)",
            boxShadow:`0 0 6px currentColor`,
            transition:"left 1s ease",zIndex:2,
          }}/>
        </div>
      </button>

      {/* XP bar */}
      <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0,minWidth:52}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:8,color:"#8040c0",letterSpacing:1}}>⬆️ Lvl{level}</span>
          <span style={{fontSize:8,color:"rgba(160,100,220,.6)"}}>{Math.round(xp/xpToNext*100)}%</span>
        </div>
        <div style={{height:6,borderRadius:3,background:"rgba(80,0,120,.3)",overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#8020c0,#c040ff)",width:`${Math.min(100,xp/xpToNext*100)}%`,borderRadius:3,transition:"width .3s"}}/>
        </div>
        <div style={{fontSize:7,color:"rgba(120,60,180,.5)",textAlign:"center"}}>{getLevelTitle(level)}</div>
      </div>
    </div>
  );

  const UnderAttack=()=>(
    <>
      {xdef<0&&(
        <div style={{background:"rgba(60,0,0,.85)",padding:"3px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0,borderBottom:"1px solid rgba(255,30,30,.3)"}}>
          <span style={{fontSize:10}}>⚠️</span>
          <span style={{fontSize:10,color:"#ff6060"}}>Aliens plündern</span>
          <span style={{fontSize:9,color:"#a03030",marginLeft:"auto"}}>−Kr. −Wiss. −Bev.</span>
        </div>
      )}
      {/* Pre-warning countdown strip – unobtrusive */}
      {!khaosWave&&nextKhaosIn>0&&nextKhaosIn<=60&&(
        <div onClick={()=>setScreen("khaos")} style={{background:"rgba(30,8,0,.8)",padding:"3px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0,borderBottom:"1px solid rgba(255,80,20,.25)",cursor:"pointer"}}>
          <span style={{fontSize:9}}>⚠️</span>
          <span style={{fontSize:9,color:"#ff8040"}}>Khaos-Angriff in {nextKhaosIn}s</span>
          <div style={{flex:1,height:3,background:"rgba(255,80,20,.15)",borderRadius:2,marginLeft:4}}>
            <div style={{height:"100%",background:"#ff6020",borderRadius:2,width:`${(60-nextKhaosIn)/60*100}%`,transition:"width 1s linear"}}/>
          </div>
        </div>
      )}
      {/* Active wave strip */}
      {khaosWave&&(
        <div onClick={()=>setScreen("khaos")} style={{background:"rgba(50,0,0,.9)",padding:"4px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0,borderBottom:"1px solid rgba(255,50,20,.4)",cursor:"pointer"}}>
          <span style={{fontSize:11}}>{khaosWave.emoji}</span>
          <span style={{fontSize:10,color:"#ff6040",fontWeight:"bold"}}>⚔️ {khaosWave.name}</span>
          <span style={{fontSize:10,color:"#ff4020",marginLeft:"auto",fontWeight:"bold"}}>{khaosCountdown}s</span>
        </div>
      )}
    </>
  );

  return(
    <div style={{width:"100%",maxWidth:480,margin:"0 auto",minHeight:"100vh",background:"#000814",color:"#b8d4f8",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1a3060}
        @keyframes floatUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-40px)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes sheetFloat{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-28px)}}
        @keyframes khaosFlash{from{opacity:0}to{opacity:1}}
        @keyframes adProgress{from{width:0}to{width:100%}}
        button{-webkit-appearance:none;touch-action:manipulation}
        body,div,span,p{color-scheme:dark}
      `}</style>

      <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}>
        {STARS.map(s=>(<circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s} fill="#7ab0ff" opacity={.27}><animate attributeName="opacity" values=".05;.44;.05" dur={`${s.d}s`} repeatCount="indefinite" begin={`${s.del}s`}/></circle>))}
      </svg>

      {/* Offline Earnings Modal */}
      {offlineEarnings&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:4500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"linear-gradient(160deg,#001428,#000c1e)",border:"1.5px solid rgba(0,200,80,.4)",borderRadius:22,padding:"28px 22px",width:"100%",maxWidth:360,textAlign:"center",boxShadow:"0 0 40px rgba(0,180,60,.2)"}}>
            <div style={{fontSize:48,marginBottom:8}}>💤</div>
            <div style={{fontSize:18,fontWeight:"bold",color:"#40ff80",marginBottom:4}}>Willkommen zurück!</div>
            <div style={{fontSize:12,color:"rgba(100,200,120,.6)",marginBottom:20}}>
              Du warst {offlineEarnings.minutes} Minute{offlineEarnings.minutes!==1?"n":""} offline
            </div>

            {/* Earnings */}
            <div style={{background:"rgba(0,30,15,.6)",border:"1px solid rgba(0,180,60,.3)",borderRadius:14,padding:"16px",marginBottom:16}}>
              <div style={{fontSize:10,color:"rgba(0,200,80,.5)",letterSpacing:2,marginBottom:10}}>OFFLINE-EINNAHMEN</div>
              <div style={{fontSize:22,fontWeight:"bold",color:"#40ff80",marginBottom:4}}>+{fmt(offlineEarnings.cr)} Kr.</div>
              <div style={{fontSize:13,color:"#4090ff"}}>+{fmt(offlineEarnings.sci)} Wissenschaft</div>
              <div style={{fontSize:10,color:"rgba(100,160,100,.4)",marginTop:6}}>50% Effizienz im Offline-Modus</div>
            </div>

            {/* Buttons */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>{
                showRewardedAd(()=>{
                  setCr(c=>c+offlineEarnings.cr); // double by adding again
                  setSci(sc=>sc+offlineEarnings.sci);
                  addToast("📺 ×2 Offline-Einnahmen!",{color:"#40ff80",bg:"rgba(0,25,10,.97)",border:"rgba(0,200,80,.5)",duration:3000});
                  setOfflineEarnings(null);
                });
              }} style={{padding:"16px",background:"linear-gradient(135deg,#1a3800,#2a6000)",border:"1.5px solid rgba(0,200,80,.5)",borderRadius:14,color:"#40ff80",fontSize:14,fontWeight:"bold",cursor:"pointer"}}>
                📺 Werbung -> ×2 Einnahmen!
              </button>
              <button onClick={()=>setOfflineEarnings(null)} style={{padding:"14px",background:"rgba(0,15,40,.5)",border:"1px solid rgba(0,60,120,.3)",borderRadius:14,color:"#4080a0",fontSize:13,cursor:"pointer"}}>
                Einnahmen abholen ✓
              </button>
            </div>
          </div>
        </div>
      )}
      {khaosWarning&&(
        <div style={{position:"fixed",inset:0,zIndex:5000,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(80,0,0,.65)",animation:"khaosFlash .3s ease"}}>

          <div style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:72,marginBottom:8,filter:"drop-shadow(0 0 20px #ff0000)"}}>🚨</div>
            <div style={{fontSize:28,fontWeight:"900",color:"#ff2020",letterSpacing:4,textShadow:"0 0 30px rgba(255,0,0,.8)"}}>ANGRIFF!</div>
            <div style={{fontSize:18,color:"#ff6040",marginTop:6,fontWeight:"bold"}}>{khaosWave?.name}</div>
            <div style={{fontSize:12,color:"rgba(255,100,60,.7)",marginTop:4}}>{khaosWave?.desc}</div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts}/>
      {achToast&&<AchievementToast ach={achToast} onDone={()=>setAchToast(null)}/>}

      {/* Level-Up Toast */}
      {levelUpMsg&&(
        <div style={{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",zIndex:3600,pointerEvents:"none",width:"92%",maxWidth:420}}>
          <div style={{background:"linear-gradient(135deg,rgba(60,0,100,.97),rgba(40,0,80,.97))",border:"2px solid rgba(200,80,255,.6)",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 0 30px rgba(180,0,255,.4)"}}>
            <div style={{fontSize:32}}>⬆️</div>
            <div>
              <div style={{fontSize:9,color:"rgba(200,120,255,.7)",letterSpacing:2}}>LEVEL UP!</div>
              <div style={{fontSize:16,fontWeight:"bold",color:"#e080ff"}}>Level {levelUpMsg.level}</div>
              <div style={{fontSize:11,color:"rgba(180,100,255,.8)"}}>{levelUpMsg.title}</div>
            </div>
          </div>
        </div>
      )}

      {showSpin&&<DailySpin spinRewards={getSpinRewards(credits)} onClose={()=>setShowSpin(false)} onApply={item=>{
        const s=st.current;const ns=item.fn({credits:s.credits,science,mult:s.mult,xdef:s.xdef});
        setCr(ns.credits);if(ns.science!==science)setSci(ns.science);
        if(ns.mult!==s.mult)setMult(ns.mult);if(ns.xdef!==s.xdef)setXdef(ns.xdef);
        setLastSpin(Date.now());setTotalSpins(s=>s+1);addXP(XP_REWARDS.spin);addLog(`🎰 Dreh: ${item.label}`);
        addToast(`🎰 ${item.label}!`,{color:"#a040f0",bg:"rgba(20,0,40,.97)",border:"rgba(160,60,255,.5)",duration:3500});
      }}/>}
      {activeEv&&<EventPopup event={activeEv} credits={credits} onAccept={()=>acceptEv(activeEv)} onDecline={()=>{setEvents(e=>e.filter(x=>x.id!==activeEv.id));setActiveEv(null);}}/>}
      {defAlert&&<DefAlert event={defAlert} onClose={()=>{setDefAlert(null);addToast("🛡️ Investiere ins Militär um die Verteidigung zu stärken!",{color:"#ff8050",bg:"rgba(30,5,0,.97)",border:"rgba(255,100,50,.4)",duration:4000});}}/>}
      {techDetail&&<TechSheet
        tech={techDetail.tech}
        countRef={makeCountRef(techDetail.tech.id)}
        credits={credits}
        mult={mult}
        discount={getSciDiscount(science)}
        onBuy={()=>doInvest(techDetail.pid,techDetail.tech)}
        onClose={()=>setTechDetail(null)}
      />}
      {randRes&&<ResultOverlay result={randRes} onClose={()=>setRandRes(null)}/>}
      {infoSheet&&<InfoSheet info={infoSheet} onClose={()=>setInfo(null)}/>}
      {planetDetails&&<PlanetDetails id={planetDetails} customName={eigeneWeltName} onClose={()=>setPlanetDetails(null)}/>}

      {/* Ad Loading Overlay */}
      {adLoading&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:4000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
          <div style={{fontSize:48}}>📺</div>
          <div style={{fontSize:18,fontWeight:"bold",color:"white"}}>Werbung lädt...</div>
          <div style={{fontSize:12,color:"rgba(150,180,220,.6)"}}>Gleich bekommst du deine Belohnung!</div>
          <div style={{width:200,height:4,background:"rgba(255,255,255,.1)",borderRadius:2,overflow:"hidden",marginTop:8}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#4080ff,#80c0ff)",borderRadius:2,animation:"adProgress 3s linear forwards"}}/>
          </div>

        </div>
      )}

      {/* Eigene Welt Naming Modal */}
      {namingWelt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"linear-gradient(160deg,#0a0028,#140040)",border:"2px solid rgba(200,60,255,.5)",borderRadius:24,padding:"32px 24px",width:"100%",maxWidth:360,textAlign:"center",boxShadow:"0 0 60px rgba(180,0,255,.3)"}}>
            <div style={{fontSize:52,marginBottom:12}}>🌌</div>
            <div style={{fontSize:22,fontWeight:"900",color:"#c040ff",marginBottom:6,textShadow:"0 0 20px rgba(200,60,255,.6)"}}>Deine Welt!</div>
            <div style={{fontSize:13,color:"rgba(180,120,255,.7)",marginBottom:20,lineHeight:1.6}}>Du hast es geschafft – jenseits des Sonnensystems liegt deine eigene Welt. Gib ihr einen Namen!</div>
            <input
              autoFocus
              value={weltNameInput}
              onChange={e=>setWeltNameInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&weltNameInput.trim()&&(setEigeneWeltName(weltNameInput.trim()),setNamingWelt(false))}
              maxLength={24}
              placeholder="Name deiner Welt..."
              style={{width:"100%",padding:"14px",background:"rgba(80,0,120,.3)",border:"1px solid rgba(200,60,255,.4)",borderRadius:12,color:"#e080ff",fontSize:16,outline:"none",marginBottom:16,textAlign:"center",boxSizing:"border-box",fontWeight:"bold"}}
            />
            <button
              onClick={()=>{if(weltNameInput.trim()){setEigeneWeltName(weltNameInput.trim());setNamingWelt(false);}}}
              disabled={!weltNameInput.trim()}
              style={{width:"100%",padding:"16px",background:weltNameInput.trim()?"linear-gradient(135deg,#400080,#8000c0)":"rgba(30,0,50,.5)",border:"2px solid rgba(200,60,255,.5)",borderRadius:14,color:weltNameInput.trim()?"#e080ff":"#604080",fontSize:16,fontWeight:"bold",cursor:weltNameInput.trim()?"pointer":"default",letterSpacing:1}}>
              🌌 Welt erschaffen!
            </button>
            <div style={{fontSize:10,color:"rgba(120,60,160,.5)",marginTop:10}}>Du kannst den Namen später ändern indem du auf den Planeten tippst</div>
          </div>
        </div>
      )}

      {/* HOME */}
      {screen==="home"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:"rgba(0,10,28,.85)",border:"1px solid rgba(0,50,120,.3)",borderRadius:14,padding:"14px"}}>
              <div style={{fontSize:10,color:"#5a80aa",letterSpacing:2,marginBottom:10}}>STATISTIKEN</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {l:"Wissenschaft", v:fmt(science),      i:"🔬", c:"#3080ff", k:"wissenschaft"},
                  {l:"Energie",      v:fmt(energy),       i:"⚡", c:"#ff9020", k:"energie"},
                  {l:"Bevölkerung",  v:fmtPop(population),i:"👥", c:"#40a0c0", k:"bevoelkerung"},
                  {l:"Multiplikator",v:`×${mult.toFixed(2)}`,i:"⚙️",c:"#b040f0",k:"multiplikator"},
                ].map(r=>(
                  <button key={r.l} onClick={()=>setInfo(INFO[r.k])} style={{background:"rgba(0,8,24,.6)",borderRadius:10,padding:"10px",border:"1px solid rgba(0,40,100,.2)",textAlign:"left",cursor:"pointer"}}>
                    <div style={{fontSize:9,color:"#4a6a8a"}}>{r.i} {r.l} <span style={{color:"#2a4060"}}>ℹ</span></div>
                    <div style={{fontSize:15,color:r.c,fontWeight:"bold",marginTop:2}}>{r.v}</div>
                  </button>
                ))}
              </div>
              {slowInvests.length>0&&(
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,60,120,.2)"}}>
                  <div style={{fontSize:9,color:"#6080a8",marginBottom:6}}>📈 AKTIVE INVESTITIONEN ({slowInvests.length})</div>
                  {slowInvests.slice(0,3).map(si=>(
                    <div key={si.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <div style={{flex:1,height:4,background:"rgba(0,60,120,.4)",borderRadius:2}}>
                        <div style={{height:"100%",background:"#3080ff",borderRadius:2,width:`${Math.max(5,(1-(si.ticksLeft/(si.ticksLeft+1)))*100)}%`}}/>
                      </div>
                      <span style={{fontSize:8,color:"#3060a0",minWidth:28}}>{Math.ceil(si.ticksLeft/5)}s</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Multiplikator Werbeboost */}
              <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,60,120,.2)"}}>
                {multBoostActive?(
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(150,0,255,.12)",borderRadius:10,padding:"8px 12px"}}>
                    <span style={{fontSize:16}}>⚡</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#c040ff",fontWeight:"bold"}}>WERBEBOOST AKTIV – ×2 Multiplikator</div>
                      <div style={{fontSize:9,color:"rgba(160,80,255,.6)"}}>Noch {multBoostRemaining} Minute{multBoostRemaining!==1?"n":""}</div>
                    </div>
                  </div>
                ):(
                  <button onClick={()=>showRewardedAd(()=>{
                    setMultBoost({until:Date.now()+600000}); // 10 Minuten
                    setMult(m=>m*2);
                    addToast("📺 ×2 Multiplikator für 10 Minuten aktiv!",{color:"#c040ff",bg:"rgba(20,0,40,.97)",border:"rgba(180,0,255,.5)",duration:4000});

                    setTimeout(()=>{
                      setMult(m=>m/2);
                      setMultBoost(null);
                      addToast("⏰ Werbeboost abgelaufen",{color:"#806090",duration:3000});
                    },600000);
                  })} style={{width:"100%",background:"linear-gradient(135deg,#1a0028,#280040)",border:"1px solid rgba(180,0,255,.3)",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:20}}>📺</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:"bold",color:"#c040ff"}}>Werbung -> ×2 Multiplikator</div>
                      <div style={{fontSize:9,color:"rgba(140,60,200,.7)"}}>10 Minuten lang – alle Einnahmen verdoppelt!</div>
                    </div>
                    <span style={{fontSize:14,color:"#8020c0"}}>›</span>
                  </button>
                )}
              </div>
              {/* Science discount indicator */}
              {science>0&&(()=>{
                const disc=getSciDiscount(science);
                const sciBonus=Math.min(3.0,1.0+science/5000);
                return(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,60,120,.2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:9,color:"#2060a0"}}>
                      🔬 Wissenschafts-Bonus
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {disc>0&&<span style={{fontSize:9,color:"#30c080",background:"rgba(0,80,40,.25)",borderRadius:6,padding:"2px 8px"}}>
                        −{Math.round(disc*100)}% Kosten
                      </span>}
                      <span style={{fontSize:9,color:"#4090ff",background:"rgba(0,50,120,.25)",borderRadius:6,padding:"2px 8px"}}>
                        ×{sciBonus.toFixed(1)} Ereignisse
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {events.length>0&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{fontSize:10,color:"#806020",letterSpacing:2}}>⚡ INVESTITIONSCHANCEN</div>
                  <button onClick={()=>setInfo(INFO.ereignisse)} style={{background:"rgba(200,120,0,.15)",border:"1px solid rgba(200,120,0,.3)",borderRadius:6,color:"#806020",fontSize:9,padding:"2px 7px",cursor:"pointer"}}>ℹ Was ist das?</button>
                </div>
                {events.map(ev=>(
                  <button key={ev.id} onClick={()=>setActiveEv(ev)} style={{width:"100%",background:"rgba(16,8,0,.9)",border:"1px solid rgba(200,120,0,.4)",borderRadius:14,padding:"16px",marginBottom:8,display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:32}}>{ev.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:"bold",color:"#ffa030"}}>{ev.title}</div>
                      <div style={{fontSize:11,color:"#4a5a6a",marginTop:2}}>{PLANET_INFO[ev.planet]?.name} · {fmt(ev.cost)} Kr. -> Ertrag über {ev.secs}s</div>
                    </div>
                    <span style={{fontSize:20,color:"#604010"}}>›</span>
                  </button>
                ))}
              </div>
            )}

            <div style={{fontSize:10,color:"#5a80aa",letterSpacing:2,marginBottom:2}}>STANDORTE</div>
            {Object.entries(PLANET_INFO).map(([id,pi])=>{
              const isU=unlocked.includes(id);
              const t2=TECHS[id]||[];
              const done=t2.filter(t=>invested[t.id]).length;
              const displayName=id==="eigene_welt"?eigeneWeltName:pi.name;
              const isEigene=id==="eigene_welt";
              return(
                <button key={id} onClick={isU?()=>{setSelP(id);setScreen("planet");}:undefined}
                  style={{width:"100%",background:isU?pi.bg:"rgba(0,4,12,.6)",border:`1.5px solid ${isU?(isEigene?"rgba(200,60,255,.6)":pi.color+"60"):"rgba(0,30,60,.28)"}`,borderRadius:16,padding:"14px 16px",opacity:isU?1:.38,display:"flex",alignItems:"center",gap:14,cursor:isU?"pointer":"default",textAlign:"left",overflow:"hidden",position:"relative",
                    boxShadow:isU&&isEigene?"0 0 20px rgba(180,0,255,.2)":undefined}}>
                  <PlanetMini id={id} size={56} animated={isU}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:17,fontWeight:"bold",color:isU?pi.color:"#607898",display:"flex",alignItems:"center",gap:8}}>
                      {displayName}
                      {isU&&isEigene&&<button onClick={e=>{e.stopPropagation();setWeltNameInput(eigeneWeltName);setNamingWelt(true);}} style={{fontSize:10,background:"rgba(180,0,255,.2)",border:"1px solid rgba(200,60,255,.3)",borderRadius:6,color:"#c060ff",padding:"2px 8px",cursor:"pointer"}}>✏️ umbenennen</button>}
                    </div>
                    {isU?(
                      <>
                        <div style={{fontSize:10,color:"#8090a8",marginTop:2}}>
                          {done}/{t2.length} Techs aktiv{stations[id]>0?` · ${stations[id]} Station(en)`:""}
                          {isEigene&&" · 🌌 Endplanet"}
                        </div>
                        <div style={{height:4,background:"rgba(0,0,0,.3)",borderRadius:2,marginTop:6}}>
                          <div style={{width:`${t2.length?done/t2.length*100:0}%`,height:"100%",background:isEigene?"linear-gradient(90deg,#8000c0,#c040ff)":pi.color,borderRadius:2,transition:"width .5s"}}/>
                        </div>
                      </>
                    ):<div style={{fontSize:11,color:"#4a6a80",marginTop:2}}>
                        {isEigene?"🌌 Erschaffe deine eigene Welt – nach Khaos":"🔒 Gesperrt – investiere in Raumfahrt"}
                      </div>}
                  </div>
                  {isU&&<span style={{fontSize:22,color:isEigene?"#c040ff90":pi.color+"90",flexShrink:0}}>›</span>}
                </button>
              );
            })}

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {/* Main spin button */}
              <button onClick={canSpin?()=>setShowSpin(true):undefined} style={{width:"100%",background:canSpin?"linear-gradient(135deg,#0a1a40,#1a2a60)":"rgba(0,4,12,.5)",border:`1.5px solid ${canSpin?"rgba(60,120,255,.45)":"rgba(0,30,60,.22)"}`,borderRadius:16,padding:"18px 16px",display:"flex",alignItems:"center",gap:14,opacity:canSpin?1:.7,cursor:canSpin?"pointer":"default",textAlign:"left"}}>
                <span style={{fontSize:38}}>🎰</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:"bold",color:canSpin?"#5090e0":"#607898"}}>Täglicher Dreh</div>
                  <div style={{fontSize:11,color:"#6080a8",marginTop:2}}>{canSpin?"Nur Gewinne – alle 5 Min. kostenlos!":"Noch nicht bereit…"}</div>
                  <button onTouchStart={e=>{e.stopPropagation();setInfo(INFO.spin);}} onClick={e=>{e.stopPropagation();setInfo(INFO.spin);}} style={{marginTop:6,background:"rgba(160,60,255,.15)",border:"1px solid rgba(160,60,255,.3)",borderRadius:6,color:"#8050c0",fontSize:9,padding:"2px 8px",cursor:"pointer"}}>ℹ Wie funktioniert's?</button>
                </div>
                {canSpin&&<span style={{fontSize:24,color:"#3070c070"}}>›</span>}
              </button>

              {/* Ad spin button – only when cooldown active */}
              {!canSpin&&(
                <button onClick={()=>showRewardedAd(()=>{
                  setShowSpin(true);
                  addToast("📺 Werbung geschaut – Bonus-Dreh frei!",{color:"#40ff80",bg:"rgba(0,30,10,.97)",border:"rgba(0,200,80,.5)",duration:3000});
                })} style={{width:"100%",background:"linear-gradient(135deg,#1a1a00,#2a2a00)",border:"1.5px solid rgba(200,180,0,.4)",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:32}}>📺</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:"bold",color:"#c0b020"}}>Werbung schauen</div>
                    <div style={{fontSize:11,color:"#808020",marginTop:2}}>-> Sofort nochmal drehen!</div>
                  </div>
                  <span style={{fontSize:18,color:"#c0b02070"}}>›</span>
                </button>
              )}
            </div>
          </div>

          <div style={{display:"flex",background:"rgba(0,4,16,.99)",borderTop:"1px solid rgba(0,40,100,.3)",flexShrink:0,overflowX:"auto"}}>
            {[["🏠","Basis","home"],["🌌","Karte","map"],["📅","Aufgaben","daily"],["🏆","Erfolge","ach"],["📊","Stats","stats"],["⚔️","Khaos","khaos"],["🏅","Rang","rank"]].map(([ic,lb,sc])=>(
              <button key={sc} onClick={()=>setScreen(sc)} style={{flex:"0 0 auto",minWidth:52,padding:"11px 4px 14px",background:screen===sc?"rgba(0,30,80,.6)":"transparent",border:"none",borderTop:`2px solid ${screen===sc?"#2a60d0":"transparent"}`,color:screen===sc?"#4080d0":"#4a6a8a",fontSize:8,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:18}}>{ic}</span><span style={{letterSpacing:.5}}>{lb}</span>
              </button>
            ))}
            <button onClick={()=>{
              const s=st.current;
              writeSave(saveSlot,{slot:saveSlot,name:saveName,savedAt:Date.now(),credits:s.credits,science,energy,defence:s.xdef,population,mult:s.mult,xdef:s.xdef,unlocked:s.unlocked,invested:s.invested,stations,lastSpin,clickLevel:clickLevelRef.current,log,eigeneWeltName,achievements,totalClicks,totalEarned,totalSpins,survivedDefZero});
              addToast("💾 Gespeichert!",{color:"#40ff80",duration:1800});
              setTimeout(()=>setSaveSlot(null),700);
            }} style={{flex:1,padding:"13px 4px 16px",background:"transparent",border:"none",borderTop:"2px solid transparent",color:"#4a6a8a",fontSize:9,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span style={{fontSize:22}}>💾</span><span style={{letterSpacing:1}}>Menü</span>
            </button>
          </div>
        </div>
      )}

      {/* PLANET */}
      {screen==="planet"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10,background:pInfo?.bg}}>
          <StickyBar/><UnderAttack/>
          <div style={{background:"rgba(0,0,0,.5)",padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${pInfo?.color}40`,flexShrink:0}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(0,0,0,.45)",border:`1.5px solid ${pInfo?.color}60`,borderRadius:12,color:pInfo?.color,fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
            <span style={{fontSize:24}}>{pInfo?.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:"bold",color:pInfo?.color}}>{selP==="eigene_welt"?eigeneWeltName:pInfo?.name}</div>
              <div style={{fontSize:9,color:"#6080a0"}}>{isUnl?`${techs.filter(t=>invested[t.id]).length}/${techs.length} investiert`:"Gesperrt"}</div>
            </div>
            {PLANET_FACTS[selP]&&<button onClick={()=>setPlanetDetails(selP)} style={{background:`${pInfo?.color}22`,border:`1px solid ${pInfo?.color}50`,borderRadius:10,color:pInfo?.color,fontSize:11,padding:"8px 12px",cursor:"pointer",flexShrink:0}}>📖 Details</button>}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
            {!isUnl?(
              <div style={{textAlign:"center",padding:48,color:"#607898"}}>
                <div style={{fontSize:52,marginBottom:14}}>🔒</div>
                <div style={{fontSize:17,color:"#3a4a5a",marginBottom:10}}>{selP==="eigene_welt"?eigeneWeltName:pInfo?.name} ist gesperrt</div>
                <div style={{fontSize:13}}>Investiere in Raumfahrttechnik um diesen Standort zu erschließen.</div>
              </div>
            ):techs.map(tech=>{
              const cost=getCost(tech);
              const cnt=invested[tech.id]||0;
              const isOnce=tech.type==="multiplier"||tech.type==="unlock";
              const done=cnt>0&&isOnce;
              const can=credits>=cost;
              const typeColor=tech.type==="random"?"#ffa030":tech.type==="multiplier"?"#b030f0":tech.type==="unlock"?"#30e080":"#2880c0";
              const typeName=tech.type==="random"?"🎲 ZUFALL":tech.type==="multiplier"?"✨ MULTI":tech.type==="unlock"?"🔓 FREISCH.":"📈 STETIG";
              return(
                <button key={tech.id} onClick={()=>setTechDetail({tech,pid:selP})} style={{width:"100%",background:done?"rgba(0,28,10,.85)":can?"rgba(0,10,30,.92)":"rgba(0,4,12,.72)",border:`1.5px solid ${done?"rgba(0,140,50,.4)":can?pInfo?.color+"55":"rgba(0,30,60,.3)"}`,borderRadius:16,padding:"14px",opacity:done?.65:can?1:.42,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:28,flexShrink:0}}>{tech.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:"bold",color:done?"#28a848":can?"#90c8f0":"#2a3c50",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      {tech.name} {done&&<span style={{color:"#28a848"}}>✓</span>}
                      {cnt>1&&<span style={{fontSize:11,color:"#406070",background:"rgba(0,60,120,.4)",borderRadius:6,padding:"1px 6px"}}>Stufe {cnt}</span>}
                    </div>
                    <div style={{fontSize:9,color:typeColor,letterSpacing:1,marginTop:2}}>{typeName}</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:5}}>
                      {(tech.cr||0)>0&&<span style={{fontSize:9,background:"rgba(0,100,40,.2)",borderRadius:5,padding:"2px 7px",color:"#28a050"}}>+{fmt((tech.cr||0)*mult)}/s</span>}
                      {(tech.def||0)>0&&<span style={{fontSize:9,background:"rgba(0,100,80,.2)",borderRadius:5,padding:"2px 7px",color:"#28a090"}}>+{tech.def} Vert.</span>}
                      {tech.type==="random"&&<span style={{fontSize:9,background:"rgba(200,100,0,.18)",borderRadius:5,padding:"2px 7px",color:"#b07030"}}>{tech.bonus}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    {!done&&<div style={{fontSize:13,fontWeight:"bold",color:can?"#28aa50":"#602818"}}>💰{fmt(cost)}</div>}
                    <div style={{fontSize:10,color:"#6080a8",marginTop:4}}>Details ›</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAP */}
      {screen==="map"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <SolarMap unlocked={unlocked} stations={stations} onBack={()=>setScreen("home")} onTap={id=>{setSelP(id);setScreen("planet");}}/>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {screen==="ach"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(0,60,150,.3)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(0,20,50,.7)",border:"1px solid rgba(0,80,180,.4)",borderRadius:10,color:"#4080c0",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
            <span style={{color:"#ffd040",fontSize:22}}>🏆</span>
            <div>
              <span style={{color:"#ffd040",fontSize:15,fontWeight:"bold"}}>Erfolge</span>
              <span style={{fontSize:11,color:"#4a6a80",marginLeft:10}}>{achievements.length}/{ACHIEVEMENTS.length} freigeschaltet</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{background:"rgba(0,10,30,.8)",padding:"12px 16px",borderBottom:"1px solid rgba(0,40,100,.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:10,color:"#4a6a80"}}>Fortschritt zur Eigenen Welt</span>
              <span style={{fontSize:10,color:achievements.length>=ACHIEVEMENTS_NORMAL.length?"#c040ff":"#4a6a80",fontWeight:"bold"}}>
                {achievements.filter(id=>id!=="all_done").length}/{ACHIEVEMENTS_NORMAL.length}
              </span>
            </div>
            <div style={{height:6,background:"rgba(0,40,100,.4)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",background:`linear-gradient(90deg,#ffd040,${achievements.length>=ACHIEVEMENTS_NORMAL.length?"#c040ff":"#ff8020"})`,width:`${Math.min(100,achievements.filter(id=>id!=="all_done").length/ACHIEVEMENTS_NORMAL.length*100)}%`,transition:"width .5s",borderRadius:3}}/>
            </div>
            {achievements.length>=ACHIEVEMENTS_NORMAL.length?(
              <div style={{fontSize:11,color:"#c040ff",marginTop:6,textAlign:"center",fontWeight:"bold"}}>🌌 ALLE GESCHAFFT – Eigene Welt freigeschaltet!</div>
            ):(
              <div style={{fontSize:10,color:"#4a6a80",marginTop:4,textAlign:"center"}}>
                Noch {ACHIEVEMENTS_NORMAL.length-achievements.filter(id=>id!=="all_done").length} Herausforderungen bis zur Eigenen Welt 🌌
              </div>
            )}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {/* Final goal card */}
            {(()=>{
              const allDone=achievements.filter(id=>id!=="all_done").length>=ACHIEVEMENTS_NORMAL.length;
              const finalAch=ACHIEVEMENTS.find(a=>a.id==="all_done");
              return(
                <div style={{background:allDone?"linear-gradient(135deg,rgba(80,0,120,.9),rgba(40,0,80,.95))":"rgba(10,0,20,.8)",border:`2px solid ${allDone?"rgba(200,60,255,.6)":"rgba(80,0,120,.3)"}`,borderRadius:16,padding:"18px",marginBottom:8,boxShadow:allDone?"0 0 20px rgba(180,0,255,.3)":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:36,filter:allDone?"none":"grayscale(1) brightness(.4)"}}>🌌</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:"900",color:allDone?"#e080ff":"#404060",letterSpacing:1}}>ULTIMATIVES ZIEL</div>
                      <div style={{fontSize:15,fontWeight:"bold",color:allDone?"#c040ff":"#506070",marginTop:2}}>Eigene Welt erschaffen</div>
                      <div style={{fontSize:11,color:allDone?"rgba(180,100,255,.8)":"#304050",marginTop:3,lineHeight:1.5}}>
                        {allDone?"🎉 Du hast ALLE Herausforderungen gemeistert! Deine Welt wartet auf dich.":"Schließe alle anderen Herausforderungen ab um deine eigene Welt zu erschaffen."}
                      </div>
                    </div>
                    {allDone&&<span style={{fontSize:24}}>✅</span>}
                  </div>
                  {!allDone&&(
                    <div style={{marginTop:10,height:4,background:"rgba(80,0,120,.3)",borderRadius:2}}>
                      <div style={{height:"100%",background:"linear-gradient(90deg,#8020c0,#c040ff)",width:`${achievements.filter(id=>id!=="all_done").length/ACHIEVEMENTS_NORMAL.length*100}%`,borderRadius:2,transition:"width .5s"}}/>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Normal achievements */}
            {ACHIEVEMENTS_NORMAL.map(ach=>{
              const done=achievements.includes(ach.id);
              return(
                <div key={ach.id} style={{background:done?"rgba(20,15,0,.9)":"rgba(0,6,18,.7)",border:`1.5px solid ${done?"rgba(255,200,0,.4)":"rgba(0,30,60,.25)"}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,opacity:done?1:.5}}>
                  <div style={{fontSize:26,flexShrink:0,filter:done?"none":"grayscale(1)"}}>{ach.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:"bold",color:done?"#ffd040":"#607898"}}>{ach.name}</div>
                    <div style={{fontSize:10,color:done?"rgba(200,160,80,.7)":"#4a6070",marginTop:2}}>{ach.desc}</div>
                    {done&&(
                      <div style={{fontSize:10,marginTop:3,display:"flex",gap:6,flexWrap:"wrap"}}>
                        {ach.reward.cr&&<span style={{color:"#40ff80"}}>+{fmt(ach.reward.cr)} Kr.</span>}
                        {ach.reward.sci&&<span style={{color:"#4090ff"}}>+{fmt(ach.reward.sci)} Wiss.</span>}
                        {ach.reward.mult&&<span style={{color:"#c040ff"}}>×{ach.reward.mult} Mult.</span>}
                      </div>
                    )}
                  </div>
                  {done&&<span style={{fontSize:18}}>✅</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY CHALLENGES */}
      {screen==="daily"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(0,60,150,.3)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(0,20,50,.7)",border:"1px solid rgba(0,80,180,.4)",borderRadius:10,color:"#4080c0",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
            <span style={{fontSize:22}}>📅</span>
            <div>
              <div style={{fontSize:15,fontWeight:"bold",color:"#80c0ff"}}>Tägliche Aufgaben</div>
              <div style={{fontSize:10,color:"#4a6a80"}}>Reset täglich um Mitternacht</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:12}}>
            {(()=>{
              const seed=getDaySeed();
              const challenges=getDailyChallenges(seed);
              const claimed=Object.keys(dailyClaimed).filter(k=>dailyClaimed[k]).length;
              return(<>
                {/* Progress */}
                <div style={{background:"rgba(0,15,40,.8)",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:28}}>📅</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:"#80c0ff",fontWeight:"bold"}}>Heute: {claimed}/3 geschafft</div>
                    <div style={{height:6,background:"rgba(0,40,100,.4)",borderRadius:3,marginTop:6}}>
                      <div style={{height:"100%",background:"linear-gradient(90deg,#2060ff,#40c0ff)",width:`${claimed/3*100}%`,borderRadius:3,transition:"width .5s"}}/>
                    </div>
                  </div>
                  {claimed===3&&<span style={{fontSize:24}}>🎉</span>}
                </div>
                {/* Challenges */}
                {challenges.map(c=>{
                  const prog=dailyProgress[c.id]||0;
                  const done=prog>=c.target;
                  const claimed2=!!dailyClaimed[c.id];
                  const pct=Math.min(100,prog/c.target*100);
                  return(
                    <div key={c.id} style={{background:done?"rgba(0,25,10,.9)":"rgba(0,10,30,.8)",border:`1.5px solid ${done?"rgba(0,200,80,.4)":"rgba(0,60,150,.3)"}`,borderRadius:16,padding:"16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                        <span style={{fontSize:30}}>{c.emoji}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:"bold",color:done?"#40ff80":"#90c0f0"}}>{c.name}</div>
                          <div style={{fontSize:11,color:"#4a6a80",marginTop:2}}>{c.desc}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          {c.reward.cr&&<div style={{fontSize:11,color:"#28aa50"}}>+{fmt(c.reward.cr)} Kr.</div>}
                          {c.reward.sci&&<div style={{fontSize:11,color:"#4080ff"}}>+{fmt(c.reward.sci)} Wiss.</div>}
                          {c.reward.mult&&<div style={{fontSize:11,color:"#c040ff"}}>×{c.reward.mult}</div>}
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{height:6,background:"rgba(0,40,100,.3)",borderRadius:3,marginBottom:8}}>
                        <div style={{height:"100%",background:done?"#28aa50":"#2060c0",width:`${pct}%`,borderRadius:3,transition:"width .3s"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:10,color:"#4a6a80"}}>{fmt(prog)} / {fmt(c.target)}</span>
                        {done&&!claimed2?(
                          <button onClick={()=>{
                            setDailyClaimed(d=>({...d,[c.id]:true}));
                            if(c.reward.cr) setCr(cr=>cr+c.reward.cr);
                            if(c.reward.sci) setSci(sc=>sc+c.reward.sci);
                            if(c.reward.mult) setMult(m=>m*c.reward.mult);
                            addXP(XP_REWARDS.dailyDone);
                            addToast(`📅 Aufgabe abgeschlossen: ${c.name}!`,{color:"#40ff80",bg:"rgba(0,25,10,.97)",border:"rgba(0,200,80,.5)",duration:3000});
                          }} style={{padding:"8px 18px",background:"linear-gradient(135deg,#0a3a18,#1a6030)",border:"1px solid rgba(0,200,80,.4)",borderRadius:10,color:"#40ff80",fontSize:12,fontWeight:"bold",cursor:"pointer"}}>
                            Abholen! ✓
                          </button>
                        ):claimed2?(
                          <span style={{fontSize:11,color:"#28aa50"}}>✅ Abgeholt</span>
                        ):(
                          <span style={{fontSize:10,color:"#304050"}}>{Math.round(pct)}%</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>);
            })()}
          </div>
        </div>
      )}

      {/* STATS */}
      {screen==="stats"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(0,60,150,.3)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(0,20,50,.7)",border:"1px solid rgba(0,80,180,.4)",borderRadius:10,color:"#4080c0",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
            <span style={{fontSize:22}}>📊</span>
            <div style={{fontSize:15,fontWeight:"bold",color:"#80c0ff"}}>Statistiken</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
            {[
              {label:"📅 Spieljahr",         value:`${gameYear} n.Chr.`},
              {label:"⏱️ Spielzeit",          value:(()=>{const h=Math.floor(totalPlaytime/3600);const m=Math.floor((totalPlaytime%3600)/60);const s2=totalPlaytime%60;return h>0?`${h}h ${m}m`:`${m}m ${s2}s`;})()},
              {label:"💰 Gesamt verdient",  value:fmt(totalEarned)+" Kr."},
              {label:"💎 Peak Kredite",     value:fmt(peakCredits)+" Kr."},
              {label:"⚙️ Peak Multiplikator",value:`×${peakMult.toFixed(2)}`},
              {label:"🔬 Wissenschaft",     value:fmt(science)},
              {label:"👆 Gesamt Klicks",    value:fmt(totalClicks)},
              {label:"🎰 Gesamt Drehe",     value:fmt(totalSpins)},
              {label:"⚡ Ereignisse",       value:fmt(totalEvents)},
              {label:"🔧 Techs gekauft",    value:fmt(totalTechsBought)},
              {label:"🪐 Planeten",         value:`${unlocked.length} von ${Object.keys(PLANET_INFO).length}`},
              {label:"🏆 Erfolge",          value:`${achievements.length} von ${ACHIEVEMENTS.length}`},
              {label:"👥 Bevölkerung",      value:fmtPop(population)},
              {label:"⚡ Energie",          value:fmt(energy)},
              {label:"🛡️ Verteidigung",     value:fmt(defence)},
            ].map(({label,value})=>(
              <div key={label} style={{background:"rgba(0,10,30,.7)",border:"1px solid rgba(0,40,100,.25)",borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:"#6080a0"}}>{label}</span>
                <span style={{fontSize:14,fontWeight:"bold",color:"#90c8f0"}}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KHAOS WAVES */}
      {screen==="khaos"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(150,20,20,.4)",display:"flex",alignItems:"center",gap:12,flexShrink:0,background:"rgba(20,0,0,.5)"}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(30,5,5,.7)",border:"1px solid rgba(150,40,40,.4)",borderRadius:10,color:"#c06060",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
            <span style={{fontSize:22}}>⚔️</span>
            <div>
              <div style={{fontSize:15,fontWeight:"bold",color:"#ff8060"}}>Khaos-Angriffe</div>
              <div style={{fontSize:10,color:"#804040"}}>Verteidige das Sonnensystem!</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:12}}>

            {/* Active wave */}
            {khaosWave?(
              <div style={{background:"linear-gradient(135deg,rgba(40,0,0,.95),rgba(30,0,0,.98))",border:"2px solid rgba(255,40,40,.5)",borderRadius:16,padding:"20px",boxShadow:"0 0 30px rgba(255,0,0,.2)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <span style={{fontSize:40}}>{khaosWave.emoji}</span>
                  <div>
                    <div style={{fontSize:10,color:"rgba(255,100,100,.7)",letterSpacing:2}}>⚠️ AKTIVER ANGRIFF</div>
                    <div style={{fontSize:18,fontWeight:"bold",color:"#ff6060"}}>{khaosWave.name}</div>
                  </div>
                  <div style={{marginLeft:"auto",textAlign:"center"}}>
                    <div style={{fontSize:28,fontWeight:"bold",color:"#ff4040"}}>{khaosCountdown}s</div>
                    <div style={{fontSize:9,color:"#803030"}}>verbleibend</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"rgba(200,100,100,.8)",marginBottom:12}}>{khaosWave.desc}</div>
                <div style={{background:"rgba(255,0,0,.08)",borderRadius:10,padding:"10px",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:"#a05050"}}>Schaden bei Ablauf</span>
                  <span style={{fontSize:14,color:"#ff6060",fontWeight:"bold"}}>-{fmt(khaosWave.defDrain)} Verteidigung</span>
                </div>
                {/* countdown bar */}
                <div style={{height:6,background:"rgba(255,0,0,.15)",borderRadius:3,marginTop:10}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#ff2020,#ff8040)",width:`${khaosCountdown/(khaosWave?.duration||60)*100}%`,borderRadius:3,transition:"width 1s linear"}}/>
                </div>
                <div style={{marginTop:10,fontSize:11,color:"#804040",textAlign:"center"}}>💡 Investiere jetzt ins Militär um den Schaden zu reduzieren!</div>
              </div>
            ):(
              <div style={{background:"rgba(0,15,30,.8)",border:"1px solid rgba(0,60,120,.3)",borderRadius:14,padding:"16px",textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>🛡️</div>
                <div style={{fontSize:14,color:"#4080c0",fontWeight:"bold"}}>Kein aktiver Angriff</div>
                <div style={{fontSize:11,color:"#304050",marginTop:4}}>
                  {nextKhaosIn>0?`Nächster Angriff in ${Math.floor(nextKhaosIn/60)}m ${nextKhaosIn%60}s`:"Angriff steht bevor..."}
                </div>
              </div>
            )}

            {/* Wave history / info */}
            <div style={{fontSize:10,color:"#4a6a80",letterSpacing:2,marginTop:4}}>MÖGLICHE ANGRIFFSWELLEN</div>
            {KHAOS_WAVES.map(w=>(
              <div key={w.id} style={{background:"rgba(15,0,0,.7)",border:"1px solid rgba(100,20,20,.3)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,opacity:unlocked.length>=w.minPlanets?1:.4}}>
                <span style={{fontSize:24}}>{w.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:"bold",color:"#c06060"}}>{w.name}</div>
                  <div style={{fontSize:10,color:"#604040",marginTop:2}}>{w.desc}</div>
                  <div style={{fontSize:9,color:"#503030",marginTop:3}}>Braucht {w.minPlanets} Planeten · -{fmt(w.defDrain)} Vert. · {w.duration}s Dauer</div>
                </div>
                {unlocked.length<w.minPlanets&&<span style={{fontSize:11,color:"#403030"}}>🔒</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RANGLISTE */}
      {screen==="rank"&&(()=>{
        const lb=getLeaderboard();
        const myId=(playerNameRef.current||"").toLowerCase().replace(/\s/g,"_");
        return(
          <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
            <StickyBar/><UnderAttack/>
            <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(100,60,0,.4)",display:"flex",alignItems:"center",gap:12,flexShrink:0,background:"rgba(15,8,0,.5)"}}>
              <button onClick={()=>setScreen("home")} style={{background:"rgba(20,12,0,.7)",border:"1px solid rgba(180,120,0,.3)",borderRadius:10,color:"#c0a040",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
              <span style={{fontSize:22}}>🏅</span>
              <div>
                <div style={{fontSize:15,fontWeight:"bold",color:"#ffd040"}}>Rangliste</div>
                <div style={{fontSize:10,color:"#806030"}}>Top Spieler nach Level & XP</div>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontSize:11,color:"#c0a040",fontWeight:"bold"}}>Du: Lvl {level}</div>
                <div style={{fontSize:9,color:"#806030"}}>{getLevelTitle(level)}</div>
              </div>
            </div>

            {/* My rank */}
            {(()=>{
              const myRank=lb.findIndex(e=>e.playerId===myId);
              if(myRank<0) return null;
              return(
                <div style={{padding:"10px 14px",background:"rgba(40,20,0,.6)",borderBottom:"1px solid rgba(180,120,0,.3)"}}>
                  <div style={{fontSize:10,color:"#806030",marginBottom:4}}>📍 Dein Rang</div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18,color:"#ffd040",fontWeight:"bold",minWidth:32}}>#{myRank+1}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:"#ffd040",fontWeight:"bold"}}>{lb[myRank].playerName}</div>
                      <div style={{fontSize:10,color:"#806030"}}>{getLevelTitle(lb[myRank].level)}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:15,fontWeight:"bold",color:"#ffd040"}}>Lvl {lb[myRank].level}</div>
                      <div style={{fontSize:9,color:"#806030"}}>{fmt(lb[myRank].xp||0)} XP</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
              {lb.length===0?(
                <div style={{textAlign:"center",padding:40,color:"rgba(180,140,60,.4)"}}>
                  <div style={{fontSize:32,marginBottom:12}}>👾</div>
                  <div style={{fontSize:13}}>Noch keine Spieler.<br/>Spiele und level auf!</div>
                </div>
              ):lb.map((e,i)=>(
                <button key={e.playerId} onClick={()=>setSelPlayer(e)} style={{
                  width:"100%",textAlign:"left",
                  background:e.playerId===myId?"linear-gradient(135deg,rgba(40,25,0,.95),rgba(60,35,0,.98))":i===0?"linear-gradient(135deg,rgba(30,22,0,.9),rgba(50,35,0,.95))":"rgba(0,8,20,.7)",
                  border:`1.5px solid ${e.playerId===myId?"rgba(255,200,0,.6)":i===0?"rgba(220,180,0,.4)":i===1?"rgba(160,160,160,.25)":i===2?"rgba(160,80,30,.25)":"rgba(0,40,80,.2)"}`,
                  borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                  <div style={{fontSize:18,flexShrink:0,minWidth:28,textAlign:"center"}}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`}
                  </div>
                  <div style={{fontSize:22,flexShrink:0}}>{e.avatar||"🚀"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:"bold",color:e.playerId===myId?"#ffd040":i<3?"#e0c060":"#90b0d0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {e.playerName}{e.playerId===myId?" 👈":""}
                    </div>
                    <div style={{fontSize:9,color:"rgba(140,110,40,.6)",marginTop:1}}>{getLevelTitle(e.level)} · {e.planets||1} 🪐</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:15,fontWeight:"bold",color:e.playerId===myId?"#ffd040":i<3?"#d0a030":"#607898"}}>Lvl {e.level}</div>
                    <div style={{fontSize:9,color:"rgba(120,90,30,.5)"}}>{fmt(e.xp||0)} XP</div>
                  </div>
                </button>
              ))}

              {/* Player detail modal */}
              {selPlayer&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)setSelPlayer(null);}}>
                  <div style={{background:"linear-gradient(180deg,#0a0800 0%,#050400 100%)",border:"1px solid rgba(200,160,0,.3)",borderRadius:"22px 22px 0 0",padding:"24px 20px 48px",width:"100%",maxWidth:500,maxHeight:"85vh",overflowY:"auto"}}>
                    <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 16px"}}/>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                      <div style={{fontSize:36,width:60,height:60,borderRadius:30,background:"linear-gradient(135deg,#1a1000,#2a2000)",border:"2px solid rgba(200,160,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {selPlayer.avatar||"🚀"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:18,fontWeight:"bold",color:"#ffd040"}}>{selPlayer.playerName}</div>
                        <div style={{fontSize:11,color:"rgba(200,160,60,.6)"}}>{getLevelTitle(selPlayer.level)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontWeight:"bold",color:"#ffd040"}}>Lvl {selPlayer.level}</div>
                        <div style={{fontSize:10,color:"rgba(180,140,40,.5)"}}>{fmt(selPlayer.xp||0)} XP</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                      {[
                        {icon:"🪐",label:"Planeten",    value:`${selPlayer.planets||1} / ${Object.keys(PLANET_INFO).length}`},
                        {icon:"📅",label:"Spieljahr",   value:`${selPlayer.gameYear||2024}`},
                        {icon:"🔬",label:"Wissenschaft",value:fmt(selPlayer.science||0)},
                        {icon:"👆",label:"Klicks",      value:fmt(selPlayer.totalClicks||0)},
                        {icon:"🏆",label:"Erfolge",     value:`${selPlayer.achievements||0} / ${ACHIEVEMENTS.length}`},
                        {icon:"🎰",label:"Drehe",       value:fmt(selPlayer.totalSpins||0)},
                        {icon:"🔧",label:"Techs",       value:fmt(selPlayer.totalTechsBought||0)},
                        {icon:"⭐",label:"Level",       value:selPlayer.level},
                      ].map(({icon,label,value})=>(
                        <div key={label} style={{background:"rgba(20,14,0,.7)",border:"1px solid rgba(150,110,0,.2)",borderRadius:12,padding:"10px 12px"}}>
                          <div style={{fontSize:9,color:"rgba(160,120,40,.5)"}}>{icon} {label}</div>
                          <div style={{fontSize:14,fontWeight:"bold",color:"#c0a040",marginTop:2}}>{value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{background:"rgba(20,14,0,.5)",borderRadius:12,padding:"10px 14px",marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:10,color:"rgba(200,160,60,.5)"}}>XP Fortschritt</span>
                        <span style={{fontSize:10,color:"rgba(200,160,60,.5)"}}>{Math.round(Math.min(100,(selPlayer.xp||0)/getXpForLevel(selPlayer.level||1)*100))}%</span>
                      </div>
                      <div style={{height:6,background:"rgba(100,70,0,.3)",borderRadius:3}}>
                        <div style={{height:"100%",background:"linear-gradient(90deg,#a06010,#ffd040)",borderRadius:3,width:`${Math.min(100,(selPlayer.xp||0)/getXpForLevel(selPlayer.level||1)*100)}%`}}/>
                      </div>
                    </div>
                    <button onClick={()=>setSelPlayer(null)} style={{width:"100%",padding:"14px",borderRadius:14,background:"rgba(20,14,0,.6)",border:"1px solid rgba(200,160,0,.3)",color:"#c0a040",fontSize:14,fontWeight:"bold",cursor:"pointer"}}>
                      Schließen ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
        );
      })()}

      {/* LOG */}
      {screen==="log"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          <StickyBar/><UnderAttack/>
          <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(0,60,150,.3)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(0,20,50,.7)",border:"1px solid rgba(0,80,180,.4)",borderRadius:10,color:"#4080c0",fontSize:14,padding:"10px 16px",cursor:"pointer"}}><- Zurueck</button>
            <span style={{color:"#4090e0",fontSize:15,fontWeight:"bold"}}>📡 Protokoll</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
            {log.map((entry,i)=>(
              <div key={i} style={{fontSize:12,color:i===0?"#5090d0":"#607898",borderLeft:`3px solid ${i===0?"rgba(0,100,220,.5)":"rgba(0,30,60,.2)"}`,paddingLeft:12,paddingBottom:8,lineHeight:1.6}}>{entry}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
