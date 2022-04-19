const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const LoginService = require('../lib/services/LoginService');
const req = require('express/lib/request');
const { check } = require('prettier');

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

    // const { username, phoneNumber, email } = mockUser;

    
  });

  it('logs user in and adds stock to watchlist', async () => {
    const [agent] = await registerAndLogin();

    const res = await agent
      // .post(`/api/v1/stocks/${ticker}`)
      .post('/api/v1/stocks')
      .send({
        name: 'Test, Inc',
        ticker: 'TST'
      });

    console.log('|| res.body >', res.body);

    expect(res.body).toEqual({
      stock_id: expect.any(String),
      name: 'Test, Inc',
      ticker: 'TST'
    });
  });

  it('gets a stock by id and tells us which users are tracking it', async () => {
    const res = await request(app).get('/api/v1/stocks/1');

    expect(res.body).toEqual({
      stock_id: '1',
      name: 'Microsoft',
      ticker: 'MSFT',
      users: expect.arrayContaining([expect.objectContaining({})])
    });
  });

  it('should return a default row for new user ', async () => {
    const agent = request.agent(app);
    //login user
    const res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);

    // get sms array
    const sms = await agent
      .get('/api/v1/sms');

    console.log('|| sms.body >', sms.body);
    console.log('|| res.body >', res.body);

    // create new users sms settings
    let checkState = false;
    for (const s of sms.body){
      if(s.id === res.body[0].id){
        // eslint-disable-next-line
          console.log('user ID has already been entered');
        checkState = true;
        break;
      }
    }

    if (checkState === false){
      res = await agent
        .post('/api/v1/sms/newUser')
        .send(res.body[0].id);
    }

    expect(res.body).toEqual({
      id: '4',
      smsInterval: '0',
      valuePlus: 0,
      valueMinus: 0,
      userId: '4'
    });
  });

  it.only('should update sms_interval for user', async () => {
    const agent = request.agent(app);
    //login user
    const res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);


    const updateUser = {
      userId: res.body[0].id,
      interval: '5 Minutes',
      valuePlus: 0,
      valueMinus: 0
    };
    
    res.body.push(updateUser);

    //update user array
    const updateSms = await agent
      .post('/api/v1/sms')
      .send(res.body);

    console.log('|| updateSms >', updateSms.body);
    
    expect(updateSms.body).toEqual({
      id: '4',
      smsInterval: '5 Minutes',
      valuePlus: 0,
      valueMinus: 0,
      userId: '4'
    });
  });

});
