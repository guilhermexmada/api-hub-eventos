import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const router = Router();

router.get('/', UsuarioController.index);
router.get('/:id', UsuarioController.show);
router.post('/', UsuarioController.create);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

export { router as usuarioRoutes };
