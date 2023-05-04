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
        const contact = req.body.contact != null ? req.body.contact : "";
        const newUser = await Users.create({ email: req.body.email, name: req.body.name, password: req.body.password, contact: contact })
        const token = newUser.getJWTToken()
        return res.status(200).send({
            message: "Registered Successfully.",
            user: { email: newUser.email, name: newUser.name, contact: newUser.contact || "", expenses: newUser.expenses, salary: newUser.salary },
            token: token
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
                    message: "Logged in.",
                    user: {
                        name: user.name,
                        email: user.email,
                        contact: user.contact || "",
                        expenses: await user.getAllExpenses(),
                        salary: user.salary
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
        console.log(parseInt(req.body.amount) > user.salary)
        if (parseInt(req.body.amount) > user.salary) {
            res.status(400).send({
                message: "Insufficient Balance",
                user: {
                    name: user.name,
                    email: user.email,
                    contact: user.contact || "",
                    expenses: await user.getAllExpenses(),
                    salary: user.salary
                }
            })
        }
        else {
            const expense = await Expenses.create({
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                amount: req.body.amount,
                date: req.body.date
            })
            user.expenses.push(expense._id)
            user.salary -= expense.amount
            await user.save()
            const expenses = await user.getAllExpenses()
            res.status(200).send({
                message: "Expense added.",
                user: {
                    name: user.name,
                    email: user.email,
                    contact: user.contact || "",
                    expenses: expenses,
                    salary: user.salary
                }
            })
        }
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
        await user.removeExpense(req.body.id)
        await user.save()
        res.status(200).send({
            message: "Expense removed successfully.",
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact || "",
                expenses: await user.getAllExpenses(),
                salary: user.salary
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
        var credit = 0
        for (var i = 0; i < idArray.length; i++) {
            var exp = await Expenses.findById(idArray[i])
            credit += exp.amount || 0
        }
        user.salary += credit
        idArray.forEach(async (element) => {
            await user.removeExpense(element)
        });
        await user.save()
        res.status(200).send({
            message: "Expense removed successfully.",
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact || "",
                expenses: await user.getAllExpenses(),
                salary: user.salary
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
                contact: user.contact || "",
                expenses: await user.getAllExpenses(),
                salary: user.salary
            },
            token: req.body.token
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

exports.updateProfile = async function (req, res) {
    try {
        const user = await Users.findById(req.user.id)
        user.name = req.body.name
        user.email = req.body.email
        user.contact = String(req.body.contact)
        console.log(user.contact)
        await user.save()
        res.status(200).send({
            message: "Profile Updated Successfully",
            user: {
                name: user.name,
                email: user.email,
                contact: user.contact || "",
                expenses: await user.getAllExpenses(),
                salary: user.salary
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

exports.changePassword = async function (req, res) {
    try {
        const user = await Users.findById(req.user.id)
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if (isPasswordMatched) {
            user.password = req.body.newPassword
            await user.save()
            res.status(201).send({
                message: "Password Changed Successfully."
            })
        } else {
            res.status(401).send({
                message: "Incorrect Password"
            })
        }
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

exports.creditSalary = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)
        const sal = parseInt(req.body.salary)
        console.log(sal)
        if (sal <= 0) {
            res.status(400).send({
                message: "Salary must me be positive.",
                user: {
                    user: {
                        name: user.name,
                        email: user.email,
                        contact: user.contact || "",
                        expenses: await user.getAllExpenses(),
                        salary: user.salary
                    }
                }
            })
        }
        else {
            user.salary += sal
            await user.save()
            res.status(200).send({
                message: "Salary Credited Successfully.",
                user: {
                    name: user.name,
                    email: user.email,
                    contact: user.contact || "",
                    expenses: await user.getAllExpenses(),
                    salary: user.salary
                }
            })
        }

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