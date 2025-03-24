function selectSystem(hostname) {
    document.getElementsByClassName('css-10l6kcd')[0].click()
    const anchors = document.querySelectorAll("a.variable-option");
    const targetAnchor = Array.from(anchors).find(anchor => 
        anchor.textContent.includes(hostname)
    );
    targetAnchor.click();
}

function rotate(hosts, index = 0) {
    selectSystem(hosts[index]);
    const newIndex = (index + 1) % hosts.length;
    setTimeout(() => rotate(hosts, newIndex), time);
}


const systemMap = {
    1m: 'IFIYCLSDT033',
    2m: 'IFIYCLSDT002',
    3m: 'IFIYCLSDT007',
    4m: 'IFIYCLSDT036',
    5m: 'IFIYCLSDT030',
    6m: 'IFIYCLSDT005',
    7m: 'IFIYCLSDT029',
    8m: 'IFIYCLSDT016',
    9m: 'IFIYCLSDT0015',
    10m: 'IFIYCLSDT034',
    11m: 'IFIYCLSDT035',
    12m: 'IFIYCLSDT024',
    1b: 'IFIYCLSDT019',
    2b: 'IFIYCLSDT010',
    3b: 'IFIYCLSDT014',
    4b: 'IFIYCLSDT037',
    5b: 'IFIYCLSDT031',
    6b: 'IFIYCLSDT017',
    7b: 'IFIYCLSDT008',
    8b: 'IFIYCLSDT003',
    9b: 'IFIYCLSDT004',
    10b: 'IFIYCLSDT018',
    11b: 'IFIYCLSDT022',
    12b: 'IFIYCLSDT009',
}
let time = 5000;
const systemNumbers = ['1m', '2m', '3m', '4m', '5m'];
const hosts = systemNumbers.map(num => systemMap+ num);
rotate(hosts);
