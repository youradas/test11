const db = require('../models');
const Users = db.users;

const Analytics = db.analytics;

const Courses = db.courses;

const DiscussionBoards = db.discussion_boards;

const Enrollments = db.enrollments;

const Instructors = db.instructors;

const Posts = db.posts;

const Students = db.students;

const AnalyticsData = [
  {
    // type code here for "relation_one" field

    student_engagement: 85,

    completion_rate: 90,

    instructor_performance: 88,
  },

  {
    // type code here for "relation_one" field

    student_engagement: 78,

    completion_rate: 80,

    instructor_performance: 85,
  },

  {
    // type code here for "relation_one" field

    student_engagement: 92,

    completion_rate: 95,

    instructor_performance: 90,
  },

  {
    // type code here for "relation_one" field

    student_engagement: 80,

    completion_rate: 85,

    instructor_performance: 87,
  },
];

const CoursesData = [
  {
    title: 'Introduction to Programming',

    description: 'Learn the basics of programming with Python.',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field
  },

  {
    title: 'Advanced Data Structures',

    description: 'Explore complex data structures and algorithms.',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field
  },

  {
    title: 'Web Development Bootcamp',

    description: 'Full-stack web development with React and Node.js.',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field
  },

  {
    title: 'Machine Learning Essentials',

    description: 'Introduction to machine learning concepts and techniques.',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field
  },
];

const DiscussionBoardsData = [
  {
    // type code here for "relation_one" field

    topic: 'Python Basics',

    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field

    topic: 'Algorithm Optimization',

    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field

    topic: 'React Components',

    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field

    topic: 'Supervised Learning',

    // type code here for "relation_many" field
  },
];

const EnrollmentsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    payment_status: 'completed',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    payment_status: 'failed',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    payment_status: 'pending',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    payment_status: 'pending',
  },
];

const InstructorsData = [
  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
  },
];

const PostsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    content: 'I found the loops section very helpful.',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    content: 'Can someone explain dynamic programming?',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    content: 'How do you manage state in React?',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    content: 'What are the best practices for feature selection?',
  },
];

const StudentsData = [
  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field
    // type code here for "relation_many" field
    // type code here for "relation_many" field
  },
];

// Similar logic for "relation_many"

async function associateAnalyticWithCourse() {
  const relatedCourse0 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Analytic0 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Analytic0?.setCourse) {
    await Analytic0.setCourse(relatedCourse0);
  }

  const relatedCourse1 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Analytic1 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Analytic1?.setCourse) {
    await Analytic1.setCourse(relatedCourse1);
  }

  const relatedCourse2 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Analytic2 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Analytic2?.setCourse) {
    await Analytic2.setCourse(relatedCourse2);
  }

  const relatedCourse3 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Analytic3 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Analytic3?.setCourse) {
    await Analytic3.setCourse(relatedCourse3);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateDiscussionBoardWithCourse() {
  const relatedCourse0 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const DiscussionBoard0 = await DiscussionBoards.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (DiscussionBoard0?.setCourse) {
    await DiscussionBoard0.setCourse(relatedCourse0);
  }

  const relatedCourse1 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const DiscussionBoard1 = await DiscussionBoards.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (DiscussionBoard1?.setCourse) {
    await DiscussionBoard1.setCourse(relatedCourse1);
  }

  const relatedCourse2 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const DiscussionBoard2 = await DiscussionBoards.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (DiscussionBoard2?.setCourse) {
    await DiscussionBoard2.setCourse(relatedCourse2);
  }

  const relatedCourse3 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const DiscussionBoard3 = await DiscussionBoards.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (DiscussionBoard3?.setCourse) {
    await DiscussionBoard3.setCourse(relatedCourse3);
  }
}

// Similar logic for "relation_many"

async function associateEnrollmentWithStudent() {
  const relatedStudent0 = await Students.findOne({
    offset: Math.floor(Math.random() * (await Students.count())),
  });
  const Enrollment0 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Enrollment0?.setStudent) {
    await Enrollment0.setStudent(relatedStudent0);
  }

  const relatedStudent1 = await Students.findOne({
    offset: Math.floor(Math.random() * (await Students.count())),
  });
  const Enrollment1 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Enrollment1?.setStudent) {
    await Enrollment1.setStudent(relatedStudent1);
  }

  const relatedStudent2 = await Students.findOne({
    offset: Math.floor(Math.random() * (await Students.count())),
  });
  const Enrollment2 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Enrollment2?.setStudent) {
    await Enrollment2.setStudent(relatedStudent2);
  }

  const relatedStudent3 = await Students.findOne({
    offset: Math.floor(Math.random() * (await Students.count())),
  });
  const Enrollment3 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Enrollment3?.setStudent) {
    await Enrollment3.setStudent(relatedStudent3);
  }
}

async function associateEnrollmentWithCourse() {
  const relatedCourse0 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Enrollment0 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Enrollment0?.setCourse) {
    await Enrollment0.setCourse(relatedCourse0);
  }

  const relatedCourse1 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Enrollment1 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Enrollment1?.setCourse) {
    await Enrollment1.setCourse(relatedCourse1);
  }

  const relatedCourse2 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Enrollment2 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Enrollment2?.setCourse) {
    await Enrollment2.setCourse(relatedCourse2);
  }

  const relatedCourse3 = await Courses.findOne({
    offset: Math.floor(Math.random() * (await Courses.count())),
  });
  const Enrollment3 = await Enrollments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Enrollment3?.setCourse) {
    await Enrollment3.setCourse(relatedCourse3);
  }
}

async function associateInstructorWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Instructor0 = await Instructors.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Instructor0?.setUser) {
    await Instructor0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Instructor1 = await Instructors.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Instructor1?.setUser) {
    await Instructor1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Instructor2 = await Instructors.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Instructor2?.setUser) {
    await Instructor2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Instructor3 = await Instructors.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Instructor3?.setUser) {
    await Instructor3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

async function associatePostWithDiscussion_board() {
  const relatedDiscussion_board0 = await DiscussionBoards.findOne({
    offset: Math.floor(Math.random() * (await DiscussionBoards.count())),
  });
  const Post0 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Post0?.setDiscussion_board) {
    await Post0.setDiscussion_board(relatedDiscussion_board0);
  }

  const relatedDiscussion_board1 = await DiscussionBoards.findOne({
    offset: Math.floor(Math.random() * (await DiscussionBoards.count())),
  });
  const Post1 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Post1?.setDiscussion_board) {
    await Post1.setDiscussion_board(relatedDiscussion_board1);
  }

  const relatedDiscussion_board2 = await DiscussionBoards.findOne({
    offset: Math.floor(Math.random() * (await DiscussionBoards.count())),
  });
  const Post2 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Post2?.setDiscussion_board) {
    await Post2.setDiscussion_board(relatedDiscussion_board2);
  }

  const relatedDiscussion_board3 = await DiscussionBoards.findOne({
    offset: Math.floor(Math.random() * (await DiscussionBoards.count())),
  });
  const Post3 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Post3?.setDiscussion_board) {
    await Post3.setDiscussion_board(relatedDiscussion_board3);
  }
}

async function associatePostWithAuthor() {
  const relatedAuthor0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post0 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Post0?.setAuthor) {
    await Post0.setAuthor(relatedAuthor0);
  }

  const relatedAuthor1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post1 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Post1?.setAuthor) {
    await Post1.setAuthor(relatedAuthor1);
  }

  const relatedAuthor2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post2 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Post2?.setAuthor) {
    await Post2.setAuthor(relatedAuthor2);
  }

  const relatedAuthor3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post3 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Post3?.setAuthor) {
    await Post3.setAuthor(relatedAuthor3);
  }
}

async function associateStudentWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Student0 = await Students.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Student0?.setUser) {
    await Student0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Student1 = await Students.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Student1?.setUser) {
    await Student1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Student2 = await Students.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Student2?.setUser) {
    await Student2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Student3 = await Students.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Student3?.setUser) {
    await Student3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Analytics.bulkCreate(AnalyticsData);

    await Courses.bulkCreate(CoursesData);

    await DiscussionBoards.bulkCreate(DiscussionBoardsData);

    await Enrollments.bulkCreate(EnrollmentsData);

    await Instructors.bulkCreate(InstructorsData);

    await Posts.bulkCreate(PostsData);

    await Students.bulkCreate(StudentsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateAnalyticWithCourse(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateDiscussionBoardWithCourse(),

      // Similar logic for "relation_many"

      await associateEnrollmentWithStudent(),

      await associateEnrollmentWithCourse(),

      await associateInstructorWithUser(),

      // Similar logic for "relation_many"

      await associatePostWithDiscussion_board(),

      await associatePostWithAuthor(),

      await associateStudentWithUser(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('analytics', null, {});

    await queryInterface.bulkDelete('courses', null, {});

    await queryInterface.bulkDelete('discussion_boards', null, {});

    await queryInterface.bulkDelete('enrollments', null, {});

    await queryInterface.bulkDelete('instructors', null, {});

    await queryInterface.bulkDelete('posts', null, {});

    await queryInterface.bulkDelete('students', null, {});
  },
};
