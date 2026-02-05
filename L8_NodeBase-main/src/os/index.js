const os = require('os');

function printOsInfo() {
  console.log('--- Информация об операционной системе ---');
  console.log('Платформа:', os.platform());
  console.log('Архитектура:', os.arch());
  console.log('Всего памяти (GB):', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
  console.log('Свободная память (GB):', (os.freemem() / 1024 / 1024 / 1024).toFixed(2));
  console.log('Домашняя директория:', os.homedir());
  console.log('Имя хоста:', os.hostname());
  console.log('Интерфейсы сети:', os.networkInterfaces());
  console.log('-----------------------------------------');
}

function hasMoreThan4GbFree() {
  const freeGb = os.freemem() / 1024 / 1024 / 1024;
  return freeGb > 4;
}

function securePrintOsInfo() {
  const { MODE } = process.env;

  if (MODE === 'admin') {
    printOsInfo();
  } else {
    console.log('Недостаточно прав. Доступ к детальной информации об ОС только в режиме admin.');
  }
}

module.exports = {
  printOsInfo,
  hasMoreThan4GbFree,
  securePrintOsInfo,
};

