/* ========================================================================== */
const AYARLAR = {
    sifre: "08.02.06",
    mektupGorseli: "assets/mektup.png", 
    kolajGorseli: "assets/kolaj.png", 
    sarkiDosyasi: "assets/bizim_sarki.mp3.mp3",
    plakGorseli: "assets/plak.jpg", // image_8b5756.png'deki plak dosyası
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
/* ========================================================================== 
   GÜNCELLENMİŞ KUTU 2: HAVAİ FİŞEK VE BALON ANİMASYONU (FINAL VERSION)
   ========================================================================== */
let birthdayAnimID; // Animasyonu durdurabilmek için global ID

function kutu2Ac() {
    const body = document.getElementById("modal-body");
    const overlay = document.getElementById("modal-overlay");
    body.innerHTML = ""; 

    const canvas = document.createElement("canvas");
    canvas.id = "birthday-canvas";
    body.appendChild(canvas);
    overlay.classList.remove("hidden");

    // Animasyon motorunu başlat
    setTimeout(() => {
        runBirthdayEngine(canvas);
    }, 100);
}

function runBirthdayEngine(c) {
    let ctx = c.getContext("2d");
    let w = (c.width = c.offsetWidth);
    let h = (c.height = c.offsetHeight);
    let hw = w / 2;
    let hh = h / 2;
    
    let opts = {
        strings: ["İYİ Kİ", "DOĞDUN!", "ESMA ❤️"],
        charSize: 30,
        charSpacing: 35,
        lineHeight: 40,
        cx: w / 2,
        cy: h / 2,
        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 2,
        fireworkAddedLineWidth: 3,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 5,
        fireworkAddedShards: 5,
        fireworkShardPrevPoints: 3,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: 0.1,
        upFlow: -0.1,
        letterContemplatingWaitTime: 360,
        balloonSpawnTime: 20,
        balloonBaseInflateTime: 10,
        balloonAddedInflateTime: 10,
        balloonBaseSize: 20,
        balloonAddedSize: 20,
        balloonBaseVel: 0.4,
        balloonAddedVel: 0.4,
        balloonBaseRadian: -(Math.PI / 2 - 0.5),
        balloonAddedRadian: -1,
    };

    let calc = { totalWidth: opts.charSpacing * Math.max(opts.strings[0].length, opts.strings[1].length) };
    let Tau = Math.PI * 2, TauQuarter = Tau / 4, letters = [];

    ctx.font = opts.charSize + "px Verdana";

    function Letter(char, x, y) {
        this.char = char; this.x = x; this.y = y;
        this.dx = -ctx.measureText(char).width / 2;
        this.dy = +opts.charSize / 2;
        this.fireworkDy = this.y - hh;
        let hue = (x / calc.totalWidth) * 360;
        this.color = "hsl(hue,80%,50%)".replace("hue", hue);
        this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
        this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
        this.alphaColor = "hsla(hue,80%,50%,alp)".replace("hue", hue);
        this.reset();
    }

    Letter.prototype.reset = function () {
        this.phase = "firework"; this.tick = 0; this.spawned = false;
        this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
        this.reachTime = (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) | 0;
        this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [[0, hh, 0]];
    };

    Letter.prototype.step = function () {
        if (this.phase === "firework") {
            if (!this.spawned) {
                ++this.tick;
                if (this.tick >= this.spawningTime) { this.tick = 0; this.spawned = true; }
            } else {
                ++this.tick;
                let linearProportion = this.tick / this.reachTime,
                    armonicProportion = Math.sin(linearProportion * TauQuarter),
                    x = linearProportion * this.x, y = hh + armonicProportion * this.fireworkDy;
                if (this.prevPoints.length > opts.fireworkPrevPoints) this.prevPoints.shift();
                this.prevPoints.push([x, y, linearProportion * this.lineWidth]);
                let lineWidthProportion = 1 / (this.prevPoints.length - 1);
                for (let i = 1; i < this.prevPoints.length; ++i) {
                    let point = this.prevPoints[i], point2 = this.prevPoints[i - 1];
                    ctx.strokeStyle = this.alphaColor.replace("alp", i / this.prevPoints.length);
                    ctx.lineWidth = point[2] * lineWidthProportion * i;
                    ctx.beginPath(); ctx.moveTo(point[0], point[1]); ctx.lineTo(point2[0], point2[1]); ctx.stroke();
                }
                if (this.tick >= this.reachTime) {
                    this.phase = "contemplate";
                    this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                    this.circleCompleteTime = (opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random()) | 0;
                    this.circleCreating = true; this.circleFading = false;
                    this.circleFadeTime = (opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random()) | 0;
                    this.tick = 0; this.tick2 = 0; this.shards = [];
                    let shardCount = (opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random()) | 0,
                        angle = Tau / shardCount, cos = Math.cos(angle), sin = Math.sin(angle), sx = 1, sy = 0;
                    for (let i = 0; i < shardCount; ++i) {
                        let x1 = sx; sx = sx * cos - sy * sin; sy = sy * cos + x1 * sin;
                        this.shards.push(new Shard(this.x, this.y, sx, sy, this.alphaColor));
                    }
                }
            }
        } else if (this.phase === "contemplate") {
            ++this.tick;
            if (this.circleCreating) {
                ++this.tick2;
                let proportion = this.tick2 / this.circleCompleteTime, armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
                ctx.beginPath(); ctx.fillStyle = this.lightAlphaColor.replace("light", 50 + 50 * proportion).replace("alp", proportion);
                ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau); ctx.fill();
                if (this.tick2 > this.circleCompleteTime) { this.tick2 = 0; this.circleCreating = false; this.circleFading = true; }
            } else if (this.circleFading) {
                ctx.fillStyle = this.lightColor.replace("light", 70); ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                ++this.tick2;
                let proportion = this.tick2 / this.circleFadeTime, armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
                ctx.beginPath(); ctx.fillStyle = this.lightAlphaColor.replace("light", 100).replace("alp", 1 - armonic);
                ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau); ctx.fill();
                if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
            } else {
                ctx.fillStyle = this.lightColor.replace("light", 70); ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
            }
            for (let i = 0; i < this.shards.length; ++i) {
                this.shards[i].step(ctx, opts, hh);
                if (!this.shards[i].alive) { this.shards.splice(i, 1); --i; }
            }
            if (this.tick > opts.letterContemplatingWaitTime) {
                this.phase = "balloon"; this.tick = 0; this.spawning = true;
                this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0; this.inflating = false;
                this.inflateTime = (opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random()) | 0;
                this.size = (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;
                let rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                    vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
                this.vx = Math.cos(rad) * vel; this.vy = Math.sin(rad) * vel;
            }
        } else if (this.phase === "balloon") {
            ctx.strokeStyle = this.lightColor.replace("light", 80);
            if (this.spawning) {
                ++this.tick; ctx.fillStyle = this.lightColor.replace("light", 70); ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                if (this.tick >= this.spawnTime) { this.tick = 0; this.spawning = false; this.inflating = true; }
            } else if (this.inflating) {
                ++this.tick; let proportion = this.tick / this.inflateTime, x = (this.cx = this.x), y = (this.cy = this.y - this.size * proportion);
                ctx.fillStyle = this.alphaColor.replace("alp", proportion); ctx.beginPath();
                generateBalloonPath(ctx, x, y, this.size * proportion); ctx.fill();
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, this.y); ctx.stroke();
                ctx.fillStyle = this.lightColor.replace("light", 70); ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                if (this.tick >= this.inflateTime) { this.tick = 0; this.inflating = false; }
            } else {
                this.cx += this.vx; this.cy += this.vy += opts.upFlow;
                ctx.fillStyle = this.color; ctx.beginPath(); generateBalloonPath(ctx, this.cx, this.cy, this.size); ctx.fill();
                ctx.beginPath(); ctx.moveTo(this.cx, this.cy); ctx.lineTo(this.cx, this.cy + this.size); ctx.stroke();
                ctx.fillStyle = this.lightColor.replace("light", 70); ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);
                if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw) this.phase = "done";
            }
        }
    };

    function Shard(x, y, vx, vy, color) {
        let vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
        this.vx = vx * vel; this.vy = vy * vel; this.x = x; this.y = y;
        this.prevPoints = [[x, y]]; this.color = color; this.alive = true;
        this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
    }
    Shard.prototype.step = function (ctx, opts, hh) {
        this.x += this.vx; this.y += this.vy += opts.gravity;
        if (this.prevPoints.length > opts.fireworkShardPrevPoints) this.prevPoints.shift();
        this.prevPoints.push([this.x, this.y]);
        let lineWidthProportion = this.size / this.prevPoints.length;
        for (let k = 0; k < this.prevPoints.length - 1; ++k) {
            let p1 = this.prevPoints[k], p2 = this.prevPoints[k + 1];
            ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
            ctx.lineWidth = k * lineWidthProportion;
            ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
        }
        if (this.prevPoints[0][1] > hh) this.alive = false;
    };

    function generateBalloonPath(ctx, x, y, size) {
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size / 4, y - size, x, y - size);
        ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
    }

    // Harfleri oluştur
    for (let i = 0; i < opts.strings.length; ++i) {
        for (let j = 0; j < opts.strings[i].length; ++j) {
            letters.push(new Letter(opts.strings[i][j], 
                j * opts.charSpacing + opts.charSpacing / 2 - (opts.strings[i].length * opts.charSpacing) / 2,
                i * opts.lineHeight + opts.lineHeight / 2 - (opts.strings.length * opts.lineHeight) / 2
            ));
        }
    }

    function anim() {
        if (document.getElementById("modal-overlay").classList.contains("hidden")) {
            cancelAnimationFrame(birthdayAnimID);
            return;
        }
        birthdayAnimID = requestAnimationFrame(anim);
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, w, h);
        ctx.translate(hw, hh);
        let allDone = true;
        for (let l = 0; l < letters.length; ++l) {
            letters[l].step();
            if (letters[l].phase !== "done") allDone = false;
        }
        ctx.translate(-hw, -hh);
        if (allDone) for (let l = 0; l < letters.length; ++l) letters[l].reset();
    }
    anim();
}

// Modal Kapatma fonksiyonuna ekleme yapalım (Animasyonu durdurmak için)
function modalKapat() {
    document.getElementById("modal-overlay").classList.add("hidden");
    if (birthdayAnimID) cancelAnimationFrame(birthdayAnimID);
}
function kutu3Ac() {
    modalAc("img", AYARLAR.kolajGorseli);
}
function kutu4Ac() { modalAc("img", AYARLAR.mektupGorseli); }
/* script.js - Kutu 5 Güncellemesi */
function kutu5Ac() {
    const plak = document.getElementById("plak-img");
    const ikon = document.getElementById("music-icon");

    // Eğer müzik çalar henüz oluşturulmadıysa oluştur
    if (!muzikCalar || muzikCalar.src === "") {
        muzikCalar = new Audio(AYARLAR.sarkiDosyasi);
    }

    if (muzikCalar.paused) {
        muzikCalar.play()
            .then(() => {
                muzikCaliyorMu = true;
                if (plak) {
                    plak.src = AYARLAR.plakGorseli;
                    plak.style.display = "block";
                    plak.classList.add("donen-plak");
                }
                if (ikon) ikon.innerHTML = "⏸️";
            })
            .catch(error => {
                console.error("Müzik çalma hatası:", error);
                alert("Müzik dosyasına ulaşılamıyor. Lütfen GitHub'daki 'assets' klasöründe 'bizim_sarki.mp3.mp3' dosyasının olduğundan emin olun.");
            });
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


