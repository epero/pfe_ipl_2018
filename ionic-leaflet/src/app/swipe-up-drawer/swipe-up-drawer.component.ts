import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'hammerjs';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-swipe-up-drawer',
  templateUrl: './swipe-up-drawer.component.html',
  styleUrls: ['./swipe-up-drawer.component.scss']
})
export class SwipeUpDrawerComponent implements OnInit {
  @ViewChild('drawer', { static: true }) el: ElementRef;
  @ViewChild('content', { static: true }) content: ElementRef;
  event: any;
  windowHeight: number;
  test: any;
  position: string;

  constructor(private drawerService: DrawerService) {}

  ngOnInit() {
    this.position = 'down';
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
      let y = e.center.y - this.drawerService.toolbarHeight;
      y = y < 0 ? 0 : y;
      if (y > this.windowHeight - 50 - this.drawerService.toolbarHeight) {
        this.setDrawer('down');
        return;
      }
      this.el.nativeElement.style.top = y + 'px';
      y = this.windowHeight - y - 50;
      this.content.nativeElement.style.height = y + 'px';
    });
    this.test.on('panend', e => {
      this.onSwipe(e);
    });
  }

  setDrawer(pos: string) {
    this.el.nativeElement.style.top = '';
    switch (pos) {
      case 'down':
        this.content.nativeElement.style.height = '0%';
        break;
      case 'up':
        this.content.nativeElement.style.height = '80%';
        break;
    }
    this.position = pos;
  }

  onSwipe(event: any) {
    if (event.overallVelocityY > 0.7) {
      this.setDrawer('down');
    }
    if (event.overallVelocityY < -0.7) {
      this.setDrawer('up');
    }
  }

  onTap() {
    if (this.position !== 'up') {
      this.setDrawer('up');
    } else {
      this.setDrawer('down');
    }
  }
}
