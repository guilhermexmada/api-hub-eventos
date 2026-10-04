import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Evento } from '../models/Evento';
import { Presenca } from '../models/Presenca';
import { Usuario } from '../models/Usuario';

export class UsuarioController {
  // lista todos os usuários
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await Usuario.findAll({ order: [['id', 'ASC']] });
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao listar usuários.',
        detalhe: (error as Error).message,
      });
    }
  }

  // consulta 01 usuáiro pelo id
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao buscar usuário.',
        detalhe: (error as Error).message,
      });
    }
  }

  // cadastra novo usuário
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email } = req.body ?? {};

      if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !email ||
        typeof email !== 'string' ||
        !emailRegex.test(email.trim())
      ) {
        return res.status(400).json({ erro: 'Informe um e-mail válido.' });
      }

      const usuarioExistente = await Usuario.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (usuarioExistente) {
        return res
          .status(400)
          .json({ erro: 'Já existe um usuário cadastrado com este e-mail.' });
      }

      const novoUsuario = await Usuario.create({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
      });

      return res.status(201).json(novoUsuario);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao cadastrar usuário.',
        detalhe: (error as Error).message,
      });
    }
  }

  //atualiza as informações do usuário
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const { nome, email } = req.body ?? {};

      if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !email ||
        typeof email !== 'string' ||
        !emailRegex.test(email.trim())
      ) {
        return res.status(400).json({ erro: 'Informe um e-mail válido.' });
      }

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const emailEmUso = await Usuario.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (emailEmUso && emailEmUso.id !== id) {
        return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
      }

      usuario.nome = nome.trim();
      usuario.email = email.trim().toLowerCase();
      await usuario.save();

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao atualizar usuário.',
        detalhe: (error as Error).message,
      });
    }
  }

  // exclui usuário
  public static async delete(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ erro: 'O ID informado deve ser um número válido.' });
    }

    const transacao = await sequelize.transaction();

    try {
      const usuario = await Usuario.findByPk(id, { transaction: transacao });
      if (!usuario) {
        await transacao.rollback();
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const presencas = await Presenca.findAll({
        where: { usuarioId: id },
        transaction: transacao,
      });

      for (const presenca of presencas) {
        await Evento.increment('vagasDisponiveis', {
          by: 1,
          where: { id: presenca.eventoId },
          transaction: transacao,
        });
      }

      await usuario.destroy({ transaction: transacao });
      await transacao.commit();

      return res
        .status(200)
        .json({ mensagem: 'Usuário excluído com sucesso.' });
    } catch (error) {
      await transacao.rollback();
      return res.status(500).json({
        erro: 'Erro ao excluir usuário.',
        detalhe: (error as Error).message,
      });
    }
  }
}
