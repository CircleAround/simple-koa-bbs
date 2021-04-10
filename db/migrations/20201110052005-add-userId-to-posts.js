'use strict';

const fkName = 'user_id_posts_fk'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('posts', 'user_id', { 
      type: Sequelize.INTEGER,
      allowNull: false
    })
    await queryInterface.addConstraint('posts', { 
      fields: ['user_id'], 
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
    await queryInterface.removeColumn('posts', 'user_id')
  }
};
