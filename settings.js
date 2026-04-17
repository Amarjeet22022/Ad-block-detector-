(function() {
    // Prevent the menu from being injected multiple times if clicked twice
    if (document.getElementById('custom-tools-gear')) return;

    // --- 1. Create the Gear Button ---
    const gearBtn = document.createElement('div');
    gearBtn.id = 'custom-tools-gear';
    gearBtn.innerHTML = '⚙️';
    gearBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;font-size:28px;cursor:pointer;background:rgba(40,40,40,0.85);border-radius:50%;padding:10px;box-shadow:0 4px 8px rgba(0,0,0,0.5);border:1px solid #555;display:flex;justify-content:center;align-items:center;width:30px;height:30px;';

    // --- 2. Create the Menu Container (85% Opacity) ---
    const menu = document.createElement('div');
    menu.id = 'custom-tools-menu';
    // The background uses rgba for 85% opacity (0.85)
    menu.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:999999;background:rgba(20,20,20,0.85);padding:15px;border-radius:12px;display:none;flex-direction:column;gap:10px;box-shadow:0 4px 10px rgba(0,0,0,0.5);border:1px solid #555;backdrop-filter:blur(4px);font-family:sans-serif;';

    // --- 3. Toggle Menu Open/Close ---
    gearBtn.onclick = () => {
        menu.style.display = (menu.style.display === 'none') ? 'flex' : 'none';
    };

    // --- 4. Button Generator Helper ---
    function createBtn(text, onClickFunc) {
        const b = document.createElement('button');
        b.innerHTML = text;
        b.style.cssText = 'padding:12px 15px;background:#333;color:#fff;border:1px solid #666;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px;width:100%;text-align:left;';
        b.onclick = () => {
            onClickFunc();
            menu.style.display = 'none'; // Auto-close menu after clicking a tool
        };
        return b;
    }

    // --- 5. Add Your Tools ---

    // Tool 1: Zoom Unlock
    menu.appendChild(createBtn('🔍 Unlock Zoom', function() {
        var v = document.querySelector('meta[name=viewport]');
        if (v) { v.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=10,user-scalable=yes'); }
        alert('Zoom Unlocked!');
    }));

    // Tool 2: Full Screen Video
    menu.appendChild(createBtn('🔲 Toggle Fullscreen', function() {
        let v = document.querySelector('video');
        if (!v) return;
        if (v.dataset.fs === '1') {
            v.style.position = v.dataset.p; v.style.top = v.dataset.t; v.style.left = v.dataset.l; v.style.width = v.dataset.w; v.style.height = v.dataset.h; v.style.zIndex = v.dataset.z; v.style.objectFit = v.dataset.f; v.controls = (v.dataset.c === 'true'); v.dataset.fs = '0';
            if (document.fullscreenElement) document.exitFullscreen();
        } else {
            v.dataset.p = v.style.position || ''; v.dataset.t = v.style.top || ''; v.dataset.l = v.style.left || ''; v.dataset.w = v.style.width || ''; v.dataset.h = v.style.height || ''; v.dataset.z = v.style.zIndex || ''; v.dataset.f = v.style.objectFit || ''; v.dataset.c = v.controls;
            v.style.position = 'fixed'; v.style.top = '0'; v.style.left = '0'; v.style.width = '100vw'; v.style.height = '100vh'; v.style.zIndex = '9999999'; v.style.objectFit = 'cover'; v.controls = true; v.dataset.fs = '1';
            try { if (v.requestFullscreen) v.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); } catch (e) {}
        }
    }));

    // Tool 3: Video Speed
    menu.appendChild(createBtn('⏩ Cycle Speed', function() {
        let v = document.querySelector('video');
        if (v) {
            let s = (v.playbackRate >= 2.5) ? 0.5 : v.playbackRate + 0.25;
            v.playbackRate = s;
            let d = document.createElement('div');
            d.style.cssText = 'position:fixed;top:20%;left:50%;transform:translate(-50%,-50%);z-index:9999999;background:rgba(0,0,0,0.8);color:#fff;padding:15px;border-radius:10px;font-family:sans-serif;font-weight:bold;';
            d.innerHTML = 'Speed: ' + s + 'x';
            document.body.appendChild(d);
            setTimeout(() => d.remove(), 1000);
        } else {
            alert('No video found');
        }
    }));

    // Tool 4: Background Playback
    menu.appendChild(createBtn('🎵 Force Background Play', function() {
        let v = document.querySelector('video');
        if (!v) return;
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', e => e.stopImmediatePropagation(), true);
        v.addEventListener('pause', (e) => {
            if (document.hidden || document.visibilityState === 'hidden') {
                e.stopImmediatePropagation();
                v.play();
            }
        }, true);
        
        // Brief visual confirmation
        let d = document.createElement('div');
        d.style.cssText = 'position:fixed;bottom:10%;left:50%;transform:translate(-50%,0);z-index:9999999;background:rgba(0,200,0,0.9);color:#fff;padding:10px 20px;border-radius:20px;font-family:sans-serif;font-weight:bold;font-size:14px;';
        d.innerHTML = 'Background Play Ready';
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 1500);
    }));

    // --- 6. Append to the page ---
    document.body.appendChild(menu);
    document.body.appendChild(gearBtn);
})();
