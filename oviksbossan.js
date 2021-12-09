const https = require('https');
const fs = require('fs');

async function getDonations(start) {
    return new Promise((resolve, reject) => {
        
        https.get(`https://bossan.musikhjalpen.se/api/fundraisers/donations/5mopODrErReGLUxWlM7otv/${start}`, res => { //https://bossan.musikhjalpen.se/api/fundraisers/donations/3dfjkM0bfHzJIO5Hfk2zag

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

    const fileName = 'donations.json';
    let result = [];
  
    try{
        const storedState = fs.readFileSync(fileName, 'utf8')
        result = JSON.parse(storedState);
    }
    catch(err){}

    while(true){
        await new Promise(resolve => setTimeout(resolve, 5000));
        let donations = await getDonations(0);
        console.log("polling server");
        donations = null;
        //for(donation of donations){
//
        //    if(!result.find(d => d.timestamp === donation.timestamp)){
        //        result.push(donation);
        //    }       
        //}

        for (var i = donations?.length - 1; i >= 0; i--) {
            const donation = donations[i];

            if(!result.find(d => d.timestamp === donation.timestamp)){
                result.push(donation);
            }   
        }

        fs.writeFileSync(fileName, JSON.stringify(result)); //, null, 4
    }

})();



