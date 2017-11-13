document.addEventListener('DOMContentLoaded', () => {
  const charts: any = {
    msgLeaderboard: {
      initChart(data: any) {
        const context = document.getElementById('leaderboard-chart');

        this.chart = new Chart(context, {
          type: 'horizontalBar',
          data: {
            labels: [],
            datasets: [{
              label: 'Number of messages',
              data: [],
              backgroundColor: 'rgba(25,118,210 ,0.5)',
            }],
          },
          options: {
            title: {
              text: 'Number of messages by person',
              display: true,
              fontSize: 14,
            },
            scales: {
              xAxes: [{
                // barPercentage: 0.5,
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }],
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        const self = this;
        const list: any = [];

        for (let i = 0; i < data.msgLeaderboard.labels.length; ++i) {
          list[i] = {};
          list[i].name = data.msgLeaderboard.labels[i];
          list[i].numOfMessages = data.msgLeaderboard.values[i];
        }

        list.sort((a: any, b: any) => {
          return (a.numOfMessages < b.numOfMessages ? 1 : (a.numOfMessages === b.numOfMessages ? 0 : -1));
        });

        list.forEach((member: any) => {
          self.chart.data.datasets[0].data.push(member.numOfMessages);
          self.chart.data.labels.push(member.name);
        });

        this.chart.update();
      },
    },
    wordLeaderboard: {
      initChart(data: any): void {
        const context = document.getElementById('word-leaderboard-chart');
        const self = this;

        this.chart = new Chart(context, {
          type: 'horizontalBar',
          data: {
            labels: [],
            datasets: [{
              label: 'Number of words',
              data: [],
              backgroundColor: 'rgba(25,118,210 ,0.5)',
            }],
          },
          options: {
            title: {
              text: 'Number of words by person',
              display: true,
              fontSize: 14,
            },
            scales: {
              xAxes: [{
                // barPercentage: 0.5,
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }],
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        const wordLeaderboard = [];

        for (let i = 0; i < data.wordLeaderboard.labels.length; ++i) {
          wordLeaderboard.push({
            name: data.wordLeaderboard.labels[i],
            numOfWords: data.wordLeaderboard.values[i],
          });
        }

        wordLeaderboard.sort((a: any, b: any) => {
          return (a.numOfWords < b.numOfWords ? 1 : (a.numOfWords === b.numOfWords ? 0 : -1));
        });

        wordLeaderboard.forEach((member: any) => {
          self.chart.data.datasets[0].data.push(member.numOfWords);
          self.chart.data.labels.push(member.name);
        });

        charts.wordsPerMessage.initChart();
        this.chart.update();
      },
    },
    wordsPerMessage: {
      initChart(): void {
        for (let i = 0; i < charts.msgLeaderboard.chart.data.labels.length; ++i) {
          const currLabel = charts.msgLeaderboard.chart.data.labels[i];
          const indexOfCurrLabel = charts.wordsLeaderboard.data.labels.indexOf(currLabel);

          const wordsPerMessage = charts.wordsLeaderboard.data.datasets[0].data[indexOfCurrLabel] / charts.msgLeaderboard.chart.data.datasets[0].data[i];

          console.log(currLabel, wordsPerMessage);
        }
      },
    },
    subjects: {
      initChart(data, wordFrqList): void {
        const context = document.getElementById('subjects-chart');
        const self = this;

        this.chart = new Chart(context, {
          type: 'horizontalBar',
          data: {
            labels: [],
            datasets: [{
              label: 'Number of occurrences',
              data: [],
              backgroundColor: 'rgba(230,74,25 ,0.5)',
            }],
          },
          options: {
            title: {
              text: 'Number of occurrences of a subject',
              display: true,
              fontSize: 14,
            },
            scales: {
              xAxes: [{
                // barPercentage: 0.5,
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }],
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        const subjects: any = {
          'БЕЛ': {
            count: 0,
            regex: /^бел$|^bel$|български|bulgarski|литература|literatura|^лит$|^lit$/i,
          },
          'Математика': {
            count: 0,
            regex: /^mat$|^мат$|математика|matematika/i,
          },
          'Английски': {
            count: 0,
            regex: /английски|angliiski/i,
          },
          'Немски': {
            count: 0,
            regex: /немски|nemski/i,
          },
          'История': {
            count: 0,
            regex: /история|istoria|istoriya|istoriq/i,
          },
          'География': {
            count: 0,
            regex: /^гео$|^geo$|география|geografiq|geografia|geografiya/i,
          },
          'Физика': {
            count: 0,
            regex: /физика|fizika/i,
          },
          'Химия': {
            count: 0,
            regex: /химия|himiq|himia|himiya/i,
          },
          'Биология': {
            count: 0,
            regex: /^био$|^bio$|биология|biologia|biologiq|biologiya/i,
          },
          'Психология': {
            count: 0,
            regex: /психология|psihologia|psihologiq|psihologiya/i,
          },
          'Логика': {
            count: 0,
            regex: /логика|logika/i,
          },
          'Етика': {
            count: 0,
            regex: /етика|etika/i,
          },
          'Право': {
            count: 0,
            regex: /право|pravo/i,
          },
          'Философия': {
            count: 0,
            regex: /философия|filosofia|filosofiq|filosofiya/i,
          },
          'Информатика': {
            count: 0,
            regex: /информатика|informatika/i,
          },
          'Информационни': {
            count: 0,
            regex: /информационни|informacionni|^ит$|^it$/i,
          },
          'Музика': {
            count: 0,
            regex: /музика|muzika/i,
          },
          'Изобразително': {
            count: 0,
            regex: /изобразително|izobrazitelno|^ии$/i,
          },
          'Физическо': {
            count: 0,
            regex: /физическо|fizichesko|fizi4esko|^фвс$|^fvs$/i,
          },
        };

        Object.keys(subjects)
          .forEach((key: any) => {
              wordFrqList
                .filter((word: any) => word.word.match(subjects[key].regex))
                .forEach((word: any) => subjects[key].count += word.count);
          });

        const subjectsDisplayData: Array<any> = [];

        Object.keys(subjects)
          .forEach((key: any) => {
            subjectsDisplayData.push({name: key, count: subjects[key].count});
          });

        subjectsDisplayData.sort((a: any, b: any) => {
          return (a.count < b.count ? 1 : (a.count === b.count ? 0 : -1));
        });

        // console.log(subjectsDisplayData);

        subjectsDisplayData.forEach((subject: any) => {
          self.chart.data.datasets[0].data.push(subject.count);
          self.chart.data.labels.push(subject.name);
        });

        this.chart.update();
      },
    },
    timeOfDayFrequency: {
      initChart(data): void {
        const context = document.getElementById('time-of-day-frequency-chart');

        this.chart = new Chart(context, {
          type: 'bar',
          data: {
            labels: [],
            datasets: [{
              label: 'Number of messages',
              data: [],
              backgroundColor: 'rgba(211,47,47 ,0.5)',
            }],
          },
          options: {
            title: {
              text: 'Number of messages by time of day',
              display: true,
              fontSize: 14,
            },
            scales: {
              xAxes: [{
                // barPercentage: 0.5,
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }],
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        this.chart.data.datasets[0].data = data.timeOfDayFrequency.values;
        this.chart.data.labels = data.timeOfDayFrequency.labels;

        this.chart.update();

        console.log(data);
      },
    },
    init(): void {
      Chart.defaults.global.defaultFontFamily = '"Ubuntu", sans-serif';

      fetch(`/api/stats`, { credentials: 'include' })
        .catch((err: any) => console.error(err))
        .then((response: any) => response.json())
        .then((data: any) => {

          const wordFrqList: any = [];

          for (let i = 0; i < data.wordFrequency.labels.length; ++i) {
            wordFrqList[i] = {};
            wordFrqList[i].word = data.wordFrequency.labels[i];
          }

          for (let i = 0; i < data.wordFrequency.values.length; ++i) {
            wordFrqList[i].count = data.wordFrequency.values[i];
          }

          wordFrqList.sort((a: any, b: any) => {
            return (a.count < b.count ? 1 : (a.count === b.count ? 0 : -1));
          });

          this.msgLeaderboard.initChart(data);
          this.wordLeaderboard.initChart(data);
          this.subjects.initChart(data, wordFrqList);
          this.timeOfDayFrequency.initChart(data);
        });
    },
  };

  charts.init();
});
