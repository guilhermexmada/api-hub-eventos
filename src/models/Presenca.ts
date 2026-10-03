import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PresencaAttributes {
  id: number;
  usuarioId: number;
  eventoId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PresencaCreationAttributes = Optional<
  PresencaAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Presenca
  extends Model<PresencaAttributes, PresencaCreationAttributes>
  implements PresencaAttributes
{
  declare id: number;
  declare usuarioId: number;
  declare eventoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Presenca.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
    },
    eventoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'eventos', key: 'id' },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'presencas',
    timestamps: true,
  },
);
