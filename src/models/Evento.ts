import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface EventoAttributes {
  id: number;
  titulo: string;
  descricao: string | null;
  local: string;
  data: Date;
  vagasTotais: number;
  vagasDisponiveis: number;
  createdAt: Date;
  updatedAt: Date;
}

export type EventoCreationAttributes = Optional<
  EventoAttributes,
  'id' | 'descricao' | 'createdAt' | 'updatedAt'
>;

export class Evento
  extends Model<EventoAttributes, EventoCreationAttributes>
  implements EventoAttributes
{
  declare id: number;
  declare titulo: string;
  declare descricao: string | null;
  declare local: string;
  declare data: Date;
  declare vagasTotais: number;
  declare vagasDisponiveis: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Evento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    local: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    vagasTotais: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vagasDisponiveis: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'eventos',
    timestamps: true,
  },
);
