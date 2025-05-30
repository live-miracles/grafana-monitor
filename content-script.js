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
    M9: 'IFIYCLSDT015',
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
            b.classList.add('badge-primary');
        } else {
            b.classList.add('badge-soft');
            b.classList.remove('badge-primary');
        }
    });
}

function getSelectedNames() {
    return Array.from(shadowRoot.querySelectorAll('.badge'))
        .filter((b) => b.querySelector('.checkbox').checked)
        .map((b) => b.innerText);
}

function rotate(index = 0, waitTime = -1) {
    const time = parseInt(shadowRoot.querySelector('.time').value);
    const rotationTime = isNaN(time) ? 1 : Math.max(1, time);

    const isRotationEnabled = shadowRoot.querySelector('.toggle').checked;
    if (isRotationEnabled) {
        if (waitTime === -1 || waitTime >= rotationTime) {
            const names = getSelectedNames();
            const len = names.length;
            const newIndex = len === 0 ? 0 : (index + 1) % len;
            setTimeout(() => rotate(newIndex, 0), 1000);
            if (len === 0) return;
            selectSystem(names[index % len]);
        } else {
            setTimeout(() => rotate(index, waitTime + 1), 1000);
        }
    } else {
        setTimeout(rotate, 1000);
    }
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
        'fixed top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-md z-50 max-w-[500px] bg-base-300 z-[9999]';
    let innerHtml = `
      <div class="systems">
        ${Object.keys(SYSTEM_MAP)
            .map(
                (k) =>
                    `<div class="badge badge-soft m-1">
                      <input type="checkbox" class="name-rotate-checkbox checkbox checkbox-xs" />
                      <span class="name cursor-pointer">${k}</span>
                    </div>`,
            )
            .join('')}
      <div>
      <div class="my-3 mx-1">
          <input id="rotate-toggle" type="checkbox" checked="checked" class="url-param toggle mr-3" />
          Auto rotate time
          <input id="rotate-time" type="number" min="1" placeholder="sec" class="url-param time input w-16" value="5"/>
      </div>`;
    controls.innerHTML = innerHtml;

    controls.querySelectorAll('.name').forEach((elem) => {
        elem.onclick = badgeClick;
    });

    controls
        .querySelectorAll('.url-param')
        .forEach((elem) => elem.addEventListener('change', updateUrlParam));

    controls.querySelectorAll('.name-rotate-checkbox').forEach((elem) => {
        elem.addEventListener('change', updateRotateNamesParam);
    });
    shadowRoot.appendChild(controls);
}

function updateUrlParam(e) {
    const name = e.currentTarget.id;
    const value = getInputValue(e.currentTarget);

    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
}

function updateRotateNamesParam() {
    const url = new URL(window.location.href);
    url.searchParams.set('rotate-names', getSelectedNames().join('.'));
    window.history.replaceState({}, '', url);
}

function getInputValue(input) {
    if (input.type === 'checkbox') {
        return input.checked ? '1' : '0';
    } else if (input.type === 'text' || input.type === 'number') {
        return input.value;
    } else {
        console.error('Unexpected type: ' + input.type);
        return null;
    }
}

function setInputValue(input, value) {
    if (input.type === 'checkbox') {
        input.checked = value === '1';
    } else if (input.type === 'text' || input.type === 'number') {
        input.value = value;
    } else {
        console.error('Unknown input type: ' + input.type);
    }
}
function setDocumentUrlParams() {
    const url = window.location.href;
    const searchParams = new URLSearchParams(new URL(url).search);

    document.querySelectorAll('.url-param').forEach((input) => {
        const value = searchParams.get(input.id);
        if (value) {
            setInputValue(input.id, value);
        }
    });
}

function setDocumentRotateNames() {
    const url = new URL(window.location.href);
    const rotateNames = url.searchParams.get('rotate-names');
    if (rotateNames) {
        const names = rotateNames.split('.');
        shadowRoot.querySelectorAll('.name-rotate-checkbox').forEach((input) => {
            const name = input.nextElementSibling.innerText;
            input.checked = names.includes(name);
        });
    }
}

function badgeClick(e) {
    const name = e.currentTarget.innerText;
    selectSystem(name);
}

const shadowRoot = createShadowRoot();
renderControls();
setDocumentUrlParams();
setDocumentRotateNames();
rotate();
