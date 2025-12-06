// Helper script to URL encode MongoDB password
// Usage: node encode-password.js "YourPasswordHere"

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 MongoDB Password URL Encoder\n');
console.log('Enter your MongoDB password (it will be hidden):\n');

// Hide password input
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

let password = '';
let masked = '';

process.stdin.on('data', (char) => {
  char = char.toString();

  switch (char) {
    case '\n':
    case '\r':
    case '\u0004': // Ctrl+D
      process.stdin.setRawMode(false);
      process.stdin.pause();
      console.log('\n');
      
      if (password.length === 0) {
        console.log('❌ Password cannot be empty');
        process.exit(1);
      }
      
      // URL encode the password
      const encoded = encodeURIComponent(password);
      
      console.log('\n✅ Encoded Password:');
      console.log('─────────────────────────────────────');
      console.log(encoded);
      console.log('─────────────────────────────────────\n');
      
      console.log('📝 Update your .env file:');
      console.log(`MONGODB_URI=mongodb+srv://amitk73262_db_user:${encoded}@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority\n`);
      
      process.exit(0);
      break;
    
    case '\u0003': // Ctrl+C
      process.exit(0);
      break;
    
    case '\u007f': // Backspace
      if (password.length > 0) {
        password = password.slice(0, -1);
        masked = '*'.repeat(password.length);
        process.stdout.write('\r' + ' '.repeat(50) + '\r' + 'Password: ' + masked);
      }
      break;
    
    default:
      password += char;
      masked = '*'.repeat(password.length);
      process.stdout.write('\r' + ' '.repeat(50) + '\r' + 'Password: ' + masked);
      break;
  }
});

// Alternative: Direct encoding if password provided as argument
if (process.argv[2]) {
  const password = process.argv[2];
  const encoded = encodeURIComponent(password);
  
  console.log('\n✅ Encoded Password:');
  console.log('─────────────────────────────────────');
  console.log(encoded);
  console.log('─────────────────────────────────────\n');
  
  console.log('📝 Update your .env file:');
  console.log(`MONGODB_URI=mongodb+srv://amitk73262_db_user:${encoded}@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority\n`);
  
  process.exit(0);
}

