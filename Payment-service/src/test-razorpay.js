import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('Testing Razorpay credentials...');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID);

razorpay.orders.create({
  amount: 50000,
  currency: 'INR',
  receipt: 'test_receipt',
  notes: { test: 'test' }
})
.then(order => {
  console.log('✅ SUCCESS! Razorpay is working');
  console.log('Order:', order);
  process.exit(0);
})
.catch(error => {
  console.error('❌ FAILED! Razorpay error:');
  console.error('Message:', error.message);
  console.error('Description:', error.description);
  console.error('Error:', error.error);
  console.error('StatusCode:', error.statusCode);
  process.exit(1);
});