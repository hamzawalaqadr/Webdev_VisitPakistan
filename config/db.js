const mongoose = require('mongoose');
const uri = 'mongodb+srv://hamzawq:PXUsHSIruVbztWtQ@cluster0.zvk1ffv.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed');
    process.exit(1);
  }
};

module.exports = connectDB;