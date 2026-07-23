<company-standards>
  <language>
    <javascript-typescript>
      <naming>
        <rule>Use camelCase for variables, enums, and functions.</rule>
        <rule>Use PascalCase for classes and React components.</rule>
        <rule>Use UPPER_SNAKE_CASE for global constants.</rule>
        <rule>Use snake_case in API input/output payloads and query params.</rule>
        <rule>Prefer descriptive names for variables and functions.</rule>
      </naming>
      <formatting>
        <rule>Use ESLint and Prettier for consistent formatting.</rule>
        <rule>Avoid unnecessary code comments.</rule>
      </formatting>
      <editorconfig>
        <charset>utf-8</charset>
        <insert_final_newline>true</insert_final_newline>
        <trim_trailing_whitespace>true</trim_trailing_whitespace>
        <end_of_line>lf</end_of_line>
        <indent_style>space</indent_style>
        <indent_size>2</indent_size>
        <max_line_length>80</max_line_length>
      </editorconfig>
    </javascript-typescript>
  </language>

  <environment-variables>
    <prefixes>
      <prefix>DATABASE_</prefix>
      <prefix>AUTH_</prefix>
      <prefix>RABBIT_</prefix>
      <prefix>AWS_</prefix>
      <prefix>AWS_S3_</prefix>
    </prefixes>
    <suffixes>
      <uri>
        <rule>Use _URI for resource access configuration.</rule>
        <examples>DATABASE_URI, REDIS_URI, RABBIT_URI</examples>
      </uri>
      <url>
        <rule>Use _URL for addresses.</rule>
        <examples>AUTH_URL, PLATFORM_URL, AWS_ENDPOINT_URL</examples>
      </url>
    </suffixes>
  </environment-variables>

  <standard-tools>
    <backend>Node.js + NestJS</backend>
    <http-requests>Fetch (native API)</http-requests>
    <logs>Pino</logs>
    <monitoring>Sentry</monitoring>
    <linting>ESLint + Prettier</linting>
    <api-docs>Swagger</api-docs>
    <orm>Prefer Prisma (use native drivers only when needed)</orm>
    <queue>RabbitMQ</queue>
    <git>Commitizen</git>
    <datetime>Luxon</datetime>
  </standard-tools>

  <backend-standards>
    <principles>SOLID and Clean Code</principles>
    <structure>
      <rule>Use Controllers and Services.</rule>
      <rule>Define input and output DTOs.</rule>
      <rule>Keep helpers organized in a helpers folder.</rule>
      <rule>Maintain Prisma schema and migrations.</rule>
      <rule>Use centralized error handling.</rule>
    </structure>
  </backend-standards>

  <frontend-standards>
    <frameworks>React and Next.js</frameworks>
    <components>
      <rule>Prefer functional components with hooks.</rule>
      <rule>Move UI logic to custom hooks when needed.</rule>
      <rule>Use TailwindCSS for styling.</rule>
    </components>
    <state>
      <local>useState for simple local state.</local>
      <complex>useReducer for complex state.</complex>
      <global>Prefer Zustand for global state.</global>
    </state>
    <forms>Use react-hook-form.</forms>
  </frontend-standards>

  <databases>
    <postgresql>
      <rule>Use migrations to version the database.</rule>
      <rule>Name tables and columns in snake_case and plural.</rule>
      <rule>Use incremental IDs as primary keys.</rule>
      <rule>
        When IDs are exposed externally, add a secondary UUID column.
        Consider context and architecture (e.g., distributed systems).
      </rule>
    </postgresql>
    <mongodb>
      <rule>Use schemas and validation in Mongoose.</rule>
      <rule>Avoid deep nesting in documents.</rule>
      <rule>Index frequently queried fields.</rule>
    </mongodb>
    <redis>
      <rule>Use TTL for temporary keys.</rule>
      <rule>Standardize keys with prefixes (e.g., user:{id}:session).</rule>
      <rule>Use Redis Streams for queues and async events.</rule>
    </redis>
  </databases>

  <messaging>
    <rabbitmq>
      <naming>
        <rule>Use kebab-case for queue and exchange names.</rule>
      </naming>
      <exchanges>
        <rule>Use exchanges when it makes sense.</rule>
        <types>
          <direct>
            Routes by exact routing key match.
            Example: order.created goes to queues bound to order.created.
          </direct>
          <fanout>
            Broadcasts to all bound queues, ignores routing keys.
          </fanout>
          <topic>
            Flexible routing with * (one level) and # (many levels).
            Example: order.* matches order.created and order.cancelled.
          </topic>
          <headers>
            Routes by custom headers instead of routing keys.
          </headers>
        </types>
      </exchanges>
      <delivery>
        <rule>Prefer idempotent messages to avoid duplicates.</rule>
        <rule>Use DLX (Dead Letter Exchange) for failed messages.</rule>
      </delivery>
    </rabbitmq>
  </messaging>

  <testing>
    <automation>
      <rule>Use Jest for unit and integration tests.</rule>
      <rule>Use Supertest for API tests.</rule>
      <rule>Mock external dependencies.</rule>
    </automation>
    <coverage>
      <rule>Keep coverage above 80%.</rule>
      <rule>Test critical functions and edge cases.</rule>
    </coverage>
  </testing>
</company-standards>
