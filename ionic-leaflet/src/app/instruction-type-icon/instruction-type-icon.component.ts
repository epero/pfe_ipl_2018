import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-type-icon',
  templateUrl: './instruction-type-icon.component.html',
  styleUrls: ['./instruction-type-icon.component.scss']
})
export class InstructionTypeIconComponent implements OnInit {
  @Input() type: number;
  src: string;

  private typeToIconTab: Array<string>;

  constructor() {
    this.typeToIconTab = [
      'turn_left',
      'turn_right',
      'turn_sharp_left',
      'turn_sharp_right',
      'turn_slight_left',
      'turn_slight_right',
      'turn_straight',
      'roundabout', //'enter roundabout',
      'roundabout', //'exit roundabout',
      'uturn',
      'arrive',
      'depart',
      'off_ramp_slight_left', //'keep left',
      'off_ramp_slight_right' //'keep right'
    ];
  }

  ngOnInit() {
    this.src =
      'assets/instruction-icon/direction_' +
      this.typeToIconTab[this.type] +
      '.png';
  }
}
