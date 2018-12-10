import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'hammerjs';

@Component({
  selector: 'app-swipe-up-drawer',
  templateUrl: './swipe-up-drawer.component.html',
  styleUrls: ['./swipe-up-drawer.component.scss']
})
export class SwipeUpDrawerComponent implements OnInit {
  @ViewChild('drawer') el: ElementRef;
  @ViewChild('content') content: ElementRef;
  event: any;
  windowHeight: number;
  test: any;
  position: string;

  constructor() {}

  ngOnInit() {
    this.position = 'up';
    this.windowHeight = window.innerHeight;
    this.test = new window['Hammer'].Manager(document.getElementById('touch'));
    const pan = new window['Hammer'].Pan();
    const tap = new window['Hammer'].Tap();
    this.test.add(pan);
    this.test.add(tap);
    this.test.on('tap', e => {
      this.onTap();
    });
    this.test.on('panstart', e => {
      this.position = 'middle';
    });
    this.test.on('pan', e => {
      this.windowHeight = window.innerHeight;
      let y = e.center.y;
      y = y < 0 ? 0 : y;
      this.el.nativeElement.style.top = y + 'px';
      y = this.windowHeight - y - 50;
      this.content.nativeElement.style.height = y + 'px';
    });
    this.test.on('panend', e => {
      this.onSwipe(e);
    });
  }

  onSwipe(event: any) {
    if (event.overallVelocityY > 0.7) {
      this.el.nativeElement.style.top = '';
      this.content.nativeElement.style.height = '0%';
      this.position = 'down';
    }
    if (event.overallVelocityY < -0.7) {
      this.el.nativeElement.style.top = '';
      this.content.nativeElement.style.height = '80%';
      this.position = 'up';
    }
  }

  onTap() {
    if (this.position !== 'up') {
      this.el.nativeElement.style.top = '';
      this.content.nativeElement.style.height = '80%';
      this.position = 'up';
    } else {
      this.el.nativeElement.style.top = '';
      this.content.nativeElement.style.height = '0%';
      this.position = 'down';
    }
  }
}
