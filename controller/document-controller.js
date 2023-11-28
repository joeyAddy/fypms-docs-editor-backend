import Document from "../schema/documentSchema.js";

export const getDocument = async (id) => {
  try {
    if (!id) return;

    // Find document by ID
    const document = await Document.findOne({ _id: id });

    // If document exists, return it
    if (document) return document;

    // If no document found, create a new one
    const newDocument = await Document.create({
      _id: id,
      sfdt: `{
        "sections": [
            {
                "blocks": [
                    {
                        "inlines": [
                            {
                                "characterFormat": {
                                    "bold": true,
                                    "italic": true
                                },
                                "text": "Start a new document"
                            }
                        ]
                    }
                ],
                "headersFooters": {
                }
            }
        ]
    }`,
    });

    return newDocument;
  } catch (error) {
    // Handle any errors and log them
    console.error("Error while fetching/creating document:", error);
    throw new Error("Failed to get document");
  }
};

export const updateDocument = async (id, sfdt) => {
  try {
    if (!id) throw new Error("Document ID not provided");

    // Update document by ID
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { $set: { sfdt } },
      { new: true, upsert: true }
    );

    // Return the updated document
    return updatedDocument;
  } catch (error) {
    // Handle any errors and log them
    console.error("Error while updating document:", error);
    throw new Error("Failed to update document");
  }
};
