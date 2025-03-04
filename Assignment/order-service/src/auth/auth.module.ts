import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DefaultNamingStrategy } from 'typeorm';
import { JwtStratergy } from './jwt.strategy';

@Module({
    imports:[PassportModule.register({DefaultNamingStrategy:'jwt'})],
    providers:[JwtStratergy],
    exports:[PassportModule]
})
export class AuthModule {}
