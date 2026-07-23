<prisma-postgres-standards>
  <description>
    Naming and development standards for projects using Prisma ORM with PostgreSQL,
    ensuring consistency between database schema, code, and entities.
  </description>

  <database>
    <tables>
      <rule>Use snake_case and plural names.</rule>
      <examples>users, customer_import_errors</examples>
    </tables>
    <columns>
      <rule>Use snake_case.</rule>
      <examples>created_at, organization_id</examples>
    </columns>
    <enums>
      <rule>Use snake_case.</rule>
      <example>customer_registration_status</example>
    </enums>
    <primary-keys>
      <rule>Use id as the primary key.</rule>
    </primary-keys>
    <foreign-keys>
      <rule>Use &lt;referenced_table&gt;_id format.</rule>
      <examples>organization_id, user_id</examples>
    </foreign-keys>
  </database>

  <code>
    <models>
      <rule>Use PascalCase and singular names.</rule>
      <examples>User, CustomerImportError</examples>
    </models>
    <properties>
      <rule>Use camelCase.</rule>
      <examples>createdAt, organizationId</examples>
    </properties>
    <enums>
      <rule>Use camelCase for enum names and values.</rule>
    </enums>
    <relationships>
      <rule>Use plural names for arrays and singular for objects.</rule>
    </relationships>
  </code>

  <prisma-usage>
    <mapping>
      <columns>
        <rule>Map snake_case columns to camelCase fields with @map.</rule>
        <example>userId Int @map("user_id")</example>
        <example>createdAt DateTime @map("created_at")</example>
      </columns>
      <tables>
        <rule>Map table names with @@map.</rule>
        <example>@@map("users")</example>
      </tables>
    </mapping>
    <types>
      <dates>
        <rule>Use DateTime with precision @db.Timestamp(6).</rule>
      </dates>
      <uuids>
        <rule>Use String with @db.Uuid.</rule>
      </uuids>
    </types>
    <booleans>
      <rule>Initialize booleans with @default(true|false) when applicable.</rule>
    </booleans>
  </prisma-usage>

  <best-practices>
    <rule>Consistency above all: always follow naming standards.</rule>
    <rule>Use ? for nullable fields.</rule>
    <rule>Define defaults whenever possible.</rule>
    <rule>Use enums instead of free-form strings for fixed values.</rule>
    <rule>Use deletedAt for soft deletes when applicable.</rule>
  </best-practices>

  <examples>
    <simple-table>
      model Organization {
        id        Int       @id @default(autoincrement())
        name      String    @db.VarChar(100)
        document  String?   @db.VarChar(20)
        isActive  Boolean?  @default(true) @map("is_active")
        createdAt DateTime? @default(now()) @db.Timestamp(6) @map("created_at")
        @@map("organizations")
      }
    </simple-table>
    <relationship>
      model User {
        id             Int          @id @default(autoincrement())
        organizationId Int          @map("organization_id")
        name           String       @db.VarChar(100)
        createdAt      DateTime?    @default(now()) @db.Timestamp(6) @map("created_at")
        organization   Organization @relation(fields: [organizationId], references: [id], onDelete: NoAction, onUpdate: NoAction)
        @@map("users")
      }
    </relationship>
  </examples>
</prisma-postgres-standards>
