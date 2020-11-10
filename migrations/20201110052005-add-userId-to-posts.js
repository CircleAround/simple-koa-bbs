'use strict';

const fkName = 'userId_Posts_fk'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'userId', { 
      type: Sequelize.INTEGER,
      allowNull: false
    })
    await queryInterface.addConstraint('Posts', { 
      fields: ['userId'], 
      type: 'foreign key',
      name: fkName,
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Posts', fkName)
    await queryInterface.removeIndex('Posts', fkName)
    await queryInterface.removeColumn('Posts', 'userId')
  }
};
