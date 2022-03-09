const getUsersQuery =
  "select name,email,last_login from dashUsers where active = true";
const getUserByIdQuery = "select * from dashUsers where id = $1";
const checkIfEmailExistQuery = "select * from dashUsers where email = $1";

const addUserQuery =
  "insert into dashUsers (name, email, password) values ($1,$2,$3)";
const removeUserQuery = "delete from dashUsers where id = $1 ";
const updateUserQuery = "update dashUsers set name = $1 where id=$2 ";
////////////////////////
// const getVoucherQuery = ` select u.login as account, p.name as partner, v.date,v.amount, extract(year from date) as year, extract(month from date) as month,extract(day from date) as day
// from public.voucher v JOIN partner p on v.partner_id = p.id
// JOIN users u on u.id = v.create_uid where type='receipt'`;

const getVoucherQuery = ` select u.login as account, p.name as partner, v.date,v.amount 
from public.voucher v JOIN partner p on v.partner_id = p.id
JOIN users u on u.id = v.create_uid where type='receipt'`;
///////////////////////////////////////////////////////////////
//this is going to group by user,year,month, sum of amount
const getVoucherStatsQuery = `select create_uid, u.login as account, extract(year from date) as year,extract(month from date) as monthNum,to_char(date,'Mon') as month,
sum("amount") as "amount" from public.voucher v
JOIN users u on u.id = v.create_uid 
group by 1,2,3,4,5
order by year asc,monthNum asc`;
///////////////////////////////////////////////////////////////////

const getVoucherStatsByIdQuery = `select v.create_uid,u.login as account, extract(year from date) as year,extract(month from date) as monthNum,to_char(date,'Mon') as month,
sum("amount") as "amount" from public.voucher v 
JOIN users u on u.id = v.create_uid 
where v.create_uid = $1
group by 1,2,3,4,5
order by year asc,monthNum asc;`;
module.exports = {
  getUsersQuery,
  getUserByIdQuery,
  checkIfEmailExistQuery,
  addUserQuery,
  removeUserQuery,
  updateUserQuery,
  getVoucherQuery,
  getVoucherStatsQuery,
  getVoucherStatsByIdQuery,
};
