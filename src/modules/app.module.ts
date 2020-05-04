import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DraftService } from '../services/draft/draft.service';
import { PlayerService } from '../services/player/player.service';
import { PlayerController } from '../controllers/player/player.controller';
import { DraftController } from '../controllers/draft/draft.controller';
import { GridDraftPickService } from '../services/draftpick/grid-draft-pick/grid-draft-pick.service';

@Module({
  controllers: [PlayerController, DraftController],
  imports: [ConfigModule.forRoot(), AuthModule],
  providers: [DraftService, PlayerService, { provide: 'DraftPickService', useClass: GridDraftPickService }],
})
export class AppModule {}
