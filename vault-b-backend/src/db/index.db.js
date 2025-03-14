import mongoose from 'mongoose'

const connectDb = async ()=>{
try{
    const handleConnection=await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database connected\nDB Host: "+`${handleConnection.connection.host}`)
}

catch(err){
    throw Error(err)
}
}
export default connectDb
