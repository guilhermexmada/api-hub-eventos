import { Request, Response } from 'express';
import { Evento } from '../models/Evento';
import { Presenca } from '../models/Presenca';
import { Usuario } from '../models/Usuario';

export class PresencaController {
  // cadastra uma presença (usuário <-> evento)
  public static async marcar(req: Request, res: Response): Promise<Response> {
    try {
      const eventoId = parseInt(req.params.id as string, 10);
      if (isNaN(eventoId) || eventoId <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID do evento deve ser um número válido.' });
      }

      const usuarioId = parseInt(req.body?.usuarioId, 10);
      if (isNaN(usuarioId) || usuarioId <= 0) {
        return res
          .status(400)
          .json({ erro: 'O campo usuarioId deve ser um número válido.' });
      }

      const evento = await Evento.findByPk(eventoId);
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado.' });
      }

      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const presencaExistente = await Presenca.findOne({
        where: { eventoId, usuarioId },
      });
      if (presencaExistente) {
        return res
          .status(400)
          .json({ erro: 'O usuário já possui presença marcada neste evento.' });
      }

      if (evento.vagasDisponiveis <= 0) {
        return res
          .status(400)
          .json({ erro: 'Não há vagas disponíveis neste evento.' });
      }

      await Presenca.create({ eventoId, usuarioId });

      evento.vagasDisponiveis = evento.vagasDisponiveis - 1;
      await evento.save();

      return res.status(201).json({
        mensagem: 'Presença marcada com sucesso.',
        eventoId,
        usuarioId,
        vagasDisponiveis: evento.vagasDisponiveis,
      });
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao marcar presença.',
        detalhe: (error as Error).message,
      });
    }
  }

  // exclui uma presença
  public static async cancelar(req: Request, res: Response): Promise<Response> {
    try {
      const eventoId = parseInt(req.params.id as string, 10);
      if (isNaN(eventoId) || eventoId <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID do evento deve ser um número válido.' });
      }

      const usuarioId = parseInt(req.params.usuarioId as string, 10);
      if (isNaN(usuarioId) || usuarioId <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID do usuário deve ser um número válido.' });
      }

      const evento = await Evento.findByPk(eventoId);
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado.' });
      }

      const presenca = await Presenca.findOne({
        where: { eventoId, usuarioId },
      });
      if (!presenca) {
        return res.status(404).json({
          erro: 'Presença não encontrada para este usuário neste evento.',
        });
      }

      await presenca.destroy();

      evento.vagasDisponiveis = evento.vagasDisponiveis + 1;
      await evento.save();

      return res.status(200).json({
        mensagem: 'Presença cancelada com sucesso.',
        eventoId,
        usuarioId,
        vagasDisponiveis: evento.vagasDisponiveis,
      });
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao cancelar presença.',
        detalhe: (error as Error).message,
      });
    }
  }
}
