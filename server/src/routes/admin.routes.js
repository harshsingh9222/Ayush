import express from 'express'
import { adminLogin, getCurrentAdmin, getPendingBusinesses, perticularBusiness, verifyBusiness, verifyRepresentative} from '../controllers/admin.controller.js'
import { verifyAdminJwt } from '../Middlewares/auth.middleware.js';
import { adminLogout } from '../controllers/admin.controller.js';

const router = express.Router();

router.route('/login').post(adminLogin);
router.route('/current-admin').get(verifyAdminJwt,getCurrentAdmin); // this is for the fetching of the current Admin
router.route('/logout').post(verifyAdminJwt,adminLogout);
router.route('/pending-businesses').get(verifyAdminJwt, getPendingBusinesses);
router.route('/business/:businessId').get(verifyAdminJwt, perticularBusiness);
router.route('/business/:businessId/verify').post(verifyAdminJwt,verifyBusiness);
router.route('/representative/:representativeId/verify').post(verifyAdminJwt,verifyRepresentative);
export default router;