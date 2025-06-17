import express from 'express'
import { adminLogin, getCurrentAdmin } from '../controllers/admin.controller.js'
import { verifyAdminJwt } from '../Middlewares/auth.middleware.js';
import { adminLogout } from '../controllers/admin.controller.js';

const router = express.Router();

router.route('/login').post(adminLogin);
router.route('/current-admin').get(verifyAdminJwt,getCurrentAdmin); // this is for the fetching of the current Admin
router.route('/logout').post(verifyAdminJwt,adminLogout);

export default router;