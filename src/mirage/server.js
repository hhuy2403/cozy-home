import { createServer } from 'miragejs';

export function makeServer() {
  createServer({
    routes() {
      this.namespace = 'api';

      let users = [];

      // Lấy danh sách người dùng
      this.get('/users', () => users);

      // Đăng ký người dùng mới
      this.post('/users', (schema, request) => {
        const newUser = JSON.parse(request.requestBody);
        const existingUser = users.find(user => user.email === newUser.email);
        
        if (existingUser) {
          return new Response(400, {}, { error: 'Email này đã được đăng ký.' });
        }

        newUser.id = Date.now();
        users.push(newUser);
        return newUser;
      });
    },
  });
}