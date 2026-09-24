---
layout: portfolio
title: "Prototype — St. Louis-area measles exposure sites, map + table"
description: "A live-updating Datawrapper map and table of St. Louis-area measles exposure sites, fed from a Google Sheet. Prototype for Post-Dispatch editors."
date: 2026-09-24 12:00:00 -0500
author: Dan Bauman
categories:
- prototype
tags:
- datawrapper
- google-sheets
- geoprocessing
- public-health
sitemap: false
noindex: true
---

<div class="pd-measles-map-table" style="max-width:100%;">
  <iframe id="datawrapper-chart-0IDMB" title="Measles exposure sites map"
    src="https://datawrapper.dwcdn.net/0IDMB/"
    scrolling="no" frameborder="0" style="width:0;min-width:100%!important;border:none;display:block;" height="759"
    data-external="1"></iframe>
  <iframe id="datawrapper-chart-mVYw3" title="Measles exposure sites table"
    src="https://datawrapper.dwcdn.net/mVYw3/"
    scrolling="no" frameborder="0" style="width:0;min-width:100%!important;border:none;display:block;margin-top:24px;" height="1118"
    data-external="1"></iframe>
</div>

<!-- Datawrapper responsive-height script (needed once per page) -->
<script type="text/javascript">!function(){"use strict";window.addEventListener("message",(function(a){if(void 0!==a.data["datawrapper-height"]){var e=document.querySelectorAll("iframe");for(var t in a.data["datawrapper-height"])for(var r=0;r<e.length;r++)if(e[r].contentWindow===a.source){var i=a.data["datawrapper-height"][t]+"px";e[r].style.height=i}}}))}();</script>

<!-- Map → table link -->
<script src="https://static.dwcdn.net/js/events.js"></script>
<script>
(function () {
  var MAP = '0IDMB', TABLE = 'mVYw3';
  datawrapper.on('symbol.click', function (e) {
    if (e.chartId !== MAP) return;
    if (window.location.search.indexOf('debug') > -1) console.log('symbol.click payload', e.data);
    var d = e.data || {};
    var r = d.row || d;
    // Group = the Name of the table row this pin belongs to (vital-sheet convention, README).
    var name = r.Group || r.group || r.Name || r.name || '';
    if (!name) return;
    // Fallback for data published before the Group column existed.
    if (!(r.Group || r.group) && /Amtrak|Gateway Station/i.test(name)) name = 'Amtrak';
    var t = document.getElementById('datawrapper-chart-' + TABLE);
    t.src = 'https://datawrapper.dwcdn.net/' + TABLE + '/?search=' + encodeURIComponent(name);
    // leave room for a fixed site header (dan-bauman.com and most news CMSs pin one)
    t.style.scrollMarginTop = '110px';
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
</script>
