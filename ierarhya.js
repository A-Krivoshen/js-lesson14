'user strict';
console.log('3.2 Иерархия прототипов и наследование');

class Calendar {
  constructor(now = new Date()) {
    this.now = now;
  }

  setDate(now) {
    this.now = now;
  }

  get today() {
    return this.now.toLocaleString('ru-Ru');
  }
}

class PaymentTerminal {
  constructor(title, calendar) {
    this.title = title;
    this.calendar = calendar;
  }

  get status() {
    return this.isActive ? 'работает' : 'недоступен';
  }

  get isActive() {
    return this.checkActive();
  }

  checkActive() {
    return false;
  }
}

class RegistrationError extends Error {
  constructor(field = null) {
    super(`Ошибка в поле ${field}`);
    this.field = field;
  }
}

class NotValidEmailRegistrationError extends RegistrationError {
  constructor(field, email) {
    super(field);
    this.email = email;
  }
}

class NotUniqueRegistrationError extends RegistrationError {
  constructor(field, value) {
    super(field);
    this.value = value;
  }
}

class NotSameRegistrationError extends RegistrationError {}

function isValidEmail(email) {
  return /^\w+(\.\w+)*@\w+(\.\w+)+$/i.test(email);
}

function isUniqueLogin(login) {
  return !['admin', 'boss'].includes(login);
}

function checkPassword(original, copy) {
  return original === copy;
}

function registerNewUser(data) {
  if (!isValidEmail(data.email)) {
    throw new NotValidEmailRegistrationError('Адрес электронной почты', data.email);
  }
  if (!isUniqueLogin(data.login)) {
    throw new NotUniqueRegistrationError('Логин', data.login);
  }
  if (!checkPassword(data.password, data.passwordCopy)) {
    throw new NotSameRegistrationError('Пароль');
  }
}

console.log('задание 1');

 class SpaceDate extends Date {
   copy () {
     return new SpaceDate(this);
   }
   
   getNextDate() {
     var day = this.copy();
     return new SpaceDate(day.setDate(this.getDate() + 1));
   }
   getPrevDate() {
     var day = this.copy();
     return new SpaceDate(day.setDate(this.getDate() - 1));
   }
   getDayBeginning() {
     var day = this.copy();
     return new SpaceDate(day.setHours(0,0,0,0));
   }
   getDayEnd() {
     var day = this.copy();
     return new SpaceDate(day.setHours(23,59,59,999));
   }
 }
 
let dateOriginal = new SpaceDate(2017, 1, 22);
let dateCopy = dateOriginal.copy();
dateCopy.setYear(2022);
console.log(`Оригинальная дата: ${dateOriginal.toLocaleDateString('ru-Ru')}`);
console.log(`Измененная копия: ${dateCopy.toLocaleDateString('ru-Ru')}`);

let orderDate = new SpaceDate(2017, 2, 10);
let deliveryDate = orderDate.getNextDate();
console.log(`Дата заказа: ${orderDate.toLocaleDateString('ru-Ru')}`);
console.log(`Дата доставки: ${deliveryDate.toLocaleDateString('ru-Ru')}`);

let supplyDate = new SpaceDate(2017, 3, 3);
let requestDate = supplyDate.getPrevDate();
console.log(`Дата поставки: ${supplyDate.toLocaleDateString('ru-Ru')}`);
console.log(`Дата заявки поставщику: ${requestDate.toLocaleDateString('ru-Ru')}`);

let someDate = new SpaceDate(2017, 2, 10, 12, 44);
let from = someDate.getDayBeginning();
let to = someDate.getDayEnd();
console.log(`В любое время с ${from.toLocaleString('ru-Ru')} по ${to.toLocaleString('ru-Ru')}`);

console.log('задание 2');
 class AllDayPaymentTerminal extends PaymentTerminal {
   checkActive() {
     return true;
   }
 }
 
 class AllDayExceptHolidaysPaymentTerminal extends PaymentTerminal {
   constructor (title,calendar,holidays) {
     super (title,calendar);
     this.holidays = holidays;
   }
   checkActive() {
     var today = this.calendar.now;
     for (var item of holidays) {
       if (today.getDate() === item.date && today.getMonth() === item.month){
         return false;
       }
       } return true;
    }
  }
 
 class WorkspacePaymentTerminal extends PaymentTerminal {
   checkActive() {
     var today = this.calendar.now;
     if (today.getDate() === 0 || today.getDate() === 6) {
       return false;
     } else if (today.getHours() < 8 || today.getHours() >= 18) {
       return false;
     } else {
       return true;
     }
   }
 }
 
 const holidays = [
  { date: 11, month: 3 - 1 },
  { date: 23, month: 2 - 1 }
];

const calendar = new Calendar();
const terminals = [
  new WorkspacePaymentTerminal('Терминал в офисе Убербанка', calendar),
  new AllDayPaymentTerminal('Терминал в аэропорту', calendar),
  new AllDayExceptHolidaysPaymentTerminal('Терминал в торговом центре',
    calendar, holidays)
];

function showTerminals(date) {
  if (date !== undefined) {
    calendar.setDate(date);
  }
  console.log(calendar.today);
  terminals
    .filter(terminal => terminal instanceof PaymentTerminal)
    .forEach(terminal => console.log(`${terminal.title} ${terminal.status}`));
}

showTerminals(new Date(2017, 2 - 1, 23));
showTerminals(new Date(2017, 3 - 1, 11));
showTerminals(new Date(2017, 3 - 1, 14, 18, 1));
showTerminals(new Date(2017, 3 - 1, 14, 8, 3));

console.log('задание 3');

function handleRegistration(data) {
  try {
    registerNewUser(data);
    console.log('Пользователь успешно зарегистрирован');
  } catch (err) {
    if (err instanceof NotValidEmailRegistrationError) {
      console.log(`${err.email} не является адресом электронной почты`);
    } else if (err instanceof NotUniqueRegistrationError) {
      console.log(`Пользователь с логином ${err.value} уже зарегистрирован`);
    } else if (err instanceof NotSameRegistrationError) {
      console.log('Введенные пароли не совпадают');
    }
  }
}

const notValidEmailUser = { email: 'test' };
handleRegistration(notValidEmailUser);

const notUniqueLoginUser = { email: 'test@test.co', login: 'boss' };
handleRegistration(notUniqueLoginUser);

const differentPwUser = { email: 'test@test.co', login: 'ivan',
  password: '123', passwordCopy: '456' };
handleRegistration(differentPwUser);

const normalUser = { email: 'test@test.co', login: 'ivan', password: '123', passwordCopy: '123' };
handleRegistration(normalUser);
