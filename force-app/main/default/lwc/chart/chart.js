import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJs from '@salesforce/resourceUrl/chartjs';



export default class Chart extends LightningElement {
    @api chartjsInitialized = false;
    @api recordId;
    @api labels;
    chart;
    removeItemDataset;
    addItemDataset;
    @api currentMatch;

    connectedCallback() {
        this.removeItemDataset = new CustomEvent('removeItemEvent');
        this.addItemDataset = new CustomEvent('addItemEvent');
    }



    renderedCallback() {
        console.log('render');
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
                    data: [190, 290, 150, 250, 500, 420, 100],
                backgroundColor: [
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)'
                ],
                borderColor: [
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)',
                    'rgb(0, 153, 255)'
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
