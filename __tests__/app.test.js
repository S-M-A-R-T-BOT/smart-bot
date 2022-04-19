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

    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  });

  it('should return a default row for new user ', async () => {
    const agent = request.agent(app);
    //login user
    const res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);


    // const user = await res.body[0];
    //get sms array
    const sms = await agent
      .get('/api/v1/sms');

    // update new users sms settings
    // const insertSMSforNewUser = ('3 minuets', 10, 10, res.body[0].id);
    let newRow = '';

    // console.log('|| userId >', res.body[0].id);
    // console.log('|| sms.body >', sms.body);
    for (const s of sms.body){
      if(s.id === res.body[0].id){
        console.log('user ID has already been entered');
        return;
      } else {
        newRow = await agent
          .post('/api/v1/sms/newUser')
          .send(res.body[0].id);
      }
    }

    expect(newRow.body).toEqual({
      id: expect.any(String),
      smsInterval: '0',
      valuePlus: 0,
      valueMinus: 0,
      userId: expect.any(String)
    });


    console.log('|| newRow >', newRow.body);
  });

});
