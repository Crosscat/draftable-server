import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AuthModule } from './auth/auth.module';
import { DraftService } from '../services/draft/draft.service';
import { PlayerService } from '../services/player/player.service';
import { PlayerController } from '../controllers/player/player.controller';
import { DraftController } from '../controllers/draft/draft.controller';
import { GridDraftPickService } from '../services/draftpick/grid-draft-pick/grid-draft-pick.service';
import { CubeController } from '../controllers/cube/cube.controller';
import { CubeService } from '../services/cube/cube.service';

@Module({
  controllers: [PlayerController, DraftController, CubeController],
  imports: [ConfigModule.forRoot(), AuthModule, HttpModule],
  providers: [DraftService, PlayerService, CubeService, { provide: 'DraftPickService', useClass: GridDraftPickService }],
})
export class AppModule {}
