let countdownInterval;

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function parseNaturalDate(text) {
  try {
    return luxon.DateTime.fromJSDate(new Date(text));
  } catch {
    return null;
  }
}

function startCountdown() {
  clearInterval(countdownInterval);
  const name = document.getElementById('eventName').value.trim();
  const inputText = document.getElementById('eventTimeText').value.trim();
  const theme = document.getElementById('themeSelect').value;

  if (!inputText) {
    alert('Please enter a valid time like "next Friday 5pm".');
    return;
  }

  const eventTime = parseNaturalDate(inputText);
  if (!eventTime || eventTime < luxon.DateTime.now()) {
    alert('Please enter a future time.');
    return;
  }

  document.body.className = theme;

  const milestones = [
    { label: '1 Week Left', time: eventTime.minus({ days: 7 }) },
    { label: '3 Days Left', time: eventTime.minus({ days: 3 }) },
    { label: '1 Hour Left', time: eventTime.minus({ hours: 1 }) }
  ];

  countdownInterval = setInterval(() => {
    const now = luxon.DateTime.now();
    const diff = eventTime.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();

    if (eventTime <= now) {
      document.getElementById('countdownDisplay').innerHTML = `<h2>${name || 'Event'} Started!</h2>`;
      confetti();
      clearInterval(countdownInterval);
      return;
    }

    document.getElementById('countdownDisplay').innerHTML = `
      <div class="card">${Math.floor(diff.days)}<div class="label">Days</div></div>
      <div class="card">${Math.floor(diff.hours)}<div class="label">Hours</div></div>
      <div class="card">${Math.floor(diff.minutes)}<div class="label">Minutes</div></div>
      <div class="card">${Math.floor(diff.seconds)}<div class="label">Seconds</div></div>
    `;

    const milestoneList = milestones
      .filter(m => m.time > now && m.time.diff(now, 'minutes').toObject().minutes < 1)
      .map(m => `<li>${m.label} 🎯</li>`)
      .join('');
    document.getElementById('milestoneList').innerHTML = milestoneList;
  }, 1000);
}

function generateEmbedCode() {
  const url = window.location.href;
  const embed = `<iframe src="${url}" width="100%" height="540" style="border:0;" sandbox="allow-scripts allow-same-origin"></iframe>`;
  document.getElementById('embedOutput').value = embed;
  document.getElementById('preview').src = url;
}

function sharePage(event) {
  const btn = event.target;
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = "Share This Countdown", 2000);
    })
    .catch(() => alert("Failed to copy URL."));
}

function generateQRCode() {
  const url = window.location.href;
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: url,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function downloadQRCode() {
  const qrCanvas = document.querySelector("#qrcode canvas");
  if (!qrCanvas) {
    alert("Please generate the QR code first.");
  }}