document.addEventListener('DOMContentLoaded', () => {

    // ---------- Boot Sequence ----------
    setTimeout(() => {
        document.getElementById('boot-sequence').innerHTML = `
            <div class="lcd-text mb-2">> LOADING...</div>
            <div class="lcd-text mb-2">> TRACKS... 4</div>
            <div class="lcd-text blinking w-2 h-4 bg-tertiary mt-2"></div>
        `;
        setTimeout(() => {
            document.getElementById('boot-sequence').classList.add('opacity-0');
            setTimeout(() => {
                document.getElementById('boot-sequence').style.display = 'none';
                document.getElementById('main-ui').classList.remove('opacity-0');
            }, 500);
        }, 1500);
    }, 1500);

    // ---------- Track Navigation ----------
    // LINKS comes from config.js, which must load before this file.
    const tracks = [
        { title: 'ZEENA', isLink: false, url: null },
        { title: 'LINKEDIN', isLink: true, url: LINKS.linkedin },
        { title: 'GITHUB', isLink: true, url: LINKS.github },
        { title: 'TOVIO', isLink: true, url: LINKS.tovio }
    ];
    let currentTrack = 0;
    const tracklistEl = document.getElementById('tracklist');
    const titleEl = document.getElementById('current-track-title');
    const indexEl = document.getElementById('track-index');

    function updateUI() {
        Array.from(tracklistEl.children).forEach((el, idx) => {
            if (idx === currentTrack) {
                el.classList.add('text-tertiary', 'opacity-100');
                el.classList.remove('opacity-60');
            } else {
                el.classList.remove('text-tertiary', 'opacity-100');
                el.classList.add('opacity-60');
            }
        });
        titleEl.textContent = tracks[currentTrack].title;
        indexEl.textContent = `0${currentTrack + 1}`;
    }

    document.getElementById('btn-zap').addEventListener('click', () => {
        currentTrack = (currentTrack + 1) % tracks.length;
        updateUI();
    });
    document.getElementById('btn-back').addEventListener('click', () => {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        updateUI();
    });
    document.getElementById('btn-select').addEventListener('click', () => {
        if (tracks[currentTrack].isLink) {
            showRedirect(tracks[currentTrack].title, tracks[currentTrack].url);
        }
    });

    function showRedirect(target, url) {
        const mainUi = document.getElementById('main-ui');
        const screen = document.getElementById('redirect-screen');
        const targetEl = document.getElementById('redirect-target-inline');
        const typedEl = document.getElementById('redirect-typed');
        const countEl = document.getElementById('redirect-countdown');

        targetEl.textContent = target;
        typedEl.textContent = '';
        countEl.textContent = '';

        mainUi.classList.add('opacity-0');
        screen.classList.remove('opacity-0', 'pointer-events-none');

        const line = 'REDIRECTING YOU IN...';
        let ci = 0;
        const typeIv = setInterval(() => {
            typedEl.textContent = line.slice(0, ci + 1);
            ci++;
            if (ci >= line.length) {
                clearInterval(typeIv);
                startCountdown();
            }
        }, 30);

        function startCountdown() {
            let timeLeft = 3;
            countEl.textContent = timeLeft;
            const iv = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(iv);
                    countEl.textContent = '0';
                    if (url) window.location.href = url;
                } else {
                    countEl.textContent = timeLeft;
                }
            }, 800);
        }
    }

    // ---------- USB Cap ----------
    // Clicking the cap both pops it open visually AND triggers the CV
    // download in the same action (clicking again just closes it back up
    // without re-downloading).
    document.getElementById('usb-cap').addEventListener('click', function () {
        this.classList.toggle('cap-open');
        if (this.classList.contains('cap-open')) {
            document.getElementById('cv-download').click();
        }
    });

    // ---------- CV Download ----------
    // No JS here on purpose: the <a href="assets/cv.pdf" download> tag in
    // index.html handles this natively. See README for why it can look
    // "broken" when testing locally.

    // ---------- Volume Slider (functional, drives background gradient) ----------
    const track = document.getElementById('vol-track');
    const thumb = document.getElementById('vol-thumb');
    const trackWidth = 96;   // matches w-24
    const thumbWidth = 16;
    const maxOffset = trackWidth - thumbWidth;
    let volume = 20; // 0-100, initial position roughly matches original design

    const LIGHT = { r: 0xf5, g: 0xf4, b: 0xf3 };
    const DARK  = { r: 0x1c, g: 0x1b, b: 0x1b };
    function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
    function toHex(c) { return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join(''); }

    function applyVolume(pct) {
        volume = Math.max(0, Math.min(100, pct));
        const t = volume / 100;
        thumb.style.left = `${(t * maxOffset)}px`;

        // higher volume -> darker background; lower -> lighter
        const mid = {
            r: lerp(LIGHT.r, DARK.r, t),
            g: lerp(LIGHT.g, DARK.g, t),
            b: lerp(LIGHT.b, DARK.b, t)
        };
        const outer = {
            r: lerp(LIGHT.r - 10, DARK.r - 6, t),
            g: lerp(LIGHT.g - 10, DARK.g - 6, t),
            b: lerp(LIGHT.b - 10, DARK.b - 6, t)
        };
        document.documentElement.style.setProperty('--bg-light', toHex(mid));
        document.documentElement.style.setProperty('--bg-dark', toHex(outer));

        track.setAttribute('aria-valuenow', Math.round(volume));
    }

    function pctFromClientX(clientX) {
        const rect = track.getBoundingClientRect();
        const x = clientX - rect.left - thumbWidth / 2;
        return (x / maxOffset) * 100;
    }

    let dragging = false;
    track.addEventListener('pointerdown', (e) => {
        dragging = true;
        track.setPointerCapture(e.pointerId);
        applyVolume(pctFromClientX(e.clientX));
    });
    track.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        applyVolume(pctFromClientX(e.clientX));
    });
    track.addEventListener('pointerup', () => { dragging = false; });
    track.addEventListener('pointercancel', () => { dragging = false; });

    // keyboard accessibility
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') applyVolume(volume + 5);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') applyVolume(volume - 5);
    });

    applyVolume(volume); // set initial state
});
