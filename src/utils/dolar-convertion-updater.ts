async function getDolarPriceFromApi() {
    const response = await fetch("https://dolarapi.com/v1/dolares/blue");
    const jsonResponse = await response.json();
    
    return { 
        ask: jsonResponse.venta, 
        bid: jsonResponse.compra 
    };
}

async function update() {
    const { bid, ask } = await getDolarPriceFromApi();
    await chrome.storage.sync.set({
        dolarConvertion: {
            updatedOn: Date.now(),
            bid,
            ask
        }
    });
}

export default async function updateDolarConvertionIfOutdated() {
    try {
        const storage = await chrome.storage.sync.get();
        
        if(!Object.prototype.hasOwnProperty.call(storage, "dolarConvertion")) {
            update();
        }

        const updatedOnDate = new Date(storage.dolarConvertion.updatedOn);
        const now = new Date();

        if(updatedOnDate.getDate() < now.getDate()) {
            update();
        }
    } catch(e) {
        console.log(e);
    }
}