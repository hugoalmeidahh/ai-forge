<auth-security>
  <description>
    Authentication and security standards to ensure every request is properly
    authenticated and validated for internal and external APIs.
  </description>

  <authentication-types>
    <type>
      <name>Basic Auth</name>
      <context>Internal APIs (service-to-service)</context>
      <layer>Internal backend</layer>
      <libraries>passport-http, @nestjs/passport</libraries>
    </type>
    <type>
      <name>Bearer JWT</name>
      <context>BFF APIs (front-end consumers)</context>
      <layer>External backend</layer>
      <libraries>jsonwebtoken, crypto</libraries>
    </type>
  </authentication-types>

  <basic-auth>
    <scope>Internal endpoints only.</scope>
    <request-header>
      Authorization: Basic &lt;base64(BASIC_USER:BASIC_PASS)&gt;
    </request-header>
    <strategy-example>
      import { Injectable, UnauthorizedException } from '@nestjs/common';
      import { ConfigService } from '@nestjs/config';
      import { PassportStrategy } from '@nestjs/passport';
      import { Request } from 'express';
      import { BasicStrategy as Strategy } from 'passport-http';
      @Injectable()
      export class InternalBasicStrategy extends PassportStrategy(Strategy) {
        constructor(private readonly configService: ConfigService) {
          super({ passReqToCallback: true });
        }
        public validate = (req: Request, username: string, password: string): boolean => {
          if (
            this.configService.getOrThrow<string>('BASIC_USER') === username &&
            this.configService.getOrThrow<string>('BASIC_PASS') === password
          ) {
            return true;
          }
          throw new UnauthorizedException();
        };
      }
    </strategy-example>
  </basic-auth>

  <jwt>
    <purpose>Authenticate end users with isolation and confidentiality.</purpose>
    <security-rules>
      <rule>Include only identification and permission data in the payload.</rule>
      <rule>Avoid storing open user data (name, email, etc.).</rule>
      <rule>Encrypt user data before adding it to the token when needed.</rule>
      <rule>Include device fingerprint in specific contexts.</rule>
      <rule>Encrypt the payload with AES-256-CBC.</rule>
      <rule>Never expose tokens in logs, URLs, or public variables.</rule>
    </security-rules>
    <root-payload>
      {
        "sub": "N2YyNTRjMjZlYzYzMWYyZmU0OWZjOGUyN2...",
        "iat": 1759762231,
        "exp": 1759848631
      }
    </root-payload>
    <decrypted-payload-interface>
      export interface AuthTokenPayload {
        sub?: number | null;
        email: string;
        name?: string;
        referrer?: string;
        fingerprintHash: string;
      }
    </decrypted-payload-interface>
  </jwt>

  <jwt-auth-guard>
    <responsibilities>
      <rule>Extract token from header.</rule>
      <rule>Decrypt and validate token contents.</rule>
      <rule>Verify fingerprint when required.</rule>
      <rule>Inject authenticated user into request.user.</rule>
    </responsibilities>
    <example>
      @Injectable()
      export class AuthGuard implements CanActivate {
        constructor(
          private authService: AuthService,
          private reflector: Reflector,
        ) {}
        async canActivate(context: ExecutionContext): Promise&lt;boolean&gt; {
          const request: Request = context.switchToHttp().getRequest();
          const isAlreadyLogged = request.user as AuthTokenPayload;
          if (isAlreadyLogged && isAlreadyLogged.fingerprintHash) {
            return true;
          }
          request.user = await this.authService.decryptAndValidateTokenFromRequest(request);
          return true;
        }
      }
    </example>
  </jwt-auth-guard>
</auth-security>
