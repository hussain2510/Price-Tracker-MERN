'use strict';
module.exports=(app)=>{
    const userController=require('../controllers/user');
    app.route('/api/user/create').post(userController.create_a_user);
    app.route('/api/user/loginUser').post(userController.login);
}
