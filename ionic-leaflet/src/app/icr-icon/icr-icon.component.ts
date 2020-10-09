import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-icr-icon',
  templateUrl: './icr-icon.component.html',
  styleUrls: ['./icr-icon.component.scss']
})
export class IcrIconComponent implements OnInit {
  @Input() icrName: string;
  @Input() color: string;
  @ViewChild('icon', { static: true }) icon: ElementRef;

  private regex: RegExp;

  constructor() {
    this.regex = /^\d+$/;
  }

  ngOnInit() {
    this.icon.nativeElement.style.backgroundColor = this.color;
    if (!this.regex.test(this.icrName)) {
      this.icon.nativeElement.style.borderRadius = '50%';
    }
  }
}
