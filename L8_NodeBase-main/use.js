const { fetchData } = require('./src/utils/fetchData');
const { sortStringsIgnoreSpaces } = require('./src/utils/sortStrings');
const fsModule = require('./src/utils/fsModule');

async function main() {
  // 1. Загрузка пользователей
  const { data: users, isLoading, error } = await fetchData(
    'https://jsonplaceholder.typicode.com/users'
  );

  if (error) {
    console.error('Ошибка загрузки пользователей:', error.message || error);
    return;
  }

  if (isLoading) {
    console.log('Данные ещё загружаются...');
    return;
  }

  // 2. Сортировка по именам (name)
  const names = users.map((u) => u.name);
  const sortedNames = sortStringsIgnoreSpaces(names);

  // Привязываем отсортированные имена к пользователям
  const sortedUsers = [...users].sort((a, b) => {
    const aNorm = a.name.replace(/\s+/g, '').toLowerCase();
    const bNorm = b.name.replace(/\s+/g, '').toLowerCase();

    if (aNorm < bNorm) return -1;
    if (aNorm > bNorm) return 1;
    return 0;
  });

  // 3. Создание структуры папок и файлов users/names.txt, users/emails.txt
  await fsModule.createDirAsyncCustom('users');

  const namesContent = sortedUsers.map((u) => u.name).join('\n');
  const emailsContent = sortedUsers.map((u) => u.email).join('\n');

  await fsModule.writeFileAsyncCustom('users/names.txt', namesContent);
  await fsModule.writeFileAsyncCustom('users/emails.txt', emailsContent);

  console.log('Файлы users/names.txt и users/emails.txt успешно созданы и заполнены.');
}

main().catch((err) => {
  console.error('Ошибка в use.js:', err);
});

