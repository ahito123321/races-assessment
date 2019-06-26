import { LightningElement, api, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJs from '@salesforce/resourceUrl/chartjs';
import { registerListener} from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

const CHART_COLUMN_COLOR = '#4db8ff';
const CHART_COLUMN_BORDER_COLOR = 'rgb(0, 153, 255)';

export default class Chart extends LightningElement {

    @wire(CurrentPageReference) pageRef;

    @api chartjsInitialized = false;
     dateOfMatch = [];
     dateCount = [];
    
    @track isLoading;
    chart;
    

            connectedCallback() {          
                registerListener('changeDataEvent', this.handleChangeDateEvent, this);
            }


            handleChangeDateEvent(event) {
                this.isLoading = true;
                
                let detail = event.detail;
                this.dateOfMatch = detail.map(d => d.date);
                this.dateCount = detail.map(d => d.count);   
                // console.log([...this.dateCount]);
               //  console.log([...this.dateOfMatch]);
                this.Initializechartjs();
                this.isLoading = false;
            }


            renderedCallback() {

                if (this.chartjsInitialized) {
                return;
                }
                this.chartjsInitialized = true;
                loadScript(this, ChartJs)
            .then(() => {
                this.Initializechartjs();
            })
            .catch(error => {
                console.log(error.message)
            });
            }
 
            Initializechartjs() {
                if (this.dateOfMatch.length === 0) return;   

                let ctx = this.template.querySelector(".line-chart");
                this.chart = new window.Chart(ctx ,{
                    type: 'bar',
                    data: {
                        labels: this.dateOfMatch,
                        datasets: [
                            {
                                label: 'Date Count',
                                data: this.dateCount,
                                backgroundColor: [
                                    ...this.dateCount.map(() => CHART_COLUMN_COLOR)
                                ],
                                borderColor: [
                                    ...this.dateCount.map(() => CHART_COLUMN_BORDER_COLOR)
                                ],
                                borderWidth: 1
                            }
                        ]
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