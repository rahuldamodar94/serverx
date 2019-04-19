require('./config/connection');
require('./config/settings');
var app = require('./routes/routes');

// Server running at port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
