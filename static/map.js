// Unified map for /route/<lang>. Reads language from #map[data-lang],
// fetches clinics from /api/clinics, and never blocks on geolocation:
// the Taiwan-wide map with all clinics renders first, then recenters
// if the user's position becomes available.

const I18N = {
  zh: {
    me: "我",
    note: "備註",
    phone: "電話",
    emergency: "急診專線",
    website: "網站",
    navigate: "導航",
    species: "服務對象",
    loadError: "無法載入獸醫院資料，請重新整理頁面",
    mapDown: "地圖今日流量已滿或暫時無法載入——完整的急診診所清單一樣查得到：",
    mapDownBtn: "開啟診所清單",
    filterAll: "全部",
    filterHint: "特寵篩選只顯示有明確標示可看診的醫院；前往前請先電話確認。",
    speciesNames: { dog: "犬", cat: "貓", rodent: "鼠", rabbit: "兔", bird: "鳥",
      turtle: "龜", reptile: "爬蟲", hedgehog: "刺蝟", sugar_glider: "蜜袋鼯", ferret: "貂" },
  },
  en: {
    me: "Me",
    note: "Note",
    phone: "Phone",
    emergency: "Emergency line",
    website: "Website",
    navigate: "Navigate",
    species: "Treats",
    loadError: "Couldn't load clinic data — please refresh the page",
    mapDown: "The map hit today's traffic cap or failed to load — the full clinic list still works:",
    mapDownBtn: "Open clinic list",
    filterAll: "All",
    filterHint: "Exotic-pet filters only show clinics that explicitly list the species; please call before going.",
    speciesNames: { dog: "Dogs", cat: "Cats", rodent: "Rodents", rabbit: "Rabbits", bird: "Birds",
      turtle: "Turtles", reptile: "Reptiles", hedgehog: "Hedgehogs", sugar_glider: "Sugar gliders", ferret: "Ferrets" },
  },
};

const SPECIES_ORDER = ["bird", "turtle", "reptile", "rodent", "rabbit", "hedgehog", "sugar_glider", "ferret"];
const TAIWAN_CENTER = { lat: 23.7, lng: 120.96 };

function telLinks(raw) {
  // "09-28242358 or 02-2517-0902" -> two links; "#20" extensions kept as text
  return raw
    .split(/\s+or\s+/)
    .map((part) => {
      const digits = part.replace(/[^0-9+]/g, "");
      return `<a href="tel:${digits}">${part.trim()}</a>`;
    })
    .join(" / ");
}

function infoContent(c, t) {
  const lines = [`<strong>${c.name}</strong>`, c.address];
  if (c.note) lines.push(`<strong>${t.note}: ${c.note}</strong>`);
  if (c.species_verified) {
    lines.push(`${t.species}: ${c.species.map((s) => t.speciesNames[s] || s).join("、")}`);
  }
  if (c.phone) lines.push(`${t.phone}: ${telLinks(c.phone)}`);
  if (c.emergency_phone && !c.phone.includes(c.emergency_phone.replace(/-/g, ""))) {
    lines.push(`${t.emergency}: ${telLinks(c.emergency_phone)}`);
  }
  const links = [];
  if (c.website) links.push(`<a href="${c.website}" target="_blank" rel="noopener">${t.website}</a>`);
  links.push(
    `<a href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}&travelmode=driving" target="_blank" rel="noopener">${t.navigate}</a>`
  );
  lines.push(links.join(" · "));
  return `<div class="map-info">${lines.join("<br>")}</div>`;
}

function buildFilterBar(map, clinics, entries, t) {
  const bar = document.getElementById("filter-bar");
  if (!bar) return;
  const present = new Set(clinics.flatMap((c) => (c.species_verified ? c.species : [])));
  const keys = SPECIES_ORDER.filter((s) => present.has(s));
  if (!keys.length) return;

  const chips = [["all", t.filterAll], ...keys.map((s) => [s, t.speciesNames[s]])];
  bar.innerHTML =
    chips.map(([key, label]) => `<button class="chip${key === "all" ? " active" : ""}" data-species="${key}">${label}</button>`).join("") +
    `<span class="filter-hint">${t.filterHint}</span>`;

  bar.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".chip");
    if (!btn) return;
    bar.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const sel = btn.dataset.species;
    entries.forEach(({ clinic, marker }) => {
      const show = sel === "all" || (clinic.species_verified && clinic.species.includes(sel));
      marker.setMap(show ? map : null);
    });
  });
}

// Load-shedding: if Maps JS can't start (daily quota exhausted, auth error,
// network), swap the map area for a link to the list page, which needs no
// Google quota at all.
function mapFallback() {
  const el = document.getElementById("map");
  if (!el || el.dataset.fallback) return;
  el.dataset.fallback = "1";
  const lang = el.dataset.lang === "en" ? "en" : "zh";
  const t = I18N[lang];
  el.outerHTML = `<div class="map-fallback">
    <p>${t.mapDown}</p>
    <a class="back-map-btn" href="/details/${lang}">${t.mapDownBtn}</a>
  </div>`;
}
window.gm_authFailure = mapFallback; // Google invokes this on key/quota failures
setTimeout(() => { if (!window.google || !window.google.maps) mapFallback(); }, 8000);

async function initMap() {
  const el = document.getElementById("map");
  const lang = el.dataset.lang === "en" ? "en" : "zh";
  const t = I18N[lang];

  const map = new google.maps.Map(el, { center: TAIWAN_CENTER, zoom: 8 });
  const infoWindow = new google.maps.InfoWindow({});

  try {
    const res = await fetch(`/api/clinics?lang=${lang}`);
    if (!res.ok) throw new Error(res.status);
    const clinics = await res.json();
    const entries = clinics.map((c) => {
      const marker = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map,
        title: c.name,
      });
      marker.addListener("click", () => {
        infoWindow.setContent(infoContent(c, t));
        infoWindow.open(map, marker);
      });
      return { clinic: c, marker };
    });
    buildFilterBar(map, clinics, entries, t);
  } catch (e) {
    el.insertAdjacentHTML("beforebegin", `<p class="map-error">${t.loadError}</p>`);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        new google.maps.Marker({ position: pos, map, label: t.me });
        map.setCenter(pos);
        map.setZoom(12);
      },
      () => {} // denied/unavailable: keep the Taiwan-wide view
    );
  }
}
window.initMap = initMap;
