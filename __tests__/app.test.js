const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const LoginService = require('../lib/services/LoginService');

const mockUser = {
  username: 'tester',
  password: 'guest',
  phoneNumber: '1234567890',
  email: 'test@demo.com'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await LoginService.create({ ...mockUser, ...userProps });

  const { username } = user;
  await (await agent.post('/api/v1/login')).setEncoding({ username, password });
  return [agent, user];
};

describe('stock-bot routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send(mockUser);
    const { username, phoneNumber, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      username,
      phoneNumber,
      email
    });
  });



});
