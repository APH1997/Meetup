'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId',
        as: 'Venue',
        // onDelete: 'CASCADE',
        // hooks: true
      })
      Venue.belongsToMany(models.Group, {
        through: 'Event',
        foreignKey: 'venueId',
        otherKey: 'groupId',
        // onDelete: 'CASCADE',
        // hooks: true
      })
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Venue.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups'
      },
      onDelete: 'SET NULL',
      hooks: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(9,7),
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      validate: {
        min: -180,
        max: 180
      }
    },
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
