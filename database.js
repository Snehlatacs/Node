const { MongoClient } = require('mongodb');
const url = "mongodb+srv://snehcs70:QUy4d6SmR7KmSkmV@sneh70.ci1cc.mongodb.net/?retryWrites=true&w=majority&appName=Sneh70";
const client = new MongoClient(url);
const dbName = "Test";

async function main() {
  await client.connect();
  console.log("connected successfully to the server");
  const db = client.db(dbName);
  const collection = db.collection("User");

  //create
  const data = {
    firstname: "Manu",
    lastname: "prajapati",
    city:"pusa",
    mobNo:1234567890,
  };

 //read
  const insertResult = await collection.insertOne(data);
  console.log(`A document was inserted with the _id: ${insertResult.insertedId}`);

  // Update
  const updateResult = await collection.updateOne(
    { _id: insertResult.insertedId },
    { $set: { city: "new city", mobNo: 9876543210 } }
  );
  console.log(`Updated ${updateResult.modifiedCount} document(s)`);

  const updatedDocument = await collection.findOne({ _id: insertResult.insertedId });
  console.log("Updated Document:", updatedDocument);

  // Delete
  const deleteResult = await collection.deleteOne({ _id: insertResult.insertedId });
  console.log(`Deleted ${deleteResult.deletedCount} document(s)`);


  await client.close();
}

main().catch(console.error);