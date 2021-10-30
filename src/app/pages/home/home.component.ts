import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { isNumeric } from 'rxjs-compat/util/isNumeric';
import { UserProfileService } from '../../core/services/user.service';
import { speakerContry, pieChart, newSpeaker, customPieChart, donughnutChart, barChart } from './data';
import { ChartType } from './home.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  speakerPerCountry: ChartType;
  improverPerCountry: ChartType;
  newSpeaker: ChartType;
  newImprover: ChartType;
  speakerLanguage: ChartType;
  improverLanguage: ChartType;
  newUserByLanguage: ChartType;
  cancelByLanguage: ChartType;
  lengthSpeaker: number = 0;
  lengthImprover: number = 0;
  lengthScheduledCalls: number = 0;
  lengthSpeakerAwaitingApp: number = 0;
  incidenciasMes: ChartType;
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService
  ) { 
    
   }
  ngOnInit(): void {
    this._fetchData();
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Dashboard', active: true }];
    this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'conversador')).snapshotChanges()
    .subscribe(data => {
      var arLanguage = [];
      var dataLanguage = [];
      var nameLanguage = [];
      var arCountry = [];
      var dataCountry = [];
      var nameCountry = [];
      var newSpeakers = 0;
      var allSpeakers = 0;
      var mes = new Date().getMonth();
      var anio = new Date().getFullYear();
      data.forEach((countrie: any) => {
        arCountry.push(countrie.payload.doc.data()['country'].toUpperCase());
        allSpeakers = allSpeakers+1;
        if(countrie.payload.doc.data()['creado'] != undefined){
          var dateUserMonth = new Date(countrie.payload.doc.data()['creado']).getMonth();
          var dateUserYear = new Date(countrie.payload.doc.data()['creado']).getFullYear();
          if(mes == dateUserMonth && anio == dateUserYear){
            newSpeakers = newSpeakers+1;
          }
        }
        if(countrie.payload.doc.data()['idioma'] != undefined){
          arLanguage.push(countrie.payload.doc.data()['idioma'][0].toUpperCase());
        }
      })
      let counts = {};
      for(let i =0; i < arCountry.length; i++){ 
        if (counts[arCountry[i]]){
        counts[arCountry[i]] += 1
        } else {
        counts[arCountry[i]] = 1
        }
      }
      for (let prop in counts){
        if (counts[prop] >= 1){
            dataCountry.push({value: counts[prop], name:prop});
            nameCountry.push(prop);
        }
      }
      let countsIdioma = {};
      for(let i =0; i < arLanguage.length; i++){ 
        if (countsIdioma[arLanguage[i]]){
        countsIdioma[arLanguage[i]] += 1
        } else {
        countsIdioma[arLanguage[i]] = 1
        }
      }
      for (let prop in countsIdioma){
        if (countsIdioma[prop] >= 1){
            dataLanguage.push({value: countsIdioma[prop], name:prop});
            nameLanguage.push(prop);
        }
      }
      this.speakerPerCountry= {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataCountry,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameCountry,
        }
      };
      this.newSpeaker= {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: [
              {value: newSpeakers, name:"NUEVOS"},
              {value: allSpeakers, name:"TOTAL"},
            ],
            type: 'pie',
        }],
        color: ['#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['NUEVOS', 'TOTAL'],
        }
      };
      this.speakerLanguage = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: nameLanguage,
            textStyle: { color: '#8791af' }
        },
        color: ['#556ee6', '#f1b44c', '#f46a6a', '#50a5f1', '#34c38f'],
        series: [
            {
                name: 'Speakers por idioma',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: dataLanguage
            }
        ]
      }
      this.lengthSpeaker = data.length;
    });
    this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'cliente')).snapshotChanges()
    .subscribe(data => {
      var arCountry = [];
      var dataCountry = [];
      var nameCountry = [];
      var newImprovers = 0;
      var allimprovers = 0;
      var mes = new Date().getMonth();
      var anio = new Date().getFullYear();
      var arLanguage = [];
      var dataLanguage = [];
      var nameLanguage = [];
      data.forEach((countrie: any) => {
        arCountry.push(countrie.payload.doc.data()['country'].toUpperCase());
        allimprovers = allimprovers+1;
        if(countrie.payload.doc.data()['creado'] != undefined){
          var dateUserMonth = new Date(countrie.payload.doc.data()['creado']).getMonth();
          var dateUserYear = new Date(countrie.payload.doc.data()['creado']).getFullYear();
          if(mes == dateUserMonth && anio == dateUserYear){
            newImprovers = newImprovers+1;
          }
        }
        if(countrie.payload.doc.data()['idioma'] != undefined){
          arLanguage.push(countrie.payload.doc.data()['idioma'][0].toUpperCase());
        }
      })
      let counts = {};
      for(let i =0; i < arCountry.length; i++){ 
        if (counts[arCountry[i]]){
        counts[arCountry[i]] += 1
        } else {
        counts[arCountry[i]] = 1
        }
      }
      for (let prop in counts){
        if (counts[prop] >= 1){
            dataCountry.push({value: counts[prop], name:prop});
            nameCountry.push(prop);
        }
      }
      let countsIdioma = {};
      for(let i =0; i < arLanguage.length; i++){ 
        if (countsIdioma[arLanguage[i]]){
        countsIdioma[arLanguage[i]] += 1
        } else {
        countsIdioma[arLanguage[i]] = 1
        }
      }
      for (let prop in countsIdioma){
        if (countsIdioma[prop] >= 1){
            dataLanguage.push({value: countsIdioma[prop], name:prop});
            nameLanguage.push(prop);
        }
      }
      this.improverPerCountry= {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataCountry,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameCountry,
        }
      };
      this.newImprover= {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: [
              {value: newImprovers, name:"Nuevos"},
              {value: allimprovers, name:"Total"},
            ],
            type: 'pie',
        }],
        color: ['#593dba','#7c6eac'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['Nuevos', 'Total'],
        }
      };
      this.improverLanguage = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: nameLanguage,
            textStyle: { color: '#8791af' }
        },
        color: ['#556ee6', '#f1b44c', '#f46a6a', '#50a5f1', '#34c38f'],
        series: [
            {
                name: 'Speakers por idioma',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: dataLanguage
            }
        ]
      }
      this.lengthImprover = data.length;
    });
    this.fbstore.collection('perfiles').snapshotChanges()
    .subscribe(data => {
      var newUser = 0;
      var allUsers = 0;
      var mes = new Date().getMonth();
      var anio = new Date().getFullYear();
      var arLanguages = [];
      var dataLanguages = [];
      var nameLanguages = []; 
      data.forEach((getUsers: any) => {
        allUsers = allUsers+1;
        if(getUsers.payload.doc.data()['creado'] != undefined){
          var dateUserMonth = new Date(getUsers.payload.doc.data()['creado']).getMonth();
          var dateUserYear = new Date(getUsers.payload.doc.data()['creado']).getFullYear();
          if(mes == dateUserMonth && anio == dateUserYear){
            if(getUsers.payload.doc.data()['idioma'] != undefined){
              arLanguages.push(getUsers.payload.doc.data()['idioma'][0].toUpperCase());
            }
          }
        }
      })
      let counts = {};
      for(let i =0; i < arLanguages.length; i++){ 
        if (counts[arLanguages[i]]){
        counts[arLanguages[i]] += 1
        } else {
        counts[arLanguages[i]] = 1
        }
      }
      for (let prop in counts){
        if (counts[prop] >= 1){
            dataLanguages.push({value: counts[prop], name:prop});
            nameLanguages.push(prop);
        }
      }
      this.newUserByLanguage= {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: nameLanguages,
            textStyle: { color: '#8791af' }
        },
        color: ['#556ee6', '#f1b44c', '#f46a6a', '#50a5f1', '#34c38f'],
        series: [
            {
                name: 'Speakers por idioma',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: dataLanguages
            }
        ]
      }
    });
    this.fbstore.collection('perfiles', ref => ref.where('status','==',"canceled")).snapshotChanges()
    .subscribe(data => {
      var arLanguages = [];
      var dataLanguages = [];
      var nameLanguages = []; 
      data.forEach((getUsers: any) => {
        if(getUsers.payload.doc.data()['idioma'] != undefined){
          arLanguages.push(getUsers.payload.doc.data()['idioma'][0].toUpperCase());
        }
      })
      let counts = {};
      for(let i =0; i < arLanguages.length; i++){ 
        if (counts[arLanguages[i]]){
        counts[arLanguages[i]] += 1
        } else {
        counts[arLanguages[i]] = 1
        }
      }
      for (let prop in counts){
        if (counts[prop] >= 1){
            dataLanguages.push({value: counts[prop], name:prop});
            nameLanguages.push(prop);
        }
      }
      this.cancelByLanguage= {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: nameLanguages,
            textStyle: { color: '#8791af' }
        },
        color: ['#556ee6', '#f1b44c', '#f46a6a', '#50a5f1', '#34c38f'],
        series: [
            {
                name: 'Cancelados por idioma',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: dataLanguages
            }
        ]
      }
    });
    this.fbstore.collection('support').snapshotChanges()
    .subscribe(data => {
      var mes = new Date().getMonth();
      var anio = new Date().getFullYear();
      var monthLength = new Date(anio, mes, 0).getDate();
      var allDays = [];
      var EachPerDay = [];
      var dataDays = [];
      for (let index = 0; index < monthLength; index++) {
        allDays.push((index+1));
      }
      data.forEach((getSupport: any) =>{
        if(getSupport.payload.doc.data()['creationTime'] != undefined){
          var dateMonth = new Date(getSupport.payload.doc.data()['creationTime']).getMonth();
          var dateYear = new Date(getSupport.payload.doc.data()['creationTime']).getFullYear();
          if(mes == dateMonth && anio == dateYear){
            EachPerDay.push(new Date(getSupport.payload.doc.data()['creationTime']).getDate());
          }
        }
      })
      let counts = {};
      for(let i =0; i < EachPerDay.length; i++){ 
        if (counts[EachPerDay[i]]){
        counts[EachPerDay[i]] += 1
        } else {
        counts[EachPerDay[i]] = 1
        }
      }
      for (let prop in counts){
        if (counts[prop] >= 1){
          dataDays.push(counts[prop]);
        }
      }
      this.incidenciasMes = {
        color: ['#50a5f1'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: allDays,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    show: false
                },
            },
        ],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        }],
        series: [{
            name: 'Incidencias',
            type: 'bar',
            barWidth: '60%',
            data: dataDays
        }]
      };
    });
    this.fbstore.collection('calls').snapshotChanges()
    .subscribe(data => {
      this.lengthScheduledCalls = data.length;
    });
    this.fbstore.collection('potenciales').snapshotChanges()
    .subscribe(data => {
      this.lengthSpeakerAwaitingApp = data.length;
    });
  }

  private _fetchData() {
    // this.incidenciasMes = barChart;
  }
}
