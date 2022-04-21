const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const LoginService = require('../lib/services/LoginService');
const StockService = require('../lib/services/StockService');

const mockUser = {
  username: 'tester',
  password: 'guest',
  phoneNumber: 1234567890,
  email: 'test@demo.com'
};

const registerAndLogin = async () => {
  // const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  // const user = await LoginService.create({ ...mockUser, ...userProps });
  
  
  // const { username } = user;
  await agent.post('/api/v1/login').send(mockUser);
  
  return [agent];
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

  it('creates a new user with url params, redirect to main page', async () => {
    const agent = request.agent(app);

    const res  = await agent
      .post('/api/v1/login/hotdog/hamburger')
      .redirects(1);

    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );   
  });

  it('logs user in and adds stock to watchlist', async () => {
    const [agent] = await registerAndLogin();

    const res = await agent
      .post('/api/v1/stocks/add')
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
    const [agent] = await registerAndLogin();
    // const agent = request.agent(app);



    const res = await agent.get('/api/v1/stocks/1');


    expect(res.body).toEqual({
      stock_id: '1',
      name: 'Microsoft',
      ticker: 'MSFT',
      users: expect.arrayContaining([expect.objectContaining({})])
    });
  });

  it('gets a user by id and tells us which stocks they are tracking', async () => {
    const res = await request(app).get('/api/v1/login/1');


    const stonks = [];
    res.body.map(stock => {
      stonks.push({
        stock_id: stock.stock_id,
        name: stock.name,
        ticker: stock.ticker
      });
    });



    const userObj = {
      username: res.body[0].username,
      phoneNumber: res.body[0].ph_num,
      user_id: res.body[0].user_id,
      stocks: stonks
    };
    

    expect(userObj).toEqual({
      username: 'Humma Kavula',
      phoneNumber: '8677401',
      user_id: '1',
      stocks: [
        { stock_id: '1', name: 'Microsoft', ticker: 'MSFT' },
        { stock_id: '2', name: 'Apple', ticker: 'AAPL' },
        { stock_id: '3', name: 'Tesla', ticker: 'TSLA' },
        { stock_id: '5', name: 'Google', ticker: 'GOOG' },
        { stock_id: '6', name: 'Kittens', ticker: 'CATS' }
      ]
    });
  });

  it('unfollows all stocks for a given user', async () => {
    const [agent] = await registerAndLogin();

    const res = await agent
      .delete('/api/v1/login/1');

    const userStocks = await agent.get('/api/v1/login/2');
    console.log('userStocks :>> ', userStocks.text);
    const resp = await agent.delete('/api/v1/login/2');
    
    // console.log('resp.body :>> ', resp.body);
    const userStocks2 = await agent.get('/api/v1/login/2');
    // console.log('userStocks 140 :>> ', userStocks2.text);

    expect(resp.body).toEqual(
      expect.arrayContaining([])
    );
    // expect(res.body).toEqual(expect.objectContaining({}));
  });


  it('unfollows a specific, named stock for a given user', async () => {
    const [agent] = await registerAndLogin();

    const res = await agent
      .delete('/api/v1/login/2/1');

    expect(res.body).toEqual(expect.objectContaining({}));
  });

  it('should return a default row for new user (userid/id issue) ', async () => {
    const agent = request.agent(app);
    //login user
    let res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);

    const userEYEDEE = res.body[0].user_id;

    // get sms array
    const sms = await agent
      .get('/api/v1/sms')
      .send(userEYEDEE);

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

    const userId = res.body[0].user_id;

    if (checkState === false){
      res = await agent
        .post(`/api/v1/sms/newUser/${userId}`);
    }

    expect(res.body).toEqual({
      id: '4',
      smsInterval: '0',
      valuePlus: 0,
      valueMinus: 0,
      userId: '4'
    });
  });

  it('should update sms_interval for signed in user, and not for anyone else (userid/id issue)', async () => {
    const agent = request.agent(app);
    //login user
    const res = await agent
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);
      
    let updateUser = {
      userId: res.body[0].user_id,
      interval: '5 Minutes',
      valuePlus: 0,
      valueMinus: 0
    };

    res.body.push(updateUser);

    //update user array
    let updateSms = await agent
      .post('/api/v1/sms')
      .send(res.body);

    expect(updateSms.body).toEqual({
      id: '4',
      smsInterval: '5 Minutes',
      valuePlus: 0,
      valueMinus: 0,
      userId: '4'
    });

    updateUser = {
      userId: '2',
      interval: '5 Minutes',
      valuePlus: 0,
      valueMinus: 0
    };

    res.body.pop();
    res.body.push(updateUser);
    updateSms = await agent
      .post('/api/v1/sms')
      .send(res.body);

    expect(updateSms.text).toEqual('User ID has already been entered');
  });

  it('should allow signed in users to changed their phone number(returns emply object)', async () => {
    const agent = request.agent(app);
    //login user
    const res = await agent
      .post('/api/v1/login/')
      .send(mockUser)
      .redirects(1);

    const newNumber = { phoneNumber: 5034747724 };

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
      updateRes = true;
      expect(updateRes).toEqual(false);
    }

    const updatePhNum = await agent
      .patch('/api/v1/sms/update-phone')
      .send({ ...res.body[0], ...newNumber });

    expect(updatePhNum.body).toEqual({
      id: '4',
      username: 'tester',
      password_hash: expect.any(String),
      ph_num: '5034747724',
      email: 'test@demo.com'
    });
  });


  it('should re-log in a user', async () => {
    const agent1 = request.agent(app);

    const mockUserForLogin = {
      username: 'Yon Yonson',
      phoneNumber: 911,
      password: 'BubbleHash',
      email: 'yon@bubbles.com'
    };
    // const res  = await agent1
    //   .post('/api/v1/login')
    //   .send(mockUser)
    //   .redirects(1);
    const agent = await agent1.post('/api/v1/login').send(mockUserForLogin);
    // add user log in as text
    expect(agent.body).toEqual(expect.any(String));

  });

  it('should logout a user', async () => {
    const agent1 = request.agent(app);

    const res  = await agent1
      .post('/api/v1/login')
      .send(mockUser)
      .redirects(1);
    const agent = await agent1.delete('/api/v1/login/logout');
    expect(agent.body).toEqual({ success: true });

  });

  it.skip('should send a text message', async () => { 
    const agent = request.agent(app);
    //login user
    let res = await agent
      .post('/api/v1/login/')
      .send(mockUser)
      .redirects(1);

    const newNumber = { phoneNumber: 5034747724 };

    //updating number to dial to
    res = await agent
      .patch('/api/v1/sms/update-phone')
      .send({ ...res.body[0], ...newNumber });

    //send sms
    res = await agent
      .get('/api/v1/sms/send-sms')
      .send(res.body);
  });

  it('should search for a stock by symbol', async () => {
    const expected = {
      c: expect.any(Number),
      d: expect.any(Number),
      dp: expect.any(Number),
      h: expect.any(Number),
      l: expect.any(Number),
      o: expect.any(Number),
      pc: expect.any(Number),
      t: expect.any(Number)
    };

    const res = await StockService.getStockBySymbol('AAPL');

    expect(res).toEqual(expected);
  });
});
