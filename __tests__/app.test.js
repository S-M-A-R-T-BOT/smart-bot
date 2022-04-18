const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const LoginService = require('../lib/services/LoginService');

const mockUser = {
  username: 'tester',
  password: 'guest',
  phoneNumber: 1234567890,
  email: 'test@demo.com'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await LoginService.create({ ...mockUser, ...userProps });

  const { username } = user;
  await agent.post('/api/v1/login').send({ username, password });
  return [agent, user];
};

describe('stock-bot routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user, redirect to main page', async () => {
    const agent = request.agent(app);

    const res  = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);

    console.log('|| res.body >', res.body);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
    // const { username, phoneNumber, email } = mockUser;

    
  });

  it.only('logs user in and adds stock to watchlist', async () => {
    const [agent] = await registerAndLogin();

    const res = await agent
      // .post(`/api/v1/stocks/${ticker}`)
      .post('/api/v1/stocks/AAPL')
      .send({
        name: 'Test, Inc',
        ticker: 'TST'
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Test, Inc',
      ticker: 'TST'
    });
  });





});
