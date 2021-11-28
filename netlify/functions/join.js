const { getFirestore } = require("../firestore");
const firestore = getFirestore();

exports.handler = async function join(event, context, callback) {
  const { httpMethod, body } = event;

  if (httpMethod !== "POST") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  }

  try {
    const parsedBody = JSON.parse(body);
    const { email } = parsedBody;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email required" }),
      };
    }

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid email" }),
      };
    }

    const docRef = firestore.collection("emails").doc(email);
    const doc = await docRef.get();

    if (doc.exists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email already on waitlist" }),
      };
    }

    await docRef.set({ value: email });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An unexpected error occured on the server",
      }),
    };
  }
};
