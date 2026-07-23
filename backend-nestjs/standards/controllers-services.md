<controllers-services>
  <description>
    Standards for controllers and services with clear separation of
    responsibilities for organization, testability, and maintainability.
  </description>

  <request-flow>
    Request → Controller → Service → Repository/Provider → Service →
    Controller → DTO Output → Response
  </request-flow>

  <controllers>
    <responsibilities>
      <rule>Define routes and HTTP methods (GET, POST, PATCH, etc.).</rule>
      <rule>Document inputs and outputs with DTOs and Swagger decorators.</rule>
      <rule>Set correct HTTP response codes.</rule>
      <rule>Define required authentication for endpoints.</rule>
      <rule>Delegate execution to the responsible service.</rule>
    </responsibilities>
    <json-response>
      <rule>
        Always return JSON through the output DTO for consistency.
      </rule>
      <example>
        return ChatMessageOutput.getInstance(
          await this.service.receiveMessage({ token, data }),
        );
      </example>
    </json-response>
    <documentation>
      <example>
        @Get(':id')
        @ApiOkResponse({ type: AssetOutput })
        async getById(@Param('id', ParseIntPipe) id: number) {
          return AssetOutput.getInstance(await this.service.getById(id));
        }
      </example>
      <example>
        @Post('financial-event')
        @ApiNoContentResponse({ description: 'Success to process financial event' })
        @HttpCode(HttpStatus.NO_CONTENT)
        async financialEvent(@Body() data: InternalFinancialEventInput) {
          await this.internalService.handleFinancialEvent(data);
        }
      </example>
    </documentation>
    <authentication>
      <example>
        @Controller('internal')
        @UseGuards(AuthGuard('basic'))
        @ApiBasicAuth()
        export class InternalController { ... }
      </example>
    </authentication>
    <not-allowed>
      <rule>Do not query the database directly.</rule>
      <rule>Do not call external providers (S3, Redis, etc.) directly.</rule>
      <rule>Do not implement business logic.</rule>
      <rule>Do not manually validate input data.</rule>
    </not-allowed>
  </controllers>

  <services>
    <responsibilities>
      <rule>Implement business logic and complex validations.</rule>
      <rule>Read/write to the database.</rule>
      <rule>Integrate with external providers (AWS, APIs, messaging).</rule>
      <rule>Validate input via DTOs and ValidatorHelper.</rule>
      <rule>Interact with other services when needed.</rule>
    </responsibilities>
    <validation>
      <example>
        const data = await ValidatorHelper(ExtractionInput, extraction);
      </example>
      <note>
        Invalid payloads raise InvalidPayloadError automatically.
      </note>
    </validation>
    <organization>
      <rule>Organize services by context, not by endpoint.</rule>
      <examples>
        UserService, UserAddressService, UserDocumentService
        UserReadingService, UserWritingService
      </examples>
      <counter-example>
        CreateUserService, UpdateUserService, DeleteUserService
      </counter-example>
    </organization>
    <best-practices>
      <rule>Avoid generic services that handle multiple entities.</rule>
      <rule>Avoid unnecessary dependencies between services.</rule>
      <rule>Prefer pure functions and private methods for reusable rules.</rule>
    </best-practices>
    <not-allowed>
      <rule>Do not define routes or authentication.</rule>
      <rule>Do not use output DTOs.</rule>
      <rule>Do not perform basic field validations (input DTOs handle this).</rule>
    </not-allowed>
  </services>

  <examples>
    <controller>
      @Controller('chat')
      @UseGuards(AuthGuard('basic'))
      @ApiBasicAuth()
      export class ChatController {
        constructor(private readonly service: ChatService) {}
        @Post('receive-message')
        @ApiOkResponse({ type: ChatMessageOutput })
        async receiveMessage(
          @Headers('Authorization') token: string,
          @Body() data: ChatMessageInput,
        ) {
          return ChatMessageOutput.getInstance(
            await this.service.receiveMessage({ token, data }),
          );
        }
      }
    </controller>
    <service>
      @Injectable()
      export class PurchaseService {
        private repository: Prisma.PurchaseDelegate<
          DefaultArgs,
          Prisma.PrismaClientOptions
        >;
        constructor(
          private bankProvider: BankProvider,
          prisma: PrismaService,
        ) {
          this.repository = prisma.purchase;
        }
        private async checkUserBalance(userId: number, data: Purchase) {
          const balance = this.bankProvider.getBalance(userId);
          if (balance < data.value) {
            throw new InsufficientBalanceError(`cannot buy ${data.name}`);
          }
        }
        async buy(userId: number, data: Purchase) {
          await this.checkUserBalance(userId, data);
          return this.repository.create(data);
        }
      }
    </service>
  </examples>
</controllers-services>
