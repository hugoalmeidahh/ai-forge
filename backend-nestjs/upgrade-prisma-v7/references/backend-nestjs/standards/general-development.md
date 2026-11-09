<general-development>
  <description>
    General development standards to keep code clean, cohesive, reusable, and
    easy to maintain.
  </description>

  <general-patterns>
    <variables>
      <rule>Use const when the value does not change.</rule>
      <rule>Use let only when needed.</rule>
      <rule>Do not use var.</rule>
    </variables>
    <strings>
      <rule>Prefer template literals over string concatenation.</rule>
      <example>
        const text = `Hello ${name}`;
      </example>
    </strings>
    <optional-chaining>
      <rule>Use ?. and ?? to avoid manual checks.</rule>
      <example>
        const city = user?.address?.city ?? 'Unknown';
      </example>
    </optional-chaining>
    <callbacks>
      <rule>
        Avoid anonymous functions in map/filter/reduce when possible. Prefer
        named functions for better stack traces.
      </rule>
    </callbacks>
    <conditionals>
      <rule>Always use {} blocks in if statements.</rule>
    </conditionals>
    <dates>
      <rule>Use Luxon (DateTime) whenever possible.</rule>
    </dates>
    <naming>
      <constants>UPPER_SNAKE_CASE</constants>
      <json>snake_case for API input/output</json>
      <query-params>snake_case</query-params>
      <variables-functions>camelCase</variables-functions>
    </naming>
  </general-patterns>

  <decision-structures>
    <rule>
      Avoid dynamic function maps for complex decision flows; prefer explicit
      if/switch unless implementing a formal, documented pattern (Strategy,
      Factory, etc).
    </rule>
  </decision-structures>

  <architectural-standards>
    <modules>
      <rule>Each module represents a business context.</rule>
      <rule>Only the owning module can manipulate its entity directly.</rule>
      <example>
        The user module manipulates the users table. Other modules must call
        UserService instead of accessing repositories directly.
      </example>
    </modules>
    <dependency-injection>
      <rule>Prefer dependency injection over direct instantiation.</rule>
    </dependency-injection>
  </architectural-standards>

  <file-responsibilities>
    <controller>
      <rule>Define routes and HTTP methods.</rule>
      <rule>Call the appropriate service.</rule>
      <rule>Map responses to output DTOs.</rule>
    </controller>
    <input-dto>
      <rule>Validate inputs (type, size, format).</rule>
      <rule>Apply basic transformations (lowercase emails, parse numbers).</rule>
    </input-dto>
    <service>
      <rule>Implement business logic.</rule>
      <rule>Perform complex validations.</rule>
      <rule>Call other services and external providers.</rule>
    </service>
    <output-dto>
      <rule>Document the response shape.</rule>
      <rule>Remove sensitive fields.</rule>
      <rule>Apply simple output transformations.</rule>
    </output-dto>
    <guard>
      <rule>Handle security/authorization (e.g., JWT validation).</rule>
    </guard>
    <error>
      <rule>Define standardized errors.</rule>
    </error>
    <interceptor-pipe>
      <rule>Intercept and transform data (e.g., timing, normalization).</rule>
    </interceptor-pipe>
    <helper>
      <rule>Pure, reusable utility functions.</rule>
    </helper>
    <constants>
      <rule>Shared immutable values.</rule>
    </constants>
  </file-responsibilities>

  <solid>
    <single-responsibility>
      Each class, function, and file has a single clear responsibility.
    </single-responsibility>
    <open-closed>
      Add new functionality by extension, not by changing settled rules.
    </open-closed>
    <liskov-substitution>
      Subclasses can replace base classes without breaking behavior.
    </liskov-substitution>
    <interface-segregation>
      Keep interfaces specific and avoid oversized contracts.
    </interface-segregation>
    <dependency-inversion>
      Use dependency injection to keep low coupling between modules.
    </dependency-inversion>
  </solid>
</general-development>
