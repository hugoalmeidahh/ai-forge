<error-handling>
  <description>
    Error handling standards to keep logs rich, responses consistent, and
    maintenance simple.
  </description>

  <principles>
    <rule>Avoid try/catch whenever possible.</rule>
    <rule>
      Use try/catch only when the exception must not interrupt execution.
    </rule>
    <rule>
      Preserve full error logs (file, line, stack trace) for root-cause analysis.
    </rule>
    <rule>Log errors with file/line, error class, and descriptive message.</rule>
  </principles>

  <custom-errors>
    <rule>Always create specific error classes when possible.</rule>
    <rule>Every custom error must extend BaseError.</rule>
    <fields>
      <httpCode>HTTP status code for the error.</httpCode>
      <message>Short description of what happened.</message>
    </fields>
  </custom-errors>

  <base-error>
    <example>
      export abstract class BaseError extends Error {
        abstract httpCode: number;
        abstract message: string;
        public getStatus() {
          return this.httpCode;
        }
        public getMessage() {
          return this.message.replace(/\n/g, ' ').replace(/\s+/g, ' ');
        }
      }
    </example>
    <notes>
      <note>getStatus is used by the global middleware.</note>
      <note>getMessage removes line breaks and extra spaces.</note>
    </notes>
  </base-error>

  <error-response>
    <format>
      {
        "id": "65aab7a02b6650626b9a312ee84c4c19",
        "code": "unauthorized_exception",
        "message": "Unauthorized"
      }
    </format>
    <id>Use x-request-id when present, otherwise generate a UUID.</id>
    <code>Derived from the error class name (snake_case).</code>
    <message>Returned from getMessage().</message>
  </error-response>

  <internal-errors>
    <rule>Never expose the real reason in API responses for 500 errors.</rule>
    <rule>Details must appear only in logs.</rule>
    <example>
      {
        "id": "65aab7a02b6650626b9a312ee84c4c19",
        "code": "internal_error",
        "message": "internal error"
      }
    </example>
  </internal-errors>

  <standard-errors>
    <error>
      <name>DuplicatedEntityError</name>
      <use>Conflict on unique data (e.g., duplicate email).</use>
    </error>
    <error>
      <name>EntityNotFoundError</name>
      <use>Primary entity not found (e.g., /users/:id).</use>
    </error>
    <error>
      <name>InternalProviderError</name>
      <use>External provider failures (DB, AWS, messaging).</use>
    </error>
    <error>
      <name>InvalidPayloadError</name>
      <use>Invalid body or query params.</use>
    </error>
  </standard-errors>
</error-handling>
