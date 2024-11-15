import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { YoutubePlayerComponent } from 'ngx-youtube-player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, YoutubePlayerComponent, CommonModule],
})


export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;

  id: string = 'gCRCXf7XTXk';
  player!: YT.Player;
  watchTimeInSeconds: number = 0;
  timerInterval: any;

  videoWidth: number = window.innerWidth;
  videoHeight: number = window.innerHeight;

  ngAfterViewInit() {
    this.setDynamicDimensions();
    window.addEventListener('resize', this.setDynamicDimensions.bind(this));

    const savedTime = localStorage.getItem(`watchTime-${this.id}`);
    if (savedTime) {
      this.watchTimeInSeconds = parseFloat(savedTime);
    }
  }

  setDynamicDimensions() {
    const container = this.videoContainer.nativeElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    if (this.player) {
      this.player.setSize(containerWidth, containerHeight);
    }
  }

  savePlayer(player: YT.Player) {
    this.player = player;
    this.setDynamicDimensions();

    if (this.watchTimeInSeconds > 0) {
      this.player.seekTo(this.watchTimeInSeconds, true);
    }
    console.log('Player instance', player);
  }

  onStateChange(event: any) {
    const playerState = event.data;
    if (playerState === YT.PlayerState.PLAYING) {
      this.startTrackingTime();
    } else {
      this.stopTrackingTime();
      this.saveWatchTime();
    }

    if (playerState === YT.PlayerState.ENDED) {
      this.stopTrackingTime();
      this.saveWatchTime();
      console.log('Video finished. Total watch time:', this.watchTimeInSeconds);
    }
  }

  startTrackingTime() {
    this.timerInterval = setInterval(() => {
      if (this.player) {
        this.watchTimeInSeconds = this.player.getCurrentTime();
        console.log('Current watch time:', this.watchTimeInSeconds);
        this.saveWatchTime();
      }
    }, 1000);
  }

  stopTrackingTime() {
    clearInterval(this.timerInterval);
  }

  saveWatchTime() {
    localStorage.setItem(`watchTime-${this.id}`, this.watchTimeInSeconds.toString());
    console.log('Saved Watch Time:', this.watchTimeInSeconds);
  }

  getFormattedWatchTime() {
    const minutes = Math.floor(this.watchTimeInSeconds / 60);
    const seconds = Math.floor(this.watchTimeInSeconds % 60);
    return `${minutes} minutes ${seconds} seconds`;
  }

  ngOnDestroy() {
    this.saveWatchTime();
    window.removeEventListener('resize', this.setDynamicDimensions.bind(this));
  }
}
