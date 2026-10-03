import { Router } from 'express';
import { eventoRoutes } from './eventoRoutes';
import { usuarioRoutes } from './usuarioRoutes';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/eventos', eventoRoutes);

export { router as appRoutes };
