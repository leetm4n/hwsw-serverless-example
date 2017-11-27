# hwsw-serverless-example

A serverless example with custom lambda authentication on API Gateway triggered lambda.

To get signed url use the following route:
`POST {baseUrl}/geturl?type=get or {baseUrl}/geturl?type=set`

### Environment variable needed (.env.json in root): 
```{ "AUTH_SECRET": "<token secret>" }```

### To generate a token use the following command:
`yarn generateToken <username>`

### To deploy the application run the following command:
`yarn deploy`