const Users = require("../models/userModel")
const Expenses = require("../models/expenseModel")

exports.register = async function (req, res) {
    const user = await Users.findOne({
        email: req.body.email
    })
    if (user) {
        return res.status(409).send({
            message: "User already exists."
        })
    }

    try {
        const newUser = await Users.create({ email: req.body.email, name: req.body.name, password: req.body.password, contact: req.body.contact })
        return res.status(200).send({
            message: "Registered Successfully.",
            user: { email: newUser.email, name: newUser.name, contact: newUser.contact, expenses: newUser.expenses }
        })
    } catch (error) {
        return res.status(404).send({
            message: "Something went wrong",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }
}

exports.login = async function (req, res) {
    try {
        const user = await Users.findOne({ email: req.body.email })
        if (user) {
            const isPasswordMatched = await user.comparePassword(req.body.password);
            if (isPasswordMatched) {
                const token = user.getJWTToken()
                res.status(200).send({
                    user: {
                        name: user.name,
                        email: user.email,
                        contact: user.contact,
                        expenses: user.getAllExpenses()
                    },
                    token: token
                })
            }
            else {
                res.status(401).send({
                    message: "Incorrect Contact or Password"
                })
            }
        }
        else {
            res.status(401).send({
                message: "Incorrect Contact or Password",
            })
        }
    }
    catch (err) {
        res.status(401).send({
            message: "Incorrect Contact or Password",
            error: err
        })
    }
}

exports.addExpense = async function (req, res) {
    try {
        const user = await Users.findById(req.user.id)
        const amount = parseInt(req.body.amount)
        const expense = await Expenses.create({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date
        })
        user.expenses.push(expense._id)
        await user.save()
        const expenses = await user.getAllExpenses()
        res.status(200).send({
            message: "Expense added.",
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact,
                expenses: expenses
            }
        })
    }
    catch (error) {
        res.status(404).send({
            message: "Something went wrong",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }
}

exports.removeExpense = async function (req, res) {
    try {
        const user = await Users.findById(req.user.id)
        user.removeExpense(req.body.id)
        user.save()
        res.status(200).send({
            message: "Expense removed successfully.",
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact,
                expenses: await user.getAllExpenses()
            }
        })
    }
    catch (error) {
        res.status(404).send({
            message: "Something went wrong",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }
}

exports.removeMany = async function (req, res) {
    try {
        const user = await Users.findById(req.user.id)
        const idArray = req.body.idArray
        idArray.forEach(element => {
            user.removeExpense(element)
        });
        user.save()
        res.status(200).send({
            message: "Expense removed successfully.",
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact,
                expenses: await user.getAllExpenses()
            }
        })
    }
    catch (error) {
        res.status(404).send({
            message: "Something went wrong",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }
}

exports.getUser = async function (req, res) {
    try {
        const user = await Users.findById(req.user.id)
        res.status(200).send({
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact,
                expenses: await user.getAllExpenses()
            },
            token: token
        })
    } catch (error) {
        res.status(404).send({
            message: "Something went wrong",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }
}