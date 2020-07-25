const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);

//ADD ERROR HANDLING
var admin = require("firebase-admin");
//CHANGE TO ENV VARIABLE
var serviceAccount = require(`${__dirname}/../serviceAccountKey.json`);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://auth-87509.firebaseio.com"
});

//admin middleware
//route must have CSFR PROTECTION (login page)
//On oAuthLogin ->
exports.createToken = (req, res, next) => {
    // Get the ID token passed and the CSRF token.
    const idToken = req.body.idToken;
    const csrfToken = req.body.csrfToken;

    // Guard against CSRF attacks.
    if (csrfToken !== req.cookies._csrf) {
        res.status(401).send('csfr validation failure');
        return;
    }
    // Set session expiration to 2 days.
    const expiresIn = 60 * 60 * 24 * 2 * 1000;
    admin.auth().createSessionCookie(idToken, {
            expiresIn
        })
        .then((sessionCookie) => {
            // Set cookie policy for session cookie.
            const options = {
                maxAge: expiresIn,
                httpOnly: true,
                secure: false
            };
            res.cookie('session', sessionCookie, options);
            res.status(200).send('session created');
        }, error => {
            res.status(401).send('could not create session cookie');
        });
}

exports.verifyUser = (req, res, next) => {
    const sessionCookie = req.cookies.session || '';

    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */ )
        .then((decodedClaims) => {
            if (decodedClaims.email === process.env.ADMIN) {
                next();
            } else {
                res.status(404).send('Not An ADMIN USER');
            }
        })
        .catch(error => {
            // Session cookie is unavailable or invalid. Force user to login.
            res.status(404).send('Not An ADMIN USER');
        });
}