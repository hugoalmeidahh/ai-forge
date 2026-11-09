<project>
  <goal>
    Provide a clear, consistent NestJS monolith template with Prisma, logging, and
    standardized request/response transformations.
  </goal>

  <stack>
    <runtime>Node.js</runtime>
    <framework>NestJS</framework>
    <orm>Prisma</orm>
    <logging>Pino (nestjs-pino)</logging>
    <docs>Swagger</docs>
    <auth>Basic Auth (passport-http)</auth>
    <error-tracking>Sentry</error-tracking>
  </stack>

  <architecture>
    <style>Modular monolith</style>
    <pattern>Controllers + Services + DTOs per module</pattern>
    <global-behavior>
      <input>snake_case for body/query (auto-transformed to camelCase)</input>
      <output>snake_case responses (auto-transformed)</output>
      <validation>class-validator + global ValidationPipe</validation>
      <errors>Global error filter with standardized payload</errors>
    </global-behavior>
  </architecture>

  <structure>
    <root>
      <item path="src">Application source</item>
      <item path="src/modules">Domain modules</item>
      <item path="src/providers">Infrastructure providers (Prisma, AWS, AMQP)</item>
      <item path="src/helpers">Reusable helpers and decorators</item>
      <item path="src/errors">Custom error types and global filter</item>
      <item path="prisma">Schema and migrations</item>
      <item path="test">E2E and helpers</item>
    </root>
    <module-layout>
      <example>src/modules/&lt;domain&gt;/controllers</example>
      <example>src/modules/&lt;domain&gt;/services</example>
      <example>src/modules/&lt;domain&gt;/dtos</example>
      <example>src/modules/&lt;domain&gt;/&lt;domain&gt;.module.ts</example>
    </module-layout>
  </structure>

  <naming>
    <files>kebab-case for files and folders</files>
    <dto-files>*.input.ts and *.output.ts</dto-files>
    <classes>PascalCase</classes>
    <endpoints>kebab-case routes</endpoints>
    <schemas>Prisma models in schema.prisma</schemas>
  </naming>

  <coding-patterns>
    <controllers>
      <rule>Controllers are thin: validate/transform input, call service, map output</rule>
      <rule>Decorate with Swagger and auth guards</rule>
    </controllers>
    <services>
      <rule>Services encapsulate business logic and persistence</rule>
      <rule>Access Prisma via injected PrismaService</rule>
      <rule>Emit action logs when domain changes occur</rule>
    </services>
    <dtos>
      <rule>Use class-validator and Swagger decorators</rule>
      <rule>Output DTOs expose fields and hide sensitive ones via class-transformer</rule>
      <rule>Provide static getInstance to map plain objects</rule>
    </dtos>
  </coding-patterns>

  <request-response>
    <input>
      <rule>Body and query keys are camelCased by BodyQueryTransformPipe</rule>
    </input>
    <output>
      <rule>Responses are snake_cased by ResponseTransformInterceptor</rule>
      <rule>Preserve Date types during transformation</rule>
    </output>
    <pagination>
      <rule>Use PaginatedArgs and PaginatedResponse decorator</rule>
      <rule>Order fields are normalized to camelCase</rule>
    </pagination>
  </request-response>

  <errors>
    <rule>Custom errors extend BaseError with httpCode and message</rule>
    <rule>GlobalErrorFilter formats JSON as { id, code, message }</rule>
    <rule>5xx errors return generic internal message and code</rule>
  </errors>

  <logging>
    <rule>Request IDs come from x-request-id or generated UUID</rule>
    <rule>ActionLogService records transactional logs via Prisma</rule>
    <rule>Pino logger intercepts request/response</rule>
  </logging>

  <configuration>
    <rule>Validate environment variables via env.validate.ts (Joi)</rule>
    <rule>Secrets loaded from AWS Secrets Manager in staging/production</rule>
    <rule>Configuration is accessed via ConfigService</rule>
  </configuration>

  <swagger>
    <rule>Documentation exposed at /docs and /docs-json</rule>
    <rule>BasicAuth is declared in Swagger</rule>
  </swagger>

  <providers>
    <rule>Providers are isolated modules under src/providers</rule>
    <rule>PrismaService extends PrismaClient and logs query events</rule>
  </providers>

  <testing>
    <rule>Tests live under test/ with helpers and module-level suites</rule>
  </testing>
</project>
