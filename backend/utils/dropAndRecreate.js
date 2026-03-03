import User from "./models/users.js"; // Adjust the path to your User model

// Function to drop the existing googleId index and recreate it with the sparse option
export const fixGoogleIdIndex = async () => {
  try {
    // Drop the existing index if it exists
    await User.collection.dropIndex("googleId_1");
    console.log("Dropped the googleId index successfully.");

    // Recreate the index with sparse: true
    await User.collection.createIndex(
      { googleId: 1 },
      { unique: true, sparse: true }
    );
    console.log("Recreated the googleId index with sparse: true.");
  } catch (error) {
    console.error("Error while fixing googleId index:", error.message);
  }
};

// Call the function to fix the index
fixGoogleIdIndex();
