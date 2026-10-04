import { Request, Response } from 'express';
import { Evento } from '../models/Evento';

export class EventoController {
  // lista todos os eventos
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const eventos = await Evento.findAll({ order: [['data', 'ASC']] });
      return res.status(200).json(eventos);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao listar eventos.',
        detalhe: (error as Error).message,
      });
    }
  }

  // consulta 01 evento por ID
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado.' });
      }

      return res.status(200).json(evento);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao buscar evento.',
        detalhe: (error as Error).message,
      });
    }
  }

  // cadastra um novo evento
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { titulo, descricao, local, data, vagasTotais } = req.body ?? {};

      if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ erro: 'O campo titulo é obrigatório.' });
      }

      if (descricao && typeof descricao !== 'string') {
        return res
          .status(400)
          .json({ erro: 'O campo descricao deve ser um texto.' });
      }

      if (!local || typeof local !== 'string' || local.trim() === '') {
        return res.status(400).json({ erro: 'O campo local é obrigatório.' });
      }

      if (!data || isNaN(Date.parse(data))) {
        return res
          .status(400)
          .json({ erro: 'O campo data deve conter uma data válida.' });
      }

      if (!Number.isInteger(vagasTotais) || vagasTotais <= 0) {
        return res.status(400).json({
          erro: 'O campo vagasTotais deve ser um número inteiro maior que zero.',
        });
      }

      const novoEvento = await Evento.create({
        titulo: titulo.trim(),
        descricao: descricao ? descricao.trim() : null,
        local: local.trim(),
        data: new Date(data),
        vagasTotais,
        vagasDisponiveis: vagasTotais,
      });

      return res.status(201).json(novoEvento);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao cadastrar evento.',
        detalhe: (error as Error).message,
      });
    }
  }

  // atualiza as informações de um evento
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const { titulo, descricao, local, data, vagasTotais } = req.body ?? {};

      if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ erro: 'O campo titulo é obrigatório.' });
      }

      if (descricao && typeof descricao !== 'string') {
        return res
          .status(400)
          .json({ erro: 'O campo descricao deve ser um texto.' });
      }

      if (!local || typeof local !== 'string' || local.trim() === '') {
        return res.status(400).json({ erro: 'O campo local é obrigatório.' });
      }

      if (!data || isNaN(Date.parse(data))) {
        return res
          .status(400)
          .json({ erro: 'O campo data deve conter uma data válida.' });
      }

      if (!Number.isInteger(vagasTotais) || vagasTotais <= 0) {
        return res.status(400).json({
          erro: 'O campo vagasTotais deve ser um número inteiro maior que zero.',
        });
      }

      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado.' });
      }

      const vagasOcupadas = evento.vagasTotais - evento.vagasDisponiveis;
      if (vagasTotais < vagasOcupadas) {
        return res.status(400).json({
          erro: `O total de vagas não pode ser menor que o número de presenças já marcadas (${vagasOcupadas}).`,
        });
      }

      evento.titulo = titulo.trim();
      evento.descricao = descricao ? descricao.trim() : null;
      evento.local = local.trim();
      evento.data = new Date(data);
      evento.vagasTotais = vagasTotais;
      evento.vagasDisponiveis = vagasTotais - vagasOcupadas;
      await evento.save();

      return res.status(200).json(evento);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao atualizar evento.',
        detalhe: (error as Error).message,
      });
    }
  }

  // exclui um evento
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado.' });
      }

      await evento.destroy();

      return res.status(200).json({ mensagem: 'Evento excluído com sucesso.' });
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao excluir evento.',
        detalhe: (error as Error).message,
      });
    }
  }
}
