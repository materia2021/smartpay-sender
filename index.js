const open = require('open');
const axios = require('axios').default;
const CryptoJS = require("crypto-js");
(async() => {
    const requestId = Math.random() * (1000000 - 1000) + 1000
    axios.post('http://localhost/api/transaction/create', {
        "requestId": requestId,
        "currencyCode": "VND",
        "bankCode": "VVCBI",
        "depositorName": "Test",
        "depositorAcctNo": "123456",
        "depositAmount": 10,
        "beneficiaryName": "Test",
        "beneficiaryAcctNo": "123456"
      })
      .then(async function (response) {
        
        if(response.data) {
          console.log(response.data)
          if(response.data.statusCode != -1) {
            const sessionId = response.data.sessionId;
            const key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
            const iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
            const sessionIdEnc = CryptoJS.AES.encrypt(sessionId, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();
            const params = "sessionId=" + encodeURIComponent(sessionIdEnc) + "&language=";
            await open("http://localhost/" + "?" + params)
          } else {
            console.log("Request ID duplication, Please try again or use another Request ID.")
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
})();