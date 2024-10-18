import '../utils/env';
import * as userS from '../services/user';

; (async function () {
  await userS.addItem({
    account: 'admin',
    password: 'admin',
    status: 1,
    name: '管理员',
    isAdmin: true,
    email: 'admin@admin.com',
  });

//   console.info('res:', JSON.stringify(res));
})();
