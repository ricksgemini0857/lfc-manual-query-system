
(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main-container");
    const gallery = document.getElementById("gallery-grid");
    const result = document.getElementById("result");
    const demoButton = document.getElementById("demo-btn");
    const logo = document.querySelector(".brand img").getAttribute("src");

    document.addEventListener("click", event => {
      const button = event.target.closest("button[data-scene]");
      if (!button) return;
      document.body.dataset.scene = button.dataset.scene;
      document.querySelectorAll("button[data-scene]").forEach(item => {
        item.setAttribute("aria-pressed", String(item.dataset.scene === button.dataset.scene));
      });
    });

    const dialog = document.createElement("dialog");
    dialog.className = "art-dialog";
    dialog.setAttribute("aria-labelledby", "art-dialog-title");
    dialog.innerHTML = '<div class="dialog-toolbar"><h2 id="art-dialog-title">作品展示</h2><button type="button" class="dialog-close" aria-label="關閉作品展示">×</button></div><div class="dialog-stage"><img alt="積木畫完整效果展示"></div><div class="dialog-footer"><span role="status">完整比例展示</span><a target="_blank" rel="noopener noreferrer">開啟原圖 ↗</a></div>';
    document.body.appendChild(dialog);
    const dialogImage = dialog.querySelector("img");
    const dialogStatus = dialog.querySelector('[role="status"]');
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialogImage.addEventListener("error", () => {
      dialogStatus.textContent = "圖片暫時無法顯示，可由右側連結開啟原圖。";
    });

    if (gallery) {
      gallery.addEventListener("click", event => {
        const anchor = event.target.closest(".gallery-card a");
        if (!anchor || !gallery.contains(anchor) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const image = anchor.querySelector("img");
        if (!image) return;
        event.preventDefault();
        const card = anchor.closest(".gallery-card");
        dialog.querySelector("h2").textContent = card.dataset.remark || "積木畫效果展示";
        dialogStatus.textContent = "完整比例展示";
        dialogImage.src = image.currentSrc || image.src;
        dialog.querySelector("a").href = anchor.href;
        dialog.showModal();
      });
      document.getElementById("back-btn").addEventListener("click", () => {
        document.getElementById("gallery-demo-notice").textContent = "";
        demoButton.focus();
      });
    }

    function addGalleryDemo() {
      main.classList.remove("max-w-md");
      main.classList.add("max-w-5xl");
      document.getElementById("login-view").classList.add("hidden");
      document.getElementById("gallery-view").classList.remove("hidden");
      document.getElementById("gallery-title").textContent = "作品展示空間";
      document.getElementById("gallery-demo-notice").textContent = "展示示意｜以下為原創視覺示意與 LFC 品牌圖，非客戶作品。可切換背景、點擊作品放大。";
      gallery.replaceChildren();
      [["studio-art.svg", "山湖晨光 · 原創視覺示意"], [logo, "LFC 品牌圖 · 裱框展示示意"]].forEach(([url, caption]) => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        card.dataset.remark = caption;
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.setAttribute("aria-label", "放大：" + caption);
        const image = document.createElement("img");
        image.src = url;
        image.alt = caption;
        anchor.appendChild(image);
        const remark = document.createElement("div");
        remark.className = "p-3";
        remark.textContent = caption;
        card.append(anchor, remark);
        gallery.appendChild(card);
      });
    }

    function guideDocument(frameGuide) {
      const art = new URL("studio-art.svg", location.href).href;
      return '<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{background:#d8d9d4;margin:0;padding:28px;font-family:Arial,"Microsoft JhengHei",sans-serif;color:#26343c}.sheet{max-width:580px;min-height:720px;padding:38px;margin:0 auto;background:#fffef9;box-shadow:0 10px 30px #34413f22}.top{font-size:9px;letter-spacing:2px;display:flex;justify-content:space-between;border-bottom:1px solid #c9cec7;padding-bottom:15px}.over{font-size:9px;color:#a28353;letter-spacing:2px;margin-top:30px}h1{font-size:28px;margin:13px 0}p{font-size:12px;line-height:1.9;color:#6d797b}.art{display:block;width:100%;height:220px;object-fit:contain;background:#edf0e9;margin:26px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cell{border:1px solid #d9dfd7;padding:18px 12px;font-size:11px;text-align:center}.cell b{display:block;color:#9a7b4e;font-size:20px;margin-bottom:9px}.note{font-size:10px;color:#8a9390;border-top:1px solid #d4d9d2;padding-top:20px;margin-top:32px}@media(max-width:480px){body{padding:15px}.sheet{padding:24px;min-height:600px}h1{font-size:23px}.art{height:170px}.cell{padding:15px 5px}}</style></head><body><article class="sheet"><div class="top"><b>LFC / MOSAIC STUDIO</b><span>DISPLAY SAMPLE</span></div><div class="over">' + (frameGuide ? 'FRAME ASSEMBLY' : 'YOUR MOSAIC, STEP BY STEP') + '</div><h1>' + (frameGuide ? '邊框組裝 · 展示示意' : '把喜歡的畫面，一顆顆拼出來。') + '</h1><p>這是文件展示版型示意，並非實際訂單說明書。</p><img class="art" src="' + art + '" alt="原創山湖晨光視覺示意"><div class="grid"><div class="cell"><b>01</b>準備與分類</div><div class="cell"><b>02</b>對照專屬圖紙</div><div class="cell"><b>03</b>完成你的作品</div></div><p class="note">實際圖紙、零件與組裝步驟，請以下單後提供的說明書為準。此頁僅呈現文件外框、展示背景與版面效果。</p></article></body></html>';
    }

    function resetManualDemo() {
      main.classList.remove("max-w-4xl");
      main.classList.add("max-w-md");
      document.getElementById("login-form").style.display = "";
      document.getElementById("title-section").style.display = "";
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      result.replaceChildren();
      demoButton.focus();
    }

    function addManualDemo() {
      main.classList.remove("max-w-md");
      main.classList.add("max-w-4xl");
      document.getElementById("login-form").style.display = "none";
      document.getElementById("title-section").style.display = "none";
      result.innerHTML = '<p class="demo-notice">展示示意｜以下文件為版型示意，非實際客戶說明書。真實文件仍透過姓名與手機查詢。</p><div class="flex mb-4" role="tablist" aria-label="說明書展示示意"><button id="demo-tab-button-1" class="tab-button active" type="button" role="tab" aria-selected="true" aria-controls="demo-tab-1" data-demo-tab="demo-tab-1">積木畫說明書</button><button id="demo-tab-button-2" class="tab-button" type="button" role="tab" aria-selected="false" aria-controls="demo-tab-2" data-demo-tab="demo-tab-2">邊框組裝說明書</button><button id="demo-tab-button-3" class="tab-button" type="button" role="tab" aria-selected="false" aria-controls="demo-tab-3" data-demo-tab="demo-tab-3">教學影片</button></div><div id="demo-tab-1" class="tab-content active" role="tabpanel" aria-labelledby="demo-tab-button-1"></div><div id="demo-tab-2" class="tab-content" role="tabpanel" aria-labelledby="demo-tab-button-2"></div><div id="demo-tab-3" class="tab-content" role="tabpanel" aria-labelledby="demo-tab-button-3"><div class="demo-video"><div><span class="play-mark" aria-hidden="true">▶</span><p>讓每一步，都有跡可循。</p><small>此區示範影片展示背景，可另開原有教學影片。</small><a href="https://drive.google.com/file/d/1v4AbpqD2z0hKKrJt3ePJyO5EMgdHh4Dm/view?usp=sharing" target="_blank" rel="noopener noreferrer">開啟教學影片 ↗</a></div></div></div><div class="mt-8 text-center"><button id="demo-return" type="button" class="secondary-button">返回查詢</button></div>';
      for (let index = 1; index <= 2; index++) {
        const frame = document.createElement("iframe");
        frame.className = "preview-iframe";
        frame.title = index === 1 ? "積木畫文件展示版型示意" : "邊框說明書展示版型示意";
        frame.setAttribute("sandbox", "");
        frame.srcdoc = guideDocument(index === 2);
        document.getElementById("demo-tab-" + index).appendChild(frame);
      }
      result.querySelectorAll("[data-demo-tab]").forEach(button => {
        button.addEventListener("click", () => {
          result.querySelectorAll("[data-demo-tab]").forEach(item => {
            item.classList.toggle("active", item === button);
            item.setAttribute("aria-selected", String(item === button));
          });
          result.querySelectorAll(".tab-content").forEach(panel => panel.classList.toggle("active", panel.id === button.dataset.demoTab));
        });
      });
      document.getElementById("demo-return").addEventListener("click", resetManualDemo);
    }

    demoButton.addEventListener("click", gallery ? addGalleryDemo : addManualDemo);
    if (new URLSearchParams(location.search).get("demo") === "1") demoButton.click();
  });
})();

