/// <references path="../exoplayer.d.ts" />

import { Component, OnDestroy, OnInit } from '@angular/core';
import * as utils from 'tns-core-modules/utils/utils';
import { ExoPlayerService } from '~/services/exo-player.service';

// Reading https://www.raywenderlich.com/5573-media-playback-on-android-with-exoplayer-getting-started
// https://android.jlelse.eu/sending-media-to-chromecast-has-never-been-easier-c331eeef1e0a

const exoplayer2 = com.google.android.exoplayer2;

@Component({
  selector: 'ns-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private player: ExoPlayerService) {}

  public ngOnInit(): void {
    try {
      this.player.loadPlaylist([
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      ]);

      this.player.play();
    } catch (err) {
      console.error(err);
      console.error(err.stack);
    }
  }
}
