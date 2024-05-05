
const FIREBASE_API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';

const data = {
    email: "testdev@mail.com",
    password: "password",
    returnSecureToken: true
};

const getIdToken = async () => {

    // get the user token
    const tokenResponse: Response = await fetch(
        FIREBASE_API_URL + 'signInWithPassword?key=' + process.env.FIREBASE_API_KEY,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const token = await tokenResponse.json();

    return token;

}

export { getIdToken };
