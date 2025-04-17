const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CoursesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const courses = await db.courses.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        description: data.description || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await courses.setInstructors(data.instructors || [], {
      transaction,
    });

    await courses.setStudents(data.students || [], {
      transaction,
    });

    await courses.setDiscussion_boards(data.discussion_boards || [], {
      transaction,
    });

    return courses;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const coursesData = data.map((item, index) => ({
      id: item.id || undefined,

      title: item.title || null,
      description: item.description || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const courses = await db.courses.bulkCreate(coursesData, { transaction });

    // For each item created, replace relation files

    return courses;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const courses = await db.courses.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.title !== undefined) updatePayload.title = data.title;

    if (data.description !== undefined)
      updatePayload.description = data.description;

    updatePayload.updatedById = currentUser.id;

    await courses.update(updatePayload, { transaction });

    if (data.instructors !== undefined) {
      await courses.setInstructors(data.instructors, { transaction });
    }

    if (data.students !== undefined) {
      await courses.setStudents(data.students, { transaction });
    }

    if (data.discussion_boards !== undefined) {
      await courses.setDiscussion_boards(data.discussion_boards, {
        transaction,
      });
    }

    return courses;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const courses = await db.courses.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of courses) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of courses) {
        await record.destroy({ transaction });
      }
    });

    return courses;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const courses = await db.courses.findByPk(id, options);

    await courses.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await courses.destroy({
      transaction,
    });

    return courses;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const courses = await db.courses.findOne({ where }, { transaction });

    if (!courses) {
      return courses;
    }

    const output = courses.get({ plain: true });

    output.analytics_course = await courses.getAnalytics_course({
      transaction,
    });

    output.discussion_boards_course = await courses.getDiscussion_boards_course(
      {
        transaction,
      },
    );

    output.enrollments_course = await courses.getEnrollments_course({
      transaction,
    });

    output.instructors = await courses.getInstructors({
      transaction,
    });

    output.students = await courses.getStudents({
      transaction,
    });

    output.discussion_boards = await courses.getDiscussion_boards({
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
        as: 'instructors',
        required: false,
      },

      {
        model: db.users,
        as: 'students',
        required: false,
      },

      {
        model: db.discussion_boards,
        as: 'discussion_boards',
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

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('courses', 'title', filter.title),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('courses', 'description', filter.description),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.instructors) {
        const searchTerms = filter.instructors.split('|');

        include = [
          {
            model: db.users,
            as: 'instructors_filter',
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
                        firstName: {
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

      if (filter.students) {
        const searchTerms = filter.students.split('|');

        include = [
          {
            model: db.users,
            as: 'students_filter',
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
                        firstName: {
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

      if (filter.discussion_boards) {
        const searchTerms = filter.discussion_boards.split('|');

        include = [
          {
            model: db.discussion_boards,
            as: 'discussion_boards_filter',
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
                        topic: {
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
      const { rows, count } = await db.courses.findAndCountAll(queryOptions);

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
          Utils.ilike('courses', 'title', query),
        ],
      };
    }

    const records = await db.courses.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};
