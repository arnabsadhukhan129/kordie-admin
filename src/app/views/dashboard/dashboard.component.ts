import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from '../../../app/services/authenticate/authenticate.service';
import { UserService } from '../../../app/services/user/user.service';
import { getStyle, hexToRgba } from '@coreui/utils/src';
import {
  Chart,
  registerables,
  ChartConfiguration,
  ChartType,
  ChartOptions,
} from 'chart.js';
Chart.register(...registerables);

import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userno = { active_count: 0, inactive_count: 0 };
  courseno = { active_count: 0, inactive_count: 0 };
  chapterno = { active_count: 0, inactive_count: 0 };

  mainChart: {
    type: ChartType;
    data: ChartConfiguration['data'];
    options: ChartOptions;
    plugins: {
      id: string;
      afterDatasetsDraw: (chart: any) => void;
    }[];
  };

  // mainChart: IChartProps = {
  //   data: {
  //     labels: [
  //       'January',
  //       'February',
  //       'March',
  //       'April',
  //       'May',
  //       'June',
  //       'July',
  //       'August',
  //       'September',
  //       'October',
  //       'November',
  //       'December',
  //     ],
  //     datasets: [
  //       {
  //         label: 'Sample Data',
  //         backgroundColor: 'rgba(75,192,192,0.4)',
  //         borderColor: 'rgba(75,192,192,1)',
  //         borderWidth: 1,
  //         hoverBackgroundColor: 'rgba(75,192,192,0.6)',
  //         hoverBorderColor: 'rgba(75,192,192,1)',
  //         data: [65, 59, 80, 81, 56, 55, 40],
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: true,
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //       },
  //     },
  //   },
  //   type: 'bar',
  // };

  errorMessage: string = '';

  isLoaded: boolean = false;

  profileData: any = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notify_email: '',
  };

  today_date: string = new Date().toISOString().split('T')[0];
  start_date: string = '';
  end_date: string = '';

  trafficRadioGroup = this.buildTrafficRadio();

  user_type :any = {
    type : 'user',
    status : 'is_active',
  }

  constructor(
    private __auth: AuthenticateService,
    private __route: Router,
    private __user: UserService,
    private __shared: SharedService
  ) {
    const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const defaultValues = [12, 18, 25, 32, 15, 48, 20];
    const barColors = [
      'rgb(0, 102, 255)',
      'rgb(0, 153, 68)',
      'rgb(255, 153, 0)',
      'rgb(220, 0, 0)',
      'rgb(102, 204, 102)',
      'rgb(1, 25, 70)',
    ];
    const offset = 5;
    const lineValues = defaultValues.map((v) => v + offset);
    this.mainChart = {
      type: 'bar',
      data: {
        labels: defaultLabels,
        datasets: [
          {
            label: 'Transactions',
            type: 'bar',
            data: defaultValues, // [12,18,25,32,40,48]
            backgroundColor: barColors,
            borderWidth: 0,
            borderRadius: 20,
            categoryPercentage: 0.6,
            barPercentage: 0.8,
          },
          // ─────── Line dataset (offset above bars) ────────
          {
            label: 'Trend',
            type: 'line',
            data: lineValues, // [17,23,30,37,45,53]
            fill: false,
            borderColor: 'rgb(220, 20, 60)',
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 0,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            cornerRadius: 4,
            padding: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#555',
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            // If you want Chart.js to auto‐expand above 53, you can also set:
            suggestedMax: Math.max(...lineValues) + 5,
            grid: {
              color: '#e0e0e0',
              lineWidth: 1,
              borderDash: [4, 4],
            },
            ticks: {
              color: '#555',
              font: { size: 12 },
            },
          },
        },
      } as ChartOptions,
      plugins: [
        {
          id: 'lineArrowhead',
          afterDatasetsDraw: (chart) => {
            const lineDatasetIndex = 1; // the second dataset is the line
            const meta = chart.getDatasetMeta(lineDatasetIndex);
            if (!meta.data.length) return;

            const ctx = chart.ctx;
            const lastPoint = meta.data[meta.data.length - 1];
            const penultimatePoint = meta.data[meta.data.length - 2];

            if (!lastPoint) return;
            const { x: xPos, y: yPos } = lastPoint.getProps(['x', 'y'], true);
            if (!penultimatePoint) {
              ctx.save();
              ctx.fillStyle = chart.data.datasets[lineDatasetIndex]
                .borderColor as string;
              ctx.beginPath();
              ctx.moveTo(xPos, yPos);
              ctx.lineTo(xPos - 6, yPos + 10);
              ctx.lineTo(xPos + 6, yPos + 10);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
              return;
            }
            const { x: x2, y: y2 } = penultimatePoint.getProps(
              ['x', 'y'],
              true
            );
            const dx = xPos - x2;
            const dy = yPos - y2;
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length === 0) return;

            const ux = dx / length;
            const uy = dy / length;
            const perpX = -uy;
            const perpY = ux;
            const arrowLength = 10;
            const arrowWidth = 6;
            const baseX = xPos - ux * arrowLength;
            const baseY = yPos - uy * arrowLength;

            const leftX = baseX + perpX * (arrowWidth / 2);
            const leftY = baseY + perpY * (arrowWidth / 2);
            const rightX = baseX - perpX * (arrowWidth / 2);
            const rightY = baseY - perpY * (arrowWidth / 2);

            ctx.save();
            ctx.fillStyle = chart.data.datasets[lineDatasetIndex]
              .borderColor as string;
            ctx.beginPath();
            ctx.moveTo(xPos, yPos);
            ctx.lineTo(leftX, leftY);
            ctx.lineTo(rightX, rightY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.getProfileDetail();
    this.goList(this.user_type.type, this.user_type.status);
  }

  getProfileDetail() {
    this.__user.detailsUser().subscribe(
      (response) => {
        if (response.error == false) {
          this.profileData = response.data;
        }
      },
      (err) => {
        console.log(err);
        if (err.status == 403) {
          this.__shared.sessionExpired();
        }
      }
    );
  }

  checkMessage() {
    if (this.errorMessage != '') {
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);

      return true;
    } else {
      return false;
    }
  }

  goList(type: string, status: string) {
    this.__user.dashboard().subscribe(
      (response) => {
        if (response.error == false) {
          console.log(response?.data,"<----------RESPONSE")
          this.userno = response?.data?.userno;
          this.courseno = response?.data?.courseno;
          this.chapterno = response?.data?.chapterno;
        }
      },
      (err) => {
        console.log(err);
        if (err.status == 403) {
          this.__shared.sessionExpired();
        }
      }
    );
  }

  getChangedDateGraph() {
    console.log(
      `Get changed date graph from ${this.start_date} to ${this.end_date}`
    );
  }

  setTrafficPeriod(period: string) {
    this.trafficRadioGroup.controls['trafficRadio'].setValue(period);
    console.log(`Set traffic period to ${period}`);
  }
  buildTrafficRadio() {
    return new FormGroup({
      trafficRadio: new FormControl('Day'),
    });
  }
}
