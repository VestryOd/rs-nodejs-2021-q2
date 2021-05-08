process.on('exit', code => {
    return console.log(`Exit with code ${code}`);
  });
  
  process.on('uncaughtException', (err) => {
    console.error(err);
    process.exit(1);
  });
  
  const argv = require('minimist')(process.argv.slice(2));
  const { input, i, output, o, shift, s, action, a } = argv;
  const AppTool = require('./src/AppTool');
  
  const tool = new AppTool({
    input: input || i,
    output: output || o,
    shift: shift || s,
    action: action || a,
  });
  
  tool.render();