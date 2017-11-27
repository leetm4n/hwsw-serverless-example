# hwsw-serverless-example

Small serverless example which has authentication and s3 signedUrl set / get logic.
Routes:
 - POST {baseUrl}/geturl?type=get or {baseUrl}/geturl?type=set

### Environment variable needed (.env.json in root): 
```{ "AUTH_SECRET": "<token secret>" }```

### To generate a token use the following command:
`yarn generateToken <username>`

### To deploy the application run the following command:
`yarn deploy`