console.log('Hi from Grafana extension');

const SYSTEM_MAP = {
    M1: 'IFIYCLSDT033',
    M2: 'IFIYCLSDT002',
    M3: 'IFIYCLSDT007',
    M4: 'IFIYCLSDT036',
    M5: 'IFIYCLSDT030',
    M6: 'IFIYCLSDT005',
    M7: 'IFIYCLSDT029',
    M8: 'IFIYCLSDT016',
    M9: 'IFIYCLSDT0015',
    M10: 'IFIYCLSDT034',
    M11: 'IFIYCLSDT035',
    M12: 'IFIYCLSDT024',
    B1: 'IFIYCLSDT019',
    B2: 'IFIYCLSDT010',
    B3: 'IFIYCLSDT014',
    B4: 'IFIYCLSDT037',
    B5: 'IFIYCLSDT031',
    B6: 'IFIYCLSDT017',
    B7: 'IFIYCLSDT008',
    B8: 'IFIYCLSDT003',
    B9: 'IFIYCLSDT004',
    B10: 'IFIYCLSDT018',
    B11: 'IFIYCLSDT022',
    B12: 'IFIYCLSDT009',
    PCR10: 'IFIYCLSDT020',
    PCR11: 'IFIYCLSDT013',
    PCR12: 'IFIYCLSDT025',
    PCR13: 'IFIYCLSDT011',
    PCR14: 'IFIYCLSDT032',
};

function selectSystem(name) {
    const hostname = SYSTEM_MAP[name];
    const systemSelector = document.getElementsByClassName('css-10l6kcd')[0];
    if (!systemSelector) {
        console.log('System selector is not loaded yet');
        return;
    }

    const view = document.getElementsByClassName('view')[0];
    if (!view) {
        console.log('View is not loaded yet');
        return;
    }
    const viewScroll = view.scrollTop;
    systemSelector.click();
    view.scrollTop = viewScroll;

    const anchors = document.querySelectorAll('a.variable-option');
    const targetAnchor = Array.from(anchors).find((anchor) =>
        anchor.textContent.includes(hostname),
    );
    targetAnchor.click();

    shadowRoot.querySelectorAll('.badge').forEach((b) => {
        if (b.innerText === name) {
            b.classList.remove('badge-soft');
        } else {
            b.classList.add('badge-soft');
        }
    });
}

function getSelectedNames() {
    const names = [];
    const badges = shadowRoot.querySelectorAll('.badge');
    badges.forEach((b) => {
        if (b.querySelector('.checkbox').checked) {
            names.push(b.innerText);
        }
    });
    return names;
}

function getTime() {
    const time = parseInt(shadowRoot.querySelector('.time').value);
    return isNaN(time) ? 1 : Math.max(1, time);
}

function isRotateEnabled() {
    return shadowRoot.querySelector('.toggle').checked;
}

function rotate(index = 0) {
    const names = getSelectedNames();
    const len = names.length;
    const newIndex = len === 0 ? 0 : (index + 1) % len;
    setTimeout(() => rotate(newIndex), getTime() * 1000);

    if (names.length === 0 || !isRotateEnabled()) return;
    selectSystem(names[index]);
}

function createShadowRoot() {
    const shadowHost = document.createElement('div');
    document.body.appendChild(shadowHost);
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = chrome.runtime.getURL('output.css'); // Load your Tailwind CSS or custom styles
    shadowRoot.appendChild(style);
    return shadowRoot;
}

function renderControls() {
    const controls = document.createElement('div');
    controls.setAttribute('data-theme', 'dark');
    controls.className =
        'fixed top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-md z-50 w-[450px] bg-base-300 z-[9999]';
    let innerHtml = `
      <div class="systems">
        ${Object.keys(SYSTEM_MAP)
            .map(
                (k) =>
                    `<div class="badge badge-soft badge-primary m-1">
                      <input type="checkbox" class="checkbox checkbox-xs" />
                      <span class="name cursor-pointer">${k}</span>
                    </div>`,
            )
            .join('')}
      <div>
      <div class="my-3 mx-1">
          <input type="checkbox" checked="checked" class="toggle mr-3" />
          Auto rotate time
          <input type="number" min="1" placeholder="sec" class="time input w-16" value="5"/>
      </div>`;
    controls.innerHTML = innerHtml;

    controls.querySelectorAll('.name').forEach((elem) => {
        elem.onclick = badgeClick;
    });
    shadowRoot.appendChild(controls);
}

function badgeClick(e) {
    const name = e.currentTarget.innerText;
    selectSystem(name);
}

const shadowRoot = createShadowRoot();
renderControls();
rotate();
