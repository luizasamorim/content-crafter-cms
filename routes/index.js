const express = require('express');
const Task = require('../model/Tasks');
const page = require('../model/page');
const TaskSchema = require('../validators/TaskValidator');
const Joi = require('joi');
const router = express.Router();

const obj = {
  like: true // or false
};

/* GET home page. */
router.get('/', async function(req, res) {
  let pages = await page.getAll();
  if (pages.length == 0) {
    await page.create({title: "primeira url", url: "teste1", content: "teste"});
    await page.create({title: "segunda url", url: "teste2", content: "teste2"});
  }

  pages = await page.getAll();
  res.render('home', {pages: pages, task: obj, logged: true});
});


router.get('/page/:url', async function(req, res) {
  let data = await page.search(req.params.url)
  console.log(data);
  
  res.render('page', {data: data});
});


router.post("/page", function (req, res) {
    const {error, value} = TaskSchema.validate(req.body);
    if (error) {
      res.render('home', { tasks: Task.list(), erro: "Dados incompletos"});
      return;
    }
    
    const {id, nome} = value;
    if (id === undefined) {
      // Inserir
      Task.new(nome);
    } else {
      // Alterar
      Task.update(id, nome);
    }
    
    res.redirect("/");
});

router.delete("/page/del/:id", function(req, res) {
  const {id} = req.params;
  const {error, value} = Joi.number().integer().greater(0).validate(id);

  if (error || !Task.delete(value)) {
    res.send("Falha ao excluir uma tarefa");
    return;
  }
  res.redirect("/");
});

router.get("/create", function(req, res) {
  console.log('Rota /create acessada');
  res.render('create');
});

module.exports = router;
