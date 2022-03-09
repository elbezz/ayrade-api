const { Router } = require("express");
const controller = require("./controller");
const verify = require('../../verifyToken')
const router = Router();
// router.get("/", (req, res) => {
//   res.send("using api route");
// });
router.get("/",verify, controller.getUsers);
router.get("/voucher", controller.getVoucher);
router.get("/vouchersts", controller.getVoucherStats);
router.get("/vouchersts/:id", controller.getVoucherStatsById);
router.post("/login", controller.login);
router.get('/:id',controller.getUserById)
router.post("/", controller.checkIfEmailExist,controller.addUser);
router.delete("/:id", verify,controller.removeUser);
router.put('/:id',verify, controller.updateUser)
module.exports = router;
