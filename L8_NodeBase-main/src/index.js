function printStudentInfo() {
  const { FIRST_NAME, LAST_NAME, GROUP, LIST_NUMBER, MODE } = process.env;

  console.log('--- Информация о студенте ---');
  console.log(`Имя: ${FIRST_NAME}`);
  console.log(`Фамилия: ${LAST_NAME}`);
  console.log(`Группа: ${GROUP}`);
  console.log(`Номер по списку: ${LIST_NUMBER}`);
  console.log(`Режим доступа (MODE): ${MODE}`);
  console.log('------------------------------');
}

printStudentInfo();

