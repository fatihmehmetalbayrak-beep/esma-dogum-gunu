/* ========================================================================== */
const AYARLAR = {
    sifre: "08.02.06",
    // Not: Bu linkler 'Direct Link' olmalıdır. i.ibb.co gibi...
    mektupGorseli: "https://i.ibb.co/yF0SDmHC/mektup.png", 
    kolajGorseli: "https://i.ibb.co/TB58nFYk/kolaj.png", 
    // Google Drive Doğrudan Oynatma Linki:
    sarkiDosyasi: "https://drive.google.com/uc?export=download&id=1B7_ETxQ7zEkGol6YeLyMpBepI6bNThPz",
    plakGorseli: "https://i.ibb.co/YFPJRQ2d/plak.jpg",
    
    // Eksik olan mesaj listesini geri ekledim:
    gelecekMesajlari: [
        "Seninle dünyayı gezmek istiyorum. 🌍",
        "Bu yıl senin yılın olacak. ✨",
        "Seni her şeyden çok seviyorum. ❤️",
        "Hayatımın en güzel iyikisisin. 🍀"
    ]
};
/* ========================================================================== */
let muzikCalar = new Audio(AYARLAR.sarkiDosyasi);
let muzikCaliyorMu = false;
let cicekAnimasyonID = null;
/* ========================================================================== */
function sifreyiKontrolEt() {
    const girilen = document.getElementById("password-input").value;
    const hataKutusu = document.getElementById("error-message");
    if (girilen === AYARLAR.sifre) {
        document.getElementById("login-screen").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("login-screen").style.display = "none";
            const mainContent = document.getElementById("main-content");
            mainContent.classList.remove("hidden");
            mainContent.style.opacity = 0;
            setTimeout(() => { mainContent.style.opacity = 1; }, 100);
        }, 500);
    } else {
        hataKutusu.style.display = "block";
        hataKutusu.style.animation = "shake 0.5s";
        setTimeout(() => { hataKutusu.style.display = "none"; }, 3000);
    }
}
/* ========================================================================== */
function kutu1Ac() {
    if (typeof confetti === "function") {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#DD2D4A', '#ffffff', '#FFD700']
        });
    } else { console.warn("Confetti kütüphanesi yüklenmemiş."); }
}
function kutu2Ac() {
    const img = document.getElementById("tree-anim");
    if (img) {
        const src = "assets/ask_agaci.gif";
        img.src = "";
        img.src = src;
        img.style.display = "block";
    }
}
function kutu3Ac() {
    modalAc("img", AYARLAR.kolajGorseli);
}
function kutu4Ac() { modalAc("img", AYARLAR.mektupGorseli); }
function kutu5Ac() {
    const plak = document.getElementById("plak-img");
    const ikon = document.getElementById("music-icon");
    
    if (!muzikCaliyorMu) {
        // Müzik çalmaya başlarken plak görselini senin linkinden çekelim
        if (plak) {
            plak.src = AYARLAR.plakGorseli;
            plak.style.display = "block";
            plak.classList.add("donen-plak");
        }
        muzikCalar.play().catch(e => alert("Müzik linki hatalı veya tarayıcı engelliyor!"));
        muzikCaliyorMu = true;
        if (ikon) ikon.innerHTML = "⏸️";
    } else {
        muzikCalar.pause();
        muzikCaliyorMu = false;
        if (plak) plak.classList.remove("donen-plak");
        if (ikon) ikon.innerHTML = "🎶";
    }
}
function kutu6Ac() {
    const rastgeleIndex = Math.floor(Math.random() * AYARLAR.gelecekMesajlari.length);
    const secilenMesaj = AYARLAR.gelecekMesajlari[rastgeleIndex];
    modalAc("text", "💌 Gelecekten Mesajın Var:\n\n" + secilenMesaj);
}
function kutu7Ac() {
    const body = document.getElementById("modal-body");
    const overlay = document.getElementById("modal-overlay");
    body.innerHTML = "";
    const container = document.createElement("div");
    container.id = "flower-canvas-container";
    const canvas = document.createElement("canvas");
    canvas.id = "flower-canvas";
    const info = document.createElement("div");
    info.className = "flower-info";
    info.id = "flower-info-text";
    info.innerText = "Bahçeni büyütmek için dokun (0 Çiçek)";
    container.appendChild(canvas);
    container.appendChild(info);
    body.appendChild(container);
    overlay.classList.remove("hidden");
    setTimeout(() => { cicekBahcesiniBaslat(canvas, info); }, 100);
}
/* ========================================================================== */
function modalAc(type, icerik) {
    const body = document.getElementById("modal-body");
    const overlay = document.getElementById("modal-overlay");
    body.innerHTML = "";
    if (type === "img") {
        const resim = document.createElement("img");
        resim.src = icerik;
        body.appendChild(resim);
    } else {
        const yazi = document.createElement("p");
        yazi.innerText = icerik;
        body.appendChild(yazi);
    }
    overlay.classList.remove("hidden");
}
function modalKapat() {
    document.getElementById("modal-overlay").classList.add("hidden");
    if (cicekAnimasyonID) {
        cancelAnimationFrame(cicekAnimasyonID);
        cicekAnimasyonID = null;
    }
}
/* ========================================================================== */
function cicekBahcesiniBaslat(canvas, infoText) {
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    const flowers = [];
    let clickCount = 0;
    class Flower {
        constructor(x, y, isSpecial) {
            this.x = x; this.y = y;
            this.rootX = x + (Math.random() - 0.5) * 60;
            this.rootY = canvas.height;
            this.progress = 0;
            this.speed = 0.01 + Math.random() * 0.006;
            this.isSpecial = isSpecial;
            this.sway = Math.random() * Math.PI * 2;
            this.swaySpeed = 0.01 + Math.random() * 0.01;
            this.leafSway = Math.random() * Math.PI * 2;
            this.leafSpeed = 0.015 + Math.random() * 0.01;
            this.cp1 = { x: this.rootX + (Math.random() - 0.5) * 50, y: this.rootY - (this.rootY - y) * 0.3 };
            this.cp2 = { x: this.rootX + (Math.random() - 0.5) * 50, y: this.rootY - (this.rootY - y) * 0.7 };
        }
        update() { this.progress = Math.min(1, this.progress + this.speed); this.sway += this.swaySpeed; this.leafSway += this.leafSpeed; }
        getStemPoint(t, windX = 0) {
            const x = Math.pow(1 - t, 3) * this.rootX +
                3 * Math.pow(1 - t, 2) * t * (this.cp1.x + windX * 0.3) +
                3 * (1 - t) * t * t * (this.cp2.x + windX * 0.6) +
                t * t * t * (this.x + windX);
            const y = Math.pow(1 - t, 3) * this.rootY +
                3 * Math.pow(1 - t, 2) * t * this.cp1.y +
                3 * (1 - t) * t * t * this.cp2.y +
                t * t * t * this.y;
            return { x, y };
        }
        drawStem(windX) {
            const tip = this.getStemPoint(this.progress, windX);
            ctx.beginPath();
            ctx.moveTo(this.rootX, this.rootY);
            ctx.bezierCurveTo(this.cp1.x + windX * 0.3, this.cp1.y, this.cp2.x + windX * 0.6, this.cp2.y, tip.x, tip.y);
            ctx.strokeStyle = "#5D7C48"; ctx.lineWidth = 4 * (1 - this.progress * 0.3); ctx.lineCap = "round"; ctx.stroke();
            return tip;
        }
        drawLeaf(t, side, windX) {
            const p = this.getStemPoint(t, windX);
            const sway = Math.sin(this.leafSway + t * 4) * 0.5;
            const length = 70 * this.progress;
            const width = length * 0.4;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(side * 0.5 + sway);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(side * width, length * 0.3, side * width * 0.6, length * 0.9, 0, length);
            ctx.bezierCurveTo(-side * width * 0.6, length * 0.9, -side * width, length * 0.3, 0, 0);
            const grad = ctx.createLinearGradient(0, 0, 0, length);
            grad.addColorStop(0, "#4f6f3a"); grad.addColorStop(1, "#8fbf73");
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }
        drawTulip(x, y, scale, rotation) {
            ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.scale(scale, scale);
            const size = 35;
            const palettes = [{ start: '#C0392B', end: '#FF9A9E' }, { start: '#8E44AD', end: '#D2B4DE' }, { start: '#D35400', end: '#F5CBA7' }];
            const palette = palettes[Math.floor(Math.random() * palettes.length)];
            const drawPetal = (px, py, w, h, color1, color2, angle) => {
                ctx.save(); ctx.translate(px, py); ctx.rotate(angle); ctx.beginPath();
                ctx.moveTo(0, 0); ctx.bezierCurveTo(-w, -h * 0.3, -w * 0.8, -h, 0, -h);
                ctx.bezierCurveTo(w * 0.8, -h, w, -h * 0.3, 0, 0);
                const grad = ctx.createRadialGradient(0, -h / 2, 0, 0, -h / 2, w);
                grad.addColorStop(0, color1); grad.addColorStop(1, color2);
                ctx.fillStyle = grad; ctx.fill(); ctx.restore();
            };
            drawPetal(0, 0, size * 0.5, size * 1.1, palette.start, '#fff', 0);
            drawPetal(-4, 2, size * 0.45, size, palette.end, '#fff', -0.2);
            drawPetal(4, 2, size * 0.45, size, palette.end, '#fff', 0.2);
            ctx.restore();
        }
        draw() {
            const windX = Math.sin(this.sway) * 15 * this.progress;
            const tip = this.drawStem(windX);
            if (this.progress > 0.4) this.drawLeaf(0.45, 1, windX);
            if (this.progress > 0.6) this.drawLeaf(0.65, -1, windX);
            if (this.progress > 0.7) {
                const scale = Math.min(1, (this.progress - 0.7) * 3);
                const angle = Math.sin(this.sway) * 0.1;
                this.drawTulip(tip.x, tip.y, scale, angle);
            }
        }
    }
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); flowers.forEach(f => { f.update(); f.draw(); }); cicekAnimasyonID = requestAnimationFrame(animate); }
    animate();
    canvas.addEventListener('pointerdown', function (e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        clickCount++;
        infoText.innerText = `Bahçeni büyütmek için dokun (${clickCount} Çiçek)`;
        const isSpecial = clickCount % 20 === 0;
        flowers.push(new Flower(x, y, isSpecial));
        if (flowers.length > 50) { flowers.shift(); }
    });
}
