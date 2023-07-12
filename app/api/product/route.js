import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// export async function GET(request) {

//   // Replace the uri string with your connection string.
//   const uri = "mongodb+srv://mongodb:di9utTasUi4AHxoJ@mongoyoutube.nhtraxd.mongodb.net/";
//   const client = new MongoClient(uri);
//   try {
//     const database = client.db('stock');
//     const inventory = database.collection('inventory');
//     const query = {};
//     const products = await inventory.find(query).toArray();
//     return NextResponse.json({ success: true, products })
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }

// }

// export async function POST(request) {
//   // Replace the uri string with your connection string.
//   let body = await request.json()
//   const uri = "mongodb+srv://mongodb:di9utTasUi4AHxoJ@mongoyoutube.nhtraxd.mongodb.net/";
//   const client = new MongoClient(uri);
//   try {
//     const database = client.db('stock');
//     const inventory = database.collection('inventory');
//     const product = await inventory.insertOne(body)
//     return NextResponse.json({ product, ok: true })
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
export async function GET(request) {
  //Replace the uri string with your connection string.
    const uri = "mongodb+srv://shourya:shouryajain@stock-management.a2nazqb.mongodb.net/";
    const client = new MongoClient(uri);
    try {
      const database = client.db('stock-management');
      const inventory = database.collection('inventory');
      // Query for a movie that has the title 'Back to the Future'
      const query = {  };
      const allProduct= await inventory.find().toArray();
      return NextResponse.json({allProduct})
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  
  export async function POST(request) {
      //Replace the uri string with your connection string.
      let body=await request.json()
        const uri = "mongodb+srv://shourya:shouryajain@stock-management.a2nazqb.mongodb.net/";
        const client = new MongoClient(uri);
        try {
          const database = client.db('stock-management');
          const inventory = database.collection('inventory');
          // Query for a movie that has the title 'Back to the Future'
          const query = {  };
          const products=await inventory.findOne({slug:body.slug})
          let Product={}
          if (products){
             Product=await inventory.updateOne({_id:products._id},{$set:{"quantity":body.quantity,"price":body.price}},{new:true})
          }else{
             Product= await inventory.insertOne(body)
          }
          return NextResponse.json({Product})
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }