const mongoose = require('mongoose');
require('dotenv').config();
const OTP = require('./models/OTP');
(async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser:true, useUnifiedTopology:true });
    const doc = await OTP.findOne().sort({ createdAt: -1 }).lean();
    console.log('Latest OTP doc:', doc);
    await mongoose.disconnect();
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();