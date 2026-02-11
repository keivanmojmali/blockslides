---
title: Home
layout: page
sidebar: false
prev: false
next: false
---

<div style="height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0 24px;">

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; width: 100%; max-width: 1400px; height: 100%;">

<div>

<h1 style="font-size: 72px; font-weight: 700; line-height: 1.1; margin: 0 0 32px 0;">WYSIWYG slide deck editor toolkit</h1>

<p style="font-size: 28px; line-height: 1.6; margin: 0; color: var(--vp-c-text-1);">
The fastest way to add an <span class="hero-highlight">in-app presentation editor.</span> Compose slides with blocks and layouts, then render/export anywhere.<br/><span class="hero-highlight">Try the one component drop-in</span>
</p>

</div>

<div style="height: 100%; display: flex; align-items: center;">
<HeroSlideEditor />
</div>

</div>

</div>

<style scoped>
.hero-highlight {
  background: #cef79f;
  color: #222f30;
  padding: 2px 6px;
  border-radius: 2px;
}

.hero-button {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.hero-button-alt {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.hero-button-alt:hover {
  border-color: var(--vp-c-brand-1);
}

.hero-button-brand {
  background: #32363f;
  color: #cef79f;
  border: 2px solid #cef79f;
}

.hero-button-brand:hover {
  background: #3a3e47;
}

@media (max-width: 960px) {
  div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  
  h1 {
    font-size: 48px !important;
  }
  
  p {
    font-size: 20px !important;
  }
}
</style>



