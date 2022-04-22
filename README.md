# Smart-Bot

Miro board with project plans:
https://miro.com/app/board/uXjVO8hsBKw=/?share_link_id=707505539093


Smart Bot is an intelligent way to choose stocks. Sign up with our bot and never miss any updates. And with mobile text messgaing integration, you and your team can always stay up to date whether it is day trading or swing trading



### Team Members

Sam Benatovich

Arma Burton

Clifford Maxson

Joshua Williams


### Database

With a POSTGRES implementation we were able to take advantage of using SQL to manage data so it can be organized with our junction table and stadard table organization






## RESTFUL



| REQUEST | URL |   Description   |
|:------:|:---------:|:---------:|
|    GET   |    (url_name)/api/v1/users/:id    |   grab username by its ID   |
|   POST   |    (url_name)/api/v1/users/   |  Check if  user does exists, if it does not create a user  |
|  DELETE  |    (url_name)/api/v1/users/logout    | Logs out the user |


| REQUEST | URL |   Description   |
|:------:|:---------:|:---------:|
|    GET   |    (url_name)/api/v1/sms/    |   grabs all text messgaes   |
|   GET   |    (url_name)/api/v1/sms/send   |  Sends Text Message to User  |
|  PATCH  |    (url_name)/api/v1/sms/update-phone    | Changes user's Phone Number |


| REQUEST | URL |   Description   |
|:------:|:---------:|:---------:|
|    GET   |    (url_name)/api/v1/stocks/:id    |   grab a stock by its id and tell which users are following that stocks   |
|   GET   |    (url_name)/api/v1/stocks//symbol/:symbol   |  Grabs Stocks by TICKER and displays price  |
|  POST  |    (url_name)/api/v1/stocks/    | Grab a random stock |
