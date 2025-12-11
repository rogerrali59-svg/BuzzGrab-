const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger.json");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { USER } = require("../app/userService/model/userModel");

const router = express.Router();

// Session middleware (must come before auth or route handlers)
router.use(
  session({
    secret: "swagger-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  })
);

// Middleware to parse form data
router.use(express.urlencoded({ extended: true }));

// Authentication middleware
function authenticateSwagger(req, res, next) {
  console.log("Session Authentication Check:", req.session.swaggerAuth);
  if (!req.session || !req.session.swaggerAuth) {
    return res.render("swagger", { error: null }); // Login form
  }
  next(); // Authenticated
}

router.use(swaggerUi.serve);

// ✅ Protect the Swagger UI render route
router.get("/", authenticateSwagger, swaggerUi.setup(swaggerFile));

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await USER.findOne({ email });

    if (!findUser) {
      return res.render("swagger", { error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordMatch) {
      return res.render("swagger", { error: "Invalid email or password" });
    }

    req.session.swaggerAuth = true;
    console.log("Login successful, session set:", req.session);

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.render("swagger", { error: "Session error, try again." });
      }
      return res.redirect("/api/swagger/");
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.render("swagger", { error: "Something went wrong. Try again." });
  }
});

module.exports = router;
