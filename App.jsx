import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Search, Bell, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, Clock, Users, FileText, Shield, Layers, ZoomIn, ZoomOut, Flag, MessageCircle, ArrowUp, Eye, Wrench, Settings, LogOut, Home, Menu, X, Plus, Filter, Send } from "lucide-react";

// ============================================================
// COLEMAN CONSTRUCTION - LAS VEGAS, NEVADA
// Interactive Prototype - Robert Coleman Project
// ============================================================

const TRADES = [
  { id: "general", name: "General", icon: "📋", color: "#6B7280", sheets: ["G000A", "G001A", "G020A", "G100A"], desc: "Cover sheets, codes, life safety, UL assemblies" },
  { id: "architectural", name: "Architectural", icon: "🏗️", color: "#3B82F6", sheets: ["A001A","A021A","A041A","A101A","A141A","A161A","A190A","A191A","A251A","A252A","A261A","A501A","A541A"], desc: "Site plans, floor plans, finishes, details, elevations" },
  { id: "mechanical", name: "Mechanical / HVAC", icon: "❄️", color: "#10B981", sheets: ["M001A","M011A","M012A","M201A","M202A","M501A","M502A","M601A","M701A","M801A"], desc: "Ductwork, fan coils, controls, mechanical schedules" },
  { id: "plumbing", name: "Plumbing", icon: "🔧", color: "#8B5CF6", sheets: ["P001A","P101A","P201A","P202A"], desc: "Fixture schedules, supply/waste lines, isometrics" },
  { id: "fire", name: "Fire Protection", icon: "🔥", color: "#EF4444", sheets: ["FP001A","FP101A","FP201A"], desc: "Sprinkler layouts, zone plans, head schedules" },
  { id: "electrical", name: "Electrical", icon: "⚡", color: "#F59E0B", sheets: ["E001A","E011A","E012A","E201A","E202A","E301A","E302A","E500A","E600A","E700A","E701A"], desc: "Power, lighting, fire alarm, panels, riser diagrams" },
  { id: "technology", name: "Technology", icon: "📡", color: "#06B6D4", sheets: ["T001A","T011A","T012A","T201A","T202A","T701A"], desc: "Voice/data, access control, CCTV, grounding" },
];

const USERS_DB = [
  { email: "pm@naples-aob.com", password: "demo", name: "Sarah Chen", role: "General PM", level: "pm", avatar: "SC", trades: ["all"] },
  { email: "mech@naples-aob.com", password: "demo", name: "James Rivera", role: "Mechanical Foreman", level: "foreman", avatar: "JR", trades: ["mechanical"] },
  { email: "elec@naples-aob.com", password: "demo", name: "Mike Torres", role: "Electrical Lead", level: "foreman", avatar: "MT", trades: ["electrical"] },
  { email: "plumb@naples-aob.com", password: "demo", name: "Dave Wilson", role: "Plumbing Installer", level: "worker", avatar: "DW", trades: ["plumbing"] },
  { email: "demo@demo.com", password: "demo", name: "Rick Bradford", role: "Project Owner", level: "pm", avatar: "RB", trades: ["all"] },
];

const SAMPLE_SHEETS = {
  "G000A": { title: "Cover Sheet", type: "general", floor: "N/A", description: "Project information, location map, design team, and complete sheet index for Naples AOB Improvements." },
  "G001A": { title: "General Information", type: "general", floor: "N/A", description: "Abbreviations, reference symbols, general notes, building sections, casework elevation legends, identity symbols." },
  "G100A": { title: "Life Safety Plans", type: "general", floor: "Both", description: "First and second floor life safety plans with wall ratings, egress paths, travel distances, and occupancy classifications." },
  "A101A": { title: "Architectural Plan - 1st & 2nd Floors", type: "architectural", floor: "Both", description: "Complete architectural floor plans showing room layouts, dimensions, door/window locations, and screen details for both floors." },
  "A141A": { title: "Reflected Ceiling Plans", type: "architectural", floor: "Both", description: "Ceiling types (ACT, gypsum, wood plank), light fixture locations, diffuser placements, and ceiling heights for both floors." },
  "A161A": { title: "Finish Schedule & Plans", type: "architectural", floor: "Both", description: "Complete finish plans with carpet, porcelain tile, vinyl, paint, quartz, and wood composite schedules including manufacturers and colors." },
  "M201A": { title: "1st Floor Ductwork", type: "mechanical", floor: "1st", description: "First floor HVAC ductwork layout showing supply/return runs, flex duct connections, grille locations, and keyed notes for installation." },
  "M202A": { title: "2nd Floor Ductwork", type: "mechanical", floor: "2nd", description: "Second floor ductwork plan with fan coil connections, refrigerant piping routes, and condensate drain locations." },
  "M501A": { title: "Mechanical Details", type: "mechanical", floor: "N/A", description: "Duct fitting construction, diffuser mounting, wall louver/plenum details, flex duct support, and condensing unit mounting." },
  "M801A": { title: "Mechanical Schedules", type: "mechanical", floor: "N/A", description: "Heat pump condensing unit schedule, DX fan coil unit schedule, fan schedule, air distribution schedule with CFM values." },
  "P001A": { title: "Plumbing Legends & Notes", type: "plumbing", floor: "N/A", description: "Plumbing fixture schedule (water closets, lavatories, sinks), symbol legend, general/demolition notes, shock arrestor schedule." },
  "P201A": { title: "1st Floor Plumbing", type: "plumbing", floor: "1st", description: "First floor plumbing plan showing fixture connections, sanitary/vent/water lines, and keyed installation notes." },
  "E201A": { title: "1st Floor Power & Fire Alarm", type: "electrical", floor: "1st", description: "First floor power plan with receptacle layouts, circuit assignments, fire alarm device locations, and panel connections." },
  "E301A": { title: "1st Floor Lighting", type: "electrical", floor: "1st", description: "First floor lighting plan showing fixture types, switching, emergency lighting, and exit sign locations." },
  "E600A": { title: "Panel Schedules", type: "electrical", floor: "N/A", description: "Complete panel schedules for DP-A, Panel A, SP2, Panel B, and Panel M with circuit descriptions, loads, and breaker sizes." },
  "FP201A": { title: "Fire Protection Plans", type: "fire", floor: "Both", description: "Sprinkler layout for both floors showing zone boundaries, branch lines, sprinkler head locations, and pipe sizing." },
  "T201A": { title: "1st Floor Technology", type: "technology", floor: "1st", description: "First floor technology plan with data outlet locations, wireless AP placements, cable tray routing, and equipment rack positions." },
};

const SAMPLE_TICKETS = [
  {
    id: "TKT-001",
    title: "Ductwork conflicts with cable tray at corridor ceiling",
    description: "24x12 supply duct at grid line E/10 drops below the planned cable tray route. Need to coordinate routing — either raise duct or reroute cable tray to avoid the conflict zone near office A209.",
    status: "open",
    priority: "high",
    trades: ["mechanical", "technology"],
    location: "1st Floor - Corridor near A209",
    sheet: "M201A",
    createdBy: "James Rivera",
    createdAt: "2026-03-28",
    escalationLevel: 1,
    escalationChain: ["Field Worker", "Trade Foreman", "Trade PM", "General PM"],
    comments: [
      { author: "James Rivera", role: "Mechanical Foreman", time: "Mar 28, 10:15 AM", text: "Found during ductwork rough-in. The 24x12 supply duct at grid E/10 sits 2 inches below the cable tray path shown on T201A." },
      { author: "Mike Torres", role: "Electrical Lead", time: "Mar 28, 2:30 PM", text: "Can we raise the duct 4 inches? Our cable tray needs 14 inches of clearance per NEC requirements." },
    ]
  },
  {
    id: "TKT-002",
    title: "Plumbing waste line routing through electrical room",
    description: "2-inch sanitary waste line for 2nd floor women's restroom routes directly over Panel B location. Need to reroute to avoid water damage risk to electrical equipment.",
    status: "escalated",
    priority: "critical",
    trades: ["plumbing", "electrical"],
    location: "2nd Floor - Electrical Room / Women's A202",
    sheet: "P202A",
    createdBy: "Dave Wilson",
    createdAt: "2026-03-25",
    escalationLevel: 3,
    escalationChain: ["Field Worker", "Trade Foreman", "Trade PM", "General PM"],
    comments: [
      { author: "Dave Wilson", role: "Plumbing Installer", time: "Mar 25, 9:00 AM", text: "Per P202A, the 2\" sanitary line passes directly over the electrical panel location shown on E600A. This is a code concern." },
      { author: "Sarah Chen", role: "General PM", time: "Mar 26, 8:00 AM", text: "Escalating to architect. We need a revised routing that avoids the electrical room entirely. Meeting scheduled for Thursday." },
    ]
  },
  {
    id: "TKT-003",
    title: "Sprinkler head placement conflicts with ceiling light fixture",
    description: "Pendant sprinkler head location at boardroom A217 overlaps with the LT-1 decorative pendant light shown on A141A/E301A.",
    status: "resolved",
    priority: "medium",
    trades: ["fire", "electrical", "architectural"],
    location: "1st Floor - Boardroom A217",
    sheet: "FP201A",
    createdBy: "Mike Torres",
    createdAt: "2026-03-20",
    escalationLevel: 2,
    escalationChain: ["Field Worker", "Trade Foreman", "Trade PM", "General PM"],
    comments: [
      { author: "Mike Torres", role: "Electrical Lead", time: "Mar 20, 11:00 AM", text: "LT-1 pendant fixture at boardroom center conflicts with sprinkler head position per FP201A." },
      { author: "Sarah Chen", role: "General PM", time: "Mar 22, 3:00 PM", text: "Resolved: Architect approved shifting sprinkler 18\" east. Updated on FP201A Rev 1." },
    ]
  },
];

const TASK_CARDS = {
  mechanical: [
    { id: "MT-1", title: "Install fan coil units AHU-1 through AHU-5", sheet: "M801A", floor: "1st", status: "in_progress", priority: "high",
      steps: ["Verify mounting locations per M201A", "Install wall brackets at specified heights", "Connect refrigerant piping per M202A keyed notes", "Connect condensate drain lines", "Wire to Panel M circuits per E600A", "Test operation and balance airflow"],
      materials: ["Carrier FCU-3 units (5x)", "Copper refrigerant lines", "PVC condensate drain", "Mounting brackets"],
      specs: "Wall-mounted, 750 CFM each, R-410A refrigerant, 208V/1PH power" },
    { id: "MT-2", title: "Rough-in ductwork - 1st floor main corridor", sheet: "M201A", floor: "1st", status: "pending", priority: "medium",
      steps: ["Layout main trunk duct route per M201A", "Install trapeze hangers per M502A detail 6", "Fabricate and install rectangular duct fittings per M501A", "Install flex duct connections to diffusers", "Seal all joints with mastic", "Install fire dampers at rated walls"],
      materials: ["Galvanized sheet metal duct", "Flex duct", "Trapeze hangers", "Duct mastic", "Fire dampers"],
      specs: "Main supply: 24x12 rectangular, branches per air distribution schedule M801A" },
  ],
  electrical: [
    { id: "EL-1", title: "Install Panel A & Panel B", sheet: "E600A", floor: "Both", status: "pending", priority: "high",
      steps: ["Mount panels per E700A panelboard detail", "Pull feeders from DP-A per E500A riser diagram", "Land conductors and torque to spec", "Install branch circuit breakers per schedule", "Label all circuits", "Perform IR scan after energization"],
      materials: ["Panel A (225A MLO)", "Panel B (225A MCB)", "Copper conductors per E500A schedule", "Circuit breakers"],
      specs: "Panel A: 208Y/120V 3PH, Panel B: 208Y/120V 3PH" },
    { id: "EL-2", title: "1st floor lighting rough-in", sheet: "E301A", floor: "1st", status: "in_progress", priority: "medium",
      steps: ["Layout junction box locations per E301A", "Run conduit/MC cable to each fixture location", "Pull conductors and make up splices", "Install fixture mounting brackets", "Coordinate with ceiling grid per A141A", "Install switching per keyed notes"],
      materials: ["Type A LED downlights (Lithonia)", "Type D recessed LED (Lithonia)", "MC cable", "Junction boxes", "Switches"],
      specs: "All fixtures LED, see E500A lighting fixture schedule for types and wattages" },
  ],
  plumbing: [
    { id: "PL-1", title: "Install water closets and lavatories - 1st floor", sheet: "P001A", floor: "1st", status: "pending", priority: "medium",
      steps: ["Verify rough-in dimensions per P001A fixture schedule", "Install carriers and supports", "Connect 2\" sanitary, 1.5\" vent per P201A", "Connect 1/2\" cold and 1/2\" hot water supply", "Mount fixtures and install trim", "Test and check for leaks"],
      materials: ["Zurn Z5615 wall-mounted WC (3x)", "Kohler K-2214 undermount lav (3x)", "Carrier frames", "Chrome supply stops"],
      specs: "WC: 1.0 GPF sensor flush, Lav: 0.5 GPM sensor faucet" },
  ],
  fire: [
    { id: "FP-1", title: "Install sprinkler branch lines - 1st floor", sheet: "FP201A", floor: "1st", status: "pending", priority: "high",
      steps: ["Layout branch line routing per FP201A", "Install hangers per FP001A detail", "Run 1\" and 1-1/4\" branch lines", "Install sprinkler heads per head schedule", "Hydrostatically test at 200 PSI for 2 hours", "Obtain fire marshal inspection"],
      materials: ["Schedule 10 steel pipe", "Sprinkler heads per FP001A schedule", "Hangers and clamps", "Test equipment"],
      specs: "Ordinary hazard Group 1, 0.15 GPM/SF density, upright in non-accessible ceilings" },
  ],
  technology: [
    { id: "TC-1", title: "Install voice/data outlets - 1st floor", sheet: "T201A", floor: "1st", status: "pending", priority: "medium",
      steps: ["Layout outlet locations per T201A", "Install conduit/J-hooks to each location", "Pull Cat6A cable from telecom room", "Terminate at patch panel and outlet", "Test and certify each run", "Label per T001A standards"],
      materials: ["Cat6A plenum cable", "Single-gang faceplates", "Cat6A jacks", "Patch panels", "Cable management"],
      specs: "Each data jack: dedicated Cat6A home run, max 295ft, TIA-568 certified" },
  ],
};

// ============================================================
// COMPONENTS
// ============================================================

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = () => {
    const user = USERS_DB.find(u => u.email === email && u.password === password);
    if (user) { onLogin(user); }
    else { setError("Invalid email or password"); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <Layers className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Coleman Construction</h1>
          <p className="text-blue-300 mt-2">Las Vegas, Nevada</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              Sign In
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button onClick={() => setShowDemo(!showDemo)} className="text-sm text-blue-600 hover:text-blue-800 w-full text-center">
              {showDemo ? "Hide demo accounts" : "Show demo accounts ↓"}
            </button>
            {showDemo && (
              <div className="mt-3 space-y-2">
                {USERS_DB.map(u => (
                  <button key={u.email} onClick={() => { setEmail(u.email); setPassword(u.password); }}
                    className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    <span className="font-medium text-gray-900">{u.name}</span>
                    <span className="text-gray-500 ml-2">— {u.role}</span>
                    <span className="block text-gray-400 text-xs">{u.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-blue-300 text-sm">
          <Shield className="w-4 h-4" />
          <span>Secured with end-to-end encryption</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onNavigate }) {
  const myTrades = user.trades.includes("all") ? TRADES : TRADES.filter(t => user.trades.includes(t.id));
  const openTickets = SAMPLE_TICKETS.filter(t => t.status !== "resolved");
  const criticalTickets = SAMPLE_TICKETS.filter(t => t.priority === "critical");

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h2>
        <p className="text-blue-200 mt-1">Coleman Construction — Las Vegas, Nevada</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
            <div className="text-2xl font-bold">{openTickets.length}</div>
            <div className="text-xs text-blue-200">Open Tickets</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
            <div className="text-2xl font-bold">{criticalTickets.length}</div>
            <div className="text-xs text-blue-200">Critical</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
            <div className="text-2xl font-bold">52</div>
            <div className="text-xs text-blue-200">Sheets</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-blue-200">Trades</div>
          </div>
        </div>
      </div>

      {/* Critical alerts */}
      {criticalTickets.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <AlertTriangle className="w-5 h-5" />
            Critical Coordination Issues
          </div>
          {criticalTickets.map(t => (
            <button key={t.id} onClick={() => onNavigate("ticket", t.id)} className="w-full text-left bg-white rounded-lg p-3 border border-red-200 hover:border-red-400 transition-colors mt-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">{t.title}</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Level {t.escalationLevel}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{t.trades.map(tr => TRADES.find(tt => tt.id === tr)?.icon).join(" ")} {t.location}</div>
            </button>
          ))}
        </div>
      )}

      {/* Trade sections */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Your Trades</h3>
        <div className="grid grid-cols-2 gap-3">
          {myTrades.filter(t => t.id !== "general").map(trade => (
            <button key={trade.id} onClick={() => onNavigate("trade", trade.id)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left">
              <div className="text-3xl mb-2">{trade.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{trade.name}</div>
              <div className="text-xs text-gray-500 mt-1">{trade.sheets.length} sheets</div>
              <div className="mt-2 flex items-center gap-1">
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.random() * 60 + 20}%`, backgroundColor: trade.color }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button onClick={() => onNavigate("tickets")} className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><Flag className="w-5 h-5 text-orange-600" /></div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 text-sm">Coordination Tickets</div>
              <div className="text-xs text-gray-500">{openTickets.length} open issues across trades</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button onClick={() => onNavigate("sheets")} className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 text-sm">All Blueprint Sheets</div>
              <div className="text-xs text-gray-500">52 sheets across 7 disciplines</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button onClick={() => onNavigate("newticket")} className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 text-sm">Raise a Conflict</div>
              <div className="text-xs text-gray-500">Flag a cross-trade coordination issue</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TradeView({ tradeId, user, onNavigate }) {
  const trade = TRADES.find(t => t.id === tradeId);
  const isWorkerView = user.level === "worker";
  const tasks = TASK_CARDS[tradeId] || [];
  const tradeTickets = SAMPLE_TICKETS.filter(t => t.trades.includes(tradeId));
  const [viewMode, setViewMode] = useState(isWorkerView ? "tasks" : "sheets");

  if (!trade) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${trade.color}, ${trade.color}dd)` }}>
        <div className="text-4xl mb-2">{trade.icon}</div>
        <h2 className="text-2xl font-bold">{trade.name}</h2>
        <p className="text-white/80 text-sm mt-1">{trade.desc}</p>
      </div>

      {/* View toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button onClick={() => setViewMode("tasks")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "tasks" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
          📋 Task Cards
        </button>
        <button onClick={() => setViewMode("sheets")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "sheets" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
          📄 Blueprint Sheets
        </button>
      </div>

      {viewMode === "tasks" && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium">No task cards yet</p>
              <p className="text-sm mt-1">Task cards will be added by the project manager</p>
            </div>
          ) : tasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {task.status === "in_progress" ? "In Progress" : "Pending"}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {task.priority} priority
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{task.title}</h4>
                <p className="text-xs text-gray-500 mt-1">Sheet: {task.sheet} • Floor: {task.floor}</p>
                <p className="text-xs text-gray-500 mt-0.5 italic">{task.specs}</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Installation Steps:</p>
                  <div className="space-y-1.5">
                    {task.steps.map((step, i) => (
                      <label key={i} className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                        <span>{step}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Materials Needed:</p>
                  <div className="flex flex-wrap gap-1">
                    {task.materials.map((m, i) => (
                      <span key={i} className="text-xs bg-white border border-gray-200 rounded px-2 py-0.5">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <button onClick={() => onNavigate("sheet", task.sheet)} className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                  <Eye className="w-4 h-4" /> View Sheet
                </button>
                <button onClick={() => onNavigate("newticket")} className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors border-l border-gray-100">
                  <Flag className="w-4 h-4" /> Flag Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "sheets" && (
        <div className="space-y-2">
          {trade.sheets.map(sheetId => {
            const sheet = SAMPLE_SHEETS[sheetId];
            return (
              <button key={sheetId} onClick={() => onNavigate("sheet", sheetId)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold" style={{ color: trade.color }}>{sheetId}</span>
                      {sheet?.floor && sheet.floor !== "N/A" && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{sheet.floor} Floor</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 font-medium mt-0.5">{sheet?.title || sheetId}</p>
                    {sheet?.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sheet.description}</p>}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Trade-specific tickets */}
      {tradeTickets.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Flag className="w-4 h-4 text-orange-500" /> Active Coordination Issues
          </h3>
          {tradeTickets.filter(t => t.status !== "resolved").map(ticket => (
            <button key={ticket.id} onClick={() => onNavigate("ticket", ticket.id)}
              className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ticket.priority === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                }`}>{ticket.priority}</span>
                <span className="text-xs text-gray-500">{ticket.id}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
              <div className="flex items-center gap-2 mt-2">
                {ticket.trades.map(tr => (
                  <span key={tr} className="text-xs bg-gray-100 rounded px-2 py-0.5">{TRADES.find(t => t.id === tr)?.icon} {TRADES.find(t => t.id === tr)?.name}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SheetViewer({ sheetId, onNavigate }) {
  const sheet = SAMPLE_SHEETS[sheetId];
  const trade = TRADES.find(t => t.sheets.includes(sheetId));
  const [zoom, setZoom] = useState(100);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-lg font-bold" style={{ color: trade?.color }}>{sheetId}</span>
          {trade && <span className="text-lg">{trade.icon}</span>}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{sheet?.title || sheetId}</h3>
        <p className="text-sm text-gray-600 mt-1">{sheet?.description}</p>
        {sheet?.floor && sheet.floor !== "N/A" && (
          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Floor: {sheet.floor}</span>
        )}
      </div>

      {/* Blueprint preview area */}
      <div className="bg-slate-100 rounded-xl border border-gray-300 overflow-hidden">
        <div className="flex items-center justify-between bg-slate-200 px-4 py-2">
          <span className="text-sm font-medium text-gray-700">Blueprint View</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="overflow-auto bg-slate-300 w-full relative" style={{ height: "500px" }}>
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", transition: "transform 0.2s", minWidth: "100%", width: "max-content" }}>
            <img 
              src={sheetId.startsWith('G') ? 'G000A.jpg' : sheetId.startsWith('M') ? 'M201A.jpg' : 'A141A.jpg'} 
              alt={`Blueprint sheet ${sheetId}`} 
              className="w-full h-auto shadow-sm select-none" 
              style={{ minWidth: "800px" }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={() => onNavigate("newticket")} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
          <Flag className="w-5 h-5" /> Flag Conflict
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
          <MessageCircle className="w-5 h-5" /> Add Note
        </button>
      </div>

      {/* Related sheets */}
      {trade && (
        <div>
          <h4 className="font-bold text-gray-900 mb-2">Other {trade.name} Sheets</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {trade.sheets.filter(s => s !== sheetId).map(s => (
              <button key={s} onClick={() => onNavigate("sheet", s)}
                className="flex-shrink-0 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                <span className="font-mono text-sm font-bold" style={{ color: trade.color }}>{s}</span>
                <p className="text-xs text-gray-500 mt-0.5">{SAMPLE_SHEETS[s]?.title || s}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TicketList({ onNavigate }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? SAMPLE_TICKETS : SAMPLE_TICKETS.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Coordination Tickets</h2>
        <button onClick={() => onNavigate("newticket")} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "open", "escalated", "resolved"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${SAMPLE_TICKETS.filter(t => f === "all" || t.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(ticket => (
          <button key={ticket.id} onClick={() => onNavigate("ticket", ticket.id)}
            className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ticket.priority === "critical" ? "bg-red-100 text-red-700" :
                  ticket.priority === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"
                }`}>{ticket.priority}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ticket.status === "open" ? "bg-blue-100 text-blue-700" :
                  ticket.status === "escalated" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>{ticket.status}</span>
              </div>
              <span className="text-xs text-gray-500">{ticket.id}</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{ticket.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{ticket.location}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                {ticket.trades.map(tr => (
                  <span key={tr} className="text-sm">{TRADES.find(t => t.id === tr)?.icon}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ArrowUp className="w-3 h-3" />
                Level {ticket.escalationLevel}/{ticket.escalationChain.length}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TicketDetail({ ticketId, onNavigate }) {
  const ticket = SAMPLE_TICKETS.find(t => t.id === ticketId);
  const [newComment, setNewComment] = useState("");

  if (!ticket) return <div className="text-center py-8 text-gray-500">Ticket not found</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            ticket.priority === "critical" ? "bg-red-100 text-red-700" :
            ticket.priority === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"
          }`}>{ticket.priority}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            ticket.status === "open" ? "bg-blue-100 text-blue-700" :
            ticket.status === "escalated" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>{ticket.status}</span>
          <span className="text-xs text-gray-500 ml-auto">{ticket.id}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{ticket.title}</h2>
        <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {ticket.trades.map(tr => {
            const trade = TRADES.find(t => t.id === tr);
            return (
              <span key={tr} className="text-xs bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1">
                {trade?.icon} {trade?.name}
              </span>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          📍 {ticket.location} • 📄 Sheet {ticket.sheet} • 📅 {ticket.createdAt}
        </div>
      </div>

      {/* Escalation chain */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ArrowUp className="w-4 h-4 text-blue-600" /> Escalation Chain
        </h3>
        <div className="flex items-center gap-1">
          {ticket.escalationChain.map((level, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div className={`flex-1 text-center py-2 px-1 rounded-lg text-xs font-medium ${
                i < ticket.escalationLevel ? "bg-blue-600 text-white" :
                i === ticket.escalationLevel ? "bg-orange-100 text-orange-700 border-2 border-orange-400" :
                "bg-gray-100 text-gray-500"
              }`}>
                {level}
              </div>
              {i < ticket.escalationChain.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            </div>
          ))}
        </div>
        {ticket.status !== "resolved" && (
          <button className="w-full mt-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-2">
            <ArrowUp className="w-4 h-4" /> Escalate to {ticket.escalationChain[Math.min(ticket.escalationLevel + 1, ticket.escalationChain.length - 1)]}
          </button>
        )}
      </div>

      {/* Related sheet link */}
      <button onClick={() => onNavigate("sheet", ticket.sheet)}
        className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>
        <div className="text-left flex-1">
          <div className="font-semibold text-gray-900 text-sm">View Related Sheet: {ticket.sheet}</div>
          <div className="text-xs text-gray-500">{SAMPLE_SHEETS[ticket.sheet]?.title}</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-600" /> Discussion ({ticket.comments.length})
        </h3>
        <div className="space-y-3">
          {ticket.comments.map((c, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">{c.author}</span>
                <span className="text-xs text-gray-500">{c.time}</span>
              </div>
              <span className="text-xs text-blue-600">{c.role}</span>
              <p className="text-sm text-gray-700 mt-2">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={newComment} onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NewTicketForm({ onNavigate, user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");
  const [sheet, setSheet] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTrade = (id) => {
    setSelectedTrades(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Ticket Submitted!</h3>
          <p className="text-gray-500 mt-2">TKT-004 has been created and assigned.</p>
          <p className="text-sm text-gray-400 mt-1">Relevant trade foremen have been notified.</p>
          <button onClick={() => onNavigate("tickets")} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700">
            View All Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Raise a Coordination Issue</h2>
      <p className="text-sm text-gray-600">Flag a conflict between trades so the right people can coordinate a solution.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Ductwork conflicts with cable tray at corridor"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            placeholder="Describe the conflict, what you found, and which sheets/locations are affected..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trades Involved *</label>
          <div className="grid grid-cols-2 gap-2">
            {TRADES.filter(t => t.id !== "general").map(trade => (
              <button key={trade.id} onClick={() => toggleTrade(trade.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  selectedTrades.includes(trade.id) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <span>{trade.icon}</span>
                <span>{trade.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Sheet</label>
            <input value={sheet} onChange={e => setSheet(e.target.value)}
              placeholder="e.g., M201A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="e.g., 1st Floor - Corridor near office A209"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        <button onClick={() => setSubmitted(true)}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
          <Flag className="w-5 h-5" /> Submit Coordination Ticket
        </button>
      </div>
    </div>
  );
}

function AllSheets({ onNavigate }) {
  const [filterTrade, setFilterTrade] = useState("all");
  const allSheets = Object.entries(SAMPLE_SHEETS);
  const filtered = filterTrade === "all" ? allSheets : allSheets.filter(([_, s]) => s.type === filterTrade);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">All Blueprint Sheets</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFilterTrade("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            filterTrade === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}>All (52)</button>
        {TRADES.map(t => (
          <button key={t.id} onClick={() => setFilterTrade(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              filterTrade === t.id ? "text-white" : "bg-gray-100 text-gray-600"
            }`}
            style={filterTrade === t.id ? { backgroundColor: t.color } : {}}>
            {t.icon} {t.name}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(([id, sheet]) => {
          const trade = TRADES.find(t => t.id === sheet.type);
          return (
            <button key={id} onClick={() => onNavigate("sheet", id)}
              className="w-full text-left bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl">{trade?.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold" style={{ color: trade?.color }}>{id}</span>
                    <span className="text-sm text-gray-900">{sheet.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{sheet.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

function App() {
  const [user, setUser] = useState(USERS_DB[0]);
  const [screen, setScreen] = useState("dashboard");
  const [screenParam, setScreenParam] = useState(null);
  const [navHistory, setNavHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (target, param = null) => {
    setNavHistory(prev => [...prev, { screen, param: screenParam }]);
    setScreen(target);
    setScreenParam(param);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory(h => h.slice(0, -1));
      setScreen(prev.screen);
      setScreenParam(prev.param);
    }
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  const screenTitle = {
    dashboard: "Dashboard",
    trade: TRADES.find(t => t.id === screenParam)?.name || "Trade",
    sheet: screenParam || "Sheet",
    tickets: "Tickets",
    ticket: screenParam || "Ticket",
    newticket: "New Ticket",
    sheets: "All Sheets",
  }[screen] || "Coleman Construction";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            {screen !== "dashboard" ? (
              <button onClick={goBack} className="p-1"><ChevronLeft className="w-6 h-6 text-gray-700" /></button>
            ) : (
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
                {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            )}
            <span className="font-bold text-gray-900">{screenTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {user.avatar}
            </div>
          </div>
        </div>
      </div>

      {/* Side menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white w-72 shadow-xl p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{user.avatar}</div>
              <div>
                <div className="font-bold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.role}</div>
              </div>
            </div>
            <div className="space-y-1">
              <button onClick={() => navigate("dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"><Home className="w-5 h-5" /> Dashboard</button>
              <button onClick={() => navigate("sheets")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"><FileText className="w-5 h-5" /> All Sheets</button>
              <button onClick={() => navigate("tickets")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"><Flag className="w-5 h-5" /> Tickets</button>
              <button onClick={() => navigate("newticket")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"><AlertTriangle className="w-5 h-5" /> Raise Conflict</button>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">TRADES</p>
              {TRADES.filter(t => t.id !== "general").map(t => (
                <button key={t.id} onClick={() => navigate("trade", t.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
                  <span>{t.icon}</span> {t.name}
                </button>
              ))}
            </div>
            <div className="border-t pt-4">
              <button onClick={() => setUser(null)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 pb-24">
        {screen === "dashboard" && <Dashboard user={user} onNavigate={navigate} />}
        {screen === "trade" && <TradeView tradeId={screenParam} user={user} onNavigate={navigate} />}
        {screen === "sheet" && <SheetViewer sheetId={screenParam} onNavigate={navigate} />}
        {screen === "tickets" && <TicketList onNavigate={navigate} />}
        {screen === "ticket" && <TicketDetail ticketId={screenParam} onNavigate={navigate} />}
        {screen === "newticket" && <NewTicketForm onNavigate={navigate} user={user} />}
        {screen === "sheets" && <AllSheets onNavigate={navigate} />}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="max-w-lg mx-auto flex">
          {[
            { id: "dashboard", icon: Home, label: "Home" },
            { id: "sheets", icon: FileText, label: "Sheets" },
            { id: "newticket", icon: Flag, label: "Flag" },
            { id: "tickets", icon: MessageCircle, label: "Tickets" },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setNavHistory([]); setScreen(tab.id); setScreenParam(null); }}
              className={`flex-1 flex flex-col items-center py-3 ${screen === tab.id ? "text-blue-600" : "text-gray-400"}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
