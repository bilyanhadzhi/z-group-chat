document.addEventListener('DOMContentLoaded', () => {
  const charts: any = {
    leaderboard: {
      initChart(data: any) {
        const context = document.getElementById('leaderboard-chart');

        this.chart = new Chart(context, {
          type: 'horizontalBar',
          data: {
            labels: [],
            datasets: [{
              label: '# of messages',
              data: [],
              backgroundColor: 'rgba(2, 119, 189, 0.5)',
            }],
          },
          options: {
            scales: {
              xAxes: [{
                barPercentage: 0.5,
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

        for (let i = 0; i < data.leaderboard.labels.length; ++i) {
          list[i] = {};
          list[i].name = data.leaderboard.labels[i];
        }

        for (let i = 0; i < data.leaderboard.values.length; ++i) {
          list[i].numOfMessages = data.leaderboard.values[i];
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
    subjects: {
      initChart(data, wordFrqList): void {
        const context = document.getElementById('subjects-chart');
        const self = this;

        this.chart = new Chart(context, {
          type: 'horizontalBar',
          data: {
            labels: [],
            datasets: [{
              label: '# of occurrences',
              data: [],
              backgroundColor: 'rgba(2, 119, 189, 0.5)',
            }],
          },
          options: {
            scales: {
              xAxes: [{
                barPercentage: 0.5,
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

        console.log(subjectsDisplayData);

        subjectsDisplayData.forEach((subject: any) => {
          self.chart.data.datasets[0].data.push(subject.count);
          self.chart.data.labels.push(subject.name);
        });

        this.chart.update();
      },
    },
    init(): void {
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

          this.leaderboard.initChart(data);
          this.subjects.initChart(data, wordFrqList);
        });
    },
  };

  charts.init();
});
