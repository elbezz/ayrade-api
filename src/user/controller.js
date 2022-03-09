const pool = require("../../db");
const queries = require("./queries");
//////////////////////////////////////////
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  pool.query(queries.getUsersQuery, (error, results) => {
    console.log(results.rows);
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getVoucher = (req, res) => {
  pool.query(queries.getVoucherQuery, (error, results) => {
    console.log(results.rows);
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};
const getVoucherStats = (req,res)=>{
pool.query(queries.getVoucherStatsQuery,(error,results)=>{
  console.log(results.rows);
  if(error) throw error
  res.status(200).json(results.rows)
})
}
////////////////////////////////////////
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserByIdQuery, [id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};
const getVoucherStatsById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getVoucherStatsByIdQuery, [id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};
////////////////////////////////////////
// const addUser = (req, res) => {
//   const { name, email, password } = req.body;
//   //check if email exist
//   pool.query(queries.checkIfEmailExist, [email], (error, results) => {
//     if (results.rows.length) {
//       res.send("email exists");
//     } else {
//       pool.query(queries.addUser, [name, email, password], (error) => {
//         if (error) throw error;
//         res.status(201).send({
//           message: "user added successfully!",
//           body: {
//             user: { name, email },
//           },
//         });
//       });
//     }
//   });
// };
////////////////////////////////////////
const checkIfEmailExist = async (req, res, next) => {
  const { email } = req.body;
  const { rows } = await pool.query(queries.checkIfEmailExistQuery, [email]);
  if (!rows.length) next();
  else {
    console.log(rows[0].password);
    res.send("email exists");
  }
};
////////////////////////////////////////
const addUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.SECRET_KEY
  ).toString();

  try {
    await pool.query(queries.addUserQuery, [name, email, password]);
    res.status(201).send({
      message: "user added successfully!",
      body: {
        user: { name, email },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
//////////////////////////////////////
const login = async (req, res) => {
  try {
    const email = req.body.email;
    const { rows } = await pool.query(queries.checkIfEmailExistQuery, [email]);
    !rows.length && res.status(401).json("wrong password or user");
    user = rows[0];
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("wrong password or user");
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );
    const { password, ...info } = user;
    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json();
  }
};

// const addUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   const { rows } = await pool.query(queries.checkIfEmailExistQuery, [email]);
//   if (!rows.length) {
//     try {
//       await pool.query(queries.addUserQuery, [name, email, password]);
//       res.status(201).send({
//         message: "user added successfully!",
//         body: {
//           user: { name, email },
//         },
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     res.send("email exists");
//   }
// };

const removeUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserByIdQuery, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("User not found to be removed");
    }
    pool.query(queries.removeUserQuery, [id], (error, results) => {
      if (error) throw error;
      res.status(200).send("User removed successfully");
    });
  });
};
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  pool.query(queries.getUserByIdQuery, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("User not found");
    }
    pool.query(queries.updateUserQuery, [name, id], (error, results) => {
      if (error) throw error;
      res.status(200).send("User updated successfully");
    });
  });
};
module.exports = {
  getUsers,
  getUserById,
  checkIfEmailExist,
  addUser,
  removeUser,
  updateUser,
  login,
  getVoucher,
  getVoucherStats,
  getVoucherStatsById,
};
