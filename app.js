const express = require("express");
const mysql = require("mysql2");
const app = express();

const cookieParser = require("cookie-parser");

const auth = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");

app.set("view engine", "ejs");
//middle ware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// db connection

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sonu28062000",
  database: "bank",
});

connection.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(3000, () => {
      console.log("database connected and server started at 3000");
    });
  }
});

app.use(auth);

app.get("/", (req, res) => {
  res.render("home");
});



app.get("/customer", authenticateToken, (req, res) => {
  // Access the authenticated user's information using `req.user` req.user.userId

  const customerID = req.user.userId;

  connection.query(
    "SELECT * FROM customer where customer_id=?",
    customerID,
    (err, result) => {
      if (err) console.log(err);

      const first_name = result[0].first_name;
      const last_name = result[0].last_name;
      const address = result[0].address;
      const email = result[0].email;

      connection.query("select * from account where customer_id=?",customerID,(err,result2)=>{
        if(err) console.log(err);
        const account_no=result2[0].account_id;
        const curentBalance=result2[0].balance;
        res.render("customer", {
          first_name: first_name,
          last_name: last_name,
          address: address,
          email: email,
          account:account_no,
          balance:curentBalance
        });
      })

      
    }
  );
});

app.get("/payment", authenticateToken, (req, res) => {
  res.render("payment");
});

app.post("/payment", authenticateToken, (req, res) => {
  const { accountID, accountType } = req.body;
  const amount = parseInt(req.body.amount);
  const receiver = accountID;
  connection.query(
    "select * from account where customer_id=?",
    req.user.userId,
    (err, result) => {
      if (err) console.log(err);

      const senderID = result[0].account_id;
      const senderCurrentBalance = parseInt(result[0].balance);
      // console.log(senderID,receiver);

      // write update query

      connection.query(
        "select * from account where account_id=?",
        receiver,
        (err, result) => {
          if (err) console.log(err);

          const receiverID = result[0].account_id;
          const receiverCurrentBalance = parseInt(result[0].balance);

          if (senderID != receiverID) {
            const values = [senderCurrentBalance - amount, senderID];
            connection.query(
              "update account set balance=? where account_id=?",
              values,
              (err, result) => {
                if (err) console.log(err);
                // console.log(result);
              }
            );
            const Values = [receiverCurrentBalance + amount, receiverID];

            connection.query(
              "update account set balance=? where account_id=?",
              Values,
              (err, result) => {
                if (err) console.log(err);
                // console.log(result);
              }
            );
            connection.query("insert into transaction (sender,receiver,amount) values(?,?,?)",[senderID,receiverID,amount],(err,result)=>{
              if(err) console.log(err);
              // console.log(result);
            })
            res.redirect("/customer");
          }else{
            console.log("sender and reiver cannot be same");
          }
        }
      );
    }
  );
});

app.get('/transaction',authenticateToken,(req,res)=>{
  const user=req.user.userId;
  console.log(user);
  connection.query("select * from account where customer_id=?",user,(err,result)=>{
    if(err) console.log(err)
    // console.log(result);
    const user2=result[0].account_id;
    connection.query("select * from transaction where sender=?",user2,(err,result)=>{
      if(err) console.log(err)
      // console.log(result);
      
      console.log(result);
      res.render('transaction',{transactions:result});
    })
  })
})