# Routes and Services — Fastify

## Request Flow

```
Request → Fastify route → Service → Repository/Provider → Service → Serializer → Reply
```

## Fastify Plugin / Route

Register each domain as an encapsulated Fastify plugin. Route schemas own input validation and OpenAPI; handlers delegate and return serialized objects.

```js
// user.routes.js
export async function userRoutes(fastify, { userService }) {
  fastify.get('/:id', {
    preHandler: [fastify.authenticate],
    schema: { params: userParamsSchema, response: { 200: userOutputSchema } },
  }, async (request, reply) => {
    const user = await userService.getById(request.params.id);
    return reply.code(200).send(serializeUser(user));
  });
}
```

**Responsibilities:**
- Register HTTP routes, auth hooks, schemas and status codes.
- Use `request.params`, `request.query`, `request.body`; call service; serialize; `reply.send()`.
- Throw errors; Fastify's global `setErrorHandler` maps them. Do not use Express `next(err)` wrappers.

**Not allowed:**
- No DB queries. No external provider calls. No business logic. No manual field validation.

## Service

**Responsibilities:**
- Business logic and complex validations.
- DB read/write via the module's repository.
- Integrations with external providers.
- Call other modules' services when needed (never their repositories).

**Organization:** by context, not by endpoint — `userService`, `userAddressService`; never `createUserService` / `updateUserService` as separate services.

**Not allowed:**
- No `req`/`res` access. No serializers. No route/auth definitions.

## Repository

- The only place importing the DB client for its tables.
- Returns plain domain objects; no HTTP concepts.
- Exposes intent-revealing methods (`findActiveByEmail`), not generic query passthroughs.
