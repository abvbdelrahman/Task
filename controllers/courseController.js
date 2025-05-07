const Course = require('./../models/courseModel');
const AppError = require('./../utils/AppError');
const CatchAsync = require('./../utils/CatchAsync');

exports.getAllCourses = CatchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find().skip(skip).limit(limit);
  
  if (!courses.length) {
    return next(new AppError('No courses found!', 404));
  }

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: courses
  });
});

exports.getCourse = CatchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return next(new AppError('Course not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: course
  });
});

exports.addCourse = CatchAsync(async (req, res, next) => {
  const newCourse = await Course.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newCourse
  });
});

exports.updateCourse = CatchAsync(async (req, res, next) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedCourse) {
    return next(new AppError('Course not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedCourse
  });
});

exports.deleteCourse = CatchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return next(new AppError('Course not found!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

