const Assessment = require('../models/Assessment');
const Submission = require('../models/Submission');

// @desc    Get all assessments for a course
// @route   GET /api/assessments/course/:courseId
// @access  Private
exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ course: req.params.courseId });
    res.status(200).json({ success: true, count: assessments.length, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private/Faculty
exports.createAssessment = async (req, res) => {
  try {
    req.body.faculty = req.user.id;
    // Questions are built dynamically in frontend and passed in req.body.questions
    const assessment = await Assessment.create(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update assessment (For Edit)
// @route   PUT /api/assessments/:id
// @access  Private/Faculty
exports.updateAssessment = async (req, res) => {
  try {
    let assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    if (assessment.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: assessment });
  } catch(error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private/Faculty
exports.deleteAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if(!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
        if(assessment.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await assessment.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// @desc    Submit assessment and check score
// @route   POST /api/assessments/:id/submit
// @access  Private/Student
exports.submitAssessment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assessmentId = req.params.id;
    const { answers } = req.body; 

    const existingSubmission = await Submission.findOne({ assessment: assessmentId, student: studentId }).populate('assessment');
    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'Already attempted', data: existingSubmission, score: existingSubmission.score });
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    let score = 0;
    const evaluatedAnswers = answers.map(ans => {
        const question = assessment.questions.id(ans.questionId);
        const isCorrect = question && question.correctAnswer === ans.answerText;
        if (isCorrect) score += 1;
        return {
            questionId: ans.questionId,
            answerText: ans.answerText
        };
    });

    const submission = await Submission.create({
      assessment: assessmentId,
      student: studentId,
      answers: evaluatedAnswers,
      score: score,
      evaluated: true,
      feedback: `You scored ${score} out of ${assessment.questions.length}`
    });

    res.status(201).json({ success: true, data: submission, score, total: assessment.questions.length });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get submissions for an assessment
// @route   GET /api/assessments/:id/submissions
// @access  Private/Faculty
exports.getSubmissions = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    if (assessment.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const submissions = await Submission.find({ assessment: req.params.id }).populate('student', 'name email');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Evaluate submission (manual override if needed)
// @route   PUT /api/assessments/submissions/:id
// @access  Private/Faculty
exports.evaluateSubmission = async (req, res) => {
  // Manual override logic
  try {
    const { score, feedback } = req.body;
    let submission = await Submission.findById(req.params.id).populate('assessment');
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    submission.score = score;
    submission.feedback = feedback;
    submission.evaluated = true;
    await submission.save();
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
