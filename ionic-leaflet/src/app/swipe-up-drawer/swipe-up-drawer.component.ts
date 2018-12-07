import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'hammerjs';

@Component({
  selector: 'app-swipe-up-drawer',
  templateUrl: './swipe-up-drawer.component.html',
  styleUrls: ['./swipe-up-drawer.component.scss']
})
export class SwipeUpDrawerComponent implements OnInit {
  @ViewChild('drawer') el: ElementRef;
  event: any;
  windowHeight: number;
  test: any;

  constructor() {}

  ngOnInit() {
    this.windowHeight = window.innerWidth;
    this.test = new window['Hammer'].Manager(document.getElementById('swm'));
    console.log(this.test);
    let swipe = new window['Hammer'].Swipe();
    console.log(swipe);
    this.test.add(swipe);
    this.test.on('swipe', e => {
      this.onSwipe(e);
    });
  }

  onSwipe(event: any) {
    if (event.overallVelocityY > 0.7) {
      console.log('down');
      this.el.nativeElement.style.top = '90%';
    }
    if (event.overallVelocityY < -0.7) {
      console.log('up');
      this.el.nativeElement.style.top = '0%';
    }
  }

  onClick() {
    if(this.el.nativeElement.style.top !== '90%') {
      this.el.nativeElement.style.top = '90%';
    } else {
      this.el.nativeElement.style.top = '0%';
    }
  }
}
