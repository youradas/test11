const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class EnrollmentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const enrollments = await db.enrollments.create(
      {
        id: data.id || undefined,

        payment_status: data.payment_status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await enrollments.setStudent(data.student || null, {
      transaction,
    });

    await enrollments.setCourse(data.course || null, {
      transaction,
    });

    return enrollments;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const enrollmentsData = data.map((item, index) => ({
      id: item.id || undefined,

      payment_status: item.payment_status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const enrollments = await db.enrollments.bulkCreate(enrollmentsData, {
      transaction,
    });

    // For each item created, replace relation files

    return enrollments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const enrollments = await db.enrollments.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.payment_status !== undefined)
      updatePayload.payment_status = data.payment_status;

    updatePayload.updatedById = currentUser.id;

    await enrollments.update(updatePayload, { transaction });

    if (data.student !== undefined) {
      await enrollments.setStudent(
        data.student,

        { transaction },
      );
    }

    if (data.course !== undefined) {
      await enrollments.setCourse(
        data.course,

        { transaction },
      );
    }

    return enrollments;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const enrollments = await db.enrollments.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of enrollments) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of enrollments) {
        await record.destroy({ transaction });
      }
    });

    return enrollments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const enrollments = await db.enrollments.findByPk(id, options);

    await enrollments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await enrollments.destroy({
      transaction,
    });

    return enrollments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const enrollments = await db.enrollments.findOne(
      { where },
      { transaction },
    );

    if (!enrollments) {
      return enrollments;
    }

    const output = enrollments.get({ plain: true });

    output.student = await enrollments.getStudent({
      transaction,
    });

    output.course = await enrollments.getCourse({
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
        model: db.students,
        as: 'student',

        where: filter.student
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.student
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  user: {
                    [Op.or]: filter.student
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

      if (filter.payment_status) {
        where = {
          ...where,
          payment_status: filter.payment_status,
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
      const { rows, count } = await db.enrollments.findAndCountAll(
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
          Utils.ilike('enrollments', 'student', query),
        ],
      };
    }

    const records = await db.enrollments.findAll({
      attributes: ['id', 'student'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['student', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.student,
    }));
  }
};
