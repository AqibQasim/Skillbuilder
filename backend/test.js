// const axios = require('axios');

// async function getPublicIP() {
//   try {
//     const response = await axios.get('https://api64.ipify.org?format=json');
//     const publicIP = response.data.ip;
//     console.log(`Public IP address: ${publicIP}`);
//   } catch (error) {
//     console.error('Error fetching public IP:', error.message);
//   }
// }

// getPublicIP();



const dns = require('dns');

dns.resolve4('www.google.com', (err, addresses) => {
  if (err) {
    console.error('Error fetching public IP:', err.message);
    return;
  }

  const publicIP = addresses;
  console.log(`Public IP address: ${publicIP}`);
});
