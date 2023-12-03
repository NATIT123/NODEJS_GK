const mongoose=require("mongoose");
async function connect(URL){
    await mongoose.connect(URL)
  .then(() => console.log('Connected!'));
}

module.exports={connect};