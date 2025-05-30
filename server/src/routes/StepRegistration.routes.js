import { Router } from 'express';
import {
  stepRegistration,
  getCurrentRepresentative,
  getBusinessByRepresentative
} from '../controllers/StepRegistration.controller.js';
import { verifyJWT } from '../Middlewares/auth.middleware.js';
import { upload } from '../Middlewares/multer.middleware.js';

const router = Router();

router.post(
  "/step-register/:step",
  verifyJWT,
  upload.any(), // Accept any file field name
  stepRegistration
);

router.get("/getCurrentRepresentative", verifyJWT, getCurrentRepresentative);
router.get("/getBusiness", verifyJWT, getBusinessByRepresentative);

export default router;
