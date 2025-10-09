const fetchBtn = document.getElementById("fetchBtn");
const homeBtn = document.getElementById("homeBtn");
const ctx = document.getElementById("emgChart").getContext("2d");
const summaryBox = document.getElementById("ai-summary");
const scrollSection = document.querySelector(".scroll-section");

let chart;

// Show "Retrieve" button only after scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight * 0.5) {
    scrollSection.classList.add("visible");
    homeBtn.classList.add("show");
  }
});

// Fetch ThingSpeak Data
async function fetchEMG() {
  const url = "https://api.thingspeak.com/channels/3073213/fields/1.json?api_key=0JGYR24A33IT0QCB&results=20";
  try {
    const res = await fetch(url);
    const data = await res.json();

    const values = data.feeds.map(f => parseInt(f.field1));
    const times = data.feeds.map(f => new Date(f.created_at).toLocaleTimeString());

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: times,
        datasets: [{
          label: "EMG Signal",
          data: values,
          borderColor: "#bb86fc",
          backgroundColor: "rgba(187,134,252,0.2)",
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#fff" } }
        },
        scales: {
          x: { ticks: { color: "#fff" } },
          y: { ticks: { color: "#fff" } }
        }
      }
    });

    summarizeData(values);

  } catch (err) {
    summaryBox.innerHTML = "<p><b>Error:</b> Unable to fetch data.</p>";
    summaryBox.classList.add("show");
  }
}

// AI-like Stylish Summary (more informative)
function summarizeData(values) {
  if (!values.length) return;

  const avg = values.reduce((a,b) => a+b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  let activityLevel =
    avg > 50 ? "⚡ Strong muscle contractions" :
    avg > 20 ? "🔹 Moderate engagement" :
    "🌙 Muscles mostly relaxed";

  let summary = `
    <h3>NeuroFlex EMG Analysis</h3>
    <p><strong>Average Value:</strong> ${avg.toFixed(2)} µV</p>
    <p><strong>Peak Activity:</strong> ${max} µV</p>
    <p><strong>Lowest Reading:</strong> ${min} µV</p>
    <p><strong>Activity Level:</strong> ${activityLevel}</p>
    <p style="margin-top:15px; color:#aaa;">
      💡 This summary translates raw EMG signals into human-readable insights,
      showing how active or relaxed your muscles are during the session.
    </p>
  `;

  summaryBox.innerHTML = summary;
  summaryBox.classList.add("show");
}

// Home Button Scroll
homeBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Fetch Data Button
fetchBtn.addEventListener("click", fetchEMG);

// Particle Effect
const canvas = document.getElementById("particles");
const ctx2 = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx2.fillStyle = "rgba(187,134,252,0.8)";
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx2.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 100; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
