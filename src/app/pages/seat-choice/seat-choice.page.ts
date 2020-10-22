import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TicketInfoService } from 'src/app/services/ticket-info.service';

@Component({
  selector: 'app-seat-choice',
  templateUrl: './seat-choice.page.html',
  styleUrls: ['./seat-choice.page.scss'],
})
export class SeatChoicePage implements OnInit {
  rowList = ['A', 'B', 'C', 'D', 'E', 'F'];
  colList = ['1', '2', '3', '4', '5', '6', '7', '8'];
  listBookingSeatString = '...';
  bookingSeatList: Array<string>;
  bookedSeatList: Array<string>;
  ticketPrice: number;
  foodNameList: Array<string>;
  foodNumberList: Array<number>;
  foodPriceList: Array<number>;
  maxBookingSeat: number;
  seatMoney: number;
  seatMoneyString: string;

  constructor(public ticketInfo: TicketInfoService, public toastController: ToastController) {
    this.ticketPrice = 50000;
    this.maxBookingSeat = 8;
    this.bookingSeatList = new Array<string>();
    this.bookedSeatList = new Array<string>('C4', 'D4', 'A7');
    this.seatMoney = 0;
    this.seatMoneyString = '0đ';
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.bookedSeatList.forEach(item => {
      document.getElementById(item).setAttribute('color', 'dark');
    })
  }

  async press(row, col) {
    let result = await this.changeSeat(row + col);
    let seat = document.getElementById(row + col);
    switch (result) {
      case 'booked':
        const bookedToast = await this.toastController.create({
          message: 'Ghế này đã có người đặt.',
          duration: 1000,
          position: 'middle'
        });
        bookedToast.present();
        return;
      case 'max':
        const maxToast = await this.toastController.create({
          message: 'Chỉ được đặt tối đa ' + this.maxBookingSeat + ' ghế !!!',
          duration: 1000,
          position: 'middle'
        });
        maxToast.present();
        return;
      case 'added':
        seat.setAttribute('color', 'danger');
        break;
      case 'removed':
        seat.setAttribute('color', 'primary');
        break;
    }
    this.listBookingSeatString = this.bookingSeatListToString();
  }
  async changeSeat(seat) {
    if (this.bookedSeatList.includes(seat))
      return 'booked';
    let index = this.bookingSeatList.indexOf(seat);
    if (index >= 0) {
      this.bookingSeatList.splice(index, 1);
      this.calculateSeatMoney();
      return 'removed';
    }
    if (this.bookingSeatList.length >= this.maxBookingSeat)
      return 'max';
    else {
      this.bookingSeatList.push(seat);
      this.calculateSeatMoney();
      return 'added';
    }
  }
  bookingSeatListToString() {
    let output: string = '';
    this.bookingSeatList.forEach(item => {
      output += item + ', ';
    })
    output = output.slice(0, output.length - 2);
    if (output == '')
      output = '...';
    return output;
  }
  calculateSeatMoney() {
    let money = this.bookingSeatList.length * this.ticketPrice;
    this.seatMoney = money;
    this.seatMoneyString = money.toLocaleString('en').split(',').join('.') + 'đ';
  }
}