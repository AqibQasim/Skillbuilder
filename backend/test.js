const axios = require('axios');
0
async function getPublicIP() {
  try {
    const response = await axios.get('https://localhost:');
    const publicIP = response.data.ip;
    console.log(`Public IP address: ${publicIP}`);
  } catch (error) {
    console.error('Error fetching public IP:', error.message);
  }
}

getPublicIP();



// const dns = require('dns');

// dns.resolve4('www.google.com', (err, addresses) => {
//   if (err) {
//     console.error('Error fetching public IP:', err.message);
//     return;
//   }

//   const publicIP = addresses;
//   console.log(`Public IP address: ${publicIP}`);
// });



// const test = async () => {
//   const bcrypt = require("bcrypt");
  
//   const input = '2b$10$FJpb2wYnImaQdlntwF821OFSQ9fFl0Q6v37iz13qSRWuJ7iJpuJZO'
  
//   const compare = await bcrypt.compare("Shahab123@", input)
  
//   console.log(compare);

// }
// test();


// const fontColor = theme == 'black' ? colors.white : colors.grey

// fontColor