import { Router } from 'express';
import { EventoController } from '../controllers/EventoController';
import { PresencaController } from '../controllers/PresencaController';

const router = Router();

router.get('/', EventoController.index);
router.get('/:id', EventoController.show);
router.post('/', EventoController.create);
router.put('/:id', EventoController.update);
router.delete('/:id', EventoController.delete);

router.post('/:id/presencas', PresencaController.marcar);
router.delete('/:id/presencas/:usuarioId', PresencaController.cancelar);

export { router as eventoRoutes };
