const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InstructorsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const instructors = await db.instructors.create(
      {
        id: data.id || undefined,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await instructors.setUser(data.user || null, {
      transaction,
    });

    await instructors.setCourses(data.courses || [], {
      transaction,
    });

    return instructors;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const instructorsData = data.map((item, index) => ({
      id: item.id || undefined,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const instructors = await db.instructors.bulkCreate(instructorsData, {
      transaction,
    });

    // For each item created, replace relation files

    return instructors;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const instructors = await db.instructors.findByPk(id, {}, { transaction });

    const updatePayload = {};

    updatePayload.updatedById = currentUser.id;

    await instructors.update(updatePayload, { transaction });

    if (data.user !== undefined) {
      await instructors.setUser(
        data.user,

        { transaction },
      );
    }

    if (data.courses !== undefined) {
      await instructors.setCourses(data.courses, { transaction });
    }

    return instructors;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const instructors = await db.instructors.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of instructors) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of instructors) {
        await record.destroy({ transaction });
      }
    });

    return instructors;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const instructors = await db.instructors.findByPk(id, options);

    await instructors.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await instructors.destroy({
      transaction,
    });

    return instructors;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const instructors = await db.instructors.findOne(
      { where },
      { transaction },
    );

    if (!instructors) {
      return instructors;
    }

    const output = instructors.get({ plain: true });

    output.user = await instructors.getUser({
      transaction,
    });

    output.courses = await instructors.getCourses({
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
        model: db.users,
        as: 'user',

        where: filter.user
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.user
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.user
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.courses,
        as: 'courses',
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

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.courses) {
        const searchTerms = filter.courses.split('|');

        include = [
          {
            model: db.courses,
            as: 'courses_filter',
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
                        title: {
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
      const { rows, count } = await db.instructors.findAndCountAll(
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
          Utils.ilike('instructors', 'user', query),
        ],
      };
    }

    const records = await db.instructors.findAll({
      attributes: ['id', 'user'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['user', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.user,
    }));
  }
};
