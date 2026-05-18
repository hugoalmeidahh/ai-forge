<helpers>
  <description>
    Global helper standards for reusable, context-agnostic utilities that keep
    code DRY and maintainable.
  </description>

  <best-practices>
    <rule>Helpers must be independent of business context.</rule>
    <rule>Use clear, descriptive names (e.g., formatCpfCnpj, maskEmail).</rule>
    <rule>Avoid duplicating logic that already exists in other helpers.</rule>
    <rule>Do not couple helpers to infrastructure services (Prisma, Http, etc.).</rule>
  </best-practices>

  <existing-helpers>
    <helper>
      <name>bootstrap.helper.ts</name>
      <purpose>
        Apply global NestJS settings (CORS, pipes, filters, interceptors) and
        is called from main.ts after app creation.
      </purpose>
    </helper>
    <helper>
      <name>case.helpers.ts</name>
      <purpose>
        Normalize property names to snake_case and adjust Swagger/OpenAPI schemas.
      </purpose>
      <functions>
        <function>
          <name>textWithoutAccents</name>
          <description>Remove accents and special characters from a string.</description>
          <example>
            textWithoutAccents('João da Silva'); // "Joao da Silva"
          </example>
        </function>
        <function>
          <name>toSnakeCaseSchema</name>
          <description>
            Convert Swagger schema properties and parameters to snake_case.
          </description>
        </function>
      </functions>
    </helper>
    <helper>
      <name>currency.helper.ts</name>
      <purpose>
        Convert and format monetary values with precision using Big.js.
      </purpose>
      <functions>
        <function>
          <name>floatToAtom</name>
          <example>floatToAtom(10.25); // 1025</example>
        </function>
        <function>
          <name>atomToFloat</name>
          <example>atomToFloat(1025); // 10.25</example>
        </function>
        <function>
          <name>numberToCurrency</name>
          <example>numberToCurrency(1234.56); // "R$ 1.234,56"</example>
        </function>
        <function>
          <name>atomToCurrency</name>
          <example>atomToCurrency(1025); // "R$ 10,25"</example>
        </function>
      </functions>
    </helper>
    <helper>
      <name>custom-validators.helper.ts</name>
      <purpose>Custom class-validator rules.</purpose>
      <rules>
        <rule>
          Custom validators must start with the prefix CustomIs...
        </rule>
      </rules>
      <validators>
        <validator>CustomIsPhoneNumber</validator>
        <validator>CustomIsName</validator>
        <validator>CustomIsCNPJ</validator>
        <validator>CustomisCPF</validator>
        <validator>CustomisDocument</validator>
        <validator>CustomisFileName</validator>
        <validator>CustomIsUrl</validator>
      </validators>
      <function>
        <name>checkIp</name>
        <example>checkIp('192.168.0.1'); // true</example>
        <example>checkIp('999.999.999.999'); // false</example>
      </function>
    </helper>
    <helper>
      <name>date.helper.ts</name>
      <purpose>
        Convert date strings to Date objects using Luxon with consistent format.
      </purpose>
      <functions>
        <function>
          <name>dateTimeStringToJs</name>
          <example>dateTimeStringToJs('2024-10-06');</example>
          <example>dateTimeStringToJs('2024-10-06T15:30:00');</example>
        </function>
      </functions>
    </helper>
    <helper>
      <name>get-fingerprint.helper.ts</name>
      <purpose>
        Capture and compare request fingerprints for security and session control.
      </purpose>
      <functions>
        <function>
          <name>getFingerprintFromRequest</name>
          <example>getFingerprintFromRequest(req);</example>
        </function>
        <function>
          <name>getFingerprintHashFromRequest</name>
          <example>getFingerprintHashFromRequest(req);</example>
        </function>
        <function>
          <name>checkFingerprintHashFromPayload</name>
          <example>checkFingerprintHashFromPayload(request, payload);</example>
        </function>
      </functions>
    </helper>
    <helper>
      <name>paginated-response.helpers.ts</name>
      <purpose>Standardize pagination response structure with Swagger.</purpose>
      <components>
        <component>PaginatedArgs</component>
        <component>PaginatedResponse</component>
        <component>getPaginationMeta</component>
        <component>sliceItemsByPagination</component>
      </components>
    </helper>
    <helper>
      <name>password-validator.helper.ts</name>
      <purpose>
        Validate password strength and enforce rules.
      </purpose>
      <configuration>
        <min>12</min>
        <max>30</max>
        <withUppercase>true</withUppercase>
        <withLowercase>true</withLowercase>
        <minDigits>1</minDigits>
        <withoutSpaces>false</withoutSpaces>
        <blacklist>password, senha</blacklist>
      </configuration>
      <components>
        <component>PasswordValidatorHelper</component>
        <component>StrongPassword</component>
      </components>
    </helper>
    <helper>
      <name>prisma-types.helper.ts</name>
      <purpose>Global Prisma type transformations.</purpose>
      <function>
        <name>decimalEntriesToString</name>
        <example>
          decimalEntriesToString({
            id: 1,
            balance: new Prisma.Decimal('123.45'),
            amount: BigInt(10)
          });
        </example>
      </function>
    </helper>
    <helper>
      <name>validator.helper.ts</name>
      <purpose>
        Validate plain objects against DTOs with class-validator and throw
        InvalidPayloadError on failure.
      </purpose>
      <function>
        <name>ValidatorHelper</name>
        <example>
          await ValidatorHelper(CreateUserInput, { name: 123 });
        </example>
      </function>
    </helper>
  </existing-helpers>
</helpers>
