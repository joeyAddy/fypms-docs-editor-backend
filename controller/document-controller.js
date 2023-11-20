import Document from "../schema/documentSchema.js";

export const getDocument = async (id, commentsWithPositions) => {
  if (id === null) return;

  const document = await Document.findById(id);

  if (document) return document;

  return await Document.create({ _id: id, data: "", commentsWithPositions });
};

export const updateDocument = async (id, data, commentsWithPositions) => {
  return await Document.findByIdAndUpdate(
    id,
    { data, commentsWithPositions }, // Update the data and commentsWithPositions fields
    { new: true, upsert: true } // To return the updated document and create if it doesn't exist
  );
};
