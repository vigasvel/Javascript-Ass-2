const day = (n) => new Date(Date.now() + n * 864e5);
module.exports = [
  { title: 'Finish MERN assignment II', description: 'Task manager + appointment booking app', subject: 'JavaScript Frameworks', priority: 'High', status: 'In Progress', dueDate: day(6) },
  { title: 'Compiler Design unit 3 notes', description: 'LR parsing, SLR table construction', subject: 'Compiler Design', priority: 'Medium', status: 'Pending', dueDate: day(3) },
  { title: 'Submit lab record', description: 'Get signature for experiments 1-6', subject: 'Full Stack Lab', priority: 'High', status: 'Pending', dueDate: day(-1) },
  { title: 'Practice aptitude – 20 questions', subject: 'Placement', priority: 'Low', status: 'Pending', dueDate: day(2) },
  { title: 'Read paper on Transformers', description: 'Attention Is All You Need', subject: 'Self Study', priority: 'Low', status: 'In Progress' },
  { title: 'Cloud computing quiz', subject: 'Cloud Computing', priority: 'Medium', status: 'Completed', dueDate: day(-3) },
];
