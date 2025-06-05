import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import {stepFund,getCurrentFund,completeApplication} from "../controllers/fund.controller.js";

const router = Router();

router.route('/step-apply/:step').post(verifyJWT, upload.any(), stepFund);
router.route('/current-fund').get(verifyJWT, getCurrentFund);
router.route('/complete-application').post(verifyJWT,completeApplication)


export default router;