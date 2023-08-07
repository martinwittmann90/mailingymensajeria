class AuthController{
    async renderLogin  (req, res) {
        return res.render("login",{})
        }
    async login  (req, res) {
        if (!req.user) {
            req.session.user = {
                _id: req.user._id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                rol: req.user.rol,
                age: req.user.age,
                cartID: req.user.cartID,
                };
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const { _id, email, firstName, lastName, age, role } = req.user;
        req.session.user = { _id, email, firstName, lastName, age, role };
        return res.status(200).json({ status: "success", message: "User logged in successfully", payload: req.user });
    };
    async register  (req, res)  {
        req.session.user = {
            _id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            rol: req.user.rol,
            age: req.user.age,
            cartID: req.user.cartID,
        };
        return res.status(201).json({ status: "success", message: "User created successfully", payload: req.user });
    };
    async failRegister  (req, res)  {
        return res.status(400).json({ status: "error", message: "Error adding user" });
      }
    async failLogin  (req, res)  {
        return res.status(400).json({ status: "error", message: "Wrong user or password" });
    }
    async logout (req, res) {
        req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({ status: "error", message: "Error! Couldn't logout!" });
            }
            res.clearCookie("connect.sid");
            return res.status(200).json({ status: "success", message: "Logout succesfully!" });
        });
    }
    async renderRegister  (req, res) {
        return res.render("register",{})
        }
    async registerGithub (req, res)  {
        req.session.user = req.user;
        res.redirect('/products');
    }
    async getCurrent (req, res) {
        return res.render("profile", req.session.user = {
            _id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role,
            age: req.user.age,
            cartID: req.user.cartID,
        });
    }
};

export const authController = new AuthController();