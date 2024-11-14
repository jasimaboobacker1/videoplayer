import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class HomePage implements AfterViewInit {
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
  }

  setDynamicDimensions() {
    const container = this.videoContainer.nativeElement;
    // Set the video player size dynamically
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    if (this.player) {
      this.player.setSize(containerWidth, containerHeight);
    }
  }

  savePlayer(player: YT.Player) {
    this.player = player;
    this.setDynamicDimensions(); // Ensure dimensions are set when player is ready
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
      }
    }, 1000);
  }

  stopTrackingTime() {
    clearInterval(this.timerInterval);
  }

  saveWatchTime() {
    console.log('Saved Watch Time:', this.watchTimeInSeconds);
  }

  getFormattedWatchTime() {
    const minutes = Math.floor(this.watchTimeInSeconds / 60);
    const seconds = Math.floor(this.watchTimeInSeconds % 60);
    return `${minutes} minutes ${seconds} seconds`;
  }
}
