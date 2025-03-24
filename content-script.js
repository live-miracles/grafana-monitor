console.log('Hi from Grafana extension');

function selectSystem(hostname) {
    console.log(hostname);
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
}

function rotate(hosts, index = 0) {
    const newIndex = (index + 1) % hosts.length;
    setTimeout(() => rotate(hosts, newIndex), time);

    const view = document.getElementsByClassName('view')[0];
    if (!view) {
        console.log('View is not loaded yet');
        return;
    }
    const viewScroll = view.scrollTop;
    selectSystem(hosts[index]);
    view.scrollTop = viewScroll;
}

const systemMap = {
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

let time = 5000;
const systems = ['m1', 'm2', 'm3', 'm4', 'm5'];
const hosts = systems.map((id) => systemMap[id]);
rotate(hosts);
