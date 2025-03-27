const express = require('express');
const app = express();

app.use(express.json());

app.get('/user', (req, res) => {
    res.json({firstName:'Snehlata', lastName:'Prajapti'});
});

app.head('/user', (req, res) => {
    res.status(200).end();
});

app.post('/user', (req, res) => {
    res.json({message:'User created'});
});

app.put('/user',(req, res)=>{
    const user = req.body;
    res.json({message:'User Updated or created', user})
});

app.patch('/user',(req, res)=>{
    const updates = req.body;
    res.json({message:'User Updated', updates})
});


app.delete('/user', (req, res) => {
    res.json({message:'User deleted'});
});

app.options('/user', (req, res) => {
    res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    res.sendStatus(200);
});

app.use("/test",(req, res) =>{
   res.send("hello from the test")
});

app.listen(1300, ()=>{
    console.log('Server is running on port 1300');
});