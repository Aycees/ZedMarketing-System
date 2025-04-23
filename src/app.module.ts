import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { SupabaseModule } from './supabase/supabase.module';
import { JobsModule } from './jobs/jobs.module';
import { JobCategoriesModule } from './job-categories/job-categories.module';

@Module({
  imports: [AccountsModule, SupabaseModule, JobsModule, JobCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
