const  {Router} = require('express');
const { GetAllCategoryPlants, SeachCategoryPlants, CreateCategoryPlants, UpdateCategoryPlants, DeleteCategoryPlants, GetAllCategoryPlantsFK } = require('../controllers/categoryPlantsController');
const router = Router();


router.post("/api/category-plants/get-all",GetAllCategoryPlants)
router.post("/api/category-plants/get-all-fk",GetAllCategoryPlantsFK)
router.post("/api/category-plants/search/:id",SeachCategoryPlants)
router.post("/api/category-plants/update/:id",UpdateCategoryPlants)
router.post("/api/category-plants/create",CreateCategoryPlants)
router.post("/api/category-plants/delete/:id",DeleteCategoryPlants)



module.exports = router