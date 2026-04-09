import { Router } from 'express';
import { 
obtenerArrayIDs
} from '../controller/front.controller';

const router = Router();

router.get('/getIDarray/:idNum/:idType', obtenerArrayIDs);

export default router