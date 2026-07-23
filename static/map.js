// Unified map for /route/<lang>. Reads language from #map[data-lang],
// fetches clinics from /api/clinics, and never blocks on geolocation:
// the Taiwan-wide map with all clinics renders first, then recenters
// if the user's position becomes available.

const I18N = {
  zh: {
    me: "我",
    name: "醫院名稱",
    address: "地址",
    note: "備註",
    none: "無",
    phone: "電話",
    emergency: "急診專線",
    website: "網站",
    navigate: "導航",
    loadError: "無法載入獸醫院資料，請重新整理頁面",
  },
  en: {
    me: "Me",
    name: "Name",
    address: "Address",
    note: "Note",
    none: "None",
    phone: "Phone",
    emergency: "Emergency line",
    website: "Website",
    navigate: "Navigate",
    loadError: "Couldn't load clinic data — please refresh the page",
  },
};

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
    clinics.forEach((c) => {
      const marker = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map,
        title: c.name,
      });
      marker.addListener("click", () => {
        infoWindow.setContent(infoContent(c, t));
        infoWindow.open(map, marker);
      });
    });
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
