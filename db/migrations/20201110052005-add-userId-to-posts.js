'use strict';

const fkName = 'userId_Posts_fk'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('posts', 'userId', { 
      type: Sequelize.INTEGER,
      allowNull: false
    })
    await queryInterface.addConstraint('posts', { 
      fields: ['userId'], 
      type: 'foreign key',
      name: fkName,
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('posts', fkName)
    await queryInterface.removeIndex('posts', fkName)
    await queryInterface.removeColumn('posts', 'userId')
  }
};
