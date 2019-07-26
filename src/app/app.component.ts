/// <references path="../exoplayer.d.ts" />

import { Component, OnDestroy, OnInit } from '@angular/core';
import * as utils from 'tns-core-modules/utils/utils';

// Reading https://www.raywenderlich.com/5573-media-playback-on-android-with-exoplayer-getting-started
// https://android.jlelse.eu/sending-media-to-chromecast-has-never-been-easier-c331eeef1e0a

const exoplayer2 = com.google.android.exoplayer2;

@Component({
  selector: 'ns-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private interval: any;

  private get context() {
    return utils.ad.getApplicationContext();
  }
  private trackSelector = new exoplayer2.trackselection.DefaultTrackSelector();
  private loadControl = new exoplayer2.DefaultLoadControl();
  private renderersFactory = new exoplayer2.DefaultRenderersFactory(this.context);

  private exoPlayer = exoplayer2.ExoPlayerFactory.newSimpleInstance(this.context, this.renderersFactory, this.trackSelector, this.loadControl);
  private playerListener = new exoplayer2.Player.EventListener({
    /**
     * Called when the timeline and/or manifest has been refreshed.
     * Note that if the timeline has changed then a position discontinuity may also have occurred.
     * For example, the current period index may have changed as a result of periods being added or removed from the timeline.
     * This will not be reported via a separate call to onPositionDiscontinuity(int).
     *
     * @param Timeline The latest timeline. Never null, but may be empty
     * @param manifest The latest manifest. May be null
     * @param reason The Player.TimelineChangeReason responsible for this timeline change
     */
    onTimelineChanged(Timeline: com.google.android.exoplayer2.Timeline, manifest: any, reason: number) {
      switch (reason) {
        case exoplayer2.Player.TIMELINE_CHANGE_REASON_PREPARED: {
          console.log(`onTimelineChanged - reason = "prepared"`);
          break;
        }
        case exoplayer2.Player.TIMELINE_CHANGE_REASON_RESET: {
          console.log(`onTimelineChanged - reason = "reset"`);
          break;
        }
        case exoplayer2.Player.TIMELINE_CHANGE_REASON_DYNAMIC: {
          console.log(`onTimelineChanged - reason = "dynamic"`);
          break;
        }
        default: {
          console.error(`onTimelineChanged - reason is unknown`);
          break;
        }
      }
    },
    /**
     * Called when the available or selected tracks change.
     *
     * @param trackGroups The available tracks. Never null, but may be of length zero.
     * @param trackSelections The track selections for each renderer. Never null and always of length Player.getRendererCount(), but may contain null elements.
     */
    onTracksChanged: (
      trackGroups: com.google.android.exoplayer2.source.TrackGroupArray,
      trackSelections: com.google.android.exoplayer2.trackselection.TrackSelectionArray,
    ) => {
      console.log('onTracksChanged');
      console.log(this.exoPlayer.getCurrentTag());

      for (let i = 0; i < trackGroups.length; i += 1) {
        const trackGroup = trackGroups.get(i);

        for (let j = 0; j < trackGroup.length; j += 1) {
          const format = trackGroup.getFormat(j);
          console.log('onTracksChanged - group', i, 'format', j, format);
        }
      }

      for (let i = 0; i < trackSelections.length; i += 1) {
        const trackSelection = trackSelections.get(i);
        if (!trackSelection) {
          continue;
        }

        const format = trackSelection.getFormat(0);
        const indexInTrackGroup = trackSelection.getIndexInTrackGroup(0);
        const selectedFormat = trackSelection.getSelectedFormat();
        const selectedIndex = trackSelection.getSelectedIndex();
        const selectedIndexInTrackGroup = trackSelection.getSelectedIndexInTrackGroup();
        const selectionData = trackSelection.getSelectionData();
        const selectionReason = trackSelection.getSelectionReason();

        console.log('onTracksChanged - selection', i, {
          format,
          indexInTrackGroup,
          selectedFormat,
          selectedIndex,
          selectedIndexInTrackGroup,
          selectionData,
          selectionReason,
        });
      }
    },
    /**
     * Called when the player starts or stops loading the source.
     * @param isLoading Whether the source is currently being loaded
     */
    onLoadingChanged(isLoading: boolean) {
      console.log('onLoadingChanged', !!isLoading);
    },
    /**
     * Called when the value returned from either Player.getPlayWhenReady() or Player.getPlaybackState() changes.
     *
     * @param playWhenReady Whether playback will proceed when ready
     * @param playbackState One of the STATE constants
     */
    onPlayerStateChanged(playWhenReady: boolean, playbackState: number) {
      switch (playbackState) {
        case exoplayer2.Player.STATE_BUFFERING: {
          console.log(`onPlayerStateChanged(${playWhenReady}, ${playbackState}). State = 'buffering'`);
          break;
        }
        case exoplayer2.Player.STATE_IDLE: {
          console.log(`onPlayerStateChanged(${playWhenReady}, ${playbackState}). State = 'idle'`);
          break;
        }
        case exoplayer2.Player.STATE_ENDED: {
          console.log(`onPlayerStateChanged(${playWhenReady}, ${playbackState}). State = 'ended'`);
          break;
        }
        case exoplayer2.Player.STATE_READY: {
          console.log(`onPlayerStateChanged(${playWhenReady}, ${playbackState}). State = 'ready'`);
          break;
        }
        default: {
          console.error(`onPlayerStateChanged(${playWhenReady}, ${playbackState}). State is unknown`);
          break;
        }
      }
    },
    /**
     * Called when the value of Player.getRepeatMode() changes.
     * @param repeatMode The Player.RepeatMode used for playback.
     */
    onRepeatModeChanged(repeatMode: number) {
      switch (repeatMode) {
        case exoplayer2.Player.REPEAT_MODE_ALL: {
          console.log(`onRepeatModeChanged(${repeatMode}) - mode = 'ALL'`);
          break;
        }
        case exoplayer2.Player.REPEAT_MODE_OFF: {
          console.log(`onRepeatModeChanged(${repeatMode}) - mode = 'OFF'`);
          break;
        }
        case exoplayer2.Player.REPEAT_MODE_ONE: {
          console.log(`onRepeatModeChanged(${repeatMode}) - mode = 'ONE'`);
          break;
        }
        default: {
          console.error(`onRepeatModeChanged(${repeatMode}) - mode is unknown`);
          break;
        }
      }
    },
    /**
     * Called when the value of Player.getShuffleModeEnabled() changes.
     * @param shuffleModeEnabled Whether shuffling of windows is enabled
     */
    onShuffleModeEnabledChanged(shuffleModeEnabled: boolean) {
      console.log('onShuffleModeEnabledChanged', !!shuffleModeEnabled);
    },
    /**
     * Called when an error occurs. The playback state will transition to Player.STATE_IDLE immediately after this method is called.
     * The player instance can still be used, and Player.release() must still be called on the player should it no longer be required.
     *
     * @param error
     */
    onPlayerError(error: com.google.android.exoplayer2.ExoPlaybackException) {
      console.log('onPlayerError', error);
    },
    /**
     * Called when a position discontinuity occurs without a change to the timeline.
     * A position discontinuity occurs when the current window or period index changes (as a result of playback
     * transitioning from one period in the timeline to the next), or when the playback position jumps within the
     * period currently being played (as a result of a seek being performed, or when the source introduces a discontinuity internally).
     *
     * When a position discontinuity occurs as a result of a change to the timeline this method is not called.
     * onTimelineChanged(Timeline, Object, int) is called in this case.
     *
     * @param reason
     */
    onPositionDiscontinuity(reason: number) {
      console.log(global['exoPlayer'].getCurrentTag());

      switch (reason) {
        case exoplayer2.Player.DISCONTINUITY_REASON_AD_INSERTION: {
          console.log(`onPositionDiscontinuity - reason = "DISCONTINUITY_REASON_AD_INSERTION"`);
          break;
        }
        case exoplayer2.Player.DISCONTINUITY_REASON_INTERNAL: {
          console.log(`onPositionDiscontinuity - reason = "DISCONTINUITY_REASON_INTERNAL"`);
          break;
        }
        case exoplayer2.Player.DISCONTINUITY_REASON_PERIOD_TRANSITION: {
          console.log(`onPositionDiscontinuity - reason = "DISCONTINUITY_REASON_PERIOD_TRANSITION"`);
          break;
        }
        case exoplayer2.Player.DISCONTINUITY_REASON_SEEK: {
          console.log(`onPositionDiscontinuity - reason = "DISCONTINUITY_REASON_SEEK"`);
          break;
        }
        case exoplayer2.Player.DISCONTINUITY_REASON_SEEK_ADJUSTMENT: {
          console.log(`onPositionDiscontinuity - reason = "DISCONTINUITY_REASON_SEEK_ADJUSTMENT"`);
          break;
        }
        default: {
          console.error(`onPositionDiscontinuity - reason = "${reason}" is unknown`);
          break;
        }
      }
    },
    /**
     * Called when the current playback parameters change.
     * The playback parameters may change due to a call to Player.setPlaybackParameters(PlaybackParameters),
     * or the player itself may change them (for example, if audio playback switches to passthrough mode, where speed adjustment is no longer possible).
     * @param playbackParameters
     */
    onPlaybackParametersChanged(playbackParameters: com.google.android.exoplayer2.PlaybackParameters) {
      const { pitch, speed, skipSilence } = playbackParameters;
      console.log('onPlaybackParametersChanged', { pitch, speed, skipSilence });
    },
    /**
     * Called when all pending seek requests have been processed by the player.
     * This is guaranteed to happen after any necessary changes to the player state were reported to onPlayerStateChanged(boolean, int).
     */
    onSeekProcessed() {
      console.log('onSeekProcessed');
    },
  });

  private concatenatedSource = new exoplayer2.source.ConcatenatingMediaSource(Array.create(exoplayer2.source.ExtractorMediaSource, 0));

  public ngOnInit(): void {
    this.exoPlayer.addListener(this.playerListener);

    const userAgent = exoplayer2.util.Util.getUserAgent(this.context, 'mabs.dk');

    for (const url of ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3']) {
      const mediaSource = new com.google.android.exoplayer2.source.ProgressiveMediaSource.Factory(
        new exoplayer2.upstream.DefaultDataSourceFactory(this.context, userAgent),
      )
        .setTag(url)
        .createMediaSource(android.net.Uri.parse(url));

      this.concatenatedSource.addMediaSource(mediaSource);
    }

    this.exoPlayer.prepare(this.concatenatedSource);

    this.exoPlayer.setPlayWhenReady(true);

    global['exoPlayer'] = this.exoPlayer;
    global['concatenatedSource'] = this.concatenatedSource;

    this.interval = setInterval(() => {
      if (!this.exoPlayer.getPlayWhenReady()) {
        return;
      }

      const currentPosition = this.exoPlayer.getCurrentPosition();
      const duration = this.exoPlayer.getDuration();
      const currentTag = this.exoPlayer.getCurrentTag();
      console.log({
        currentPosition,
        duration,
        currentTag,
        pct: Number((currentPosition / duration) * 100).toFixed(2),
      });
    }, 250);
  }

  ngOnDestroy(): void {
    this.exoPlayer.stop();
    this.exoPlayer.removeListener(this.playerListener);
    this.exoPlayer = null;
    this.concatenatedSource = null;
    clearInterval(this.interval);

    delete global['concatenatedSource'];
    delete global['exoPlayer'];
  }
}
