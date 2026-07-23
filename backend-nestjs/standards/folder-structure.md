<folder-structure>
  <description>
    Folder and file organization standards for backend projects, aligned with
    SOLID principles and NestJS conventions.
  </description>

  <naming-conventions>
    <rule>Use lowercase names for files and folders.</rule>
    <rule>Use kebab-case for all file and folder names.</rule>
    <rule>File names include the type suffix: name.type.ts.</rule>
    <examples>
      user-address.service.ts
      customers.controller.ts
      paginated-customers-params.input.ts
      file.output.ts
      auth.module.ts
    </examples>
    <common-types>
      <type>.controller.ts</type>
      <type>.service.ts</type>
      <type>.module.ts</type>
      <type>.input.ts</type>
      <type>.output.ts</type>
      <type>.error.ts</type>
      <type>.interface.ts</type>
      <type>.guard.ts</type>
      <type>.interceptor.ts</type>
      <type>.listener.ts</type>
    </common-types>
  </naming-conventions>

  <root-structure>
    <path>src/errors</path>
    <path>src/helpers</path>
    <path>src/interceptors</path>
    <path>src/modules</path>
    <path>src/providers</path>
    <path>src/app.module.ts</path>
    <path>src/env.validate.ts</path>
    <path>src/main.ts</path>
  </root-structure>

  <modules>
    <description>
      Each module represents a business unit or domain aggregate, usually
      inspired by the database structure.
    </description>
    <rules>
      <rule>Create a module per independent table (e.g., action-log).</rule>
      <rule>
        If multiple tables belong to a main entity (users, user_emails,
        user_addresses), create a single main module (user).
      </rule>
    </rules>
    <typical-structure>
      <path>src/modules/user/dtos</path>
      <path>src/modules/user/errors</path>
      <path>src/modules/user/interfaces</path>
      <path>src/modules/user/services</path>
      <path>src/modules/user/controllers</path>
      <path>src/modules/user/listeners</path>
      <path>src/modules/user/user.module.ts</path>
      <path>src/modules/user/user.guard.ts</path>
    </typical-structure>
  </modules>

  <providers>
    <description>
      Providers mirror module structure but focus on infrastructure integrations
      and do not contain controllers, dtos, or listeners.
    </description>
    <example-structure>
      <path>src/providers/prisma/errors</path>
      <path>src/providers/prisma/interfaces</path>
      <path>src/providers/prisma/services</path>
      <path>src/providers/prisma/prisma.module.ts</path>
    </example-structure>
  </providers>
</folder-structure>
