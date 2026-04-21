const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

//assumption made: that "posts" is the name of the Firebase collection we are storing posts of different items. can be changed later accordingly
exports.getAllPosts = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("posts").get();

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.getItemById = functions.https.onRequest(async(req, res) => {
    try {
        const id = req.query.id;
        const doc = await db.collection("posts").doc(id).get(); //querying for the specific element by id
        if (!doc.exists) {
            return res.status(404).json({ error: "Not found" });
        }
        const result = {
            id: doc.id,
            ...doc.data()
        }

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

exports.createPost = functions.https.onRequest(async (req, res) => {
  try {
    const newPost = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("posts").add(newPost);

    res.status(201).json({
      id: docRef.id,
      ...newPost
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.updatePost = functions.https.onRequest(async (req, res) => {
  try {
    const id = req.query.id;

    const docRef = db.collection("posts").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.deletePost = functions.https.onRequest(async (req, res) => {
  try {
    const id = req.query.id;

    const docRef = db.collection("posts").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    await docRef.delete();

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.getPostsByCategory = functions.https.onRequest(async (req, res) => {
  try {
    const category = req.query.category;

    const snapshot = await db
      .collection("posts")
      .where("category", "==", category)
      .get();

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.getPostsByPriceRange = functions.https.onRequest(async (req, res) => {
  try {
    const min = Number(req.query.min);
    const max = Number(req.query.max);

    const snapshot = await db
      .collection("posts")
      .where("price", ">=", min)
      .where("price", "<=", max)
      .get();

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.getPostsSorted = functions.https.onRequest(async (req, res) => {
  try {
    const field = req.query.field || "createdAt";
    const order = req.query.order || "desc";

    const snapshot = await db
      .collection("posts")
      .orderBy(field, order)
      .get();

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.getPostsPaginated = functions.https.onRequest(async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const lastId = req.query.lastId;

    let query = db.collection("posts").orderBy("createdAt").limit(limit);

    if (lastId) {
      const lastDoc = await db.collection("posts").doc(lastId).get();
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});