let cards = [];

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const search = document.getElementById("search");
const sort = document.getElementById("sort");

function render(list) {
  grid.innerHTML = "";
  empty.hidden = list.length !== 0;

  for (const c of list) {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.name)}" loading="lazy">
      <div class="meta">
        <div class="name">${escapeHtml(c.name)}</div>
        <div class="row">
          <span class="badge">${escapeHtml(c.set ?? "—")}</span>
          <span class="price">$${Number(c.price).toFixed(2)}</span>
        </div>
      </div>
    `;
    grid.appendChild(el);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();
  let filtered = cards.filter(c =>
    c.name.toLowerCase().includes(q) || (c.set ?? "").toLowerCase().includes(q)
  );

  const [field, dir] = sort.value.split("-");
  filtered.sort((a,b) => {
    let av = field === "price" ? Number(a.price) : a.name.toLowerCase();
    let bv = field === "price" ? Number(b.price) : b.name.toLowerCase();
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });

  render(filtered);
}

async function main() {
  const res = await fetch("cards.json", { cache: "no-store" });
  cards = await res.json();
  applyFilters();
}

search.addEventListener("input", applyFilters);
sort.addEventListener("change", applyFilters);
main();
