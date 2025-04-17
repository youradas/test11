const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Discussion_boardsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const discussion_boards = await db.discussion_boards.create(
      {
        id: data.id || undefined,

        topic: data.topic || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await discussion_boards.setCourse(data.course || null, {
      transaction,
    });

    await discussion_boards.setPosts(data.posts || [], {
      transaction,
    });

    return discussion_boards;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const discussion_boardsData = data.map((item, index) => ({
      id: item.id || undefined,

      topic: item.topic || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const discussion_boards = await db.discussion_boards.bulkCreate(
      discussion_boardsData,
      { transaction },
    );

    // For each item created, replace relation files

    return discussion_boards;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const discussion_boards = await db.discussion_boards.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.topic !== undefined) updatePayload.topic = data.topic;

    updatePayload.updatedById = currentUser.id;

    await discussion_boards.update(updatePayload, { transaction });

    if (data.course !== undefined) {
      await discussion_boards.setCourse(
        data.course,

        { transaction },
      );
    }

    if (data.posts !== undefined) {
      await discussion_boards.setPosts(data.posts, { transaction });
    }

    return discussion_boards;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const discussion_boards = await db.discussion_boards.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of discussion_boards) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of discussion_boards) {
        await record.destroy({ transaction });
      }
    });

    return discussion_boards;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const discussion_boards = await db.discussion_boards.findByPk(id, options);

    await discussion_boards.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await discussion_boards.destroy({
      transaction,
    });

    return discussion_boards;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const discussion_boards = await db.discussion_boards.findOne(
      { where },
      { transaction },
    );

    if (!discussion_boards) {
      return discussion_boards;
    }

    const output = discussion_boards.get({ plain: true });

    output.posts_discussion_board =
      await discussion_boards.getPosts_discussion_board({
        transaction,
      });

    output.course = await discussion_boards.getCourse({
      transaction,
    });

    output.posts = await discussion_boards.getPosts({
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
        model: db.courses,
        as: 'course',

        where: filter.course
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.course
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  title: {
                    [Op.or]: filter.course
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.posts,
        as: 'posts',
        required: false,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.topic) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('discussion_boards', 'topic', filter.topic),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.posts) {
        const searchTerms = filter.posts.split('|');

        include = [
          {
            model: db.posts,
            as: 'posts_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        content: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
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
      const { rows, count } = await db.discussion_boards.findAndCountAll(
        queryOptions,
      );

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
          Utils.ilike('discussion_boards', 'topic', query),
        ],
      };
    }

    const records = await db.discussion_boards.findAll({
      attributes: ['id', 'topic'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['topic', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.topic,
    }));
  }
};
