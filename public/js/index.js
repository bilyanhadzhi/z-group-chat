document.addEventListener('DOMContentLoaded', function () {
    var charts = {
        leaderboard: {
            initChart: function () {
                var context = document.getElementById('leaderboard-chart');
                this.chart = new Chart(context, {
                    type: 'horizontalBar',
                    data: {
                        labels: [],
                        datasets: [{
                                label: '# of messages',
                                data: [],
                                backgroundColor: 'rgba(2, 119, 189, 0.5)'
                            }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                var self = this;
                fetch("/api/stats", { credentials: 'include' })["catch"](function (err) { return console.error(err); })
                    .then(function (response) { return response.json(); })
                    .then(function (data) {
                    var list = [];
                    for (var i = 0; i < data.leaderboard.labels.length; ++i) {
                        list[i] = {};
                        list[i].name = data.leaderboard.labels[i];
                    }
                    for (var i = 0; i < data.leaderboard.values.length; ++i) {
                        list[i].numOfMessages = data.leaderboard.values[i];
                    }
                    list.sort(function (a, b) {
                        return (a.numOfMessages < b.numOfMessages ? 1 : (a.numOfMessages === b.numOfMessages ? 0 : -1));
                    });
                    console.log(list);
                    list.forEach(function (member) {
                        self.chart.data.datasets[0].data.push(member.numOfMessages);
                        self.chart.data.labels.push(member.name);
                    });
                    self.chart.update();
                });
            }
        },
        init: function () {
            this.leaderboard.initChart();
        }
    };
    charts.init();
});
