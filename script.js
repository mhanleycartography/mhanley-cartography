const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(o));});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));document.getElementById('year').textContent=new Date().getFullYear();

(async () => {
  try {
    const response = await fetch("content.json", { cache: "no-store" });
    if (!response.ok) return;

    const content = await response.json();

    const originalServices = [
      {
        title: "Web Services & Database Management",
        description: "Design and maintain GIS databases; Host data and design online maps; integrate GPS, survey, and public datasets (NHD, parcels, aerials). Digitizing historic maps, and CAD Drawings."
      },
      {
        title: "Environmental & Hydrologic Analysis",
        description: "Surface raster modeling (flow direction, accumulation, drainage paths). Wetland, pond, and sub-basin analysis, and contaminant plume mapping."
      },
      {
        title: "Cartography & Visualization",
        description: "Custom map design for reports, presentations, and public engagement. Atlas creation and thematic mapping (environmental, land-use, hydrology)."
      },
      {
        title: "GPS & Field Mapping",
        description: "High-accuracy GPS collection."
      },
      {
        title: "Community & Conservation Projects",
        description: "Open space and park mapping, historic resource imagery, and support for municipal/recreation boards and conservation planning."
      }
    ];

    const replacements = new Map();

    if (content.businessName) {
      replacements.set("M Hanley", content.businessName);
    }

    if (content.subtitle) {
      replacements.set("GIS Analyst", content.subtitle);
    }

    if (Array.isArray(content.services)) {
      originalServices.forEach((original, index) => {
        const updated = content.services[index];
        if (!updated) return;

        if (updated.title) {
          replacements.set(original.title, updated.title);
        }

        if (updated.description) {
          replacements.set(original.description, updated.description);
        }
      });
    }

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(node => {
      const currentText = node.nodeValue.trim();

      if (replacements.has(currentText)) {
        node.nodeValue = node.nodeValue.replace(
          currentText,
          replacements.get(currentText)
        );
      }
    });

    if (content.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.href = `mailto:${content.email}`;

        if (link.textContent.includes("@")) {
          link.textContent = content.email;
        }
      });
    }

  } catch (error) {
    console.error("Could not load website content:", error);
  }
})();
