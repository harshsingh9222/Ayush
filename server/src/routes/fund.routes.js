import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import {
    updateFundStep,
    submitFinalApplication,
    getFundById,
    createFundDraft,
    getAllFund,
} from "../controllers/fund.controller.js";

const router = Router();
router.route('/').get(verifyJWT,getAllFund)
router.route('/').post(verifyJWT,createFundDraft)
router.route('/:fundId').get(verifyJWT, getFundById);
router.route('/:fundId/step/:stepNumber').put(verifyJWT, upload.any(), updateFundStep);
router.route('/:fundId/submit').post(verifyJWT, submitFinalApplication)


export default router;