import '../utils/env';
import * as userS from '../services/user';

; (async function () {
  await userS.addItem({
    account: 'userX',
    password: '123456',
    status: 1,
    name: '管理员',
    isAdmin: false,
    email: 'userX@userX.com',
    phone: '',
    readonly: true
  });

//   console.info('res:', JSON.stringify(res));
})();
