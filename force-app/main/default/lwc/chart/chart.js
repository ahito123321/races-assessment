import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJs from '@salesforce/resourceUrl/chartjs';



export default class Chart extends LightningElement {
    @api chartjsInitialized = false;
    @api recordId;
    chart;

    renderedCallback() {
         if (this.chartjsInitialized) {
           return;
          }
         this.chartjsInitialized = true;
         console.log('chartjs loading');
         loadScript(this, ChartJs)
     .then(() => {
         this.Initializechartjs();
     })
     .catch(error => {
         console.log(error.message)
     });
    }
 
   Initializechartjs() {
     let ctx = this.template.querySelector(".line-chart");
     this.chart = new window.Chart(ctx ,{
         type: 'bar',
         data: {
            labels: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [
                {
                    label:'Day',
                    data: [110, 290, 150, 250, 500, 420, 100],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        
         },
         options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
        });
       }
   
}
