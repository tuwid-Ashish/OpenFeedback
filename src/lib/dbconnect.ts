import mongoose from "mongoose";

type  connectionType = {
    isConnected?: number;
};

const connection: connectionType = {};

async function dbConnect():Promise<void> {
    if(connection.isConnected){
     console.log("Using existing connection");
     
        return;
    }
    try {
       const db = await mongoose.connect(`${process.env.MONGODB_URI}/openfeedback`|| "", {});
         connection.isConnected = db.connections[0].readyState;
        console.log("New connection created");
        
    } catch (error) {
        console.log("Error in creating connection", error);
        process.exit(1);
        
    }
}

export default dbConnect;