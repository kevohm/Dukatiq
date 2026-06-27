### Authentication
- This is a documentation for authentication and authorization endpoints

### Prerequisites
- Packages used to create authentication service
## Tools
- Cookie via cookie parser
- JWT via jsonwebtoken
- Hashing via Argon2

### Mental Model
- Gives a clear explanation for the flows used in each endpoint or endpoints

## Login
- Request to check current user to `/me`
- Response with fobidden access
- Request to login to `/login`
- Check if credentials in database `orm`
- Check if password and hash match `Argon2`
- Check if sign access token with userId
- Generate refresh token using `crypto`
- Generate refresh token hash using `Argon2`
- Record refresh token in db storing userId, refresh token hash, expiry time ensuring revoked time to null
- Set access token and refresh token with `userId:token` format to cookie using `cookie parser` ensuring
````json
{
    HTTP_ONLY:true
    SECURE: true // false in development to allow http access
    SAME_SITE: strict // lax in development allows cross site access
}
````
## Refresh
- Request to check current to `/me`
- Middleare reads signed cookie for accessToken `cookie parser`
- Verifies accessToken was signed by server `Argon2`
- Checks if sub has a user in db `orm`
- Passes control to controller which returns user details.
- Client can now refresh token via `/refresh`
- Server checks via same middleware in `12 - 14`
- read token from db as set in `10`
- check if token hash is valid for token recieved
- revoked previous refresh token
- generate new refresh token with `sub` and access token with format `id:token`
- send new tokens
- Client can now access server via `/me`
