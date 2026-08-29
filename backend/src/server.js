const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Shell SSW status backend running on port ${PORT}`);
});
