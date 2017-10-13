document.addEventListener('DOMContentLoaded', () => {
  const charts: any = {
    leaderboard: {
      initChart() {
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

        fetch(`/api/stats`, {credentials: 'include'})
          .catch((err: any) => console.error(err))
          .then((response: any) => response.json())
          .then((data: any) => {
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

            console.log(list);

            list.forEach((member: any) => {
              self.chart.data.datasets[0].data.push(member.numOfMessages);
              self.chart.data.labels.push(member.name);
            });

            self.chart.update();
          });
      },
    },
    init(): void {
      this.leaderboard.initChart();
    },
  };

  charts.init();
});
