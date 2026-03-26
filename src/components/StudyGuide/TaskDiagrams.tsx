import type React from 'react';

const F = "'Caveat', cursive";

function DiagramWrapper({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 overflow-x-auto my-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      {children}
      <p className="text-center text-gray-400 dark:text-gray-500 mt-2" style={{ fontFamily: F, fontSize: 13 }}>{caption}</p>
    </div>
  );
}

const DEFS = (
  <defs>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <marker id="ah" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#334155"/></marker>
    <marker id="ahb" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#4a9eff"/></marker>
    <marker id="ahr" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#ef4444"/></marker>
    <marker id="ahg" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#22c55e"/></marker>
  </defs>
);

export const TASK_DIAGRAMS: Record<string, React.ReactNode> = {

  "1.1": (
    <DiagramWrapper caption="Orchestrator fans out to parallel agents, then synthesizes results">
      <svg viewBox="0 0 520 280" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">THE ORCHESTRATOR PATTERN</text>
        {/* Orchestrator */}
        <rect x="170" y="36" width="180" height="52" rx="12" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="58" textAnchor="middle" fontSize="17" fontWeight="700" fill="#0369a1">🧠 Orchestrator</text>
        <text x="260" y="76" textAnchor="middle" fontSize="13" fill="#0284c7">Plans · Delegates · Synthesizes</text>
        {/* Fan-out arrows */}
        <path d="M220,88 C180,108 130,118 110,138" stroke="#4a9eff" strokeWidth="2.5" fill="none" strokeDasharray="5,3" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <path d="M260,88 L260,138" stroke="#4a9eff" strokeWidth="2.5" fill="none" strokeDasharray="5,3" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <path d="M300,88 C340,108 390,118 410,138" stroke="#4a9eff" strokeWidth="2.5" fill="none" strokeDasharray="5,3" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <text x="260" y="120" textAnchor="middle" fontSize="12" fill="#94a3b8" fontStyle="italic">delegate sub-tasks</text>
        {/* Agent boxes */}
        {[["40","138","Agent A","Search"],["185","138","Agent B","Analyze"],["330","138","Agent C","Validate"]].map(([x,y,name,role],i)=>(
          <g key={i}>
            <rect x={+x} y={+y} width="135" height="52" rx="10" fill="#f0f9ff" stroke="#4a9eff" strokeWidth="2" filter="url(#rough)"/>
            <text x={+x+67} y={+y+22} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1d4ed8">{name}</text>
            <text x={+x+67} y={+y+38} textAnchor="middle" fontSize="12" fill="#3b82f6">{role}</text>
          </g>
        ))}
        {/* Fan-in arrows */}
        <path d="M107,190 C140,210 200,220 240,230" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M252,190 L252,230" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M397,190 C360,210 310,220 270,230" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <text x="260" y="222" textAnchor="middle" fontSize="12" fill="#94a3b8" fontStyle="italic">merge results</text>
        {/* Synthesizer */}
        <rect x="170" y="232" width="180" height="40" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="257" textAnchor="middle" fontSize="16" fontWeight="700" fill="#166534">✓ Final Response</text>
      </svg>
    </DiagramWrapper>
  ),

  "1.2": (
    <DiagramWrapper caption="4 memory types — choose based on persistence needs and retrieval speed">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">AGENT MEMORY TYPES</text>
        {[
          ["20","40","#e0f2fe","#4a9eff","#0369a1","In-Context","messages[] array","Fast · Limited · Temporary"],
          ["270","40","#f0fdf4","#22c55e","#166534","External","Vector DB / files","Persistent · Semantic search"],
          ["20","160","#fef9c3","#f59e0b","#92400e","Episodic","Past interactions","Experience-based recall"],
          ["270","160","#fdf4ff","#a855f7","#6b21a8","Semantic","Knowledge base","Facts & long-term concepts"],
        ].map(([x,y,bg,stroke,tc,name,store,desc],i)=>(
          <g key={i}>
            <rect x={+x} y={+y} width="230" height="90" rx="12" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x={+x+115} y={+y+26} textAnchor="middle" fontSize="16" fontWeight="700" fill={tc as string}>{name}</text>
            <text x={+x+115} y={+y+48} textAnchor="middle" fontSize="13" fontWeight="600" fill={tc as string}>{store}</text>
            <text x={+x+115} y={+y+68} textAnchor="middle" fontSize="12" fill="#64748b">{desc}</text>
          </g>
        ))}
        {/* Center arrows */}
        <path d="M250,85 L270,85" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M250,205 L270,205" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M135,130 L135,160" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M385,130 L385,160" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
      </svg>
    </DiagramWrapper>
  ),

  "1.3": (
    <DiagramWrapper caption="Parallel execution cuts total time — identify independent tasks and run them concurrently">
      <svg viewBox="0 0 520 280" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">DEPENDENCY GRAPH</text>
        {/* Nodes */}
        <rect x="200" y="36" width="120" height="40" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="61" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">START</text>
        <path d="M210,76 L130,116" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <path d="M310,76 L390,116" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="60" y="118" width="140" height="40" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="130" y="138" textAnchor="middle" fontSize="14" fontWeight="700" fill="#166534">Task A</text>
        <text x="130" y="153" textAnchor="middle" fontSize="11" fill="#166534">Search</text>
        <rect x="320" y="118" width="140" height="40" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="390" y="138" textAnchor="middle" fontSize="14" fontWeight="700" fill="#166534">Task B</text>
        <text x="390" y="153" textAnchor="middle" fontSize="11" fill="#166534">Analyze</text>
        <text x="260" y="148" textAnchor="middle" fontSize="13" fill="#f59e0b" fontWeight="700">⚡ parallel</text>
        {/* Middle nodes */}
        <path d="M130,158 L190,198" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M390,158 L330,198" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="175" y="200" width="170" height="40" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="225" textAnchor="middle" fontSize="15" fontWeight="700" fill="#92400e">Task C — Synthesize</text>
        <path d="M260,240 L260,260" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="195" y="260" width="130" height="16" rx="6" fill="#334155"/>
        <text x="260" y="272" textAnchor="middle" fontSize="12" fill="white">DONE</text>
        {/* Anti-pattern */}
        <rect x="4" y="220" width="155" height="50" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2" filter="url(#rough)"/>
        <text x="82" y="238" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="82" y="254" textAnchor="middle" fontSize="11" fill="#ef4444">Running A then B</text>
        <text x="82" y="267" textAnchor="middle" fontSize="11" fill="#ef4444">sequentially = wasted time</text>
      </svg>
    </DiagramWrapper>
  ),

  "1.4": (
    <DiagramWrapper caption="Human-in-the-loop — gate irreversible or high-risk actions on human approval">
      <svg viewBox="0 0 520 300" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">HUMAN-IN-THE-LOOP</text>
        <rect x="185" y="36" width="150" height="42" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="62" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">Agent proposes action</text>
        <path d="M260,78 L260,108" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        {/* Diamond */}
        <polygon points="260,110 320,145 260,180 200,145" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="141" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Human</text>
        <text x="260" y="157" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Review?</text>
        {/* Yes */}
        <path d="M260,180 L260,218" stroke="#22c55e" strokeWidth="2.5" fill="none" markerEnd="url(#ahg)" strokeLinecap="round"/>
        <text x="268" y="202" fontSize="13" fill="#22c55e" fontWeight="700">YES</text>
        <rect x="185" y="220" width="150" height="40" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="245" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">✓ Execute</text>
        {/* No */}
        <path d="M320,145 L430,145 L430,62 L345,62" stroke="#ef4444" strokeWidth="2.5" fill="none" markerEnd="url(#ahr)" strokeLinecap="round"/>
        <text x="428" y="108" fontSize="13" fill="#ef4444" fontWeight="700" textAnchor="middle">NO</text>
        <text x="380" y="136" fontSize="13" fill="#ef4444" fontStyle="italic">Revise</text>
        {/* Checkpoints */}
        <rect x="10" y="100" width="150" height="90" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5"/>
        <text x="85" y="118" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">Gate on:</text>
        <text x="85" y="134" textAnchor="middle" fontSize="12" fill="#64748b">• Irreversible actions</text>
        <text x="85" y="150" textAnchor="middle" fontSize="12" fill="#64748b">• High-risk operations</text>
        <text x="85" y="166" textAnchor="middle" fontSize="12" fill="#64748b">• Ambiguous intent</text>
        <text x="85" y="182" textAnchor="middle" fontSize="12" fill="#64748b">• Large data changes</text>
        {/* Anti-pattern */}
        <rect x="360" y="210" width="150" height="60" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="435" y="230" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="435" y="248" textAnchor="middle" fontSize="11" fill="#ef4444">Asking human for</text>
        <text x="435" y="262" textAnchor="middle" fontSize="11" fill="#ef4444">every small action</text>
      </svg>
    </DiagramWrapper>
  ),

  "1.5": (
    <DiagramWrapper caption="Match recovery strategy to error type — retry transient, fallback permanent, escalate fatal">
      <svg viewBox="0 0 520 290" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">ERROR HANDLING STRATEGIES</text>
        {[
          ["Transient Error","(timeout, 429)","Retry with backoff: 1s → 2s → 4s","#e0f2fe","#4a9eff","#0369a1",40],
          ["Tool Error","(bad params)","Fallback tool or graceful degradation","#fef9c3","#f59e0b","#92400e",130],
          ["Fatal Error","(auth, crash)","Stop + notify human immediately","#fff1f2","#ef4444","#b91c1c",220],
        ].map(([type,sub,action,bg,stroke,tc,y],i)=>(
          <g key={i}>
            <rect x="20" y={+y} width="160" height="62" rx="10" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x="100" y={+y+22} textAnchor="middle" fontSize="15" fontWeight="700" fill={tc as string}>{type}</text>
            <text x="100" y={+y+38} textAnchor="middle" fontSize="12" fill={tc as string}>{sub}</text>
            <path d={`M180,${+y+30} L260,${+y+30}`} stroke={stroke as string} strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
            <rect x="260" y={+y+8} width="240" height="46" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" filter="url(#rough)"/>
            <text x="380" y={+y+30} textAnchor="middle" fontSize="13" fontWeight="600" fill="#334155">{action}</text>
          </g>
        ))}
        {/* Circuit breaker note */}
        <rect x="180" y="260" width="200" height="26" rx="8" fill="#334155"/>
        <text x="280" y="277" textAnchor="middle" fontSize="13" fill="white">Circuit breaker: closed→open→half-open</text>
      </svg>
    </DiagramWrapper>
  ),

  "1.6": (
    <DiagramWrapper caption="Loose coupling via message queue enables independent scaling and retries">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">AGENT COMMUNICATION</text>
        {/* Queue pattern */}
        <text x="260" y="50" textAnchor="middle" fontSize="14" fontWeight="700" fill="#64748b">Pattern 1 — Message Queue (loose coupling)</text>
        <rect x="20" y="58" width="120" height="44" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="80" y="85" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">Agent A</text>
        <path d="M140,80 L200,80" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="200" y="60" width="120" height="40" rx="8" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2" filter="url(#rough)"/>
        <text x="260" y="75" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">📨 Queue</text>
        <text x="260" y="91" textAnchor="middle" fontSize="11" fill="#92400e">msg1, msg2, msg3</text>
        <path d="M320,80 L380,80" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="380" y="58" width="120" height="44" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="440" y="85" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">Agent B</text>
        {/* Direct handoff */}
        <text x="260" y="130" textAnchor="middle" fontSize="14" fontWeight="700" fill="#64748b">Pattern 2 — Direct Handoff (tight coupling)</text>
        <rect x="30" y="140" width="120" height="44" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="90" y="167" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">Agent A</text>
        <path d="M150,162 L360,162" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <text x="255" y="155" textAnchor="middle" fontSize="12" fill="#64748b" fontStyle="italic">context + results blob</text>
        <rect x="360" y="140" width="130" height="44" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="425" y="167" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">Agent B</text>
        {/* Anti-pattern */}
        <rect x="130" y="206" width="260" height="44" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="224" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="260" y="242" textAnchor="middle" fontSize="12" fill="#ef4444">Circular dependencies: A waits for B, B waits for A</text>
      </svg>
    </DiagramWrapper>
  ),

  "1.7": (
    <DiagramWrapper caption="Never blindly trust subagent output — validate and sanitize at every trust boundary">
      <svg viewBox="0 0 520 290" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">TRUST HIERARCHY</text>
        {/* Pyramid */}
        <polygon points="260,40 360,120 160,120" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="88" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">Orchestrator</text>
        <text x="260" y="105" textAnchor="middle" fontSize="11" fill="#0284c7">Highest trust · Sets policy</text>
        <polygon points="260,125 390,195 130,195" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="168" textAnchor="middle" fontSize="14" fontWeight="700" fill="#166534">Subagents</text>
        <text x="260" y="184" textAnchor="middle" fontSize="11" fill="#166534">Delegated trust · Scoped</text>
        <polygon points="260,200 420,265 100,265" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="242" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Tool Calls</text>
        <text x="260" y="257" textAnchor="middle" fontSize="11" fill="#92400e">Lowest trust · Verify outputs</text>
        {/* Prompt injection */}
        <rect x="0" y="130" width="118" height="70" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="59" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">⚠ Prompt Injection</text>
        <text x="59" y="164" textAnchor="middle" fontSize="11" fill="#b91c1c">Malicious tool output</text>
        <text x="59" y="178" textAnchor="middle" fontSize="11" fill="#b91c1c">hijacks agent actions</text>
        <text x="59" y="192" textAnchor="middle" fontSize="11" fill="#b91c1c">→ Always sanitize!</text>
      </svg>
    </DiagramWrapper>
  ),

  "2.1": (
    <DiagramWrapper caption="A great tool schema is self-documenting — Claude uses the description to decide when to call it">
      <svg viewBox="0 0 520 280" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">ANATOMY OF A GOOD TOOL</text>
        <rect x="30" y="36" width="300" height="200" rx="12" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" filter="url(#rough)"/>
        {[
          [46,62,'#22c55e','"name": "search_web"','"verb_noun" format'],
          [46,96,'#4a9eff','"description": "Searches..."','What it does + when to use'],
          [46,138,'#a855f7','"required": ["query"]','Always mark required params'],
          [46,172,'#f59e0b','"type": "string"','Specific types prevent errors'],
        ].map(([x,y,c,code,label],i)=>(
          <g key={i}>
            <circle cx={+x+6} cy={+y-6} r="6" fill={c as string}/>
            <text x={+x+18} y={+y} fontSize="13" fontWeight="700" fill="#1e293b">{code}</text>
            <text x={+x+18} y={+y+16} fontSize="12" fill="#64748b" fontStyle="italic">← {label}</text>
          </g>
        ))}
        {/* Anti-patterns */}
        <rect x="350" y="36" width="160" height="200" rx="12" fill="#fff1f2" stroke="#ef4444" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="430" y="60" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ef4444">⚠ Anti-patterns</text>
        {['✗ name: "tool1"','✗ No description','✗ Optional everything','✗ Huge param objects','✗ Ambiguous purpose'].map((t,i)=>(
          <text key={i} x="430" y={84+i*26} textAnchor="middle" fontSize="12" fill="#b91c1c">{t}</text>
        ))}
      </svg>
    </DiagramWrapper>
  ),

  "2.2": (
    <DiagramWrapper caption="MCP separates concerns: Host handles UX, Client manages protocol, Server exposes capabilities">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">MODEL CONTEXT PROTOCOL</text>
        {[
          [30,"#e0f2fe","#4a9eff","#0369a1","HOST","Claude Code / Desktop","Renders UI · Manages sessions"],
          [185,"#f0fdf4","#22c55e","#166534","MCP CLIENT","Built into Host","Speaks MCP protocol"],
          [340,"#fdf4ff","#a855f7","#6b21a8","MCP SERVER","Your server","Tools · Resources · Prompts"],
        ].map(([x,bg,stroke,tc,name,sub,desc],i)=>(
          <g key={i}>
            <rect x={+x} y={40} width="145" height="90" rx="12" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x={+x+72} y={65} textAnchor="middle" fontSize="15" fontWeight="700" fill={tc as string}>{name}</text>
            <text x={+x+72} y={83} textAnchor="middle" fontSize="12" fontWeight="600" fill={tc as string}>{sub}</text>
            <text x={+x+72} y={101} textAnchor="middle" fontSize="11" fill="#64748b">{desc}</text>
          </g>
        ))}
        {/* Arrows */}
        <path d="M175,85 L185,85" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M185,95 L175,95" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M330,85 L340,85" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M340,95 L330,95" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        {/* Transport */}
        <rect x="80" y="152" width="360" height="50" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="260" y="172" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Transport Layer</text>
        <text x="170" y="192" textAnchor="middle" fontSize="13" fill="#64748b">stdio (local process)</text>
        <text x="350" y="192" textAnchor="middle" fontSize="13" fill="#64748b">HTTP + SSE (remote)</text>
        {/* MCP capabilities */}
        <text x="260" y="228" textAnchor="middle" fontSize="13" fill="#64748b">Server exposes: <tspan fontWeight="700" fill="#a855f7">Tools</tspan> · <tspan fontWeight="700" fill="#4a9eff">Resources</tspan> · <tspan fontWeight="700" fill="#22c55e">Prompts</tspan></text>
      </svg>
    </DiagramWrapper>
  ),

  "2.3": (
    <DiagramWrapper caption="Chain tool outputs as inputs; use a router for large tool libraries to reduce noise">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">TOOL CHAINING &amp; ROUTING</text>
        <text x="260" y="48" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b">Pipeline Pattern</text>
        {["search_web","extract_data","transform","save_result"].map((name,i)=>(
          <g key={i}>
            <rect x={20+i*122} y={56} width="108" height="36" rx="9" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2" filter="url(#rough)"/>
            <text x={74+i*122} y={79} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369a1">{name}</text>
            {i < 3 && <path d={`M${128+i*122},74 L${142+i*122},74`} stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>}
          </g>
        ))}
        <text x="260" y="116" textAnchor="middle" fontSize="12" fill="#64748b" fontStyle="italic">output of each tool feeds next tool as input</text>
        {/* Router */}
        <text x="260" y="144" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b">Router Pattern (for 50+ tools)</text>
        <rect x="185" y="152" width="150" height="38" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">🔀 Intent Router</text>
        <path d="M240,190 L140,220" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M260,190 L260,220" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M280,190 L380,220" stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        {[["60","Search tools"],["210","Code tools"],["330","Data tools"]].map(([x,label],i)=>(
          <g key={i}>
            <rect x={+x} y={220} width="120" height="34" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" filter="url(#rough)"/>
            <text x={+x+60} y={241} textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">{label}</text>
          </g>
        ))}
        {/* Anti-pattern */}
        <rect x="360" y="152" width="152" height="44" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="436" y="170" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="436" y="186" textAnchor="middle" fontSize="11" fill="#b91c1c">Passing all 200 tools</text>
        <text x="436" y="198" textAnchor="middle" fontSize="11" fill="#b91c1c">= context overload</text>
      </svg>
    </DiagramWrapper>
  ),

  "2.4": (
    <DiagramWrapper caption="Match the error recovery to the failure type — don't crash on first tool failure">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">TOOL ERROR HANDLING</text>
        <rect x="185" y="36" width="150" height="40" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="61" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">Tool Call</text>
        <path d="M260,76 L260,100" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        {/* Decision */}
        <polygon points="260,102 320,132 260,162 200,132" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="128" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">Error?</text>
        <text x="260" y="144" textAnchor="middle" fontSize="12" fill="#92400e">Type?</text>
        {/* Branches */}
        {[["Timeout","→ Retry (max 3x)","#e0f2fe","#4a9eff","#0369a1",60,185],
          ["Not Found","→ Return empty {}","#f0fdf4","#22c55e","#166534",185,185],
          ["Auth Error","→ Notify user","#fff1f2","#ef4444","#b91c1c",310,185],
          ["Schema Error","→ Fix params & retry","#fdf4ff","#a855f7","#6b21a8",435,185],
        ].map(([type,action,bg,stroke,tc,x,y],i)=>(
          <g key={i}>
            <path d={`M${i<2?200:320},132 C${+x},132 ${+x},170 ${+x},${+y}`} stroke={stroke as string} strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
            <rect x={+x-55} y={+y} width="110" height="52" rx="8" fill={bg as string} stroke={stroke as string} strokeWidth="2" filter="url(#rough)"/>
            <text x={+x} y={+y+20} textAnchor="middle" fontSize="12" fontWeight="700" fill={tc as string}>{type}</text>
            <text x={+x} y={+y+38} textAnchor="middle" fontSize="11" fill={tc as string}>{action}</text>
          </g>
        ))}
        <rect x="140" y="256" width="240" height="12" rx="4" fill="#334155"/>
        <text x="260" y="265" textAnchor="middle" fontSize="10" fill="white">Always return structured error info to Claude</text>
      </svg>
    </DiagramWrapper>
  ),

  "2.5": (
    <DiagramWrapper caption="Wrap external APIs in a consistent tool interface — handle auth, rate limits, and errors inside the wrapper">
      <svg viewBox="0 0 520 250" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">API INTEGRATION LAYERS</text>
        {[
          ["Tool Wrapper","Defines schema for Claude","#e0f2fe","#4a9eff","#0369a1"],
          ["Auth Layer","API key / OAuth token","#f0fdf4","#22c55e","#166534"],
          ["Rate Limiter","Token bucket / queue","#fef9c3","#f59e0b","#92400e"],
          ["Response Normalizer","Maps to expected schema","#fdf4ff","#a855f7","#6b21a8"],
          ["Error Translator","HTTP errors → tool errors","#fff1f2","#ef4444","#b91c1c"],
        ].map(([name,desc,bg,stroke,tc],i)=>(
          <g key={i}>
            <rect x="100" y={36+i*38} width="320" height="32" rx="8" fill={bg as string} stroke={stroke as string} strokeWidth="2" filter="url(#rough)"/>
            <text x="200" y={57+i*38} textAnchor="middle" fontSize="14" fontWeight="700" fill={tc as string}>{name}</text>
            <text x="370" y={57+i*38} textAnchor="middle" fontSize="12" fill="#64748b">{desc}</text>
            {i < 4 && <path d={`M260,${68+i*38} L260,${74+i*38}`} stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>}
          </g>
        ))}
        {/* External API */}
        <rect x="160" y="228" width="200" height="16" rx="6" fill="#334155"/>
        <text x="260" y="239" textAnchor="middle" fontSize="12" fill="white">External API</text>
      </svg>
    </DiagramWrapper>
  ),

  "3.1": (
    <DiagramWrapper caption="Settings cascade: global defaults → project rules → local personal overrides">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">SETTINGS HIERARCHY</text>
        {[
          ["~/.claude/","Global Settings","User preferences · Default model · API keys","#e0f2fe","#4a9eff","#0369a1",40],
          ["./CLAUDE.md","Project Settings","Repo rules · Commands · Context · Personas","#f0fdf4","#22c55e","#166534",120],
          ["./.claude/","Local Overrides","Personal prefs · Not committed to git","#fef9c3","#f59e0b","#92400e",200],
        ].map(([path,name,desc,bg,stroke,tc,y],i)=>(
          <g key={i}>
            <rect x="30" y={+y} width="460" height="70" rx="12" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x="56" y={+y+24} fontSize="13" fontWeight="700" fill={tc as string} fontFamily="monospace">{path}</text>
            <text x="56" y={+y+44} fontSize="16" fontWeight="700" fill={tc as string}>{name}</text>
            <text x="56" y={+y+60} fontSize="12" fill="#64748b">{desc}</text>
            {i < 2 && <path d={`M260,${+y+70} L260,${+y+80}`} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,3" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>}
          </g>
        ))}
      </svg>
    </DiagramWrapper>
  ),

  "3.2": (
    <DiagramWrapper caption="Slash commands live in .claude/commands/ — filename becomes the command name">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">SLASH COMMANDS</text>
        {/* File structure */}
        <rect x="20" y="36" width="200" height="110" rx="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" filter="url(#rough)"/>
        <text x="120" y="57" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">📁 .claude/commands/</text>
        {["review.md → /review","deploy.md → /deploy","test.md → /test"].map((f,i)=>(
          <text key={i} x="40" y={76+i*22} fontSize="13" fill="#4a9eff" fontFamily="monospace">{f}</text>
        ))}
        <path d="M220,90 L280,90" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        {/* Command anatomy */}
        <rect x="280" y="36" width="230" height="180" rx="12" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="395" y="57" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">review.md anatomy</text>
        {[
          ["# Review Code","← command title"],
          ["Review $ARGUMENTS","← $ARGUMENTS = user input"],
          ["for bugs and style","← instructions"],
          ["issues. Format as",""],
          ["markdown list.",""],
        ].map(([code,label],i)=>(
          <g key={i}>
            <text x="296" y={76+i*20} fontSize="12" fill="#0369a1" fontFamily="monospace">{code}</text>
            {label && <text x="296" y={76+i*20+14} fontSize="10" fill="#64748b" fontStyle="italic">{label}</text>}
          </g>
        ))}
        {/* Anti-pattern */}
        <rect x="20" y="160" width="200" height="56" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="120" y="178" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-patterns</text>
        <text x="120" y="196" textAnchor="middle" fontSize="12" fill="#b91c1c">✗ No $ARGUMENTS placeholder</text>
        <text x="120" y="211" textAnchor="middle" fontSize="12" fill="#b91c1c">✗ Vague instructions</text>
      </svg>
    </DiagramWrapper>
  ),

  "3.3": (
    <DiagramWrapper caption="Hooks intercept the tool lifecycle — exit code 0=allow, 1=block, 2=abort">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">CLAUDE CODE HOOKS</text>
        {/* Timeline */}
        <rect x="30" y="52" width="130" height="52" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="95" y="74" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">PreToolUse</text>
        <text x="95" y="91" textAnchor="middle" fontSize="11" fill="#92400e">Runs before tool</text>
        <path d="M160,78 L200,78" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="200" y="52" width="120" height="52" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="74" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">🔧 Tool</text>
        <text x="260" y="91" textAnchor="middle" fontSize="11" fill="#0369a1">Executes</text>
        <path d="M320,78 L360,78" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="360" y="52" width="130" height="52" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="425" y="74" textAnchor="middle" fontSize="14" fontWeight="700" fill="#166534">PostToolUse</text>
        <text x="425" y="91" textAnchor="middle" fontSize="11" fill="#166534">Runs after tool</text>
        {/* Also hooks */}
        <text x="260" y="124" textAnchor="middle" fontSize="13" fill="#64748b">Also: <tspan fontWeight="700" fill="#a855f7">Stop hook</tspan> (session ends) · <tspan fontWeight="700" fill="#f59e0b">Notification hook</tspan></text>
        {/* Exit codes */}
        <rect x="20" y="136" width="230" height="90" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="135" y="156" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Exit Codes</text>
        <text x="135" y="174" textAnchor="middle" fontSize="13" fill="#22c55e">0 — allow / continue</text>
        <text x="135" y="192" textAnchor="middle" fontSize="13" fill="#f59e0b">1 — block this tool call</text>
        <text x="135" y="210" textAnchor="middle" fontSize="13" fill="#ef4444">2 — abort entire session</text>
        {/* Use cases */}
        <rect x="270" y="136" width="240" height="90" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="390" y="156" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Use Cases</text>
        <text x="390" y="174" textAnchor="middle" fontSize="12" fill="#64748b">Pre: validate params, audit log</text>
        <text x="390" y="192" textAnchor="middle" fontSize="12" fill="#64748b">Post: auto-lint, format, test</text>
        <text x="390" y="210" textAnchor="middle" fontSize="12" fill="#64748b">Stop: save session state</text>
      </svg>
    </DiagramWrapper>
  ),

  "3.4": (
    <DiagramWrapper caption="Use non-interactive mode (-p flag) in CI — Claude reviews code and posts structured feedback">
      <svg viewBox="0 0 520 250" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">CI/CD WITH CLAUDE CODE</text>
        {[
          ["PR Created","Triggers pipeline","#e0f2fe","#4a9eff","#0369a1"],
          ["Claude Reviews","claude -p 'review...'","#f0fdf4","#22c55e","#166534"],
          ["Comments Posted","Structured feedback","#fef9c3","#f59e0b","#92400e"],
          ["Tests Run","Automated suite","#e0f2fe","#4a9eff","#0369a1"],
          ["Merge Approved","Quality gate passed","#dcfce7","#22c55e","#166534"],
        ].map(([name,desc,bg,stroke,tc],i)=>(
          <g key={i}>
            <rect x={20+i*98} y={44} width="88" height="54" rx="10" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x={64+i*98} y={66} textAnchor="middle" fontSize="12" fontWeight="700" fill={tc as string}>{name}</text>
            <text x={64+i*98} y={82} textAnchor="middle" fontSize="10" fill={tc as string}>{desc}</text>
            {i < 4 && <path d={`M${108+i*98},71 L${118+i*98},71`} stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>}
          </g>
        ))}
        <rect x="60" y="118" width="400" height="50" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
        <text x="260" y="136" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e" fontFamily="monospace">$ claude -p "Review this PR for bugs"</text>
        <text x="260" y="156" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="monospace">-p flag = non-interactive / pipe mode</text>
        <rect x="100" y="182" width="320" height="46" rx="10" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="200" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="260" y="218" textAnchor="middle" fontSize="12" fill="#b91c1c">Interactive mode in CI = pipeline hangs waiting for input</text>
      </svg>
    </DiagramWrapper>
  ),

  "3.5": (
    <DiagramWrapper caption="Default-deny is safer than default-allow — explicitly whitelist only what Claude needs">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">PERMISSIONS MODEL</text>
        <rect x="20" y="38" width="230" height="120" rx="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="135" y="60" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">allowedTools ✓</text>
        {['["Bash", "Read", "Write"]','→ Explicit whitelist','→ Only these tools work','→ Everything else blocked'].map((t,i)=>(
          <text key={i} x="40" y={82+i*20} fontSize="13" fill="#166534">{t}</text>
        ))}
        <rect x="270" y="38" width="230" height="120" rx="12" fill="#fff1f2" stroke="#ef4444" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="385" y="60" textAnchor="middle" fontSize="15" fontWeight="700" fill="#b91c1c">deniedTools ✗</text>
        {['["Bash(rm -rf *)", "Write"]','→ Explicit blacklist','→ Block dangerous cmds','→ Rest still allowed'].map((t,i)=>(
          <text key={i} x="284" y={82+i*20} fontSize="13" fill="#b91c1c">{t}</text>
        ))}
        {/* Trust levels */}
        <rect x="20" y="170" width="480" height="60" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="260" y="190" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Trust Levels</text>
        <text x="110" y="210" textAnchor="middle" fontSize="12" fill="#64748b">default — safe ops only</text>
        <text x="260" y="210" textAnchor="middle" fontSize="12" fill="#f59e0b">elevated — +shell cmds</text>
        <text x="410" y="210" textAnchor="middle" fontSize="12" fill="#ef4444">full — unrestricted ⚠</text>
        <text x="260" y="225" textAnchor="middle" fontSize="11" fill="#94a3b8">Never use full trust in production</text>
      </svg>
    </DiagramWrapper>
  ),

  "3.6": (
    <DiagramWrapper caption="MCP servers in Claude Code are configured in settings.json and become native tools">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">MCP IN CLAUDE CODE</text>
        {/* Config */}
        <rect x="20" y="36" width="250" height="160" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
        <text x="145" y="57" textAnchor="middle" fontSize="13" fontWeight="700" fill="#94a3b8">settings.json</text>
        {[
          ['"mcpServers": {','#94a3b8'],
          ['  "my-db": {','#4a9eff'],
          ['    "command": "node",','#22c55e'],
          ['    "args": ["srv.js"],','#22c55e'],
          ['    "env": {','#f59e0b'],
          ['      "KEY": "***"','#f59e0b'],
          ['    }','#f59e0b'],
          ['  }','#4a9eff'],
          ['}','#94a3b8'],
        ].map(([line,color],i)=>(
          <text key={i} x="36" y={75+i*15} fontSize="11" fill={color as string} fontFamily="monospace">{line}</text>
        ))}
        {/* Flow */}
        <path d="M270,116 L310,116" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="310" y="36" width="190" height="100" rx="12" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="405" y="60" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">Claude Code</text>
        <text x="405" y="80" textAnchor="middle" fontSize="12" fill="#0284c7">Discovers server</text>
        <text x="405" y="97" textAnchor="middle" fontSize="12" fill="#0284c7">tools automatically</text>
        <text x="405" y="114" textAnchor="middle" fontSize="12" fill="#0284c7">→ uses as native tools</text>
        {/* Server types */}
        <rect x="310" y="150" width="190" height="46" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="405" y="168" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">Server types</text>
        <text x="405" y="185" textAnchor="middle" fontSize="12" fill="#64748b">Local (stdio) · Remote (HTTP)</text>
        {/* Note */}
        <text x="145" y="214" textAnchor="middle" fontSize="12" fill="#64748b">Scope: user-level (global) or</text>
        <text x="145" y="229" textAnchor="middle" fontSize="12" fill="#64748b">project-level (.claude/settings.json)</text>
      </svg>
    </DiagramWrapper>
  ),

  "4.1": (
    <DiagramWrapper caption="Chain-of-thought unlocks multi-step reasoning; extended thinking adds internal scratchpad tokens">
      <svg viewBox="0 0 520 290" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">PROMPTING TECHNIQUES</text>
        {[
          ["Zero-shot","No examples","Classify this email:\n'Win a prize!' → spam","#e0f2fe","#4a9eff","#0369a1",20,46],
          ["Few-shot","With examples","'Win prize' → spam\n'Meeting at 3' → ham\n'Congrats!' → ?","#f0fdf4","#22c55e","#166534",20,140],
          ["Chain-of-thought","Step-by-step","Let's think step by step:\n1) Check sender domain\n2) Look for urgency...","#fef9c3","#f59e0b","#92400e",270,46],
          ["Extended Thinking","Deep reasoning","Allocates extra token budget\nfor internal scratchpad\nbefore final answer","#fdf4ff","#a855f7","#6b21a8",270,140],
        ].map(([name,sub,desc,bg,stroke,tc,x,y],i)=>(
          <g key={i}>
            <rect x={+x} y={+y} width="230" height="88" rx="12" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x={+x+115} y={+y+22} textAnchor="middle" fontSize="16" fontWeight="700" fill={tc as string}>{name}</text>
            <text x={+x+115} y={+y+38} textAnchor="middle" fontSize="12" fill={tc as string} fontStyle="italic">{sub}</text>
            <text x={+x+12} y={+y+56} fontSize="11" fill="#64748b">{(desc as string).split('\n').map((l,li)=><tspan key={li} x={+x+12} dy={li?14:0}>{l}</tspan>)}</text>
          </g>
        ))}
      </svg>
    </DiagramWrapper>
  ),

  "4.2": (
    <DiagramWrapper caption="A well-structured system prompt defines role, context, constraints, format, and examples">
      <svg viewBox="0 0 520 280" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">SYSTEM PROMPT ANATOMY</text>
        {[
          ["[ROLE]","You are an expert code reviewer...","#e0f2fe","#4a9eff","#0369a1"],
          ["[CONTEXT]","The user is a junior dev on a React app...","#f0fdf4","#22c55e","#166534"],
          ["[INSTRUCTIONS]","Always explain why. Never rewrite entire files.","#fef9c3","#f59e0b","#92400e"],
          ["[FORMAT]","Respond with: Issue, Severity, Fix","#fdf4ff","#a855f7","#6b21a8"],
          ["[EXAMPLES]","Bad: x=1 → Good: userCount=1","#fff1f2","#ef4444","#b91c1c"],
        ].map(([section,text,bg,stroke,tc],i)=>(
          <g key={i}>
            <rect x="20" y={38+i*42} width="100" height="34" rx="8" fill={stroke as string}/>
            <text x="70" y={59+i*42} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{section}</text>
            <rect x="128" y={38+i*42} width="372" height="34" rx="8" fill={bg as string} stroke={stroke as string} strokeWidth="1.5" filter="url(#rough)"/>
            <text x="314" y={59+i*42} textAnchor="middle" fontSize="13" fill={tc as string}>{text}</text>
          </g>
        ))}
        <rect x="140" y="252" width="240" height="24" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="268" textAnchor="middle" fontSize="13" fill="#b91c1c">⚠ No system prompt = unpredictable behavior</text>
      </svg>
    </DiagramWrapper>
  ),

  "4.3": (
    <DiagramWrapper caption="Always validate structured output against your schema — loop with error feedback if invalid">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">STRUCTURED OUTPUT PIPELINE</text>
        <rect x="20" y="44" width="150" height="50" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="95" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">Prompt with</text>
        <text x="95" y="82" textAnchor="middle" fontSize="13" fill="#0369a1">JSON schema</text>
        <path d="M170,69 L200,69" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="200" y="44" width="120" height="50" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Claude</text>
        <text x="260" y="82" textAnchor="middle" fontSize="13" fill="#92400e">Generates JSON</text>
        <path d="M320,69 L350,69" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="350" y="44" width="150" height="50" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" filter="url(#rough)"/>
        <text x="425" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Validate</text>
        <text x="425" y="82" textAnchor="middle" fontSize="13" fill="#334155">Schema check</text>
        {/* Pass */}
        <path d="M425,94 L425,160" stroke="#22c55e" strokeWidth="2.5" fill="none" markerEnd="url(#ahg)" strokeLinecap="round"/>
        <text x="433" y="130" fontSize="13" fill="#22c55e" fontWeight="700">PASS</text>
        <rect x="350" y="162" width="150" height="40" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="425" y="187" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">✓ Use result</text>
        {/* Fail loop */}
        <path d="M350,69 C270,69 230,150 230,160" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="5,3" markerEnd="url(#ahr)" strokeLinecap="round"/>
        <text x="278" y="130" fontSize="12" fill="#ef4444" textAnchor="middle">FAIL</text>
        <rect x="100" y="162" width="170" height="50" rx="10" fill="#fff1f2" stroke="#ef4444" strokeWidth="2" filter="url(#rough)"/>
        <text x="185" y="182" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b91c1c">Re-prompt with error</text>
        <text x="185" y="200" textAnchor="middle" fontSize="12" fill="#b91c1c">max 3 retries</text>
        <path d="M185,162 L185,94" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" fill="none" markerEnd="url(#ahr)" strokeLinecap="round"/>
      </svg>
    </DiagramWrapper>
  ),

  "4.4": (
    <DiagramWrapper caption="Build a validation loop — generate, validate against schema + business rules, then self-correct with error context">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">OUTPUT VALIDATION LOOP</text>
        {/* Steps */}
        <rect x="185" y="36" width="150" height="40" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="61" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">Generate</text>
        <path d="M260,76 L260,106" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="160" y="108" width="200" height="50" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="128" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Validate</text>
        <text x="260" y="146" textAnchor="middle" fontSize="12" fill="#92400e">Schema + business rules</text>
        {/* Pass branch */}
        <path d="M360,133 L400,133 L400,190 L360,190" stroke="#22c55e" strokeWidth="2.5" fill="none" markerEnd="url(#ahg)" strokeLinecap="round"/>
        <text x="390" y="164" fontSize="13" fill="#22c55e" fontWeight="700">PASS</text>
        <rect x="185" y="176" width="150" height="40" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="201" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">✓ Done</text>
        {/* Fail branch */}
        <path d="M160,133 L100,133 L100,56 L185,56" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="5,3" markerEnd="url(#ahr)" strokeLinecap="round"/>
        <text x="92" y="100" fontSize="13" fill="#ef4444" fontWeight="700" textAnchor="middle">FAIL</text>
        {/* Escalate */}
        <path d="M260,216 L260,240" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" fill="none" markerEnd="url(#ahr)" strokeLinecap="round"/>
        <text x="200" y="232" fontSize="12" fill="#ef4444" fontStyle="italic">after 3 retries</text>
        <rect x="160" y="240" width="200" height="26" rx="8" fill="#ef4444"/>
        <text x="260" y="257" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">Escalate to human</text>
        <rect x="360" y="220" width="152" height="44" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="436" y="238" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="436" y="255" textAnchor="middle" fontSize="11" fill="#b91c1c">Trusting first output</text>
        <text x="436" y="268" textAnchor="middle" fontSize="11" fill="#b91c1c">blindly</text>
      </svg>
    </DiagramWrapper>
  ),

  "4.5": (
    <DiagramWrapper caption="Budget your context window — system prompt + history + tools + task + output reserve">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">CONTEXT WINDOW BUDGET</text>
        {/* Bar */}
        {[
          [0,80,"System Prompt","~2k","#4a9eff"],
          [80,160,"Conversation","~10k","#22c55e"],
          [240,120,"Tool Results","~5k","#f59e0b"],
          [360,80,"Current Task","~3k","#a855f7"],
          [440,80,"Output Reserve","~4k","#ef4444"],
        ].map(([startX,width,label,size,color],i)=>(
          <g key={i}>
            <rect x={+startX} y={40} width={+width} height={40} fill={color as string} opacity="0.85" filter="url(#rough)"/>
            <text x={+startX + +width/2} y={55} textAnchor="middle" fontSize="10" fill="white" fontWeight="700">{label}</text>
            <text x={+startX + +width/2} y={70} textAnchor="middle" fontSize="10" fill="white">{size}</text>
          </g>
        ))}
        <rect x="0" y="40" width="520" height="40" fill="none" stroke="#334155" strokeWidth="2"/>
        {/* Strategies */}
        <text x="260" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Optimization Strategies</text>
        {["Summarize old conversation turns","Truncate long tool outputs","Compress repeated context","Use references instead of full content"].map((s,i)=>(
          <text key={i} x="260" y={122+i*18} textAnchor="middle" fontSize="13" fill="#64748b">→ {s}</text>
        ))}
        {/* Model tiers */}
        <rect x="20" y="200" width="480" height="62" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="260" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Model Selection</text>
        {[["Haiku","Fast · Cheap · Simple tasks","#22c55e",80],["Sonnet","Balanced · Code · Analysis","#4a9eff",260],["Opus","Powerful · Complex reasoning","#a855f7",440]].map(([m,d,c,x])=>(
          <g key={m as string}>
            <text x={+x} y={240} textAnchor="middle" fontSize="14" fontWeight="700" fill={c as string}>{m}</text>
            <text x={+x} y={256} textAnchor="middle" fontSize="11" fill="#64748b">{d}</text>
          </g>
        ))}
      </svg>
    </DiagramWrapper>
  ),

  "4.6": (
    <DiagramWrapper caption="Use task-specific templates — code gen, analysis, and extraction each need different prompt shapes">
      <svg viewBox="0 0 520 280" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">TASK-SPECIFIC PROMPTS</text>
        {[
          ["💻 Code Gen","Language: Python\nTask: [what to build]\nReqs: [constraints]\nReturn: only code, no prose","#e0f2fe","#4a9eff","#0369a1"],
          ["🔍 Analysis","Analyze: [subject]\nConsider: [aspects]\nEvidence: cite sources\nFormat: bullet points","#f0fdf4","#22c55e","#166534"],
          ["📋 Extraction","Extract these fields: [list]\nFrom: [text]\nReturn JSON:\n{field1: ..., field2: ...}","#fef9c3","#f59e0b","#92400e"],
        ].map(([title,template,bg,stroke,tc],i)=>(
          <g key={i}>
            <rect x={10+i*170} y={38} width="158" height="130" rx="12" fill={bg as string} stroke={stroke as string} strokeWidth="2.5" filter="url(#rough)"/>
            <text x={89+i*170} y={59} textAnchor="middle" fontSize="14" fontWeight="700" fill={tc as string}>{title}</text>
            {(template as string).split('\n').map((line,li)=>(
              <text key={li} x={22+i*170} y={78+li*18} fontSize="11" fill={tc as string}>{line}</text>
            ))}
          </g>
        ))}
        <rect x="100" y="184" width="320" height="50" rx="10" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="203" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="260" y="221" textAnchor="middle" fontSize="12" fill="#b91c1c">Generic prompts for specific tasks = inconsistent, vague outputs</text>
      </svg>
    </DiagramWrapper>
  ),

  "5.1": (
    <DiagramWrapper caption="Checkpoint state externally every N turns so long-running tasks can recover from failures">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">LONG-TASK CONTEXT LIFECYCLE</text>
        {/* Timeline */}
        <line x1="30" y1="80" x2="490" y2="80" stroke="#e2e8f0" strokeWidth="3"/>
        {[30,150,270,390,490].map((x,i)=>(
          <g key={i}>
            <circle cx={x} cy={80} r={10} fill={i===4?"#22c55e":"#4a9eff"}/>
            <text x={x} y={102} textAnchor="middle" fontSize="11" fill="#64748b">Turn {i===4?"N":""+[1,10,20,30][i]}</text>
          </g>
        ))}
        {/* Fill arrows */}
        <rect x="30" y="38" width="120" height="28" rx="6" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="1.5"/>
        <text x="90" y="56" textAnchor="middle" fontSize="12" fill="#0369a1">Context fills up</text>
        <rect x="150" y="38" width="120" height="28" rx="6" fill="#fef9c3" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="210" y="56" textAnchor="middle" fontSize="12" fill="#92400e">Compress + summarize</text>
        <rect x="270" y="38" width="120" height="28" rx="6" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="1.5"/>
        <text x="330" y="56" textAnchor="middle" fontSize="12" fill="#0369a1">Continue with summary</text>
        <rect x="390" y="38" width="100" height="28" rx="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5"/>
        <text x="440" y="56" textAnchor="middle" fontSize="12" fill="#166534">Done ✓</text>
        {/* Checkpoint */}
        <rect x="40" y="110" width="440" height="70" rx="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="260" y="132" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Checkpoint Pattern</text>
        <text x="260" y="152" textAnchor="middle" fontSize="13" fill="#64748b">Every N turns → save state to external storage</text>
        <text x="260" y="170" textAnchor="middle" fontSize="13" fill="#64748b">On failure → resume from last checkpoint, not scratch</text>
        {/* Anti-pattern */}
        <rect x="130" y="196" width="260" height="44" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="215" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="260" y="232" textAnchor="middle" fontSize="12" fill="#b91c1c">No checkpoints → 3hr task fails at step 90% → restart from 0</text>
      </svg>
    </DiagramWrapper>
  ),

  "5.2": (
    <DiagramWrapper caption="Progressive summarization: archive old turns as summaries, keep recent turns in full">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">CONTEXT COMPRESSION</text>
        {/* Rolling window */}
        <text x="260" y="48" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b">Rolling Window — Active vs Archived</text>
        <rect x="20" y="56" width="220" height="60" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" filter="url(#rough)"/>
        <text x="130" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">📦 Archived (compressed)</text>
        <text x="130" y="95" textAnchor="middle" fontSize="12" fill="#64748b">"We discussed auth design,</text>
        <text x="130" y="108" textAnchor="middle" fontSize="12" fill="#64748b">decided on JWT tokens"</text>
        <path d="M240,86 L280,86" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="280" y="56" width="220" height="60" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="390" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369a1">💬 Active (full turns)</text>
        <text x="390" y="95" textAnchor="middle" fontSize="12" fill="#0284c7">Turn N-5 → Turn N (full)</text>
        <text x="390" y="108" textAnchor="middle" fontSize="12" fill="#0284c7">Recent context intact</text>
        {/* Progressive summarization steps */}
        <text x="260" y="140" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b">Progressive Summarization</text>
        {[["Turns 1-10","Full detail"],["→ Summary 1","Key decisions"],["Turns 11-20","Full detail"],["→ Summary 2","Key decisions"]].map(([label,sub],i)=>(
          <g key={i}>
            <rect x={10+i*125} y={150} width="110" height="52" rx="8" fill={i%2===0?"#e0f2fe":"#f0fdf4"} stroke={i%2===0?"#4a9eff":"#22c55e"} strokeWidth="2" filter="url(#rough)"/>
            <text x={65+i*125} y={170} textAnchor="middle" fontSize="13" fontWeight="700" fill={i%2===0?"#0369a1":"#166534"}>{label}</text>
            <text x={65+i*125} y={188} textAnchor="middle" fontSize="11" fill="#64748b">{sub}</text>
            {i < 3 && <path d={`M${120+i*125},176 L${135+i*125},176`} stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>}
          </g>
        ))}
        <text x="260" y="224" textAnchor="middle" fontSize="13" fill="#64748b">Lossy compression — preserve decisions, drop chit-chat</text>
      </svg>
    </DiagramWrapper>
  ),

  "5.3": (
    <DiagramWrapper caption="Idempotency lets you safely retry — same input always produces same output with no side effects">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">RELIABILITY PATTERNS</text>
        {/* Idempotency */}
        <rect x="20" y="40" width="230" height="90" rx="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="135" y="62" textAnchor="middle" fontSize="15" fontWeight="700" fill="#166534">✓ Idempotency</text>
        <text x="135" y="82" textAnchor="middle" fontSize="12" fill="#166534">Same input → same output</text>
        <text x="135" y="98" textAnchor="middle" fontSize="12" fill="#166534">Safe to retry on failure</text>
        <text x="135" y="114" textAnchor="middle" fontSize="12" fill="#166534">Use idempotency keys</text>
        {/* Circuit breaker */}
        <rect x="270" y="40" width="230" height="90" rx="12" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="385" y="62" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0369a1">⚡ Circuit Breaker</text>
        <text x="385" y="82" textAnchor="middle" fontSize="12" fill="#0284c7">Closed → Open → Half-open</text>
        <text x="385" y="98" textAnchor="middle" fontSize="12" fill="#0284c7">Stops cascading failures</text>
        <text x="385" y="114" textAnchor="middle" fontSize="12" fill="#0284c7">Auto-heals after timeout</text>
        {/* Fallback + bulkhead */}
        <rect x="20" y="146" width="230" height="76" rx="12" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="135" y="168" textAnchor="middle" fontSize="15" fontWeight="700" fill="#92400e">🔄 Graceful Fallback</text>
        <text x="135" y="188" textAnchor="middle" fontSize="12" fill="#92400e">Degraded but functional</text>
        <text x="135" y="204" textAnchor="middle" fontSize="12" fill="#92400e">Cache stale → partial → error</text>
        <rect x="270" y="146" width="230" height="76" rx="12" fill="#fdf4ff" stroke="#a855f7" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="385" y="168" textAnchor="middle" fontSize="15" fontWeight="700" fill="#6b21a8">🧱 Bulkhead</text>
        <text x="385" y="188" textAnchor="middle" fontSize="12" fill="#6b21a8">Isolate failures to a pool</text>
        <text x="385" y="204" textAnchor="middle" fontSize="12" fill="#6b21a8">Prevent total system failure</text>
        <rect x="130" y="236" width="260" height="26" rx="8" fill="#334155"/>
        <text x="260" y="252" textAnchor="middle" fontSize="13" fill="white">Layer these patterns for production resilience</text>
      </svg>
    </DiagramWrapper>
  ),

  "5.4": (
    <DiagramWrapper caption="LLM-as-judge scores quality automatically — combine with latency and cost metrics for full observability">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">MONITORING &amp; OBSERVABILITY</text>
        {/* Pipeline */}
        <rect x="20" y="46" width="100" height="44" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="70" y="73" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">Input</text>
        <path d="M120,68 L160,68" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="160" y="46" width="100" height="44" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="210" y="73" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Claude</text>
        <path d="M260,68 L300,68" stroke="#334155" strokeWidth="2.5" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <rect x="300" y="46" width="100" height="44" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="350" y="73" textAnchor="middle" fontSize="14" fontWeight="700" fill="#166534">Output</text>
        {/* Monitors */}
        <path d="M350,90 L200,130" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M350,90 L350,130" stroke="#4a9eff" strokeWidth="2" strokeDasharray="4,3" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        <path d="M400,90 L460,130" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,3" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>
        {[
          [100,"#fdf4ff","#a855f7","#6b21a8","🧑‍⚖️ LLM Judge","Score 0.0-1.0","Quality eval"],
          [290,"#e0f2fe","#4a9eff","#0369a1","⏱ Latency","p50/p95/p99","ms per call"],
          [395,"#f0fdf4","#22c55e","#166534","💰 Cost","tokens × price","per request"],
        ].map(([x,bg,stroke,tc,name,m1,m2],i)=>(
          <g key={i}>
            <rect x={+x} y={130} width="120" height="72" rx="10" fill={bg as string} stroke={stroke as string} strokeWidth="2" filter="url(#rough)"/>
            <text x={+x+60} y={150} textAnchor="middle" fontSize="13" fontWeight="700" fill={tc as string}>{name}</text>
            <text x={+x+60} y={168} textAnchor="middle" fontSize="12" fill={tc as string}>{m1}</text>
            <text x={+x+60} y={184} textAnchor="middle" fontSize="11" fill="#64748b">{m2}</text>
          </g>
        ))}
        {/* Alert */}
        <rect x="160" y="218" width="200" height="34" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="232" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">🔔 Alert when thresholds exceeded</text>
        <text x="260" y="247" textAnchor="middle" fontSize="11" fill="#b91c1c">quality &lt; 0.7 · latency &gt; 5s · cost spike</text>
      </svg>
    </DiagramWrapper>
  ),

  "5.5": (
    <DiagramWrapper caption="Cache identical prompts — exact-match by hash is cheap; semantic cache uses embedding similarity">
      <svg viewBox="0 0 520 260" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">CACHING STRATEGY</text>
        {/* Flow */}
        <rect x="20" y="46" width="120" height="44" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="80" y="73" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0369a1">Request</text>
        <path d="M140,68 L180,68" stroke="#4a9eff" strokeWidth="2.5" fill="none" markerEnd="url(#ahb)" strokeLinecap="round"/>
        <rect x="180" y="46" width="160" height="44" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="260" y="68" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">Hash prompt</text>
        <text x="260" y="83" textAnchor="middle" fontSize="12" fill="#92400e">Check cache</text>
        {/* HIT */}
        <path d="M340,68 C400,68 400,130 380,160" stroke="#22c55e" strokeWidth="2.5" fill="none" markerEnd="url(#ahg)" strokeLinecap="round"/>
        <text x="410" y="110" fontSize="13" fill="#22c55e" fontWeight="700">HIT</text>
        <rect x="300" y="162" width="180" height="52" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="390" y="182" textAnchor="middle" fontSize="14" fontWeight="700" fill="#166534">✓ Cached response</text>
        <text x="390" y="200" textAnchor="middle" fontSize="12" fill="#166534">Instant · $0 · No API call</text>
        {/* MISS */}
        <path d="M260,90 L260,130" stroke="#ef4444" strokeWidth="2.5" fill="none" markerEnd="url(#ahr)" strokeLinecap="round"/>
        <text x="268" y="114" fontSize="13" fill="#ef4444" fontWeight="700">MISS</text>
        <rect x="160" y="132" width="180" height="44" rx="10" fill="#fff1f2" stroke="#ef4444" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="250" y="152" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b91c1c">Call Claude API</text>
        <text x="250" y="168" textAnchor="middle" fontSize="12" fill="#b91c1c">Store response in cache</text>
        {/* Cache types */}
        <rect x="20" y="140" width="130" height="74" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/>
        <text x="85" y="158" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">Cache Types</text>
        <text x="85" y="176" textAnchor="middle" fontSize="11" fill="#64748b">Exact hash match</text>
        <text x="85" y="192" textAnchor="middle" fontSize="11" fill="#64748b">Semantic (embeddings)</text>
        <text x="85" y="208" textAnchor="middle" fontSize="11" fill="#64748b">Prefix caching (API)</text>
      </svg>
    </DiagramWrapper>
  ),

  "5.6": (
    <DiagramWrapper caption="Exponential backoff prevents thundering herds — failover to a lighter model when primary is unavailable">
      <svg viewBox="0 0 520 270" width="100%" style={{ fontFamily: F }} role="img">
        {DEFS}
        <text x="260" y="22" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">RATE LIMITS &amp; RETRIES</text>
        {/* Retry timeline */}
        <text x="260" y="48" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b">Exponential Backoff</text>
        {[["Request","#4a9eff","#0369a1",20],["429 →\nwait 1s","#ef4444","#b91c1c",140],["Retry →\n429 2s","#ef4444","#b91c1c",240],["Retry →\n429 4s","#ef4444","#b91c1c",340],["✓ Success","#22c55e","#166534",440]].map(([label,bg,tc,x],i)=>(
          <g key={i}>
            <rect x={+x} y={56} width="82" height="52" rx="8" fill={bg as string} opacity="0.15" stroke={bg as string} strokeWidth="2" filter="url(#rough)"/>
            <text x={+x+41} y={78} textAnchor="middle" fontSize="12" fontWeight="700" fill={tc as string}>{(label as string).split('\n')[0]}</text>
            <text x={+x+41} y={96} textAnchor="middle" fontSize="11" fill={tc as string}>{(label as string).split('\n')[1]||''}</text>
            {i < 4 && <path d={`M${+x+82},82 L${+x+100},82`} stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#ah)" strokeLinecap="round"/>}
          </g>
        ))}
        {/* Failover */}
        <text x="260" y="130" textAnchor="middle" fontSize="14" fontWeight="600" fill="#64748b">Failover Pattern</text>
        <rect x="60" y="140" width="130" height="44" rx="10" fill="#e0f2fe" stroke="#4a9eff" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="125" y="157" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369a1">Sonnet (primary)</text>
        <text x="125" y="175" textAnchor="middle" fontSize="11" fill="#0284c7">Unavailable / slow</text>
        <path d="M190,162 L250,162" stroke="#ef4444" strokeWidth="2.5" fill="none" markerEnd="url(#ahr)" strokeLinecap="round"/>
        <text x="220" y="154" fontSize="12" fill="#ef4444" textAnchor="middle">fails</text>
        <rect x="250" y="140" width="130" height="44" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" filter="url(#rough)"/>
        <text x="315" y="157" textAnchor="middle" fontSize="13" fontWeight="700" fill="#166534">Haiku (fallback)</text>
        <text x="315" y="175" textAnchor="middle" fontSize="11" fill="#166534">Lighter, always available</text>
        {/* Token bucket */}
        <rect x="400" y="136" width="110" height="64" rx="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2" filter="url(#rough)"/>
        <text x="455" y="156" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">Token Bucket</text>
        <text x="455" y="173" textAnchor="middle" fontSize="11" fill="#92400e">Max N requests</text>
        <text x="455" y="188" textAnchor="middle" fontSize="11" fill="#92400e">per minute</text>
        {/* Anti-pattern */}
        <rect x="100" y="202" width="320" height="44" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="260" y="220" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">⚠ Anti-pattern</text>
        <text x="260" y="238" textAnchor="middle" fontSize="12" fill="#b91c1c">Retry immediately with no backoff = thundering herd, worse 429s</text>
      </svg>
    </DiagramWrapper>
  ),

};
