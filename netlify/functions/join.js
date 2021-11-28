const { getFirestore } = require("../firestore");
const firestore = getFirestore();

async function verifyCaptcha(token) {
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: JSON.stingify({
          secret: "6Le5WmQdAAAAAFbd83pwuxlMim6jT0-V0I6duFEO",
          response: token,
        }),
      }
    );
    const json = response.json();

    return Promise.resolve(json.success);
  } catch {
    return Promise.resolve(false);
  }
}

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

    if (!parsedBody["g-recaptcha-response"]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" }),
      };
    }

    const hasValidCaptcha = await verifyCaptcha(
      parsedBody["g-recaptcha-response"]
    );

    if (!hasValidCaptcha) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" }),
      };
    }

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
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An unexpected error occured on the server",
      }),
    };
  }
};
