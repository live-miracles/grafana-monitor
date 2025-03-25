console.log('Hi from Grafana extension');

const SYSTEM_MAP = {
    m1: 'IFIYCLSDT033',
    m2: 'IFIYCLSDT002',
    m3: 'IFIYCLSDT007',
    m4: 'IFIYCLSDT036',
    m5: 'IFIYCLSDT030',
    m6: 'IFIYCLSDT005',
    m7: 'IFIYCLSDT029',
    m8: 'IFIYCLSDT016',
    m9: 'IFIYCLSDT0015',
    m10: 'IFIYCLSDT034',
    m11: 'IFIYCLSDT035',
    m12: 'IFIYCLSDT024',
    b1: 'IFIYCLSDT019',
    b2: 'IFIYCLSDT010',
    b3: 'IFIYCLSDT014',
    b4: 'IFIYCLSDT037',
    b5: 'IFIYCLSDT031',
    b6: 'IFIYCLSDT017',
    b7: 'IFIYCLSDT008',
    b8: 'IFIYCLSDT003',
    b9: 'IFIYCLSDT004',
    b10: 'IFIYCLSDT018',
    b11: 'IFIYCLSDT022',
    b12: 'IFIYCLSDT009',
};

function selectSystem(name) {
    const hostname = SYSTEM_MAP[name];
    const systemSelector = document.getElementsByClassName('css-10l6kcd')[0];
    if (!systemSelector) {
        console.log('System selector is not loaded yet');
        return;
    }
    systemSelector.click();

    const anchors = document.querySelectorAll('a.variable-option');
    const targetAnchor = Array.from(anchors).find((anchor) =>
        anchor.textContent.includes(hostname),
    );
    targetAnchor.click();

    shadowRoot.querySelectorAll('.badge').forEach((b) => {
        if (b.innerText.toLowerCase() === name) {
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
            names.push(b.innerText.toLowerCase());
        }
    });
    return names;
}

function getTime() {
    const time = parseInt(shadowRoot.querySelector('.time').value);
    return isNaN(time) ? 1 : Math.max(1, time);
}

function rotate(index = 0) {
    const names = getSelectedNames();
    const len = names.length;
    const newIndex = len === 0 ? 0 : (index + 1) % len;
    setTimeout(() => rotate(newIndex), getTime() * 1000);

    if (names.length === 0) return;
    const view = document.getElementsByClassName('view')[0];
    if (!view) {
        console.log('View is not loaded yet');
        return;
    }
    const viewScroll = view.scrollTop;
    selectSystem(names[index]);
    view.scrollTop = viewScroll;
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
              <span class="name cursor-pointer uppercase">${k}</span>
            </div>`,
            )
            .join('')}
      <div>
      <div class="my-3 mx-1">
          <input type="checkbox" checked="checked" class="toggle mr-3" />
          Auto rotate time
          <input type="text" placeholder="sec" class="time input input-xs w-14" value="5"/>
      </div>`;
    controls.innerHTML = innerHtml;

    controls.querySelectorAll('.name').forEach((elem) => {
        elem.onclick = badgeClick;
    });
    shadowRoot.appendChild(controls);
}

function badgeClick(e) {
    const name = e.currentTarget.innerText.toLowerCase();
    selectSystem(name);
}

const shadowRoot = createShadowRoot();
renderControls();
rotate();
