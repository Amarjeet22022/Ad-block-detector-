(function() {
    // Prevent multiple menus
    if (document.getElementById('custom-tools-gear')) return;

    // --- 1. Create the Gear ---
    const g = document.createElement('div');
    g.id = 'custom-tools-gear';
    g.innerHTML = '⚙️';
    g.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:2147483647;font-size:28px;cursor:pointer;background:rgba(30,30,30,0.8);border-radius:50%;padding:10px;box-shadow:0 4px 8px rgba(0,0,0,0.5);border:1px solid #555;display:flex;justify-content:center;align-items:center;width:30px;height:30px;transition:opacity 0.4s ease;opacity:0.8;touch-action:none;';

    // --- 2. Create the Centered Menu ---
    const m = document.createElement('div');
    m.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:rgba(20,20,20,0.85);padding:15px;border-radius:12px;display:none;flex-direction:column;gap:10px;box-shadow:0 4px 10px rgba(0,0,0,0.5);border:1px solid #555;backdrop-filter:blur(4px);font-family:sans-serif;width:250px;';

    // --- 3. Auto-Fade Logic ---
    let fadeTimer;
    const resetFade = () => {
        g.style.opacity = '0.8';
        clearTimeout(fadeTimer);
        if (m.style.display !== 'flex') {
            fadeTimer = setTimeout(() => g.style.opacity = '0.5', 5000);
        }
    };

    // --- 4. Drag & Drop Physics ---
    let isDragging = false, hasMoved = false, startX, startY, origX, origY;
    
    const dragStart = (x, y) => {
        isDragging = true; hasMoved = false; startX = x; startY = y;
        let rect = g.getBoundingClientRect();
        origX = rect.left; origY = rect.top;
        g.style.right = 'auto'; g.style.bottom = 'auto';
        g.style.left = origX + 'px'; g.style.top = origY + 'px';
        g.style.transition = 'none';
    };

    const dragMove = (x, y) => {
        if (!isDragging) return;
        let dx = x - startX; let dy = y - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
        g.style.left = (origX + dx) + 'px'; g.style.top = (origY + dy) + 'px';
    };

    const dragEnd = () => {
        isDragging = false;
        g.style.transition = 'opacity 0.4s ease';
    };

    // Touch Support
    g.addEventListener('touchstart', e => dragStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener('touchmove', e => dragMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener('touchend', dragEnd);

    // Mouse Support
    g.addEventListener('mousedown', e => { e.preventDefault(); dragStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove', e => dragMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', dragEnd);

    // --- 5. Open/Close Menu ---
    g.onclick = (e) => {
        if (hasMoved) { e.preventDefault(); return; } // Prevent opening if you were just dragging it
        if (m.style.display === 'none') {
            m.style.display = 'flex';
            g.style.opacity = '0.8';
            clearTimeout(fadeTimer);
        } else {
            m.style.display = 'none';
            resetFade();
        }
    };

    // --- 6. Tool Buttons ---
    const createBtn = (text, func) => {
        const b = document.createElement('button');
        b.innerHTML = text;
        b.style.cssText = 'padding:12px 15px;background:#333;color:#fff;border:1px solid #666;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px;width:100%;text-align:left;';
        b.onclick = () => { func(); m.style.display = 'none'; resetFade(); };
        return b;
    };

    m.appendChild(createBtn('🔍 Unlock Zoom', function() {
        var v = document.querySelector('meta[name=viewport]');
        if (v) v.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=10,user-scalable=yes');
    }));

    m.appendChild(createBtn('🔲 Toggle Fullscreen', function() {
        let v = document.querySelector('video');
        if (!v) return;
        if (v.dataset.fs === '1') {
            v.style.position = v.dataset.p; v.style.top = v.dataset.t; v.style.left = v.dataset.l; v.style.width = v.dataset.w; v.style.height = v.dataset.h; v.style.zIndex = v.dataset.z; v.style.objectFit = v.dataset.f; v.style.pointerEvents = v.dataset.pe; v.controls = (v.dataset.c === 'true'); v.dataset.fs = '0';
            if (document.fullscreenElement) document.exitFullscreen();
        } else {
            v.dataset.p = v.style.position || ''; v.dataset.t = v.style.top || ''; v.dataset.l = v.style.left || ''; v.dataset.w = v.style.width || ''; v.dataset.h = v.style.height || ''; v.dataset.z = v.style.zIndex || ''; v.dataset.f = v.style.objectFit || ''; v.dataset.pe = v.style.pointerEvents || ''; v.dataset.c = v.controls;
            v.style.setProperty('position', 'fixed', 'important'); v.style.setProperty('top', '0', 'important'); v.style.setProperty('left', '0', 'important'); v.style.setProperty('width', '100vw', 'important'); v.style.setProperty('height', '100vh', 'important'); v.style.setProperty('z-index', '2147483646', 'important'); v.style.setProperty('object-fit', 'cover', 'important'); v.style.setProperty('pointer-events', 'auto', 'important'); v.controls = true; v.dataset.fs = '1';
            try { if (v.requestFullscreen) v.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); } catch (e) {}
        }
    }));

    m.appendChild(createBtn('⏩ Cycle Speed', function() {
        let v = document.querySelector('video');
        if (v) {
            let s = (v.playbackRate >= 2.5) ? 0.5 : v.playbackRate + 0.25;
            v.playbackRate = s;
            let d = document.createElement('div');
            d.style.cssText = 'position:fixed;top:20%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:rgba(0,0,0,0.8);color:#fff;padding:15px;border-radius:10px;font-family:sans-serif;font-weight:bold;pointer-events:none;';
            d.innerHTML = 'Speed: ' + s + 'x';
            document.body.appendChild(d);
            setTimeout(() => d.remove(), 1000);
        }
    }));

    m.appendChild(createBtn('🎵 Background Play', function() {
        let v = document.querySelector('video');
        if (!v) return;
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', e => e.stopImmediatePropagation(), true);
        v.addEventListener('pause', (e) => {
            if (document.hidden || document.visibilityState === 'hidden') { e.stopImmediatePropagation(); v.play(); }
        }, true);
        let d = document.createElement('div');
        d.style.cssText = 'position:fixed;bottom:10%;left:50%;transform:translate(-50%,0);z-index:2147483647;background:rgba(0,200,0,0.9);color:#fff;padding:10px 20px;border-radius:20px;font-family:sans-serif;font-weight:bold;font-size:14px;pointer-events:none;';
        d.innerHTML = 'Ready';
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 1500);
    }));

    // --- 7. Mount ---
    document.body.appendChild(m);
    document.body.appendChild(g);
    resetFade();
})();
                                                                                                                                                                                                                                                                                                                                                        
