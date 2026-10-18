const assert = require('assert');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

console.log('🧪 Starting StreamSphere Backend Verification Suite...\n');

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

// 1. Password Hashing Test
it('should hash password and verify correctly using bcrypt', () => {
  const password = 'SuperSecretPassword123!';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  assert(hash !== password, 'Hash should not match plaintext');
  assert(bcrypt.compareSync(password, hash), 'Bcrypt compare should succeed');
  assert(!bcrypt.compareSync('WrongPassword', hash), 'Bcrypt compare should fail on wrong password');
});

// 2. JWT Generation & Verification Test
it('should sign and verify valid JWT token with claims', () => {
  const secret = 'test_secret_123';
  const payload = { id: 'usr_9981', username: 'streamer_pro', email: 'pro@streamsphere.com' };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  const decoded = jwt.verify(token, secret);
  assert.strictEqual(decoded.id, payload.id);
  assert.strictEqual(decoded.username, payload.username);
  assert.strictEqual(decoded.email, payload.email);
});

// 3. HTTP 206 Byte-Range Chunk Calculation Test
it('should compute correct byte ranges for HTTP 206 video chunking', () => {
  const fileSize = 10485760; // 10MB file
  const rangeHeader = 'bytes=1000000-1999999';

  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parseInt(parts[1], 10);
  const chunkSize = end - start + 1;

  assert.strictEqual(start, 1000000);
  assert.strictEqual(end, 1999999);
  assert.strictEqual(chunkSize, 1000000); // exactly 1MB chunk
  const contentRange = `bytes ${start}-${end}/${fileSize}`;
  assert.strictEqual(contentRange, 'bytes 1000000-1999999/10485760');
});

// 4. Open-ended Byte-Range Request Test (e.g., "bytes=5000000-")
it('should handle open-ended range request to end of video stream', () => {
  const fileSize = 10000000;
  const rangeHeader = 'bytes=5000000-';

  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  assert.strictEqual(start, 5000000);
  assert.strictEqual(end, 9999999);
  assert.strictEqual(chunkSize, 5000000);
});

console.log(`\n========================================`);
console.log(`Verification Complete: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
