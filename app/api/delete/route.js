import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
export async function POST(request) {
    console.log("CALLED")
    const { slug } = await request.json();

    // Replace the uri string with your connection string.
    const uri = "mongodb+srv://shourya:shouryajain@stock-management.a2nazqb.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('stock-management');
        const inventory = database.collection('inventory');

        // Delete the product with the given slug
        const deleteResult = await inventory.deleteOne({ slug });

        if (deleteResult.deletedCount > 0) {
            // Product deleted successfully
            return NextResponse.json({ message: 'Product deleted successfully' });
        } else {
            // Product not found
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}