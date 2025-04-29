import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { PetImagesModule } from './pet-images/pet-images.module';

@Module({
  imports: [UsersModule, AuthModule, PetsModule, MedicalRecordsModule, PetImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
