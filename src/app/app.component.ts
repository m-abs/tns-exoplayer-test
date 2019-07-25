import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from 'tns-core-modules/utils/utils';

// Reading https://www.raywenderlich.com/5573-media-playback-on-android-with-exoplayer-getting-started

const exoplayer2 = com.google.android.exoplayer2;

@Component({
  selector: 'ns-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private get context() {
    return utils.ad.getApplicationContext();
  }
  private trackSelector = new exoplayer2.trackselection.DefaultTrackSelector();
  private loadControl = new exoplayer2.DefaultLoadControl();
  private renderersFactory = new exoplayer2.DefaultRenderersFactory(this.context);

  private exoPlayer = exoplayer2.ExoPlayerFactory.newSimpleInstance(this.context, this.renderersFactory, this.trackSelector, this.loadControl);
  private playerListener = new exoplayer2.Player.EventListener({
    onTimelineChanged(param0: com.google.android.exoplayer2.Timeline, param1: any, param2: number) {
      console.log('onTimelineChanged', ...Array.from(arguments));
    },
    onTracksChanged(param0: com.google.android.exoplayer2.source.TrackGroupArray, param1: com.google.android.exoplayer2.trackselection.TrackSelectionArray) {
      console.log('onTracksChanged', ...Array.from(arguments));
    },
    onLoadingChanged(param0: boolean) {
      console.log('onLoadingChanged', ...Array.from(arguments));
    },
    onPlayerStateChanged(playWhenReady: boolean, playbackState: number) {
      console.log('onPlayerStateChanged', ...Array.from(arguments));
    },
    onRepeatModeChanged(param0: number) {
      console.log('onRepeatModeChanged', ...Array.from(arguments));
    },
    onShuffleModeEnabledChanged(param0: boolean) {
      console.log('onShuffleModeEnabledChanged', ...Array.from(arguments));
    },
    onPlayerError(param0: com.google.android.exoplayer2.ExoPlaybackException) {
      console.log('onPlayerError', ...Array.from(arguments));
    },
    onPositionDiscontinuity(param0: number) {
      console.log('onPositionDiscontinuity', ...Array.from(arguments));
    },
    onPlaybackParametersChanged(param0: com.google.android.exoplayer2.PlaybackParameters) {
      console.log('onPlaybackParametersChanged', ...Array.from(arguments));
    },
    onSeekProcessed() {
      console.log('onSeekProcessed', ...Array.from(arguments));
    },
  });

  public ngOnInit(): void {
    this.exoPlayer.addListener(this.playerListener);

    const userAgent = exoplayer2.util.Util.getUserAgent(this.context, 'mabs.dk');
    const mediaSource = new exoplayer2.source.ExtractorMediaSource.Factory(new exoplayer2.upstream.DefaultDataSourceFactory(this.context, userAgent))
      .setExtractorsFactory(new exoplayer2.extractor.DefaultExtractorsFactory())
      .createMediaSource(android.net.Uri.parse('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'));

    this.exoPlayer.prepare(mediaSource);

    this.exoPlayer.setPlayWhenReady(true);
  }

  ngOnDestroy(): void {
    this.exoPlayer.stop();
    this.exoPlayer.removeListener(this.playerListener);
    this.exoPlayer = null;
  }
}
