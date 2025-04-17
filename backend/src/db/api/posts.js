const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PostsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.create(
      {
        id: data.id || undefined,

        content: data.content || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await posts.setDiscussion_board(data.discussion_board || null, {
      transaction,
    });

    await posts.setAuthor(data.author || null, {
      transaction,
    });

    return posts;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const postsData = data.map((item, index) => ({
      id: item.id || undefined,

      content: item.content || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const posts = await db.posts.bulkCreate(postsData, { transaction });

    // For each item created, replace relation files

    return posts;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.content !== undefined) updatePayload.content = data.content;

    updatePayload.updatedById = currentUser.id;

    await posts.update(updatePayload, { transaction });

    if (data.discussion_board !== undefined) {
      await posts.setDiscussion_board(
        data.discussion_board,

        { transaction },
      );
    }

    if (data.author !== undefined) {
      await posts.setAuthor(
        data.author,

        { transaction },
      );
    }

    return posts;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of posts) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of posts) {
        await record.destroy({ transaction });
      }
    });

    return posts;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findByPk(id, options);

    await posts.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await posts.destroy({
      transaction,
    });

    return posts;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findOne({ where }, { transaction });

    if (!posts) {
      return posts;
    }

    const output = posts.get({ plain: true });

    output.discussion_board = await posts.getDiscussion_board({
      transaction,
    });

    output.author = await posts.getAuthor({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.discussion_boards,
        as: 'discussion_board',

        where: filter.discussion_board
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.discussion_board
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  topic: {
                    [Op.or]: filter.discussion_board
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.users,
        as: 'author',

        where: filter.author
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.author
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.author
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.content) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('posts', 'content', filter.content),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.posts.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit, offset) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('posts', 'content', query),
        ],
      };
    }

    const records = await db.posts.findAll({
      attributes: ['id', 'content'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['content', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.content,
    }));
  }
};
