

module.exports = {

    session(req, res, next) {
        if (req.session.logged == true) {
            next()
        } else{
            // res.redirect("/login")
            res.status(500).send("Não logado")
        }
    }
}