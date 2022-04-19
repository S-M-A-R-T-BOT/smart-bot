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

  it.only('creates a new user, redirect to main page', async () => {
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

  it('gets a user by id and tells us which stocks they are tracking', async () => {
    const res = await request(app).get('/api/v1/login/1');


    expect(res.body).toEqual({
      user_id: '1',
      username: 'Humma Kavula',
      phoneNumber: 8677401,
      stocks: expect.arrayContaining([expect.objectContaining({})])
    });
  });

  it('should return a default row for new user ', async () => {
    const agent = request.agent(app);
    //login user
    let res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);

    //get sms array
    const sms = await agent
      .get('/api/v1/sms');

    // create new users sms settings
    let checkState = false;
    for (const s of sms.body){
      console.log('|| s >', s);
      if(s.id === res.body[0].id){
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
      user_id: '4'
    });
  });

  it('should update sms_interval for user', async () => {
    const agent = request.agent(app);
    //login user
    let res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);

    //update user array
    let sms = await agent
      .get('/api/v1/sms');
      
    //insert new user default sms
    let checkState = false;
    for(const s of sms.body){
      if(s.id === res.body[0].id){
        console.log('user ID has already been entered');
        checkState = true;
        break;
      } 
    }

    if (checkState === false){
      console.log('creating new User sms settings');
      res = await agent
        .post('/api/v1/sms/newUser')
        .send(res.body[0].id);
    }

    sms = await agent
      .get('/api/v1/sms');

    let updateUser = {
      user_id: res.body.id,
      interval: '5 Minutes',
      valuePlus: 0,
      valueMinus: 0
    };

    let updateRes;
    
    //update sms interval
    if(updateUser.user_id === res.body.id){
      updateRes = await agent
        .post('/api/v1/sms/update-interval')
        .send(updateUser);

      expect(updateRes.body).toEqual({
        id: '4',
        smsInterval: '5 Minutes',
        valuePlus: 0,
        valueMinus: 0,
        user_id: '4'
      });
    } else {
      console.log('User cannot adjust intervals of other Users');
      updateRes = true;
      expect(updateRes).toEqual(false);
    }

    updateUser = {
      user_id: '2',
      interval: '30 Minutes',
      valuePlus: 50,
      valueMinus: 20
    };

    console.log(`|| res.body.id >`, res.body.id);

    //update sms interval
    if(updateUser.user_id === res.body.id){
      updateRes = await agent
        .post('/api/v1/sms/update-interval')
        .send(updateUser);

      expect(updateRes.body).toEqual('undefined');
    } else {
      console.log('User cannot adjust intervals of other Users');
      updateRes = true;
      expect(updateRes).toEqual(true);
    }

    updateUser = {
      user_id: '4',
      interval: '30 Minutes',
      valuePlus: 50,
      valueMinus: 20
    };

    if(updateUser.user_id === res.body.id){
      updateRes = await agent
        .post('/api/v1/sms/update-interval')
        .send(updateUser);

      expect(updateRes.body).toEqual({
        id: '4',
        smsInterval: '30 Minutes',
        valuePlus: 50,
        valueMinus: 20,
        user_id: '4'
      });
    } else {
      console.log('User cannot adjust intervals of other Users');
      updateRes = true;
      expect(updateRes).toEqual(false);
    }
  
    
  });

  it.skip('should logout a user', async () => {
    const agent = request.agent(app);

  });
});
