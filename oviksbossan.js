const https = require('https');
const fs = require('fs');

async function getDonations(start) {
    return new Promise((resolve, reject) => {

        https.get(`https://bossan.musikhjalpen.se/api/fundraisers/donations/3dfjkM0bfHzJIO5Hfk2zag/${start}`, res => {

            let data = [];    
            res.on('data', chunk => {
                data.push(chunk);
            });
          
            res.on('end', () => {
                const donations = JSON.parse(Buffer.concat(data).toString());
                resolve(donations);
            });

        }).on('error', err => {
            console.log('Error: ', err.message);
            reject();
        });
    });
}

(async () => {
    let start = -5;
    let result = [];

    while(true){
        await new Promise(resolve => setTimeout(resolve, 1000));
        const donations = await getDonations(start+=5);

        if(!donations.length){
            fs.writeFileSync(`donations ${new Date().getTime()}.json`, JSON.stringify(result, null, 4));
            console.log('No more donations.');
            break;
        }
        else{
            for(donation of donations){
                console.log(donation);
                result.push(donation);
            }

        }
    }

    console.log("Script ended successfully.");
})();



