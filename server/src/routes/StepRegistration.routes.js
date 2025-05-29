import {Router} from 'express';
import { stepRegistration, getCurrentRepresentative, getBusinessByRepresentative } from '../controllers/StepRegistration.controller.js';
import { verifyJWT } from '../Middlewares/auth.middleware.js';
import { upload } from '../Middlewares/multer.middleware.js';

const router = Router();

router.route("/step-register/:step").post(upload.any(), verifyJWT, stepRegistration)
router.route("/getCurrentRepresentative").get(verifyJWT, getCurrentRepresentative)
router.route("/getBusiness").get(verifyJWT, getBusinessByRepresentative)

export default router;