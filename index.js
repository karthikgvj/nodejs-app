const mysql = require('promise-mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let ENV = require("./env");
const nodemailer = require("nodemailer");

app.use(bodyParser.json())

const getPool = () => {
  return mysql.createPool({
    host: ENV.getDBHost(),
    user: ENV.getDBUser(),
    password: ENV.getDBPassword(),
    database: ENV.getDBInstance(),
    port: ENV.getDBPort(),
    connectionLimit: 5,
  });
}

const port = ENV.getPort() || 3000

app.listen(port, () => console.log("Express server is running in port: ", port))

app.get('/blogs', async (req, res) => {
  getAllBlogs(res)
})

app.get('/blog/:id', async (req, res) => {
  getBlog(req, res)
})

app.post('/blogs', async (req, res) => {
  saveBlog(req, res)
})

app.delete('/blog/:id', async (req, res) => {
  deleteBlog(req, res)
})

app.put('/blog/:id', async (req, res) => {
  updateBlog(req, res)
})

const getAllBlogs = async (res) => {
  let pool = await getPool();
  const allBlogs = await pool.query('SELECT * FROM blogs');
  if (allBlogs) {
    res.status(200).send({status: 'success', data: allBlogs})
  } else {
    console.log("Error in getting blogs")
  }
}

const getBlog = async (req, res) => {
  let id = req.params.id
  let pool = await getPool();
  const blog = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
  if (blog) {
    res.status(200).send({status: 'success', data: blog})
  } else {
    console.log("Error in getting the blog")
  }
}

const saveBlog = async (req, res) => {
  let title = req.body.title
  let description = req.body.description
  let author = req.body.author
  let pool = await getPool();
  const response = await pool.query('INSERT INTO blogs(title, description, author) VALUES (?, ?, ?)',
  [title, description, author]);
  sendEmailNotification(title, author)
  if (response) {
    res.status(200).send({status: 'success'})
  } else {
    console.log("Error in saving the blog")
  }
}

const deleteBlog = async (req, res) => {
  let id = req.params.id
  let pool = await getPool();
  const response = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
  if (response) {
    res.status(200).send({status: 'success'})
  } else {
    console.log("Error in deleting the blog")
  }
}

const updateBlog = async (req, res) => {
  let id = req.params.id
  let title = req.body.title
  let description = req.body.description
  let author = req.body.author
  let pool = await getPool();
  const response = await pool.query('UPDATE blogs SET title = ?, description = ?, author = ? WHERE id = ?', [title, description, author, id]);
  if (response) {
    res.status(200).send({status: 'success', data: response})
  } else {
    console.log("Error in updating the blog")
  }
}

const sendEmailNotification = (title, author) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ENV.getTransporterEmail(),
      pass: ENV.getTransporterPassword()
    }
  });

  let mailOptions = {
    from: ENV.getTransporterEmail(),
    to: author,
    subject: 'Sending Email using Node.js',
    text: `Your blog "${title}" has been created successfully.`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}