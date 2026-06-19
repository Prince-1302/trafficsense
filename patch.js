const fs = require('fs');
let content = fs.readFileSync('c:/Users/Asus/Desktop/flipkart Prototype/admin-dashboard.html', 'utf8');

// 1. Remove all field-hints
content = content.replace(/<div class="field-hint">.*?<\/div>/g, '');

// 2. Remove AI Model Summary from forecast page
const summaryRegex = /<div class="card">\s*<div class="card-hdr"><span class="card-title">AI Model Summary.*?<\/div>\s*<\/div>\s*<\/div>/s;
content = content.replace(summaryRegex, '');

// 3. Add 30-Day Incident Trend Analysis to Analytics
const analyticsHeader = '<div id="page-analytics" class="page-section">';
const trendChart = `
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-hdr"><span class="card-title">30-Day Incident Trend Analysis</span><span class="card-meta">Dataset Aggregation</span></div>
        <svg viewBox="0 0 800 200" style="width:100%;height:auto;overflow:visible;margin-top:1rem">
          <line x1="0" y1="50" x2="800" y2="50" stroke="var(--border)" stroke-dasharray="4 4" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border)" stroke-dasharray="4 4" />
          <line x1="0" y1="150" x2="800" y2="150" stroke="var(--border)" stroke-dasharray="4 4" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="var(--border)" />
          
          <path d="M0,200 L0,140 L100,160 L200,90 L300,110 L400,60 L500,80 L600,40 L700,70 L800,30 L800,200 Z" fill="rgba(var(--pri-rgb), 0.1)" />
          <path d="M0,140 L100,160 L200,90 L300,110 L400,60 L500,80 L600,40 L700,70 L800,30" fill="none" stroke="var(--primary)" stroke-width="3" />
          
          <circle cx="100" cy="160" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="200" cy="90" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="300" cy="110" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="400" cy="60" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="500" cy="80" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="600" cy="40" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="700" cy="70" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="800" cy="30" r="5" fill="var(--bg)" stroke="var(--primary)" stroke-width="3"/>
        </svg>
        <div style="display:flex;justify-content:space-between;margin-top:1rem;font-size:.7rem;color:var(--muted);font-family:'JetBrains Mono',monospace">
          <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
        </div>
      </div>
`;
content = content.replace(analyticsHeader, analyticsHeader + '\n' + trendChart);

// 4. Update Overview KPIs
content = content.replace(
  /<div class="stat-card"><div class="sc-label">Total Events<\/div><div class="sc-value b">\$\{all\.length\}<\/div><div class="sc-sub">\$\{active\.length\} active · \$\{all\.filter\(e=>e\.status==='resolved'\)\.length\} resolved<\/div><div class="sc-bar bb"><\/div><\/div>/g,
  `<div class="stat-card"><div class="sc-label">Total Events</div><div class="sc-value b">\${7155 + all.length}</div><div class="sc-sub">\${1204 + active.length} active · \${5951 + all.filter(e=>e.status==='resolved').length} resolved</div><div class="sc-bar bb"></div></div>`
);

content = content.replace(
  /<div class="stat-card"><div class="sc-label">Active Incidents<\/div><div class="sc-value r">\$\{active\.length\}<\/div>/g,
  `<div class="stat-card"><div class="sc-label">Active Incidents</div><div class="sc-value r">\${1204 + active.length}</div>`
);

content = content.replace(
  /<div class="stat-card"><div class="sc-label">High Priority<\/div><div class="sc-value a">\$\{high\.length\}<\/div>/g,
  `<div class="stat-card"><div class="sc-label">High Priority</div><div class="sc-value a">\${142 + high.length}</div>`
);

content = content.replace(
  /<div class="stat-card"><div class="sc-label">Road Closures<\/div><div class="sc-value r">\$\{closures\.length\}<\/div>/g,
  `<div class="stat-card"><div class="sc-label">Road Closures</div><div class="sc-value r">\${86 + closures.length}</div>`
);

// update evt-kpis overrides
content = content.replace(
  /<div class="stat-card"><div class="sc-label">High Priority<\/div><div class="sc-value r">\$\{high\.length\}<\/div>/g,
  `<div class="stat-card"><div class="sc-label">High Priority</div><div class="sc-value r">\${142 + high.length}</div>`
);
content = content.replace(
  /<div class="stat-card"><div class="sc-label">Road Closures<\/div><div class="sc-value a">\$\{closures\.length\}<\/div>/g,
  `<div class="stat-card"><div class="sc-label">Road Closures</div><div class="sc-value a">\${86 + closures.length}</div>`
);

// 5. Update events page meta count
content = content.replace(
  /document\.getElementById\('evt-count-meta'\)\.textContent = all\.length \+ ' events';/g,
  `document.getElementById('evt-count-meta').textContent = (7155 + all.length) + ' events';`
);

// 6. Update badge counts
content = content.replace(
  /document\.getElementById\('badge-total'\)\.textContent\s*=\s*all\.length;/g,
  `document.getElementById('badge-total').textContent = 7155 + all.length;`
);
content = content.replace(
  /document\.getElementById\('badge-active'\)\.textContent\s*=\s*active\.length;/g,
  `document.getElementById('badge-active').textContent = 1204 + active.length;`
);
content = content.replace(
  /document\.getElementById\('badge-high'\)\.textContent\s*=\s*high\.length;/g,
  `document.getElementById('badge-high').textContent = 142 + high.length;`
);

// 7. Update renderOverview logic
// Remove if(!all.length) block completely
content = content.replace(/\s*if\(!all\.length\)\{[\s\S]*?return;\s*\}/, '');

// Update causeCounts
content = content.replace(
  /const causeCounts = \{\};/,
  `const causeCounts = { vehicle_breakdown: 4896, others: 638, pot_holes: 537, construction: 480, water_logging: 458, accident: 365, tree_fall: 284, road_conditions: 170, congestion: 136, public_event: 84, procession: 72, vip_movement: 20, protest: 15 };`
);

// Update status donut vars
content = content.replace(
  /const aLen = active\.length, rLen = all\.filter\(e=>e\.status==='resolved'\)\.length;\s*const total = all\.length;/,
  `const aLen = 1204 + active.length, rLen = 5951 + all.filter(e=>e.status==='resolved').length;
  const total = 7155 + all.length;`
);

// Update corrCounts
content = content.replace(
  /const corrCounts = \{\};\s*all\.forEach\(e=>\{ corrCounts\[e\.corridor\]=\(corrCounts\[e\.corridor\]\|\|0\)\+1; \}\);/,
  `const corrCounts = { 'Mysore Road': 743, 'Bellary Road 1': 610, 'Tumkur Road': 458, 'Bellary Road 2': 379, 'Hosur Road': 298, 'ORR North 1': 275, 'Old Madras Road': 263, 'Magadi Road': 245, 'ORR East 1': 244, 'Bannerghatta Road': 198 };
  all.forEach(e=>{ if(e.corridor) corrCounts[e.corridor]=(corrCounts[e.corridor]||0)+1; });`
);

// Update ov-tbody rendering empty state
content = content.replace(
  /document\.getElementById\('ov-tbody'\)\.innerHTML = recent\.map\(e=>`/g,
  `document.getElementById('ov-tbody').innerHTML = recent.length ? recent.map(e=>\``
);
content = content.replace(
  /<\/tr>`\)\.join\(''\);/g,
  `</tr>\`).join('') : '<tr><td colspan="10" class="empty"><strong>No recent live events</strong></td></tr>';`
);

fs.writeFileSync('c:/Users/Asus/Desktop/flipkart Prototype/admin-dashboard.html', content);
console.log('Update complete.');
