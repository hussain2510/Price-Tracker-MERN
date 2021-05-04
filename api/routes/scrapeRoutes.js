module.exports=(app)=>{
    const userController=require('../controllers/scrape');
    app.route('/api/addProduct').post(userController.add_item);
    app.route('/api/getAllProduct').post(userController.get_singleUser_items)
    app.route('/api/deleteProduct').post(userController.deleteItem)
}