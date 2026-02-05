const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const passwords = Array.from({ length: 13 }, (_, i) => `password_${i + 1}`);

async function hashPasswordWithTiming(password, index) {
  const label = `hash_${index + 1}`;
  const start = Date.now();

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const end = Date.now();
  const duration = end - start;

  console.log(`Пароль #${index + 1} зашифрован за ${duration} мс. Хэш: ${hash}`);

  return { password, hash, duration };
}

async function runBcryptDemo() {
  console.log('--- Начало шифрования 13 паролей ---');

  const results = await Promise.all(
    passwords.map((pwd, index) => hashPasswordWithTiming(pwd, index))
  );

  console.log('--- Итоги по времени ---');
  const durations = results.map((r) => r.duration);
  console.log('Времена (мс):', durations.join(', '));

  console.log('\nКомментарий:');
  console.log(
    'Пароли шифруются асинхронно и параллельно. Разброс по времени связан с планировщиком ОС, ' +
      'количеством потоков в пуле libuv и конкуренцией за ресурсы процессора.'
  );
}

runBcryptDemo().catch((err) => {
  console.error('Ошибка при шифровании паролей:', err);
});

