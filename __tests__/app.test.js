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

  // it('creates a new user', async () => {
  //   const res = await request(app)
  //     .post('/api/v1/login')
  //     .send(mockUser);
  //   const { username, phoneNumber, email } = mockUser;

  //   expect(res.body).toEqual({
  //     id: expect.any(String),
  //     username,
  //     phoneNumber,
  //     email
  //   });
  // });

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

  // it('login and redirect', async () => {
  //   //login user
  //   const agent = request(app);

  //   const res = await agent
  //     .get('/api/v1/login')
  //     .send(mockUser)
  //     .redirects(1);

  // }); 

  // it('fetches an array of all stocks, randomly chooses one, displays values, refresh periodically', async () => {
  //   //login user
  //   const agent = request(app);

  //   const res = await agent
  //     .get('/api/v1/')

  // }); 

});
