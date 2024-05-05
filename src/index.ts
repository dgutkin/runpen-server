import app from './server';

const PORT = process.env.PORT || 8080;

app.listen(
    PORT, 
    function () {
      console.log(`runPen back-end listening on port ${PORT}!`);
    }
);
