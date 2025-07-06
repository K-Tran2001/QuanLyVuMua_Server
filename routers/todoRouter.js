const { Router } = require('express');
const { GetAllTodo, SeachTodo, CreateTodo, UpdateTodo, DeleteTodo, GetAllTodoFK } = require('../controllers/todoController');
const router = Router();


router.post("/api/todo/get-all", GetAllTodo)
router.post("/api/todo/get-all-fk", GetAllTodoFK)
router.post("/api/todo/search/:id", SeachTodo)
router.post("/api/todo/update/:id", UpdateTodo)
router.post("/api/todo/create", CreateTodo)
router.post("/api/todo/delete/:id", DeleteTodo)



module.exports = router