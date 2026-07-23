<dto-standards>
  <description>
    DTO standards for Swagger documentation, validation, and transformations.
    All endpoints returning JSON must use output DTOs, and all request/query
    inputs must use input DTOs.
  </description>

  <conventions>
    <naming>
      <input>Use suffix Input (e.g., CreateUserInput).</input>
      <output>Use suffix Output (e.g., UserOutput).</output>
    </naming>
    <structure>
      <rule>Always use classes, not interfaces.</rule>
      <rule>
        Properties may include ApiProperty, class-validator, and
        class-transformer decorators.
      </rule>
      <rule>Prefer enums for fields with fixed values.</rule>
    </structure>
  </conventions>

  <input-dtos>
    <rules>
      <rule>Use @ApiProperty for every field (type, enum, required, default).</rule>
      <rule>Validate fields with class-validator.</rule>
      <rule>Use @Type(() =&gt; ClassName) for lists or nested objects.</rule>
      <rule>Mark optional fields with @IsOptional().</rule>
    </rules>
    <example>
      export class CreateUserInput {
        @ApiProperty({ type: String })
        @MaxLength(100)
        @Validate(IsName)
        name: string;
        @ApiProperty({ type: String })
        @IsEmail()
        @Transform(({ value }) =&gt; (value as string).toLowerCase())
        email: string;
        @ApiProperty({ type: String, required: false })
        @Validate(PhoneNumber)
        @IsOptional()
        phone?: string | null;
      }
    </example>
    <when-to-use>
      Use input DTOs for all endpoints that receive parameters (body or query)
      and for functions that accept object parameters.
    </when-to-use>
    <validation-helper>
      For non-controller usage, validate with ValidatorHelper from
      src/helpers/validator.helper.ts.
    </validation-helper>
    <usage-examples>
      <endpoint>
        @Get()
        @UseGuards(HeadGuard)
        @PaginatedResponse(UserOutput)
        async getAll(@Query() params: PaginatedUsersInput, @Req() req: Request) {
          const auth = req.user as AuthTokenPayload;
          const result = await this.userService.getAllPaginated(auth, params);
          return { ... };
        }
      </endpoint>
      <function>
        @Injectable()
        export class ActionLogService {
          ...
          async newLog(payload: NewLogInput) {
            const params = await ValidatorHelper(NewLogInput, payload);
            ...
          }
        }
      </function>
    </usage-examples>
  </input-dtos>

  <output-dtos>
    <rules>
      <rule>Expose fields with @ApiProperty.</rule>
      <rule>Hide non-returned fields with @Exclude().</rule>
      <rule>Use @Type(() =&gt; ClassName) for nested objects/lists.</rule>
      <rule>Include static getInstance using plainToInstance.</rule>
      <rule>No validation decorators are required.</rule>
    </rules>
    <example>
      export class AssetPriceOutput {
        @Exclude()
        id: string;
        @ApiProperty({ type: Number })
        @Transform(({ value }) =&gt; Number(value))
        floatPrice: number;
        @Exclude()
        projectId: string;
        @ApiProperty({ type: Date })
        createdAt: Date | string;
        static getInstance(data: Partial&lt;AssetPriceOutput&gt;) {
          return plainToInstance(AssetPriceOutput, data);
        }
      }
    </example>
    <when-to-use>
      Use output DTOs for every endpoint that returns JSON.
    </when-to-use>
    <endpoint-example>
      @Get(':id')
      @ApiOkResponse({ type: AssetOutput })
      async getOne(
        @Req() request: Request,
        @Param('id', ParseUUIDPipe) id: string,
      ) {
        const auth = request.user as AuthTokenPayload;
        const data = await this.assetService.getDetailsById(auth, id);
        return AssetOutput.getInstance(data as unknown as AssetOutput);
      }
    </endpoint-example>
  </output-dtos>
</dto-standards>
